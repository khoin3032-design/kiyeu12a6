/* =====================================================================
   POTATO 🥔 — PHIÊN BẢN CHUẨN HÓA TÊN GỌI POTATO 100% (CỰC MƯỢT)
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

// Các câu đùa mặn mà về đời học sinh 12A6 đã đổi sang tên Potato
const JOKES=[
  "Tại sao Potato không bao giờ sợ thi học kỳ? Vì nó biết dù thế nào thì mình cũng... 'trúng tủ' dưới đất rồi! 🥔",
  "Điểm giống nhau giữa Potato và thần dân 12A6? Càng bị deadline và thầy cô 'ép' thì lại càng... giòn và tỏa sáng! ✨",
  "Potato hỏi khoai lang: 'Sao đi học về lúc nào mặt cậu cũng đỏ bừng lên thế?' — 'Tại tớ vừa được crush khen là đáng yêu phát ngất chứ sao!' 🍠",
  "Thanh xuân như một ly trà, hỏi câu khó quá Potato... ra chuồng gà ngủ luôn! 🐔 Hỏi câu khác dễ thở hơn đi cậu ơiii!"
];

/* ---------- Bộ não tra cứu offline ---------- */
const relOf=p=>QUAN_HE.flatMap(([a,b,k])=>a===p.ten?[[b,k]]:b===p.ten?[[a,k]]:[]);
function personCard(p){
  const rel=relOf(p),same=p.truong?lop.filter(x=>x.truong&&x!==p&&norm(x.truong)===norm(p.truong)):[],albums=mem.filter(m=>(m.profiles||[]).some(q=>q.ten&&q.ten===p.ten));
  let h=`<b>${esc(p.ten)}</b>${p.vaiTro?` — <i>\${esc(p.vaiTro)}</i>`:''}${p.ten===POTATO_LA?' (chính là mình, Potato 🥔 đây 😎)':''}`;
  if(SHOW_BD&&p.sinh)h+=`<br>🎂 Thổi nến ngày: ${esc(p.sinh)}`;
  h+=p.truong?`<br>🎓 Nơi cập bến: ${esc(p.truong)}`:'<br>🎓 Ẩn số đại học (chưa có thông tin)';
  h+=p.diem?`<br>📝 Sơ yếu lý lịch sơ sài: <i>${esc(p.diem)}</i>`:'<br>✨ Chưa có mô tả';
  if(rel.length)h+='<br>🤝 ' + rel.map(([n,k])=>`Là <b>${esc(k)}</b> của ${esc(n)}`).join('; ');
  if(same.length)h+=`<br>🔗 Đồng bọn chung trường: ${same.slice(0,5).map(x=>esc(x.ten)).join(', ')}${same.length>5?'…':''}`;
  if(albums.length)h+='<br>📸 Bị dìm hàng trong các album: '+albums.map(hA).join(', ');
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
  if(/^(hi|hello|hey|alo|chao|xin chao|yo)\b/.test(t))return "Hú hồn chim én! 🥔 Trợ lý Potato siêu cấp VIP PRO của 12A6 xin chào cậu nhen. Cậu muốn 'bóc phốt' hay tìm thông tin của thành viên nào trong lớp thế?";
  if(/(ban la ai|ten gi|potato la|ai tao ra|ai la potato)/.test(t))return `Tớ là <b>Potato</b> 🥔 — quả chip AI chạy bằng cơm, biết tuốt mọi bí mật ăn chơi, học hành của thần dân 12A6 đây!`;
  if(/(cam on|thanks|thank)/.test(t)) return "Ơ kìa khách sáo thế! Potato luôn yêu thương và sẵn sàng phục vụ cậu 💛";
  if(/(joke|dua|cuoi|chuyen vui|hai huoc)/.test(t))return JOKES[Math.floor(Math.random()*JOKES.length)];
  
  const intent=/(la ai|ai la|thong tin|nguoi nhu the nao|tinh cach|hoc truong|truong nao|hoc dai hoc)/.test(t);
  const ppl=findPeople(t,intent);
  if(ppl.length===1)return personCard(ppl);
  if(ppl.length>1)return `Úi chà, có tận ${ppl.length} thế lực trùng tên nè, để tớ liệt kê ra xem cậu muốn tìm ai nha:<br><br>`+ppl.slice(0,4).map(personCard).join('<br><br>');

  if (/(^| )ai |nhung ban|danh sach|bao nhieu ban|bao nhieu nguoi|ban nao/.test(t)) {
    let s = t.replace(/\b(ai|nhung|cac|ban|nguoi|nao|la|o|hoc|truong|dai hoc|co|danh sach|liet ke|cho|toi|biet|bao nhieu|trong lop|lop)\b/g, ' ').replace(/\s+/g, ' ').trim();
    s = ALIAS[s] || s;
    if (s.length >= 2) {
      let r = lop.filter(p => norm(p.diem + ' ' + p.truong).includes(s));
      if (r.length) return `Trời ơi tin được không, đây là danh sách đồng bọn khớp với từ khóa "${esc(s)}" nè:<br>` + r.map(p => `• ${nameLink(p)}${p.truong ? ` (\${esc(p.truong)})` : ''}`).join('<br>');
    }
  }
  return "Đầu Potato 🥔 nảy số chưa kịp rồi... Câu này tớ chưa học tới. Hay là cậu hỏi kiểu: 'Nguyễn Anh Khôi là ai', 'ai đá bóng giỏi', hoặc 'ai học FPT' đi, tớ trả lời rẹt rẹt liền!";
}

/* ---------- PREMIUM POTATO DESIGN CSS ---------- */
const css = `
  #pt-launcher { 
    position:fixed; bottom:25px; right:25px; width:65px; height:65px; 
    background:#FFD043; border:3px solid #5C3A0F; border-radius:50%; 
    cursor:pointer; box-shadow:0 10px 30px rgba(92,58,15,0.3); 
    display:flex; align-items:center; justify-content:center; 
    font-size:34px; z-index:9999; user-select:none;
    transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  #pt-launcher:hover { 
    transform: scale(1.15) rotate(-12deg); 
    background:#FFC107;
    box-shadow:0 14px 35px rgba(92,58,15,0.45); 
  }
  
  #pt-panel { 
    position:fixed; bottom:105px; right:25px; width:390px; height:560px; 
    background:rgba(255, 253, 246, 0.96); border:3.5px solid #5C3A0F; border-radius:28px; 
    box-shadow:0 20px 50px rgba(92,58,15,0.2); display:none; flex-direction:column; 
    overflow:hidden; z-index:9999; font-family: system-ui, -apple-system, sans-serif;
    transform: scale(0.85) translateY(40px); opacity:0; 
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1), opacity 0.3s ease;
    backdrop-filter: blur(10px);
  }
  #pt-panel.open { display:flex; transform: scale(1) translateY(0); opacity:1; }
  
  #pt-header { 
    background:#FFD043; color:#5C3A0F; padding:18px 22px; 
    font-weight:800; display:flex; justify-content:space-between; align-items:center;
    border-bottom:3.5px solid #5C3A0F; font-size:15px; letter-spacing:0.3px;
  }
  
  #pt-chatbox { 
    flex:1; padding:20px; overflow-y:auto; 
    background:#FFFDF6; display:flex; flex-direction:column; gap:16px;
  }
  
  #pt-chatbox::-webkit-scrollbar { width: 5px; }
  #pt-chatbox::-webkit-scrollbar-track { background: transparent; }
  #pt-chatbox::-webkit-scrollbar-thumb { background: #E4D0B7; border-radius: 10px; }
  
  .pt-msg { 
    max-width:85%; padding:12px 18px; border-radius:22px; 
    line-height:1.55; font-size:14.5px; color:#4A321A;
    box-shadow: 0 4px 10px rgba(92,58,15,0.05);
    animation: pt-bounceIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards;
  }
  @keyframes pt-bounceIn { from { opacity:0; transform:scale(0.9) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
  
  .pt-bot { 
    background:#F5ECD5; align-self:flex-start; 
    border-top-left-radius:4px; border: 1.5px solid rgba(92,58,15,0.15);
  }
  .pt-user { 
    background:#FFD043; align-self:flex-end; 
    border-top-right-radius:4px; margin-left:auto;
    border: 2px solid #5C3A0F; font-weight: 500;
  }
  
  #pt-input-area { 
    padding:14px 20px; border-top:3.5px solid #5C3A0F; 
    display:flex; background:#F5ECD5; align-items:center; gap:10px;
  }
  #pt-input { 
    flex:1; border:2.5px solid #5C3A0F; padding:11px 18px; 
    border-radius:24px; outline:none; font-size:14px; 
    background:#FFFDF6; color:#4A321A;
  }
  #pt-input:focus { border-color: #B25E00; }
  
  #pt-send { 
    background:#FFD043; color:#5C3A0F; border:2.5px solid #5C3A0F; 
    padding:9px 20px; border-radius:24px; cursor:pointer; 
    font-weight:bold; font-size:14px; transition:all 0.2s ease;
  }
  #pt-send:hover { background:#FFB300; transform:translateY(-1px); }
  
  .pt-link { color:#B25E00; text-decoration:underline; font-weight:bold; }
  .pt-link:hover { color:#5C3A0F; }
`;

const style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);

const html = `
  <div id="pt-launcher">🥔</div>
  <div id="pt-panel">
    <div id="pt-header">
      <span style="display:flex; align-items:center; gap:6px;">🥔 POTATO · 12A6 ASSISTANT</span>
      <span id="pt-close" style="cursor:pointer;font-size:26px;line-height:1; font-weight:bold;">×</span>
    </div>
    <div id="pt-chatbox">
      <div class="pt-msg pt-bot">Chào cậu, lại là Potato siêu cấp đáng yêu đây! 🥔 💛 Tớ đã nạp thêm rổ muối học đường rồi nè. Muốn hỏi thăm, lục tìm kỷ niệm cũ hay bóc phốt ai trong lớp 12A6 thì nhắn tớ ngay nhen! ✨</div>
    </div>
    <div id="pt-input-area">
      <input type="text" id="pt-input" placeholder="Nhập tên bạn học hoặc từ khóa tìm kiếm...">
      <button id="pt-send">Gửi</button>
    </div>
  </div>
`;

const div = document.createElement('div');
div.innerHTML = html;
document.body.appendChild(div);

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

function askBot(q) {
  const userText = q.trim();
  if (!userText) return;
  appendMsg(esc(userText), true);
  const reply = local(userText);
  setTimeout(() => appendMsg(reply, false), 250);
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') askBot(input.value);
});

sendBtn.addEventListener('click', () => askBot(input.value));

input.value = '';

})();

