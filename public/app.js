/* ===== Kỷ yếu 12A6 · v4 — phần chạy của trang (nội dung nằm ở data.js) ===== */
const $=id=>document.getElementById(id);
const U=(id,w=800)=>/[\/.]/.test(id)?(/^(https?:|data:)/.test(id)?id:encodeURI(id).replace(/#/g,'%23').replace(/\?/g,'%3F')):`https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
const FB="data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#E9DFCB"/><text x="50%" y="50%" fill="#D8452F" font-family="serif" font-size="48" text-anchor="middle">12A6</text></svg>');
const ERR=`this.onerror=null;this.src='${FB}'`;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rot=i=>[-4,3,-2,5,-3][i%5],pad=n=>String(n).padStart(2,'0'),ph=x=>typeof x==='string'?x:x.file;
const coverOf=m=>m.bia||ph(m.photos[0]);
const PAL=['#D8452F','#2F7D6B','#C9962B','#3B5BA9','#8A4FA3','#CC5C83'];
const WASHI=['#FFD6A5','#CDEAC0','#BDE0FE','#FFC8DD','#E4C1F9'],DOW=['CN','T2','T3','T4','T5','T6','T7'];
const RAT=['aspect-[3/4]','aspect-[4/3]','aspect-square','aspect-[4/5]','aspect-[3/2]'];
const WALL='columns-2 md:columns-3 lg:columns-4 2xl:columns-5 gap-5';

function avatar(name,photo,w){
  if(photo)return U(photo,w||300);
  const t=name.trim().split(/\s+/),ini=(t.length>1?t[t.length-2][0]+t[t.length-1][0]:t[0][0]).toUpperCase();let h=0;for(const c of name)h=(h*31+c.charCodeAt(0))%PAL.length;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125"><rect width="100" height="125" fill="${PAL[h]}"/><text x="50" y="76" font-size="40" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">${ini}</text></svg>`);
}
const toAlbum=(o,label)=>o.album=o.photos.map((p,i)=>{const x=typeof p==='string'?{file:p}:p;return {id:x.file,nhom:x.nhom||'',cap:x.cap||`${label} · ảnh ${i+1}`}});
mem.forEach(m=>{toAlbum(m,m.title);m.album.forEach(x=>x.nhom='')});chuyendi.forEach(t=>toAlbum(t,t.ten));
const lopOf=d=>{const y=d.getFullYear(),s=d.getMonth()+1>=8?y:y-1;return String(Math.min(12,Math.max(10,10+s-2022)))};
const frames=daily.map(x=>{const [y,m,d]=(x.ngay||'2000-01-01').split('-'),dt=new Date(+y,m-1,+d);return {id:x.file,d:dt,cap:x.chuthich||'',lop:x.lop||lopOf(dt)}});

/* ---------- Xem ảnh lớn ---------- */
let lists=[],L=[],I=0;const reg=l=>lists.push(l)-1;
const lbi=x=>({s:U(x.id,1600),t:U(x.id,150),cap:x.cap||''});
function openLb(i,k){L=lists[k];I=i;showLb();$('lb').classList.remove('hidden')}
function showLb(){const m=L[I];$('lbImg').src=m.s;$('lbCount').textContent=`${I+1} / ${L.length}${m.cap?' · '+m.cap:''}`;
  $('lbThumbs').innerHTML=L.length>1?L.map((x,i)=>`<button onclick="I=${i};showLb()" class="shrink-0 w-12 h-12 rounded overflow-hidden ${i===I?'ring-2 ring-white':'opacity-50'}"><img src="${x.t}" alt="" onerror="${ERR}" class="w-full h-full object-cover"></button>`).join(''):''}
const stepLb=d=>{I=(I+d+L.length)%L.length;showLb()};
const closeLb=()=>$('lb').classList.add('hidden');
addEventListener('keydown',e=>{if($('lb').classList.contains('hidden'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')stepLb(1);if(e.key==='ArrowLeft')stepLb(-1)});
let tx=0;$('lb').addEventListener('touchstart',e=>tx=e.touches[0].clientX);
$('lb').addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)stepLb(d<0?1:-1)});

/* ---------- Thành phần dùng chung ---------- */
const pol=(x,i,k)=>`<button onclick="openLb(${i},${k})" title="${esc(x.cap)}" class="polaroid relative block w-full mb-5 break-inside-avoid cursor-zoom-in" style="transform:rotate(${rot(i)*.6}deg);padding-bottom:10px"><img src="${U(x.id,500)}" alt="${esc(x.cap)}" loading="lazy" decoding="async" onerror="${ERR}" class="w-full ${RAT[(i*7)%5]} object-cover"></button>`;
const chip=(on,fn,arg,l)=>`<button class="chip ${on?'on':''}" data-k="${esc(arg)}" onclick="${fn}(this.dataset.k)">${esc(l)}</button>`;
const back='<a href="#" class="chip inline-block">← Về trang chủ</a>';
const nPhoto=a=>`${a.length} ảnh`;

/* ---------- Trang chủ ---------- */
let yr='all',sq='',dq='';
function home(){
  const hero=mem.slice(0,4),pos=['left-0 top-4 w-48 sm:w-56','right-0 top-0 w-44 sm:w-52','left-10 sm:left-16 bottom-0 w-44 sm:w-52','right-4 sm:right-10 bottom-6 w-40 sm:w-48'];
  const dThumbs=YRS.filter(y=>frames.some(f=>f.lop===y)).map(y=>({id:dailyPoster[y]||frames.find(f=>f.lop===y).id}));
  const tThumbs=chuyendi.map(t=>({id:t.bia||t.album[0].id})).slice(0,4);
  $('app').innerHTML=`
  <header class="paper-grain"><div class="max-w-6xl mx-auto px-4 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
    <div class="space-y-6"><p class="font-hand text-2xl red">THPT Chuyên Sơn Tây · 2022 – 2025</p>
      <h1 class="font-display font-extrabold text-5xl sm:text-7xl leading-[1.02] tracking-tight">Ba mùa phượng<br>của <span class="italic font-medium">chúng mình.</span></h1>
      <p class="muted text-base sm:text-lg leading-relaxed max-w-md">Một cuốn album nhỏ về tập thể 12A6: những trận bóng, hội trại, buổi tập văn nghệ, những chuyến đi và ngày chia tay mái trường.</p>
      <div class="flex flex-wrap gap-3"><button onclick="goto('years')" class="bg-[var(--red)] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:brightness-110">Lật album</button></div></div>
    <div class="relative h-[380px] sm:h-[440px]">${hero.map((m,i)=>`<a href="#${m.id}" class="polaroid absolute ${pos[i]}" style="transform:rotate(${rot(i)*1.4}deg)"><span class="tape"></span><img src="${U(coverOf(m),500)}" alt="${esc(m.title)}" onerror="${ERR}" class="w-full aspect-square object-cover"><span class="font-hand text-lg block mt-1.5" style="color:var(--ink)">Lớp ${m.year} · ${esc(m.date.split(' / ')[1])}</span></a>`).join('')}</div>
  </div></header>

  <section id="years" class="max-w-6xl mx-auto px-4 py-16 space-y-8 scroll-mt-16">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-5"><h2 class="font-display font-extrabold text-3xl sm:text-4xl">Album theo năm học</h2>
      <div class="flex flex-wrap items-center gap-2"><input id="sq" oninput="sq=this.value;renderYears()" placeholder="Tìm bạn, năm, kỷ niệm..." class="card rounded-full px-4 py-2 text-sm w-44 focus:outline-none focus:border-[var(--red)] bg-transparent"><div id="yrChips" class="flex gap-2"></div></div></div>
    <div id="yearsBox" class="space-y-14"></div><div id="searchResults" class="space-y-4"></div></section>

  <section id="own" class="max-w-6xl mx-auto px-4 pb-16 space-y-6 scroll-mt-16">
    <div><p class="font-hand text-2xl red">những kỉ niệm đáng nhớ</p><h2 class="font-display font-extrabold text-3xl sm:text-4xl">Album 12A6</h2></div>
    <div class="grid md:grid-cols-2 gap-6">
      <a href="#cuon-phim" class="grid-paper card rounded-3xl p-6 relative block hover:-translate-y-1 transition duration-300"><div class="flex gap-3 mb-5">${dThumbs.map((f,i)=>`<div class="relative flex-1" style="transform:rotate(${rot(i)}deg)"><span class="washi" style="background:${WASHI[i]};width:44px;height:14px"></span><img src="${U(f.id,300)}" alt="" loading="lazy" onerror="${ERR}" class="w-full aspect-[3/4] object-cover" style="border:5px solid #fff;box-shadow:0 5px 12px -5px rgba(0,0,0,.4)"></div>`).join('')}</div>
        <p class="font-hand text-2xl red">nhật ký của cả lớp</p><h3 class="font-hand font-bold text-5xl"><span class="marker">Daily</span></h3><p class="muted text-sm mt-2">${dThumbs.length} năm học · ${frames.length} ảnh</p></a>
      <a href="#chuyen-di" class="card rounded-3xl p-6 relative block hover:-translate-y-1 transition duration-300"><div class="flex gap-3 mb-5">${tThumbs.map((x,i)=>`<img src="${U(x.id,300)}" alt="" loading="lazy" onerror="${ERR}" class="flex-1 min-w-0 aspect-[3/4] object-cover rounded-xl">`).join('')}</div>
        <p class="font-hand text-2xl red">✈ mỗi chuyến đi là một trải nghiệm</p><h3 class="font-display font-extrabold text-4xl">A6 đi đâu thế</h3><p class="muted text-sm mt-2">${chuyendi.length} chuyến đi · ${chuyendi.reduce((s,t)=>s+t.album.length,0)} ảnh</p></a>
    </div></section>

  <section id="guestbook" class="max-w-6xl mx-auto px-4 py-16 space-y-8 scroll-mt-16"><div><h2 class="font-display font-extrabold text-3xl sm:text-4xl">Lưu bút</h2><p class="muted mt-1">Để lại vài dòng cho tụi mình sau này đọc lại nhé.</p></div>
    <div class="card rounded-2xl p-5 grid sm:grid-cols-[1fr_2fr_auto] gap-3"><input id="gbN" maxlength="30" placeholder="Tên của bạn" class="bg-transparent border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red)]" style="border-color:var(--line)"><input id="gbM" maxlength="140" placeholder="Lời nhắn (tối đa 140 ký tự)" onkeydown="if(event.key==='Enter')addNote()" class="bg-transparent border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--red)]" style="border-color:var(--line)"><button onclick="addNote()" class="bg-[var(--red)] text-white font-semibold px-6 py-2.5 rounded-xl hover:brightness-110">Dán lên</button></div>
    <div id="notes" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"></div></section>`;
  renderYears();renderNotes();
}
function setYr(y){yr=y;renderYears()}
const searchText=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
function renderYears(){
  $('yrChips').innerHTML=[['all','Tất cả'],['10','Lớp 10'],['11','Lớp 11'],['12','Lớp 12']].map(([k,l])=>chip(yr===k,'setYr',k,l)).join('');
  const q=searchText(sq.trim()),includesQuery=value=>searchText(value).includes(q);
  const h=['10','11','12'].filter(y=>yr==='all'||yr===y).map(y=>{
    const items=mem.filter(m=>{
      const people=(m.profiles||[]).flatMap(p=>[p.ten,p.role,p.quote]).join(' ');
      return m.year===y&&(!q||includesQuery([m.title,m.summary,m.cat,m.story,m.date,m.year,people].join(' ')));
    });
    if(!items.length)return '';
    return `<div class="grid md:grid-cols-[150px_1fr] gap-6"><div class="md:sticky md:top-24 self-start"><div class="font-display font-extrabold text-6xl red leading-none">${y}</div><p class="muted text-sm mt-1">Năm học ${2012+ +y}–${2013+ +y}</p></div>
      <div class="grid sm:grid-cols-2 gap-8">${items.map((m,i)=>`<a href="#${m.id}" class="polaroid relative block fade-in" style="transform:rotate(${rot(i)}deg)"><span class="tape"></span><div class="relative"><img src="${U(coverOf(m))}" alt="${esc(m.title)}" loading="lazy" onerror="${ERR}" class="w-full aspect-[4/3] object-cover"><span class="absolute bottom-2 left-2 bg-black/65 text-white text-[11px] font-semibold rounded-full px-2.5 py-1">${nPhoto(m.album)}</span>${m.video?`<span class="absolute bottom-2 right-2 bg-[var(--red)] text-white text-[11px] font-semibold rounded-full px-2.5 py-1">▶ ${esc(m.video.thoiLuong||"Video")}</span>`:''}</div>
        <p class="font-hand text-xl mt-2 red">${esc(m.date)}</p><h3 class="font-display font-bold text-lg leading-snug" style="color:var(--ink)">${esc(m.title)}</h3><p class="text-sm mt-1" style="color:var(--muted)">${esc(m.summary)}</p></a>`).join('')}</div></div>`}).join('');
  $('yearsBox').innerHTML=h||(q?'':'<p class="muted text-center py-12">Không có album nào khớp.</p>');

  const extra=[];
  if(q.length>=2){
    const people=lop.filter(p=>includesQuery(p.ten));
    if(people.length)extra.push(`<section class="space-y-3"><h3 class="font-display font-bold text-xl">Thành viên phù hợp</h3><div class="flex flex-wrap gap-2">${people.slice(0,12).map(p=>`<span class="chip">${esc(p.ten)}${p.vaiTro?` · ${esc(p.vaiTro)}`:''}</span>`).join('')}</div>${people.length>12?`<p class="muted text-sm">Còn ${people.length-12} kết quả phù hợp.</p>`:''}</section>`);

    const tripHits=chuyendi.filter(t=>includesQuery([t.ten,t.noi,t.ngay,t.mota].join(' ')));
    if(tripHits.length)extra.push(`<section class="space-y-3"><h3 class="font-display font-bold text-xl">Chuyến đi phù hợp</h3><div class="flex flex-wrap gap-2">${tripHits.map(t=>`<a class="chip" href="#${t.id}">${esc(t.ten)} →</a>`).join('')}</div></section>`);

    const dailyHits=YRS.filter(y=>{const info=dailyChuong[y]||{};return includesQuery(`Daily lớp ${y} năm học ${2012+ +y} ${2013+ +y} ${info.tieude||''} ${info.mota||''}`)});
    if(dailyHits.length)extra.push(`<section class="space-y-3"><h3 class="font-display font-bold text-xl">Nhật ký Daily</h3><div class="flex flex-wrap gap-2">${dailyHits.map(y=>`<a class="chip" href="#cuon-phim-${y}">Daily lớp ${y} →</a>`).join('')}</div></section>`);
  }
  if(q&&!h&&!extra.length)extra.push('<p class="muted text-center py-4">Không tìm thấy kỷ niệm phù hợp.</p>');
  $('searchResults').innerHTML=extra.join('');
}

/* ---------- Video của album (nếu có) ---------- */
const vDur=v=>{if(!v||!v.thoiLuong)return '';const p=v.thoiLuong.split(':').map(Number);return p.length===2?`${p[0]} phút ${p[1]} giây`:v.thoiLuong};
function vidErr(v){v.parentNode.innerHTML='<p style="padding:2rem;color:#fff;text-align:center">Chưa tìm thấy file video. Hãy bỏ file vào thư mục <b>video/</b> và ghi đúng tên trong data.js.</p>'}
/* Thay TOÀN BỘ hàm videoBlock cũ trong app.js (từ dòng "function videoBlock(v, m) {" đến dấu "}" kết thúc)
   bằng đoạn dưới đây. Giữ nguyên khung viền vàng của bạn. Dán link vào ô youtube / drive / src đều được. */
function vbYt(s){s=String(s||'').trim();var m=s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);return m?m[1]:(/^[A-Za-z0-9_-]{11}$/.test(s)?s:'')}
function vbDrive(s){s=String(s||'').trim();var m=s.match(/\/d\/([A-Za-z0-9_-]{15,})|[?&]id=([A-Za-z0-9_-]{15,})/);return m?(m[1]||m[2]):''}
function vbBadHost(u){if(!/^https?:\/\//i.test(u))return '';try{var h=new URL(u).hostname;return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(h)?'':h}catch(e){return u}}
function vbNote(t){return '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:2rem;color:#fff;text-align:center;line-height:1.6">'+t+'</div>'}
function vbYt(s){s=String(s||'').trim();var m=s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);return m?m[1]:(/^[A-Za-z0-9_-]{11}$/.test(s)?s:'')}
function vbDrive(s){s=String(s||'').trim();var m=s.match(/\/d\/([A-Za-z0-9_-]{15,})|[?&]id=([A-Za-z0-9_-]{15,})/);return m?(m[1]||m[2]):''}
function vbBadHost(u){if(!/^https?:\/\//i.test(u))return '';try{var h=new URL(u).hostname;return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(h)?'':h}catch(e){return u}}
function vbRatio(t){var m=String(t||'16/9').match(/^\s*(\d+(?:\.\d+)?)\s*[\/:x]\s*(\d+(?:\.\d+)?)\s*$/);return m&&+m[2]?(+m[1])/(+m[2]):16/9}
function vbDur(t){var p=String(t||'').split(':').map(Number);return p.length===2&&!isNaN(p[0])&&!isNaN(p[1])?p[0]+' phút '+p[1]+' giây':String(t||'')}
function vbNote(t){return '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:2rem;color:#fff;text-align:center;line-height:1.6">'+t+'</div>'}
/* Thay TOÀN BỘ hàm videoBlock cũ trong app.js (từ dòng "function videoBlock(v, m) {" đến dấu "}" kết thúc)
   bằng đoạn dưới đây. Giữ nguyên khung viền vàng của bạn. Dán link vào ô youtube / drive / src đều được.
   Có tiêu đề (tieude) + thời lượng (thoiLuong) phía trên video.
   Video quay dọc / 4:3 / vuông bị nhỏ trong khung? Thêm vào dòng video trong data.js:  tyLe:"9/16"  (hoặc "4/3", "1/1", mặc định "16/9"). */
function vbYt(s){s=String(s||'').trim();var m=s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);return m?m[1]:(/^[A-Za-z0-9_-]{11}$/.test(s)?s:'')}
function vbDrive(s){s=String(s||'').trim();var m=s.match(/\/d\/([A-Za-z0-9_-]{15,})|[?&]id=([A-Za-z0-9_-]{15,})/);return m?(m[1]||m[2]):''}
function vbBadHost(u){if(!/^https?:\/\//i.test(u))return '';try{var h=new URL(u).hostname;return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(h)?'':h}catch(e){return u}}
function vbRatio(t){var m=String(t||'16/9').match(/^\s*(\d+(?:\.\d+)?)\s*[\/:x]\s*(\d+(?:\.\d+)?)\s*$/);return m&&+m[2]?(+m[1])/(+m[2]):16/9}
function vbDur(t){var p=String(t||'').split(':').map(Number);return p.length===2&&!isNaN(p[0])&&!isNaN(p[1])?p[0]+' phút '+p[1]+' giây':String(t||'')}
function vbNote(t){return '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:2rem;color:#fff;text-align:center;line-height:1.6">'+t+'</div>'}
function videoBlock(v, m) {
  if (!v) return '';
  const link = String(v.youtube || v.drive || v.src || '').trim();
  let inner = '', open = '';
  if (/drive\.google\.com/i.test(link)) {
    // Google Drive: phải dùng dạng /preview mới nhúng được (link /view bị chặn)
    const id = vbDrive(link);
    inner = id
      ? `<iframe class="absolute top-0 left-0 w-full h-full" src="https://drive.google.com/file/d/${id}/preview" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
      : vbNote('Link Google Drive chưa đúng. Hãy dán link chia sẻ dạng drive.google.com/file/d/.../view');
    open = id ? `https://drive.google.com/file/d/${id}/view` : '';
  } else if (/youtu\.?be/i.test(link) || /^[A-Za-z0-9_-]{11}$/.test(link)) {
    const id = vbYt(link);
    inner = id
      ? `<iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/${id}?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
      : vbNote('Mã hoặc link YouTube chưa đúng. Hãy dán lại link video.');
    open = id ? `https://www.youtube.com/watch?v=${id}` : '';
  } else if (link) {
    // file video (mp4...) trên GitHub Pages hoặc chép cùng trang
    const bad = vbBadHost(link);
    inner = bad
      ? vbNote('Địa chỉ video bị dính liền hoặc gõ sai: "' + bad + '" không phải tên miền hợp lệ. Sau tên miền phải có dấu "/".')
      : `<video controls preload="metadata" playsinline class="absolute top-0 left-0 w-full h-full" src="${link}"></video>`;
    open = bad ? '' : link;
  } else {
    inner = vbNote('Chưa có link video. Hãy điền vào ô youtube, drive hoặc src trong data.js.');
  }
  const r = vbRatio(v.tyLe);
  const sizeStyle = 'aspect-ratio:' + r + (r < 1 ? ';max-width:min(100%,420px);margin:0 auto' : '');
  return `
    <div class="space-y-3">
      ${v.tieude ? `<h2 class="font-display font-extrabold text-2xl sm:text-3xl">▶ ${esc(v.tieude)}</h2>` : ''}
      ${v.thoiLuong ? `<p class="font-hand text-xl" style="color:var(--red)">Thời lượng ${vbDur(v.thoiLuong)}</p>` : ''}
      <div class="relative w-full rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-[#CD9B4D]" style="${sizeStyle}">
        ${inner}
      </div>
      ${open ? `<p class="text-sm" style="color:var(--muted)">Không xem được? <a class="underline font-semibold" style="color:var(--red)" href="${open}" target="_blank" rel="noopener">Mở video ở tab mới ↗</a></p>` : ''}
    </div>
  `;
}




/* ---------- Trang bài viết của album ---------- */
function post(id){
  const i=mem.findIndex(m=>m.id===id),m=mem[i],k=reg(m.album.map(lbi)),pr=(m.profiles||[]).filter(p=>p.ten&&p.ten.trim());
  $('app').innerHTML=`<div class="max-w-4xl mx-auto px-4 py-10 space-y-10 fade-in">${back}
    <div class="space-y-3"><p class="font-hand text-2xl red">Lớp ${m.year} · ${esc(m.date)} · ${esc(m.cat)}</p><h1 class="font-display font-extrabold text-4xl sm:text-5xl leading-tight">${esc(m.title)}</h1></div>
    <p class="font-display text-lg sm:text-xl leading-loose" style="max-width:62ch">${esc(m.story)}</p>
    ${m.video?videoBlock(m.video,m):''}
    ${pr.length?`<div class="space-y-5"><h2 class="font-display font-extrabold text-2xl sm:text-3xl">${esc(m.profilesTitle||'Gương mặt trong album')}</h2><div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">${pr.map((p,j)=>`<div class="card rounded-2xl overflow-hidden" style="transform:rotate(${rot(j)/2}deg)"><div class="relative"><img src="${avatar(p.ten,p.photo,400)}" alt="${esc(p.ten)}" loading="lazy" onerror="${ERR}" class="w-full aspect-[4/5] object-cover">${p.number?`<span class="absolute top-2 left-2 font-display font-extrabold text-2xl text-white" style="text-shadow:0 2px 8px rgba(0,0,0,.7)">${esc(p.number)}</span>`:''}</div><div class="p-3"><span class="text-xs font-semibold red">${esc(p.role)}</span><h3 class="font-display font-bold">${esc(p.ten)}</h3><p class="font-hand text-lg muted leading-tight">${esc(p.quote)}</p></div></div>`).join('')}</div></div>`:''}
    <div class="grid sm:grid-cols-2 gap-6 pt-2">${m.album.slice(0,4).map((x,j)=>`<button onclick="openLb(${j},${k})" class="polaroid relative cursor-zoom-in" style="transform:rotate(${rot(j+1)}deg)"><span class="tape"></span><img src="${U(x.id)}" alt="${esc(x.cap)}" loading="lazy" onerror="${ERR}" class="w-full aspect-[4/3] object-cover"></button>`).join('')}</div>
    <a href="#${m.id}/album" class="card rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4 hover:border-[var(--red)] transition"><span><b class="font-display text-xl sm:text-2xl block">Xem toàn bộ album</b><span class="muted text-sm">${nPhoto(m.album)} đang chờ bạn lật xem</span></span><span class="red font-semibold whitespace-nowrap">Mở album →</span></a>
    <div class="flex justify-between gap-3 pt-6" style="border-top:1px solid var(--line)">${mem[i-1]?`<a href="#${mem[i-1].id}" class="card px-5 py-3 rounded-2xl text-sm max-w-[48%]"><span class="muted text-xs">← Trước</span><br><b class="font-display">${esc(mem[i-1].title)}</b></a>`:'<span></span>'}${mem[i+1]?`<a href="#${mem[i+1].id}" class="card px-5 py-3 rounded-2xl text-sm text-right max-w-[48%]"><span class="muted text-xs">Sau →</span><br><b class="font-display">${esc(mem[i+1].title)}</b></a>`:''}</div></div>`;
}

/* ---------- Trang album (tường ảnh) ---------- */
let aF='all',aShow=24,curAlb=null;
function albumPage(id){
  curAlb=mem.find(m=>m.id===id);aF='all';aShow=24;
  $('app').innerHTML=`<div class="max-w-7xl mx-auto px-4 py-10 space-y-8"><a href="#${id}" class="chip inline-block">← Về bài viết</a>
    <div class="space-y-2"><p class="font-hand text-2xl red">Lớp ${curAlb.year} · ${esc(curAlb.date)}</p><h1 class="font-display font-extrabold text-3xl sm:text-5xl leading-tight">Album: ${esc(curAlb.title)}</h1><p class="muted text-sm">${nPhoto(curAlb.album)}</p></div>
    <div id="aChips" class="flex flex-wrap gap-2"></div><div id="aWall" class="${WALL}"></div><div id="aMore" class="text-center"></div></div>`;
  renderWall();
}
function setAF(k){aF=k;aShow=24;renderWall()}
function renderWall(){
  const m=curAlb,gs=[...new Set(m.album.map(x=>x.nhom).filter(Boolean))];
  $('aChips').innerHTML='';
  const items=m.album.filter(x=>aF==='all'||x.nhom===aF),k=reg(items.map(lbi));
  $('aWall').innerHTML=items.slice(0,aShow).map((x,i)=>pol(x,i,k)).join('');
  $('aMore').innerHTML=items.length>aShow?`<button class="chip px-8 py-3" onclick="aShow+=24;renderWall()">Xem thêm (còn ${items.length-aShow})</button>`:'';
}

/* ---------- Daily: mỗi năm một trang riêng, tường ảnh polaroid như các album ---------- */
let dMore={};
const DAYS_PAGE=48,YRS=['10','11','12'];
function dailyPage(y){YRS.includes(y)?dailyYear(y):dailyHub()}
function dailyHub(){
  const chs=YRS.map(y=>({y,l:frames.filter(f=>f.lop===y)})).filter(c=>c.l.length);
  $('app').innerHTML=`<div class="max-w-6xl mx-auto px-4 py-10 space-y-8 fade-in">${back}
    <div><p class="font-hand text-3xl red">nhật ký của cả lớp</p><h1 class="font-display font-extrabold text-5xl sm:text-7xl">Daily</h1><p class="muted mt-2 max-w-md">Mỗi năm học một khoảngthời gian đáng nhớ. Những ngày bình thường của các thành viên trong lớp.</p></div>
    <div class="grid md:grid-cols-3 gap-8 pt-2">${chs.map((c,i)=>{const info=dailyChuong[c.y]||{},cv=c.l[Math.floor(c.l.length/2)];
      return `<a href="#cuon-phim-${c.y}" class="polaroid relative block" style="transform:rotate(${rot(i)}deg)"><span class="tape"></span><img src="${U(dailyPoster[c.y]||info.bia||cv.id,700)}" alt="Daily lớp ${c.y}" loading="lazy" onerror="${ERR}" class="w-full aspect-[4/3] object-cover">
        <p class="font-hand text-xl mt-2 red">Năm học ${2012+ +c.y} – ${2013+ +c.y} · ${nPhoto(c.l)}</p><h2 class="font-display font-bold text-xl leading-snug" style="color:var(--ink)">Lớp ${c.y} · ${esc(info.tieude||'Daily')}</h2>${info.mota?`<p class="text-sm mt-1" style="color:var(--muted)">${esc(info.mota)}</p>`:''}</a>`}).join('')}</div></div>`;
}
function dailyYear(y){
  const l=frames.filter(f=>f.lop===y);if(!l.length)return dailyHub();
  const k=reg(l.map(lbi)),info=dailyChuong[y]||{},shown=l.slice(0,DAYS_PAGE+(dMore[y]||0)),g={};
  shown.forEach((f,i)=>{const key=f.d.getFullYear()*100+f.d.getMonth();(g[key]=g[key]||[]).push([f,i])});
  const nav=YRS.filter(x=>frames.some(f=>f.lop===x)),idx=nav.indexOf(y);
  $('app').innerHTML=`<div class="px-4 sm:px-8 lg:px-12 py-10 space-y-8 fade-in">
    <div class="flex flex-wrap items-center justify-between gap-3"><a href="#cuon-phim" class="chip inline-block">← Tất cả các năm</a><div class="flex gap-2">${nav.map(x=>`<a href="#cuon-phim-${x}" class="chip ${x===y?'on':''}">Lớp ${x}</a>`).join('')}</div></div>
    <div class="space-y-2"><p class="font-hand text-2xl red">Daily · năm học ${2012+ +y} – ${2013+ +y}</p><h1 class="font-display font-extrabold text-3xl sm:text-5xl leading-tight">Daily Lớp ${y}: ${esc(info.tieude||'Những ngày thường ngày')}</h1><p class="muted text-sm">${nPhoto(l)}${info.mota?' · '+esc(info.mota):''}</p></div>
    <div class="${WALL}">${shown.map((f,n)=>pol(f,n,k)).join('')}</div>
    ${l.length>shown.length?`<div class="text-center"><button class="chip px-8 py-3" onclick="dMore['${y}']=(dMore['${y}']||0)+${DAYS_PAGE};dailyYear('${y}')">Xem thêm (còn ${l.length-shown.length})</button></div>`:''}
    <div class="flex justify-between gap-3 pt-6" style="border-top:1px solid var(--line)">${idx>0?`<a href="#cuon-phim-${nav[idx-1]}" class="chip">← Daily lớp ${nav[idx-1]}</a>`:'<span></span>'}${idx<nav.length-1?`<a href="#cuon-phim-${nav[idx+1]}" class="chip">Daily lớp ${nav[idx+1]} →</a>`:''}</div></div>`;
}

/* ---------- Chuyến đi chơi ---------- */
function tripsPage(){
  $('app').innerHTML=`<div class="max-w-6xl mx-auto px-4 py-10 space-y-8 fade-in">${back}<div><p class="font-hand text-3xl red">mỗi chuyến đi là một trang riêng</p><h1 class="font-display font-extrabold text-5xl sm:text-7xl">Chuyến đi chơi</h1></div>
    <div class="grid md:grid-cols-2 gap-8">${chuyendi.map((t,i)=>`<a href="#${t.id}" class="ticket"><img src="${U(t.bia||t.album[0].id,500)}" alt="${esc(t.ten)}" loading="lazy" onerror="${ERR}" class="object-cover" style="width:38%"><div class="flex-1 p-5 space-y-2" style="border-left:2px dashed var(--line)"><p class="text-[11px] font-bold tracking-widest red">VÉ A6 · CHUYẾN SỐ ${pad(i+1)}</p><h2 class="font-display font-extrabold text-xl leading-snug">${esc(t.ten)}</h2><p class="text-sm muted">📍 ${esc(t.noi)}</p><p class="text-sm muted">🗓 ${esc(t.ngay)}${t.soNgay?` · ${t.soNgay} ngày`:''}</p><p class="font-hand text-xl red">${nPhoto(t.album)} →</p></div></a>`).join('')}</div></div>`;
}
function tripPage(id){
  const t=chuyendi.find(x=>x.id===id),k=reg(t.album.map(lbi)),g={};
  t.album.forEach((x,i)=>{const n=x.nhom||'Ảnh chuyến đi';(g[n]=g[n]||[]).push([x,i])});
  $('app').innerHTML=`<div class="max-w-6xl mx-auto px-4 py-10 space-y-10 fade-in"><a href="#chuyen-di" class="chip inline-block">← Các chuyến đi</a>
    <div class="grid md:grid-cols-2 gap-8 items-center"><div class="space-y-4"><p class="font-hand text-3xl red">✈ chuyến đi</p><h1 class="font-display font-extrabold text-4xl sm:text-6xl leading-tight">${esc(t.ten)}</h1>
      <div class="flex flex-wrap gap-2 text-sm"><span class="card rounded-full px-4 py-1.5">📍 ${esc(t.noi)}</span><span class="card rounded-full px-4 py-1.5">🗓 ${esc(t.ngay)}</span>${t.soNgay?`<span class="card rounded-full px-4 py-1.5">${t.soNgay} ngày</span>`:''}<span class="card rounded-full px-4 py-1.5">${nPhoto(t.album)}</span></div>
      <p class="font-display text-lg leading-loose">${esc(t.mota)}</p></div>
      <button onclick="openLb(0,${k})" class="polaroid relative cursor-zoom-in" style="transform:rotate(2deg)"><span class="tape"></span><img src="${U(t.bia||t.album[0].id,900)}" alt="${esc(t.ten)}" onerror="${ERR}" class="w-full aspect-[4/3] object-cover"></button></div>
    ${Object.keys(g).map(n=>`<section class="space-y-5"><div class="flex items-center gap-3"><span class="w-4 h-4 rounded-full" style="background:var(--red)"></span><h2 class="font-display font-extrabold text-2xl sm:text-3xl">${esc(n)}</h2><span class="font-hand text-xl muted">${nPhoto(g[n])}</span><span class="flex-1" style="border-top:2px dashed var(--line)"></span></div><div class="${WALL}">${g[n].map(([x,i])=>pol(x,i,k)).join('')}</div></section>`).join('')}</div>`;
}

/* ---------- Lưu bút ---------- */
const NC=['#FFE88A','#FFC9C0','#BFE3D0','#C9D8FF'];
const REACTION_OPTIONS=[['heart','❤️'],['laugh','😂'],['potato','🥔']];
function getSelectedReactions(){try{return JSON.parse(localStorage.getItem('a6-note-reactions')||'{}')}catch(e){return {}}}
function getReactionVisitorId(){
  const key='a6-reaction-visitor';
  try{
    let id=localStorage.getItem(key);
    if(!id){id=crypto.randomUUID();localStorage.setItem(key,id)}
    return id;
  }catch(e){return '';}
}
function reactionBar(note){
  const id=Number(note.id);
  if(!Number.isSafeInteger(id)||id<1)return '';
  const selected=getSelectedReactions()[id],counts=note.reactions||{};
  return `<div class="flex gap-2 mt-3" aria-label="Biểu cảm">${REACTION_OPTIONS.map(([key,emoji])=>`<button type="button" onclick="reactNote(${id},'${key}')" aria-pressed="${selected===key}" class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm transition ${selected===key?'border-[var(--red)] bg-white/70':'border-transparent hover:border-[var(--line)]'}"><span>${emoji}</span><span>${Number(counts[key])||0}</span></button>`).join('')}</div>`;
}
async function reactNote(noteId,reaction){
  const visitorId=getReactionVisitorId();
  if(!visitorId){alert('Không lưu được biểu cảm trên trình duyệt này.');return}
  const selected=getSelectedReactions(),key=String(noteId);
  const next=selected[key]===reaction?null:reaction;
  try{
    const res=await fetch('/api/guestbook',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'react',noteId,visitorId,reaction:next})
    });
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    if(next)selected[key]=next;else delete selected[key];
    localStorage.setItem('a6-note-reactions',JSON.stringify(selected));
    await renderNotes();
  }catch(error){
    console.error('Lỗi lưu biểu cảm:',error);
    alert('Chưa lưu được biểu cảm. Bạn thử lại nhé!');
  }
}
// Tải lời nhắn từ Cloudflare Database
async function renderNotes() {
  const notesEl = $('notes');

  try {
    const res = await fetch('/api/guestbook');

    if (!res.ok) {
      throw new Error(`Không tải được lời nhắn: HTTP ${res.status}`);
    }

    let dbNotes = await res.json();

    // Nếu database chưa có lời nhắn, dùng lời nhắn mẫu trong data.js
    if (!Array.isArray(dbNotes) || dbNotes.length === 0) {
      dbNotes = Array.isArray(loiNhan) ? loiNhan : [];
    }

    notesEl.innerHTML = dbNotes.map((note, i) => {
      // DB dùng name/message; data.js dùng n/m
      const author = note.name || note.n || 'Ẩn danh';
      const content = note.message || note.m || '';
      const bg = NC[i % NC.length];

      return `
        <div
          class="p-4 rounded-sm shadow-sm transition"
          style="background:${esc(bg)}; transform:rotate(-1.5deg); border:1px solid rgba(0,0,0,0.05);"
        >
          <p class="font-sans text-base text-gray-800 leading-relaxed mb-2">"${esc(content)}"</p>
          <p class="font-hand text-right text-lg font-bold text-gray-700">— ${esc(author)}</p>
          ${reactionBar(note)}
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Lỗi đồng bộ lưu bút:', error);

    // Nếu API gặp lỗi, vẫn hiện lời nhắn mẫu trong data.js
    const fallbackNotes = Array.isArray(loiNhan) ? loiNhan : [];
    notesEl.innerHTML = fallbackNotes.map((note, i) => {
      const author = note.name || note.n || 'Ẩn danh';
      const content = note.message || note.m || '';
      const bg = NC[i % NC.length];

      return `
        <div
          class="p-4 rounded-sm shadow-sm transition"
          style="background:${esc(bg)}; transform:rotate(-1.5deg); border:1px solid rgba(0,0,0,0.05);"
        >
          <p class="font-sans text-base text-gray-800 leading-relaxed mb-2">"${esc(content)}"</p>
          <p class="font-hand text-right text-lg font-bold text-gray-700">— ${esc(author)}</p>
          ${reactionBar(note)}
        </div>
      `;
    }).join('');
  }
}

// Gửi lời nhắn mới lên Cloudflare
async function addNote() {
  const nameInput = $('gbN');
  const messageInput = $('gbM');
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    if (!name) nameInput.focus();
    else messageInput.focus();
    return;
  }

  const randomColor = NC[Math.floor(Math.random() * NC.length)];

  try {
    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        message,
        color: randomColor
      })
    });

    if (!res.ok) {
      throw new Error(`Không lưu được lời nhắn: HTTP ${res.status}`);
    }

    nameInput.value = '';
    messageInput.value = '';

    // Cập nhật danh sách ngay sau khi lưu thành công
    await renderNotes();
  } catch (error) {
    console.error('Lỗi gửi lời nhắn:', error);
    alert('Không lưu được lời nhắn. Bạn thử lại nhé!');
  }
}

// Tải lời nhắn khi trang đã sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderNotes);
} else {
  renderNotes();
}

/* ---------- Hình nền của từng trang (chọn trong data.js: nen) ---------- */
function setBg(u){
  const b=$('bg');if(!b)return;
  if(u){b.style.backgroundImage=`url("${U(u,1800).replace(/"/g,'%22')}")`;b.style.setProperty('--cover',Math.round((typeof NEN_DO_PHU==='number'?NEN_DO_PHU:.82)*100)+'%');b.classList.add('on')}
  else b.classList.remove('on');
}

/* ---------- Sáng/tối + điều hướng ---------- */
function toggleTheme(){const d=document.documentElement.classList.toggle('dark');try{localStorage.setItem('a6-theme',d?'dark':'light')}catch(e){}$('themeBtn').textContent=d?'☀️':'🌙'}
let pend=null;
function goto(id){pend=id;if(location.hash&&location.hash!=='#')location.hash='';else route()}
function route(){
  lists=[];closeLb();
  const [p,sub]=location.hash.slice(1).split('/');
  let bg='';
  if(mem.some(m=>m.id===p)){bg=mem.find(m=>m.id===p).nen;sub==='album'?albumPage(p):post(p)}
  else if(chuyendi.some(t=>t.id===p)){bg=chuyendi.find(t=>t.id===p).nen;tripPage(p)}
  else if(p==='chuyen-di')tripsPage();
  else if(p&&p.startsWith('cuon-phim')){const y=p.split('-')[2];bg=(dailyChuong[y]||{}).nen;dailyPage(y)}
  else{bg=typeof NEN_TRANG_CHU!=='undefined'?NEN_TRANG_CHU:'';home()}
  setBg(bg);
  if(pend){const e=$(pend);pend=null;e&&setTimeout(()=>e.scrollIntoView({behavior:'smooth'}),40)}else scrollTo(0,0);
}
try{if(localStorage.getItem('a6-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}
$('themeBtn').textContent=document.documentElement.classList.contains('dark')?'☀️':'🌙';
addEventListener('hashchange',route);route();
