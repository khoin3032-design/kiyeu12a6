/* =====================================================================
   POTATO 🥔 — trợ lý chat của lớp 12A6, nhập vai bạn trong POTATO_LA (data.js)
   • Chế độ offline (mặc định): trả lời từ dữ liệu lớp trong data.js — hỏi về từng bạn,
     "ai đá bóng hay", "ai học FPT", sinh nhật, bạn thân, album, chuyến đi...
   • Chế độ AI: bấm ⚙ và dán API key (lưu trong trình duyệt). Nếu đưa trang lên mạng
     công khai, đừng để key phía người dùng — hãy dùng máy chủ trung gian.
   ===================================================================== */
(function(){
const AI_ENDPOINT = '/api/chat';
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
const SHOW_BD=typeof HIEN_NGAY_SINH==='undefined'||HIEN_NGAY_SINH;
const link=(h,t)=>`<a href="${h}" class="pt-link" onclick="document.getElementById('pt-panel').classList.remove('open')">${esc(t)}</a>`;
const hA=m=>link('#'+m.id,m.title),hT=t=>link('#'+t.id,t.ten);
const first=p=>p.ten.split(' ').slice(-1)[0];
const nameLink=p=>`<b>${esc(p.ten)}</b>`;
const ALIAS={gtvt:'giao thong van tai',bk:'bach khoa',neu:'kinh te quoc dan',hust:'bach khoa',ptit:'buu chinh vien thong',ftu:'ngoai thuong',hanu:'ha noi',nhan:'nhan'};
const JOKES=["Tại sao khoai tây không đi họp lớp? Vì sợ bị… nghiền nát ở phần phát biểu 🥔","Điểm giống nhau giữa khoai tây và học sinh 12A6? Càng bị ‘ép’ càng… giòn ✨","Khoai tây hỏi khoai lang: ‘Sao cậu đỏ mặt vậy?’ — ‘Vì tớ vừa được nướng khen!’ 🍠"];
const vDur=v=>{if(!v||!v.thoiLuong)return '';const p=v.thoiLuong.split(':').map(Number);return p.length===2?`${p[0]} phút ${p[1]} giây`:v.thoiLuong};
const dateOf=p=>{const m=(p.sinh||'').match(/(\d+)\/(\d+)\/(\d+)/);return m?{d:+m[1],m:+m[2],y:+m[3]}:null};
const lopOf=d=>{const y=d.getFullYear(),s=d.getMonth()+1>=8?y:y-1;return String(Math.min(12,Math.max(10,10+s-2022)))};
const dailyN=y=>daily.filter(x=>(x.lop||lopOf(new Date(x.ngay)))===y).length;

/* ---------- Tra cứu người ---------- */
const relOf=p=>QUAN_HE.flatMap(([a,b,k])=>a===p.ten?[[b,k]]:b===p.ten?[[a,k]]:[]);
function personCard(p){
  const rel=relOf(p),same=p.truong?lop.filter(x=>x.truong&&x!==p&&norm(x.truong)===norm(p.truong)):[],albums=mem.filter(m=>(m.profiles||[]).some(q=>q.ten&&q.ten===p.ten));
  let h=`<b>${esc(p.ten)}</b>${p.vaiTro?` — <i>${esc(p.vaiTro)}</i>`:''}${p.ten===POTATO_LA?' (chính là mình, Potato 🥔 đây 😎)':''}`;
  if(SHOW_BD&&p.sinh)h+=`<br>🎂 Sinh ngày ${esc(p.sinh)}`;
  h+=p.truong?`<br>🎓 ${esc(p.truong)}`:'<br>🎓 Chưa có thông tin trường';
  h+=p.diem?`<br>✨ ${esc(p.diem)}`:'<br>✨ Chưa có mô tả';
  if(rel.length)h+='<br>🤝 '+rel.map(([n,k])=>`${esc(k)} với ${esc(n)}`).join('; ');
  if(same.length)h+=`<br>🔗 Cùng trường: ${same.slice(0,5).map(x=>esc(x.ten)).join(', ')}${same.length>5?'…':''}`;
  if(albums.length)h+='<br>⚽ Có mặt trong: '+albums.map(hA).join(', ');
  return h;
}
function findPeople(t,intent){
  let r=lop.filter(p=>t.includes(norm(p.ten)));if(r.length)return r;
  r=lop.filter(p=>{const w=norm(p.ten).split(' ');return w.length>1&&t.includes(w.slice(-2).join(' '))});if(r.length)return r;
  if(!intent)return [];
  return lop.filter(p=>{const w=norm(first(p));return w.length>=2&&new RegExp('(^| )'+w+'( |$)').test(t)});
}
function nextBirthdays(n){const now=new Date(),y=now.getFullYear();return lop.map(p=>({p,b:dateOf(p)})).filter(x=>x.b).map(x=>{let d=new Date(y,x.b.m-1,x.b.d);if(d<new Date(y,now.getMonth(),now.getDate()))d=new Date(y+1,x.b.m-1,x.b.d);return {p:x.p,d}}).sort((a,b)=>a.d-b.d).slice(0,n)}

/* ---------- Bộ não offline ---------- */
function local(q){
  const t=norm(q).replace(/[?!.,;:"“”]/g,' ').replace(/\s+/g,' ').trim();
  const kt=typeof potatoKienThuc!=='undefined'?potatoKienThuc.find(k=>k.hoi.some(w=>t.includes(norm(w)))):null;
  if(kt)return esc(kt.tra).replace(/\n/g,'<br>');
  if(/^(hi|hello|hey|alo|chao|xin chao|yo)\b/.test(t))return "Chào cậu! Mình là <b>Potato</b> 🥔 — hóa thân của "+esc(POTATO_LA)+". Cậu muốn hỏi về bạn nào trong lớp, trường đại học, sinh nhật hay album?";
  if(/(ban la ai|ten gi|potato la|ai tao ra|ai la potato)/.test(t)){const k=lop.find(p=>p.ten===POTATO_LA);return `Mình là <b>Potato</b> 🥔 — một củ khoai tây do <b>${esc(POTATO_LA)}</b> nhập vai.${k&&k.diem?` Theo lời cả lớp thì: <i>${esc(k.diem)}</i> 😎`:''} Mình là chatbot, nhưng biết hết về 12A6!`}
  if(/(cam on|thanks|thank)/.test(t))return "Không có gì nha! Khoai tây luôn ở đây 🥔💛";
  if(/(joke|dua|cuoi|chuyen vui|hai huoc)/.test(t))return JOKES[Math.floor(Math.random()*JOKES.length)];
  if(/(lop truong|to truong|thu ky|ban can su|ban dai dien)/.test(t)){const want=/lop truong/.test(t)?'Lớp trưởng':/to truong/.test(t)?'Tổ trưởng':/thu ky/.test(t)?'Thư ký':'';const r=lop.filter(p=>p.vaiTro&&(!want||p.vaiTro===want));return r.length?'Ban cán sự: '+r.map(p=>`${nameLink(p)} (${esc(p.vaiTro)})`).join(', ')+'.':'Chưa có thông tin ban cán sự.'}
  const intent=/(la ai|ai la|thong tin|nguoi nhu the nao|tinh cach|hoc truong|truong nao|hoc dai hoc|sinh nhat|ngay sinh|ban than|nguoi ay|cua |ve )/.test(t);
  const ppl=findPeople(t,intent);
  if(ppl.length===1)return personCard(ppl[0]);
  if(ppl.length>1)return `Có ${ppl.length} bạn khớp, mình liệt kê hết nhé:<br><br>`+ppl.slice(0,4).map(personCard).join('<br><br>');
  if(/(sinh nhat|ngay sinh)/.test(t)){
    if(!SHOW_BD)return "Potato không chia sẻ ngày sinh của các bạn nhé 🥔";
    const mo=t.match(/thang (\d{1,2})/),dm=t.match(/(\d{1,2})[\/-](\d{1,2})/);
    if(dm){const r=lop.filter(p=>{const b=dateOf(p);return b&&b.d===+dm[1]&&b.m===+dm[2]});return r.length?`Sinh nhật ngày ${dm[1]}/${dm[2]}: ${r.map(p=>nameLink(p)).join(', ')}.`:`Không có bạn nào sinh ngày ${dm[1]}/${dm[2]}.`}
    if(mo){const r=lop.filter(p=>{const b=dateOf(p);return b&&b.m===+mo[1]}).sort((a,b)=>dateOf(a).d-dateOf(b).d);return r.length?`Sinh nhật tháng ${mo[1]} (${r.length} bạn): ${r.map(p=>`${esc(p.ten)} (${dateOf(p).d}/${mo[1]})`).join(', ')}.`:`Không có bạn nào sinh tháng ${mo[1]}.`}
    return "Sinh nhật sắp tới: "+nextBirthdays(3).map(x=>`${esc(x.p.ten)} (${x.d.getDate()}/${x.d.getMonth()+1})`).join(', ')+".";
  }
  if(/(doi hinh|cau thu|doi bong)/.test(t)){const dh=(typeof doiHinh!=='undefined'?doiHinh:[]).filter(p=>p.ten&&p.ten.trim());return dh.length?`Đội hình bóng đá nam: ${dh.map(p=>`${esc(p.ten)}${p.role?' ('+esc(p.role)+')':''}`).join(', ')}. Xem tại ${mem.filter(m=>m.profiles).map(hA).join(' · ')}.`:`Phần giới thiệu đội hình chưa được cập nhật. Xem các album bóng đá: ${mem.filter(m=>m.profiles).map(hA).join(' · ')}.`}
  const lm=t.match(/lop (10|11|12)/);
  if(lm){const y=lm[1],ms=mem.filter(m=>m.year===y);return `<b>Lớp ${y}</b> có ${ms.length} album: ${ms.map(hA).join(', ')}. Và Daily lớp ${y} có ${dailyN(y)} khung hình (${link('#cuon-phim-'+y,'xem Daily')}).`}
  if(/(daily|thuong ngay|cuon phim|nhat ky)/.test(t))return "Daily là những ngày rất bình thường của lớp: "+['10','11','12'].map(y=>link('#cuon-phim-'+y,`Lớp ${y} (${dailyN(y)})`)).join(' · ');
  if(/(chuyen di|du lich|di choi|da ngoai)/.test(t))return "Các chuyến đi của lớp: "+chuyendi.map(hT).join(' · ')+". Mỗi chuyến có một trang riêng nhé!";
  if(/(luu but|loi nhan)/.test(t))return "Kéo xuống mục <b>Lưu bút</b>, nhập tên và lời nhắn rồi bấm “Dán lên” nhé!";
  const kw=[['bong da','bong da'],['bong chuyen','bong chuyen'],['van nghe','van nghe'],['ky yeu','ky yeu'],['hoi trai','hoi trai']];
  const hit=kw.find(([k])=>t.includes(k)),ms=hit&&!/(^| )ai /.test(t)?mem.filter(m=>norm(m.title+' '+m.cat).includes(hit[1])):[];
  if(ms.length)return ms.map(m=>`${hA(m)} — Lớp ${m.year}, ${esc(m.date)}, ${m.album.length} ảnh${m.video?` và 1 video dài ${vDur(m.video)}`:''}. ${esc(m.summary)}`).join('<br><br>');
  /* tìm theo trường / tính cách: "ai đá bóng hay", "ai học FPT", "bao nhiêu bạn học Phenikaa" */
    if (/(^| )ai |nhung ban|danh sach|bao nhieu ban|bao nhieu nguoi|ban nao/.test(t)) {
    let s = t.replace(/\b(ai|nhung|cac|ban|nguoi|nao|la|o|hoc|truong|dai hoc|co|danh sach|liet ke|cho|toi|biet|bao nhieu|trong lop|lop)\b/g, ' ').replace(/\s+/g, ' ').trim();
    s = ALIAS[s] || s;
    const base = s.replace(/ (hay|nhat|gioi nhat)\$/, '');
    if (s.length >= 2) {
      let r = lop.filter(p => norm(p.diem + ' ' + p.truong).includes(s) || norm(p.diem + ' ' + p.truong).includes(base));
      if (r.length) return `Danh sách các bạn khớp với từ khóa "${esc(s)}":<br>` + r.map(p => `• ${nameLink(p)}${p.truong ? ` (\${esc(p.truong)})` : ''}`).join('<br>');
    }
  }
  return "Potato 🥔 chưa hiểu câu này lắm. Cậu thử hỏi dạng: 'Nguyễn Anh Khôi là ai', 'ai đá bóng hay', 'ai học FPT', hoặc 'sinh nhật tháng 11' xem sao nha!";
}

window.localChatProcessor = local;
})();


/* ---------- Chế độ AI ---------- */
function sys(){
  const bang=lop.map(p=>`${p.ten} | ${SHOW_BD?p.sinh+' | ':''}${p.truong||'?'} | ${p.diem||'chưa có mô tả'}${p.vaiTro?' | '+p.vaiTro:''}`).join('\n');
  return `Bạn là Potato 🥔, chatbot trên trang kỷ yếu lớp 12A6 (THPT Chuyên Sơn Tây, 2022-2025). Bạn nhập vai ${POTATO_LA} (người làm trang web): thân thiện, hài hước, xưng "mình/tớ", gọi người hỏi là "cậu", trả lời tiếng Việt, ngắn gọn (tối đa 5 câu). Nếu ai hỏi thật lòng bạn có phải người không thì nói rõ bạn là chatbot. Chỉ dựa vào dữ liệu dưới đây; thiếu thì nói thật là chưa có thông tin, đừng bịa. Khi hỏi về một bạn, hãy nối thêm thông tin liên quan (bạn thân, cùng trường, cùng sở thích, có mặt trong album nào).
DANH SÁCH LỚP (họ tên | ${SHOW_BD?'ngày sinh | ':''}trường | đặc điểm | vai trò):
${bang}
QUAN HỆ: ${QUAN_HE.map(([a,b,k])=>`${a} & ${b}: ${k}`).join('; ')}
ĐỘI HÌNH BÓNG ĐÁ: ${(typeof doiHinh!=='undefined'?doiHinh:[]).filter(p=>p.ten).map(p=>`${p.ten} (${p.role||''})`).join(', ')||'chưa cập nhật'}
ALBUM: ${mem.map(m=>`[Lớp ${m.year}] ${m.title} (${m.date}, ${m.album.length} ảnh${m.video?`, có video ${vDur(m.video)}`:''})`).join(' | ')}
CHUYẾN ĐI: ${chuyendi.map(t=>`${t.ten} (${t.noi}, ${t.ngay})`).join(' | ')}
DAILY: ${['10','11','12'].map(y=>`Lớp ${y}: ${dailyN(y)} khung hình`).join('; ')}
KIẾN THỨC THÊM: ${(typeof potatoKienThuc!=='undefined'?potatoKienThuc.map(k=>`Khi hỏi về (${k.hoi.join(', ')}): ${k.tra}`):[]).concat(typeof potatoGhiChu!=='undefined'?potatoGhiChu:[]).join(' | ')}`;
}
const hist=[];
async function ai() {
  const response = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      system: sys(),
      messages: hist.slice(-12)
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  if (typeof data.text !== 'string') {
    throw new Error('Máy chủ trả về dữ liệu không hợp lệ');
  }

  return data.text.trim();
}

/* ---------- Giao diện ---------- */
const css=document.createElement('style');
css.textContent=`#pt-fab{position:fixed;right:18px;bottom:18px;z-index:45;width:58px;height:58px;border-radius:50%;border:0;background:#F3D9A4;font-size:30px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.25);transition:transform .2s}#pt-fab:hover{transform:scale(1.08) rotate(-6deg)}
#pt-panel{position:fixed;right:18px;bottom:88px;z-index:45;width:min(380px,calc(100vw - 24px));height:min(540px,calc(100vh - 110px));display:none;flex-direction:column;background:#FFFDF8;color:#2b2118;border:1px solid #e6d3ad;border-radius:20px;box-shadow:0 20px 50px rgba(0,0,0,.3);overflow:hidden;font:14px/1.5 'Be Vietnam Pro',system-ui,sans-serif}#pt-panel.open{display:flex}
.pt-head{background:#C99A55;color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px}.pt-head b{font-size:15px}.pt-head small{display:block;opacity:.85;font-size:11px}.pt-head button{background:none;border:0;color:#fff;font-size:18px;cursor:pointer}
#pt-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#FBF3E2}
.pt-m{max-width:86%;padding:8px 12px;border-radius:14px;word-wrap:break-word}.pt-bot{background:#fff;border:1px solid #ecdcb8;align-self:flex-start;border-bottom-left-radius:4px}.pt-me{background:#C99A55;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.pt-link{color:#B5651D;font-weight:600;text-decoration:underline}
#pt-chips{display:flex;gap:6px;flex-wrap:wrap;padding:8px 12px 0;background:#FBF3E2}#pt-chips button{border:1px solid #d9c08a;background:#fff;border-radius:999px;padding:4px 10px;font-size:12px;cursor:pointer;color:#6b4a1e}
.pt-in{display:flex;gap:8px;padding:10px;background:#FBF3E2}.pt-in input{flex:1;border:1px solid #d9c08a;border-radius:999px;padding:9px 14px;outline:0;background:#fff;color:#2b2118;font:inherit}.pt-in button{border:0;background:#C99A55;color:#fff;border-radius:999px;padding:0 16px;font-weight:700;cursor:pointer}`;
document.head.appendChild(css);
const root=document.createElement('div');
root.innerHTML=`<button id="pt-fab" aria-label="Chat với Potato">🥔</button>
<div id="pt-panel" role="dialog" aria-label="Chat với Potato"><div class="pt-head"><span style="font-size:26px">🥔</span><div style="flex:1"><b>Potato</b><small id="pt-mode"></small></div><button id="pt-x" aria-label="Đóng">✕</button></div>
<div id="pt-msgs"></div><div id="pt-chips"></div><div class="pt-in"><input id="pt-input" maxlength="300" placeholder="Hỏi Potato điều gì đó..."><button id="pt-send">Gửi</button></div></div>`;
document.body.appendChild(root);
const $=id=>document.getElementById(id),msgs=$('pt-msgs');
const mode = () => {
  $('pt-mode').textContent = 'AI trực tuyến · dữ liệu lớp 12A6';
};
function add(cls,html){const d=document.createElement('div');d.className='pt-m '+cls;d.innerHTML=html;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}
const plain=h=>h.replace(/<br>/g,' ').replace(/<[^>]+>/g,'');
async function send(text){

  text=text.trim();if(!text)return;$('pt-input').value='';add('pt-me',esc(text));hist.push({role:'user',content:text});
  const wait=add('pt-bot','Potato đang nghĩ… 🥔');let out;
 try {
  out = esc(await ai()).replace(/\n/g, '<br>');
} catch (e) {
  out =
    'Potato chưa kết nối được AI, mình trả lời bằng dữ liệu có sẵn nhé 🥔:' +
    '<br><br>' +
    local(text);
}
}
$('pt-fab').onclick=()=>{const p=$('pt-panel');p.classList.toggle('open');if(p.classList.contains('open'))$('pt-input').focus()};
$('pt-x').onclick=()=>$('pt-panel').classList.remove('open');
$('pt-send').onclick=()=>send($('pt-input').value);
$('pt-input').addEventListener('keydown',e=>{if(e.key==='Enter')send(e.target.value)});
$('pt-chips').innerHTML=['Nguyễn Anh Khôi là ai?','Ai đá bóng hay?','Ai học FPT?','Sinh nhật tháng 11'].map(c=>`<button>${c}</button>`).join('');
$('pt-chips').onclick=e=>{if(e.target.tagName==='BUTTON')send(e.target.textContent)};
mode();add('pt-bot',"Chào bạn, mình là <b>Potato</b> 🥔! Mình biết kha khá về cả lớp 12A6. Hỏi mình về ai đó, trường đại học, sinh nhật hay album nào cũng được!");
