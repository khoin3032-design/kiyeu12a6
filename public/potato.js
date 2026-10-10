/* =====================================================================
   POTATO 🥔 — PHIÊN BẢN GIAO DIỆN NGUYÊN BẢN Y HỆT TRONG ẢNH CHỤP
   ===================================================================== */
(function(){
const AI_ENDPOINT = '/api/chat';
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
const SHOW_BD=typeof HIEN_NGAY_SINH==='undefined'||HIEN_NGAY_SINH;
const link=(h,t)=>`<a href="${h}" class="pt-link" onclick="document.getElementById('pt-panel').classList.remove('open')">${esc(t)}</a>`;
const hA=m=>link('#'+m.id,m.title),hT=t=>link('#'+t.id,t.ten);
const first=p=>p.ten.split(' ').slice(-1);
const nameLink=p=>`<b>${esc(p.ten)}</b>`;
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
  let h=`Cậu đang tìm thông tin về ${esc(p.ten)}. Cậu, ${esc(p.ten.split(' ').slice(-2).join(' '))} là một ${p.vaiTro || 'thành viên'} đáng yêu${p.sinh ? `, sinh ngày ${esc(p.sinh)}` : ''}${p.truong ? `, học tại ${esc(p.truong)}` : ''}.${p.diem ? ` ${esc(p.diem)}` : ''}`;
  if(rel.length) h += ` Bạn ấy có quan hệ: ` + rel.map(([n,k])=>`${esc(k)} với ${esc(n)}`).join('; ') + '.';
  if(same.length) h += ` Cùng trường đại học có: ${same.slice(0,5).map(x=>esc(x.ten)).join(', ')}.`;
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
  if(ppl.length===1)return personCard(ppl[0]);
  if(ppl.length>1)return `Úi chà, có tận ${ppl.length} thế lực trùng tên nè, để tớ liệt kê ra xem cậu muốn tìm ai nha:<br><br>`+ppl.slice(0,4).map(personCard).join('<br><br>');

  if (/(^| )ai |nhung ban|danh sach|bao nhieu ban|bao nhieu nguoi|ban nao/.test(t)) {
    let s = t.replace(/\b(ai|nhung|cac|ban|nguoi|nao|la|o|hoc|truong|dai hoc|co|danh sach|liet ke|cho|toi|biet|bao nhieu|trong lop|lop)\b/g, ' ').replace(/\s+/g, ' ').trim();
    s = ALIAS[s] || s;
    if (s.length >= 2) {
      let r = lop.filter(p => norm(p.diem + ' ' + p.truong).includes(s));
              if (r.length) return `Danh sách các bạn khớp với từ khóa "${esc(s)}":<br>` + r.map(p => `• ${nameLink(p)}${p.truong ? ` (\${esc(p.truong)})` : ''}`).join('<br>');

    }
  }
  return "Đầu Potato 🥔 nảy số chưa kịp rồi... Câu này tớ chưa học tới. Hay là cậu hỏi kiểu: 'Nguyễn Anh Khôi là ai', 'ai đá bóng giỏi', hoặc 'ai học FPT' đi, tớ trả lời rẹt rẹt liền!";
}

/* ---------- CSS TẠO GIAO DIỆN NGUYÊN BẢN Y HỆT TRONG ẢNH ---------- */
const css = `
  #pt-launcher { 
    position:fixed; bottom:25px; right:25px; width:65px; height:65px; 
    background:#D1A256; border-radius:50%; cursor:pointer; 
    box-shadow:0 8px 24px rgba(0,0,0,0.15); display:flex; align-items:center; 
    justify-content:center; font-size:32px; z-index:9999; user-select:none;
    transition: transform 0.2s ease;
  }
  #pt-launcher:hover { transform: scale(1.05); }
  
  #pt-panel { 
    position:fixed; bottom:105px; right:25px; width:390px; height:570px; 
    background:#FDF8EE; border-radius:28px; box-shadow:0 12px 36px rgba(0,0,0,0.12); 
    display:none; flex-direction:column; overflow:hidden; z-index:9999;
    font-family: system-ui, -apple-system, sans-serif;
  }
  #pt-panel.open { display:flex; }
  
  #pt-header { 
    background:#CD9B4D; color:#FFFDF9; padding:16px 20px; 
    display:flex; justify-content:space-between; align-items:center;
  }
  #pt-header-title { font-weight:700; font-size:16px; line-height:1.2; }
  #pt-header-sub { font-size:12px; opacity:0.9; font-weight:normal; display:block; margin-top:2px; }
  
  #pt-chatbox { 
    flex:1; padding:18px; overflow-y:auto; 
    display:flex; flex-direction:column; gap:14px;
    background:#FDF8EE;
  }
  
  #pt-chatbox::-webkit-scrollbar { width: 6px; }
  #pt-chatbox::-webkit-scrollbar-track { background: transparent; }
  #pt-chatbox::-webkit-scrollbar-thumb { background: #CD9B4D; border-radius: 10px; }
  
  .pt-msg { 
    max-width:85%; padding:12px 18px; border-radius:18px; 
    line-height:1.5; font-size:14.5px; color:#1F1F1F;
  }
  
  .pt-bot { 
    background:#FFF; align-self:flex-start; 
    border: 1px solid #ECE4D5; box-shadow: 0 2px 6px rgba(0,0,0,0.02);
  }
  .pt-user { 
    background:#CD9B4D; color:#FFF; align-self:flex-end; 
    margin-left:auto;
  }
  
  #pt-suggestions {
    padding: 0 16px 8px 16px; display:flex; flex-wrap:wrap; gap:8px; background:#FDF8EE;
  }
  .pt-chip {
    background:#FFF; border:1px solid #D6CBB7; padding:6px 14px; 
    border-radius:20px; font-size:13px; color:#4E4435; cursor:pointer;
    transition: all 0.2s;
  }
  .pt-chip:hover { background:#F5ECD9; border-color:#CD9B4D; }
  
  #pt-input-area { 
    padding:12px 16px 18px 16px; display:flex; background:#FDF8EE; 
    align-items:center; gap:10px;
  }
  #pt-input { 
    flex:1; border:1px solid #D6CBB7; padding:11px 18px; 
    border-radius:24px; outline:none; font-size:14px; background:#FFF; color:#222;
  }
  #pt-input::placeholder { color: #AFA28D; }
  
  #pt-send { 
    background:#CD9B4D; color:#FFF; border:none; 
    padding:11px 22px; border-radius:24px; cursor:pointer; 
    font-weight:bold; font-size:14px; transition: background 0.2s;
  }
  #pt-send:hover { background:#B58437; }
`;

const style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);

const html = `
  <div id="pt-launcher">🥔</div>
  <div id="pt-panel">
    <div id="pt-header">
      <div>
        <div id="pt-header-title">Potato</div>
        <div id="pt-header-sub">AI trực tuyến · dữ liệu lớp 12A6</div>
      </div>
      <span id="pt-close" style="cursor:pointer;font-size:24px;line-height:1;">×</span>
    </div>
    <div id="pt-chatbox">
      <div class="pt-msg pt-bot">Chào cậu, tớ là Potato đây! 🥔 💛 Tớ lưu giữ toàn bộ hồi ức của 12A6. Cậu muốn hỏi gì cứ nhắn tớ nhen! ✨</div>
    </div>
    <div id="pt-suggestions">
      <button class="pt-chip" onclick="suggest('Nguyễn Anh Khôi là ai?')">Nguyễn Anh Khôi là ai?</button>
      <button class="pt-chip" onclick="suggest('Ai đá bóng hay?')">Ai đá bóng hay?</button>
      <button class="pt-chip" onclick="suggest('Ai học FPT?')">Ai học FPT?</button>
      <button class="pt-chip" onclick="suggest('Sinh nhật tháng 11')">Sinh nhật tháng 11</button>
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

function handleSend() {
  const val = input.value.trim();
  if(!val) return;
  input.value = '';
  appendMsg(esc(val), true);

  const thinking = document.createElement('div');
  thinking.className = 'pt-msg pt-bot';
  thinking.innerHTML = '<i>Đợi tí, Potato đang lục lại ký ức thanh xuân... 📝 ⚡</i>';
  chatbox.appendChild(thinking);
  chatbox.scrollTop = chatbox.scrollHeight;

  setTimeout(() => {
    thinking.remove();
    const reply = local(val);
    appendMsg(reply, false);
  }, 450);
}

window.suggest = function(text) {
  input.value = text;
  handleSend();
};

sendBtn.onclick = handleSend;
input.onkeydown = (e) => { if(e.key === 'Enter') handleSend(); };

})();