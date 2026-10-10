/* =====================================================================
   POTATO 🥔 — Phiên bản giao diện CHỦ ĐỀ KHOAI TÂY VÀNG CUTE HOÀN CHỈNH
   ===================================================================== */
(function(){
const AI_ENDPOINT = '/api/chat';
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
const SHOW_BD=typeof HIEN_NGAY_SINH==='undefined'||HIEN_NGAY_SINH;
const link=(h,t)=>`<a href="${h}" class="pt-link" onclick="document.getElementById('pt-panel').classList.remove('open')">${esc(t)}</a>`;
const hA=m=>link('#'+m.id,m.title),hT=t=>link('#'+t.id,t.ten);
const first=p=>p.ten.split(' ').slice(-1);
const nameLink=p=>`<b style="color:#B25E00">${esc(p.ten)}</b>`;
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
  const t=norm(q).replace(/[?!.,;:"擺]/g,' ').replace(/\s+/g,' ').trim();
  if(/^(hi|hello|hey|alo|chao|xin chao|yo)\b/.test(t))return "Chào cậu! Mâm khoai tây nướng đến đây 🥔 Cậu muốn hỏi về bạn nào trong lớp 12A6 thế?";
  if(/(ban la ai|ten gi|potato la|ai tao ra|ai la potato)/.test(t))return `Tớ là siêu cấp trợ lý <b>Potato</b> 🥔 — một củ khoai tây siêu thông thái của 12A6!`;
  if(/(cam on|thanks|thank)/.test(t))return "Hì hì không có gì nha! Khoai tây luôn thương cậu 💛";
  if(/(joke|dua|cuoi|chuyen vui|hai huoc)/.test(t))return JOKES[Math.floor(Math.random()*JOKES.length)];
  
  const intent=/(la ai|ai la|thong tin|nguoi nhu the nao|tinh cach|hoc truong|truong nao|hoc dai hoc)/.test(t);
  const ppl=findPeople(t,intent);
  if(ppl.length===1)return personCard(ppl[0]);
  if(ppl.length>1)return `Úi, có tận ${ppl.length} củ khoai tây trùng tên nè, để tớ liệt kê nha:<br><br>`+ppl.slice(0,4).map(personCard).join('<br><br>');

  if (/(^| )ai |nhung ban|danh sach|bao nhieu ban|bao nhieu nguoi|ban nao/.test(t)) {
    let s = t.replace(/\b(ai|nhung|cac|ban|nguoi|nao|la|o|hoc|truong|dai hoc|co|danh sach|liet ke|cho|toi|biet|bao nhieu|trong lop|lop)\b/g, ' ').replace(/\s+/g, ' ').trim();
    s = ALIAS[s] || s;
    if (s.length >= 2) {
      let r = lop.filter(p => norm(p.diem + ' ' + p.truong).includes(s));
      if (r.length) return `Danh sách các bạn khớp với từ khóa "${esc(s)}":<br>` + r.map(p => `• ${nameLink(p)}${p.truong ? ` (\${esc(p.truong)})` : ''}`).join('<br>');
    }
  }
  return "Khoai tây 🥔 chưa hiểu ý cậu lắm... Thử hỏi tớ: 'Nguyễn Anh Khôi là ai', 'ai đá bóng hay', hoặc 'ai học FPT' xem nèoo!";
}

/* ---------- POTATO CUTE THEME CSS ---------- */
const css = `
  #pt-launcher { 
    position:fixed; bottom:25px; right:25px; width:65px; height:65px; 
    background:#FFD043; border:3.5px solid #6E4711; border-radius:50%; 
    cursor:pointer; box-shadow:0 8px 24px rgba(110,71,17,0.25); 
    display:flex; align-items:center; justify-content:center; 
    font-size:32px; z-index:9999; user-select:none;
    transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  #pt-launcher:hover { 
    transform: scale(1.15) rotate(-10deg); 
    background:#FFC107;
    box-shadow:0 12px 28px rgba(110,71,17,0.4); 
  }
  
  #pt-panel { 
    position:fixed; bottom:105px; right:25px; width:380px; height:520px; 
    background:#FFFDF6; border:4px solid #6E4711; border-radius:28px; 
    box-shadow:0 16px 35px rgba(110,71,17,0.15); display:none; flex-direction:column; 
    overflow:hidden; z-index:9999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    transform: scale(0.9) translateY(30px); opacity:0; transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  }
  #pt-panel.open { display:flex; transform: scale(1) translateY(0); opacity:1; }
  
  #pt-header { 
    background:#FFD043; color:#6E4711; padding:16px 20px; 
    font-weight:900; display:flex; justify-content:space-between; align-items:center;
    border-bottom:3.5px solid #6E4711; font-size:16px;
  }
  
  #pt-chatbox { 
    flex:1; padding:18px; overflow-y:auto; 
    background:#FFFDF6; display:flex; flex-direction:column; gap:14px;
  }
  
  .pt-msg { 
    max-width:82%; padding:11px 16px; border-radius:20px; 
    line-height:1.5; font-size:14px; color:#4E3619;
    box-shadow: 0 3px 6px rgba(110,71,17,0.04);
    animation: pt-bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards;
  }
  @keyframes pt-bounceIn { from { opacity:0; transform:scale(0.85) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
  
  .pt-bot { 
    background:#FCEFCA; align-self:flex-start; 
    border-top-left-radius:4px; border: 2px solid rgba(110,71,17,0.12);
  }
  .pt-user { 
    background:#FFD043; align-self:flex-end; 
    border-top-right-radius:4px; margin-left:auto;
    border: 2px solid #6E4711; font-weight: 500;
  }
  
  #pt-input-area { 
    padding:12px 16px; border-top:3.5px solid #6E4711; 
    display:flex; background:#FCEFCA; align-items:center; gap:8px;
  }
  #pt-input { 
    flex:1; border:2.5px solid #6E4711; padding:10px 16px; 
    border-radius:20px; outline:none; font-size:14px; 
    background:#FFFDF6; color:#4E3619;
  }
  #pt-input::placeholder { color: #A0825B; }
  
  #pt-send { 
    background:#FFD043; color:#6E4711; border:2.5px solid #6E4711; 
    padding:8px 18px; border-radius:20px; cursor:pointer; 
    font-weight:bold; font-size:14px; transition:all 0.2s;
  }
  #pt-send:hover { background:#FFC107; transform:scale(1.05); }
  
  .pt-link { color:#B25E00; text-decoration:underline; font-weight:bold; }
  .pt-link:hover { color:#6E4711; }
`;

const style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);

const html = `
  <div id="pt-launcher">🥔</div>
  <div id="pt-panel">
    <div id="pt-header">
      <span>🥔 POTATO TRỢ LÝ THÔNG THÁI</span>
      <span id="pt-close" style="cursor:pointer;font-size:26px;line-height:1; font-weight:900;">×</span>
    </div>
    <div id="pt-chatbox">
      <div class="pt-msg pt-bot">Chào cậu, tớ là Potato đây! 🥔 💛 Tớ đã nhuộm vàng giao diện để sưởi ấm căn phòng chat của tụi mình rồi nè. Muốn hỏi gì về 12A6 cứ bảo tớ nhen! ✨</div>
    </div>
    <div id="pt-input-area">
      <input type="text" id="pt-input" placeholder="Nhập lời muốn hỏi củ khoai tây...">
      <button id="pt-send">Gửi</button>
    </div>
  </div>
`;

const div = document.createElement('div');
div.innerHTML = html;
document.body.appendChild(div);

/* ---------- Điều khiển & Hiệu ứng mượt mà ---------- */
const launcher = document.getElementById('pt-launcher');
const panel = document.getElementById('pt-panel');
const closeBtn = document.getElementById('pt-close');
const input = document.getElementById('pt-input');
const sendBtn = document.getElementById('pt-send');
const chatbox = document.getElementById('pt-chatbox');

launcher.onclick = () => {
  if(panel.classList.contains('open')) {
    panel.classList.remove('open');
    setTimeout(() => panel.style.display = 'none', 300);
  } else {
    panel.style.display = 'flex';
    setTimeout(() => panel.classList.add('open'), 10);
  }
};

closeBtn.onclick = () => {
  panel.classList.remove('open');
  setTimeout(() => panel.style.display = 'none', 300);
};

function appendMsg(text, isUser) {
  const msg = document.createElement('div');
  msg.className = `pt-msg ${isUser ? 'pt-user' : 'pt-bot'}`;
  msg.innerHTML = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function handleSend() {
  const val = input.value.trim();
  if(!val) return;
  input.value = '';
  appendMsg(esc(val), true);

  // Hiệu ứng "Potato đang lăn bánh suy nghĩ..."
  const thinking = document.createElement('div');
  thinking.className = 'pt-msg pt-bot';
  thinking.innerHTML = '<i>Khoai tây đang nảy số... 🥔 ⚡</i>';
  chatbox.appendChild(thinking);
  chatbox.scrollTop = chatbox.scrollHeight;

  setTimeout(() => {
    thinking.remove();
    const reply = local(val);
    appendMsg(reply, false);
  }, 500);
}

sendBtn.onclick = handleSend;
input.onkeydown = (e) => { if(e.key === 'Enter') handleSend(); };

window.localChatProcessor = local;
})();
