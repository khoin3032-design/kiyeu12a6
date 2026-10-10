/* =====================================================================
   POTATO 🥔 — Trợ lý chat hoàn chỉnh cho lớp 12A6 (Đầy đủ giao diện và bộ não)
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

/* ---------- Bộ não tra cứu offline ---------- */
const relOf=p=>QUAN_HE.flatMap(([a,b,k])=>a===p.ten?[[b,k]]:b===p.ten?[[a,k]]:[]);
function personCard(p){
  const rel=relOf(p),same=p.truong?lop.filter(x=>x.truong&&x!==p&&norm(x.truong)===norm(p.truong)):[],albums=mem.filter(m=>(m.profiles||[]).some(q=>q.ten&&q.ten===p.ten));
  let h=`<b>${esc(p.ten)}</b>${p.vaiTro?` — <i>\${esc(p.vaiTro)}</i>`:''}${p.ten===POTATO_LA?' (chính là mình, Potato 🥔 đây 😎)':''}`;
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
  return lop.filter(p=>{const w=norm(first(p));return w.length>=2&&new RegExp('(^| )'+w+'( |\$)').test(t)});
}

function local(q){
  const t=norm(q).replace(/[?!.,;:"“”]/g,' ').replace(/\s+/g,' ').trim();
  if(/^(hi|hello|hey|alo|chao|xin chao|yo)\b/.test(t))return "Chào cậu! Mình là <b>Potato</b> 🥔 — hóa thân của "+esc(POTATO_LA)+". Cậu muốn hỏi về bạn nào trong lớp, trường đại học, sinh nhật hay album?";
  if(/(ban la ai|ten gi|potato la|ai tao ra|ai la potato)/.test(t))return `Mình là <b>Potato</b> 🥔 — chatbot thông thái biết hết về 12A6!`;
  if(/(cam on|thanks|thank)/.test(t))return "Không có gì nha! Khoai tây luôn ở đây 🥔💛";
  if(/(joke|dua|cuoi|chuyen vui|hai huoc)/.test(t))return JOKES[Math.floor(Math.random()*JOKES.length)];
  
  const intent=/(la ai|ai la|thong tin|nguoi nhu the nao|tinh cach|hoc truong|truong nao|hoc dai hoc)/.test(t);
  const ppl=findPeople(t,intent);
  if(ppl.length===1)return personCard(ppl[0]);
  if(ppl.length>1)return `Có ${ppl.length} bạn khớp:<br><br>`+ppl.slice(0,4).map(personCard).join('<br><br>');

  if (/(^| )ai |nhung ban|danh sach|bao nhieu ban|bao nhieu nguoi|ban nao/.test(t)) {
    let s = t.replace(/\b(ai|nhung|cac|ban|nguoi|nao|la|o|hoc|truong|dai hoc|co|danh sach|liet ke|cho|toi|biet|bao nhieu|trong lop|lop)\b/g, ' ').replace(/\s+/g, ' ').trim();
    s = ALIAS[s] || s;
    if (s.length >= 2) {
      let r = lop.filter(p => norm(p.diem + ' ' + p.truong).includes(s));
      if (r.length) return `Danh sách các bạn khớp với từ khóa "${esc(s)}":<br>` + r.map(p => `• ${nameLink(p)}${p.truong ? ` (\${esc(p.truong)})` : ''}`).join('<br>');
    }
  }
  return "Potato 🥔 chưa hiểu câu này lắm. Cậu thử hỏi dạng: 'Nguyễn Anh Khôi là ai', 'ai đá bóng hay', hoặc 'ai học FPT' xem sao nha!";
}

/* ---------- HTML/CSS Tạo giao diện nút bấm và khung chat ---------- */
const css = `
  #pt-launcher { position:fixed; bottom:20px; right:20px; width:60px; height:60px; background:#E9DFCB; border:3px solid #D8452F; border-radius:50%; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center; font-size:30px; z-index:9999; transition:transform 0.2s; }
  #pt-launcher:hover { transform:scale(1.05); }
  #pt-panel { position:fixed; bottom:90px; right:20px; width:360px; height:480px; background:#fff; border:2px solid #D8452F; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.2); display:none; flex-direction:column; overflow:hidden; z-index:9999; font-family:sans-serif; }
  #pt-panel.open { display:flex; }
  #pt-header { background:#D8452F; color:#fff; padding:12px; font-weight:bold; display:flex; justify-content:between; align-items:center; }
  #pt-chatbox { flex:1; padding:12px; overflow-y:auto; background:#FDFBF7; font-size:14px; }
  .pt-msg { margin-bottom:10px; max-width:80%; padding:8px 12px; border-radius:12px; line-height:1.4; }
  .pt-bot { background:#E9DFCB; color:#222; align-self:flex-start; border-bottom-left-radius:2px; }
  .pt-user { background:#D8452F; color:#fff; align-self:flex-end; border-bottom-right-radius:2px; margin-left:auto; }
  #pt-input-area { padding:8px; border-top:1px solid #eee; display:flex; background:#fff; }
  #pt-input { flex:1; border:1px solid #ccc; padding:8px; border-radius:20px; outline:none; font-size:14px; padding-left:14px; }
  #pt-send { background:#D8452F; color:#fff; border:none; padding:6px 14px; margin-left:6px; border-radius:20px; cursor:pointer; font-weight:bold; }
`;

const style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);

const html = `
  <div id="pt-launcher" title="Chat với Potato">🥔</div>
  <div id="pt-panel">
    <div id="pt-header"><span>🥔 Potato Assistant</span><span id="pt-close" style="cursor:pointer;font-size:20px;">×</span></div>
    <div id="pt-chatbox">
      <div class="pt-msg pt-bot">Chào bạn, mình là Potato 🥔! Bạn cần tra cứu thông tin gì về tập thể lớp 12A6 không?</div>
    </div>
    <div id="pt-input-area">
      <input type="text" id="pt-input" placeholder="Hỏi Potato điều gì đó...">
      <button id="pt-send">Gửi</button>
    </div>
  </div>
`;

const div = document.createElement('div');
div.innerHTML = html;
document.body.appendChild(div);

/* ---------- Xử lý tương tác điều khiển bật tắt nút ---------- */
const launcher = document.getElementById('pt-launcher');
const panel = document.getElementById('pt-panel');
const closeBtn = document.getElementById('pt-close');
const input = document.getElementById('pt-input');
const sendBtn = document.getElementById('pt-send');
const chatbox = document.getElementById('pt-chatbox');

launcher.onclick = () => panel.classList.toggle('open');
closeBtn.onclick = () => panel.classList.remove('open');

function appendMsg(text, isUser) {
  const msg = document.createElement('div');
  msg.className = `pt-msg ${isUser ? 'pt-user' : 'pt-bot'}`;
  msg.innerHTML = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function handleSend() {
  const val = input.value.trim();
  if(!val) return;
  input.value = '';
  appendMsg(esc(val), true);

  // Tạo hiệu ứng chờ phản hồi
  const thinking = document.createElement('div');
  thinking.className = 'pt-msg pt-bot';
  thinking.innerHTML = 'Potato đang nghĩ... 🥔';
  chatbox.appendChild(thinking);
  chatbox.scrollTop = chatbox.scrollHeight;

  // Xử lý bộ não offline
  setTimeout(() => {
    thinking.remove();
    const reply = local(val);
    appendMsg(reply, false);
  }, 600);
}

sendBtn.onclick = handleSend;
input.onkeydown = (e) => { if(e.key === 'Enter') handleSend(); };

window.localChatProcessor = local;
})();
