const HEADERS={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:HEADERS});

async function accountFor(request,db){
 const token=(request.headers.get("Cookie")||"").split(";").map(x=>x.trim()).find(x=>x.startsWith("a6_session="))?.slice(11);
 if(!token)return null;
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token)))).map(x=>x.toString(16).padStart(2,"0")).join("");
 return db.prepare("SELECT s.account_id,a.must_change_password FROM account_sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires_at>?").bind(hash,Math.floor(Date.now()/1000)).first();
}

export async function onRequestPost({request,env}){
 if(!env.DB)return json({error:"D1 chưa được cấu hình."},500);
 if(!env.IMAGES)return json({error:"R2 chưa được cấu hình. Hãy tạo binding IMAGES."},503);
 try{
  const account=await accountFor(request,env.DB);
  if(!account)return json({error:"Đăng nhập để tải ảnh lên."},401);
  if(account.must_change_password)return json({error:"Hãy đổi mật khẩu tạm trước khi tải ảnh lên."},403);

  const form=await request.formData(),file=form.get("image");
  if(!(file instanceof File)||!file.size)return json({error:"Chọn ảnh trước khi tải lên."},400);
  const types=new Set(["image/jpeg","image/png","image/webp"]);
  if(!types.has(file.type))return json({error:"Chỉ nhận ảnh JPG, PNG hoặc WebP."},415);
  if(file.size>150_000)return json({error:"Ảnh sau khi nén cần nhỏ hơn 150 KB."},413);

  const id=crypto.randomUUID();
  await env.IMAGES.put("images/"+id,file.stream(),{
   httpMetadata:{contentType:file.type},
   customMetadata:{ownerId:String(account.account_id)}
  });
  return json({ok:true,url:"/api/image?id="+id},201);
 }catch(error){
  console.error("Image upload:",error);
  return json({error:"Không tải được ảnh lên R2. Hãy kiểm tra binding IMAGES."},500);
 }
}