const H={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"};
const reply=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{...H,...extra}});
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
const unhex=s=>new Uint8Array((s.match(/.{2}/g)||[]).map(x=>parseInt(x,16)));
const random=n=>{const b=new Uint8Array(n);crypto.getRandomValues(b);return b};
async function digest(s){return hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))}
async function derive(password,salt){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);return hex(await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:unhex(salt),iterations:100000},key,256))}
async function setup(db){
 await db.prepare("CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,username TEXT NOT NULL UNIQUE,email TEXT NOT NULL DEFAULT '',email_verified INTEGER NOT NULL DEFAULT 0,password_hash TEXT NOT NULL,salt TEXT NOT NULL,display_name TEXT NOT NULL DEFAULT '',avatar_url TEXT NOT NULL DEFAULT '',must_change_password INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 for(const [c,d] of [["email","TEXT NOT NULL DEFAULT ''"],["email_verified","INTEGER NOT NULL DEFAULT 0"],["must_change_password","INTEGER NOT NULL DEFAULT 0"]])try{await db.prepare("ALTER TABLE accounts ADD COLUMN "+c+" "+d).run()}catch{}
 await db.prepare("CREATE TABLE IF NOT EXISTS account_sessions(token_hash TEXT PRIMARY KEY,account_id TEXT NOT NULL,expires_at INTEGER NOT NULL,FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE)").run();
 await db.prepare("CREATE TABLE IF NOT EXISTS account_recovery_limits(ip_hash TEXT PRIMARY KEY,attempts INTEGER NOT NULL,window_started INTEGER NOT NULL,blocked_until INTEGER NOT NULL DEFAULT 0)").run();
 await db.prepare("CREATE TABLE IF NOT EXISTS account_reset_requests(id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT NOT NULL,account_id TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,completed_at TEXT)").run();
 await db.prepare("CREATE TABLE IF NOT EXISTS account_invites(code_hash TEXT PRIMARY KEY,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,used_at TEXT,used_by TEXT)").run();
}
function cookie(t,n){return "a6_session="+t+"; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age="+n}
function tokenFrom(r){return(r.headers.get("Cookie")||"").split(";").map(x=>x.trim()).find(x=>x.startsWith("a6_session="))?.slice(11)||""}
async function user(r,db){const t=tokenFrom(r);if(!t)return null;return await db.prepare("SELECT a.id,a.username,a.display_name,a.avatar_url,a.must_change_password FROM account_sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires_at>?").bind(await digest(t),Math.floor(Date.now()/1000)).first()||null}
function adminReady(env){return typeof env.ADMIN_RESET_KEY==="string"&&env.ADMIN_RESET_KEY.length>=32}
function adminOK(r,env){const a=new TextEncoder().encode(String(env.ADMIN_RESET_KEY||"")),b=new TextEncoder().encode(String(r.headers.get("X-A6-Admin-Key")||""));if(a.length<32||a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a[i]^b[i];return d===0}
export async function onRequest({request,env}){
 if(!env.DB)return reply({error:"D1 chưa được cấu hình."},500);
 try{
  await setup(env.DB);const url=new URL(request.url);
  if(request.method==="GET"){
   if(url.searchParams.get("action")==="reset-requests"){
    if(!adminReady(env))return reply({error:"Chưa cấu hình ADMIN_RESET_KEY trên Cloudflare."},503);
    if(!adminOK(request,env))return reply({error:"Mã quản trị không đúng."},401);
    const rows=await env.DB.prepare("SELECT r.id,r.username,r.created_at,a.display_name FROM account_reset_requests r JOIN accounts a ON a.id=r.account_id WHERE r.status='pending' ORDER BY r.id DESC LIMIT 100").all();
    return reply({requests:rows.results||[]});
   }
   return reply({user:await user(request,env.DB)});
  }
  if(request.method!=="POST")return reply({error:"Phương thức không được hỗ trợ."},405);
  let b;try{b=await request.json()}catch{return reply({error:"JSON không hợp lệ."},400)}
  if(b.action==="logout"){const t=tokenFrom(request);if(t)await env.DB.prepare("DELETE FROM account_sessions WHERE token_hash=?").bind(await digest(t)).run();return reply({ok:true,user:null},200,{"Set-Cookie":cookie("",0)})}
  if(b.action==="forgot-password"){
   const ip=request.headers.get("CF-Connecting-IP")||"unknown",ipHash=await digest(ip),now=Math.floor(Date.now()/1000),state=await env.DB.prepare("SELECT attempts,window_started,blocked_until FROM account_recovery_limits WHERE ip_hash=?").bind(ipHash).first();
   if(state&&state.blocked_until>now)return reply({error:"Bạn thử quá nhiều lần. Hãy đợi 30 phút rồi thử lại."},429);
   const fresh=!state||now-state.window_started>=900,attempt=fresh?1:state.attempts+1,started=fresh?now:state.window_started,blocked=attempt>=10?now+1800:0;
   await env.DB.prepare("INSERT INTO account_recovery_limits(ip_hash,attempts,window_started,blocked_until) VALUES(?,?,?,?) ON CONFLICT(ip_hash) DO UPDATE SET attempts=excluded.attempts,window_started=excluded.window_started,blocked_until=excluded.blocked_until").bind(ipHash,attempt,started,blocked).run();
   if(blocked)return reply({error:"Bạn thử quá nhiều lần. Hãy đợi 30 phút rồi thử lại."},429);
   const name=String(b.username||"").trim().toLowerCase();
   if(/^[a-z0-9_]{3,24}$/.test(name)){const a=await env.DB.prepare("SELECT id FROM accounts WHERE username=?").bind(name).first();if(a)await env.DB.prepare("INSERT INTO account_reset_requests(username,account_id) VALUES(?,?)").bind(name,a.id).run()}
   return reply({ok:true,message:"Nếu tài khoản tồn tại, yêu cầu đã được ghi nhận. Hãy báo quản trị viên để được xác minh và cấp mật khẩu tạm."});
  }
  if(b.action==="admin-create-invites"){
   if(!adminReady(env))return reply({error:"Chưa cấu hình ADMIN_RESET_KEY trên Cloudflare."},503);
   if(!adminOK(request,env))return reply({error:"Mã quản trị không đúng."},401);
   const count=Number(b.count);if(!Number.isInteger(count)||count<1||count>60)return reply({error:"Mỗi lần chỉ tạo từ 1 đến 60 mã."},400);
   const codes=[];
   for(let i=0;i<count;i++){const code=hex(random(12));await env.DB.prepare("INSERT INTO account_invites(code_hash) VALUES(?)").bind(await digest(code)).run();codes.push(code)}
   return reply({ok:true,codes});
  }
  if(b.action==="admin-reset-password"){
   if(!adminReady(env))return reply({error:"Chưa cấu hình ADMIN_RESET_KEY trên Cloudflare."},503);
   if(!adminOK(request,env))return reply({error:"Mã quản trị không đúng."},401);
   const id=Number(b.requestId);if(!Number.isSafeInteger(id)||id<1)return reply({error:"Yêu cầu không hợp lệ."},400);
   const req=await env.DB.prepare("SELECT id,account_id FROM account_reset_requests WHERE id=? AND status='pending'").bind(id).first();if(!req)return reply({error:"Yêu cầu đã xử lý hoặc không tồn tại."},404);
   const a=await env.DB.prepare("SELECT id,username FROM accounts WHERE id=?").bind(req.account_id).first();if(!a)return reply({error:"Không tìm thấy tài khoản."},404);
   const chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789",temp=Array.from(random(24),n=>chars[n%chars.length]).join(""),salt=hex(random(16)),hash=await derive(temp,salt);
   await env.DB.prepare("UPDATE accounts SET password_hash=?,salt=?,must_change_password=1 WHERE id=?").bind(hash,salt,a.id).run();
   await env.DB.prepare("DELETE FROM account_sessions WHERE account_id=?").bind(a.id).run();
   await env.DB.prepare("UPDATE account_reset_requests SET status='issued',completed_at=CURRENT_TIMESTAMP WHERE account_id=? AND status='pending'").bind(a.id).run();
   return reply({ok:true,username:a.username,temporaryPassword:temp});
  }
  if(b.action==="change-password"){
   const current=await user(request,env.DB);if(!current)return reply({error:"Hãy đăng nhập trước."},401);
   const pass=String(b.password||"");if(pass.length<6||pass.length>128)return reply({error:"Mật khẩu mới cần từ 6 đến 128 ký tự."},400);
   const salt=hex(random(16)),hash=await derive(pass,salt),session=await digest(tokenFrom(request));
   await env.DB.prepare("UPDATE accounts SET password_hash=?,salt=?,must_change_password=0 WHERE id=?").bind(hash,salt,current.id).run();
   await env.DB.prepare("DELETE FROM account_sessions WHERE account_id=? AND token_hash<>?").bind(current.id,session).run();
   return reply({ok:true,user:{...current,must_change_password:0}});
  }
  const username=String(b.username||"").trim().toLowerCase(),pass=String(b.password||"");
  if(["register","login"].includes(b.action)){if(!/^[a-z0-9_]{3,24}$/.test(username))return reply({error:"Tên đăng nhập cần 3–24 ký tự: chữ thường, số hoặc _."},400);if(pass.length<6||pass.length>128)return reply({error:"Mật khẩu cần từ 6 đến 128 ký tự."},400)}
  let account;
  if(b.action==="register"){
   const inviteCode=String(b.inviteCode||"").trim().toLowerCase();
   if(!/^[a-f0-9]{24}$/.test(inviteCode))return reply({error:"Nhập mã mời hợp lệ do quản trị viên cấp."},400);
   const codeHash=await digest(inviteCode),validInvite=await env.DB.prepare("SELECT code_hash FROM account_invites WHERE code_hash=? AND used_at IS NULL").bind(codeHash).first();
   if(!validInvite)return reply({error:"Mã mời không đúng hoặc đã được sử dụng."},403);
   const salt=hex(random(16)),hash=await derive(pass,salt),id=crypto.randomUUID(),display=String(b.displayName||"").trim().slice(0,30);
   try{
    const result=await env.DB.batch([
     env.DB.prepare("INSERT INTO accounts(id,username,password_hash,salt,display_name) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM account_invites WHERE code_hash=? AND used_at IS NULL)").bind(id,username,hash,salt,display,codeHash),
     env.DB.prepare("UPDATE account_invites SET used_at=CURRENT_TIMESTAMP,used_by=? WHERE code_hash=? AND used_at IS NULL").bind(id,codeHash)
    ]);
    if(Number(result[0]?.meta?.changes)!==1||Number(result[1]?.meta?.changes)!==1)return reply({error:"Mã mời không đúng hoặc đã được sử dụng."},403);
   }catch{return reply({error:"Tên đăng nhập đã được dùng."},409)}

   account={id,username,display_name:display,avatar_url:"",must_change_password:0};
  }else if(b.action==="login"){
   const row=await env.DB.prepare("SELECT * FROM accounts WHERE username=?").bind(username).first();if(!row||await derive(pass,row.salt)!==row.password_hash)return reply({error:"Tên đăng nhập hoặc mật khẩu chưa đúng."},401);
   account={id:row.id,username:row.username,display_name:row.display_name,avatar_url:row.avatar_url,must_change_password:row.must_change_password||0};
  }else if(b.action==="profile"){
   const current=await user(request,env.DB);if(!current)return reply({error:"Hãy đăng nhập trước."},401);
   const display=String(b.displayName||"").trim().slice(0,30),avatar=String(b.avatarUrl||"");if(avatar&&!/^\/api\/image\?id=[0-9a-f-]{36}$/i.test(avatar))return reply({error:"Ảnh đại diện không hợp lệ."},400);
   await env.DB.prepare("UPDATE accounts SET display_name=?,avatar_url=? WHERE id=?").bind(display,avatar,current.id).run();return reply({ok:true,user:{...current,display_name:display,avatar_url:avatar}});
  }else return reply({error:"Thao tác không hợp lệ."},400);
  const raw=hex(random(32)),expires=Math.floor(Date.now()/1000)+2592000;
  await env.DB.prepare("INSERT INTO account_sessions(token_hash,account_id,expires_at) VALUES(?,?,?)").bind(await digest(raw),account.id,expires).run();
  return reply({ok:true,user:account},200,{"Set-Cookie":cookie(raw,2592000)});
 }catch(e){console.error("Account API:",e);return reply({error:"Có lỗi khi xử lý tài khoản."},500)}
}