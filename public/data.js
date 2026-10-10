/* =====================================================================
   DỮ LIỆU TRANG KỶ YẾU 12A6 (v4)  —  CHỈ CẦN SỬA FILE NÀY
   • Ảnh của bạn: bỏ vào thư mục anh/ rồi ghi đường dẫn, vd "anh/bong-da-01.jpg".
   • Ảnh mẫu dùng mã Unsplash. Dòng có "...mau(...)" / "...mauDaily(...)" là DỮ LIỆU MẪU,
     xóa đi khi đã có ảnh thật.
   ===================================================================== */

/* --- Phần hỗ trợ (đừng sửa) --- */
const POOL=["1529156069898-49953e39b3ac","1523240795612-9a054b0db644","1523580494863-6f3031224c94","1514525253161-7a46d19cd819","1465847899084-d164df4dedc6","1511632765486-a01980e01a18","1574629810360-7efbbe195018","1508098682722-e99c43a406b2"];
function mau(count,n,start=2,nhom){return Array.from({length:count},(_,j)=>{const f=POOL[((j+start)*3+n)%POOL.length];return nhom?{file:f,nhom}:f})}
function mauDaily(n){
  const tp={"Giờ ra chơi":["Hành lang tầng 3","Tụ tập trước cửa lớp","Chuyện trên trời dưới biển"],"Căng tin":["Bàn quen món quen","Xếp hàng giờ nghỉ trưa","Chia nhau ly trà đá"],"Tiết học":["Tiết cuối buồn ngủ","Giờ kiểm tra căng thẳng","Cô giảng bài say sưa"],"Văn nghệ":["Tập hát sai nhịp","Hậu trường đêm diễn","Chọn trang phục"],"Sân trường":["Chụp ảnh dưới gốc phượng","Đá vài hiệp sau giờ học","Chiều lộng gió"],"Trực nhật":["Quét lớp xong chụp ảnh","Lau bảng cho cô","Xếp lại bàn ghế"]};
  const ns=Object.keys(tp);
  return Array.from({length:n},(_,i)=>{const dt=new Date(2022,8,5+Math.round(i*1000/(n-1))),p=x=>String(x).padStart(2,'0'),chude=ns[(i*5)%6];
    return {file:POOL[(i*3)%POOL.length],ngay:`${dt.getFullYear()}-${p(dt.getMonth()+1)}-${p(dt.getDate())}`,chude,chuthich:tp[chude][i%3]}});
}

/* =====================================================================
   1) DANH SÁCH LỚP — mỗi dòng:  Họ tên | Ngày sinh | Trường ĐH | Đặc điểm
   Có thể copy thẳng các dòng từ Google Sheet dán vào (cột cách nhau bằng Tab hoặc dấu |).
   ⚠ Mục này CHỈ dành cho Potato (câu trả lời khi hỏi về từng bạn). Phần giới thiệu đội bóng trên trang web nằm ở mục 2.
   Potato (chat) đọc từ đây để trả lời về từng bạn (trang web không hiện danh sách này).
   ===================================================================== */
const BANG_LOP=`
Lê Phương Anh | 23/08/2007 | |
Nguyễn Minh Cường | 04/12/2007 | Bách Khoa | tổ trưởng, tính cách thân thiện, sống tình cảm
Lê Phương Khánh Hà | 30/09/2007 | Học viện Hành chính Quốc gia | hay ngủ, trốn học, đánh bóng chuyền giỏi
Hà Ngọc An | 18/03/2007 | | thầy An, thân thiện
Nguyễn Hà Tuyết Nhi | 16/01/2007 | |
Hà Thị Thanh Thảo | 15/07/2007 | Đại học Tài nguyên và Môi trường | chữ đẹp, là thư ký của lớp
Nguyễn Thị Thu | 15/11/2007 | | vẽ đẹp, hơi lowkey
Bạch Bảo Trâm | 18/12/2007 | |
Đỗ Trung Dũng | 05/11/2007 | Đại học Phenikaa | cao ráo đẹp trai, tốt bụng
Đỗ Đăng Dương | 15/11/2007 | Đại học Công nghiệp | đầu có điện, học giỏi, chăm học nhất lớp
Nguyễn Thành Đạt | 13/09/2007 | |
Nguyễn Thành Đạt | 16/08/2007 | Học viện Chính sách và Phát triển | biệt danh Mãi Đạt, đẹp trai, hát hay, học giỏi nhưng lười
Kiều Quang Đẳng | 08/12/2007 | Đại học Xây dựng Hà Nội | học giỏi, trầm tính
Lê Minh Đức | 23/01/2007 | Đại học FPT | hay đi học muộn, tốt bụng
Phùng Minh Đức | 28/10/2007 | Đại học Phenikaa | đẹp trai, nhà giàu, học giỏi nhưng không chịu học
Nguyễn Minh Hiền | 10/06/2007 | Đại học Khoa học Xã hội và Nhân văn ĐHQGHN | giỏi tiếng Anh nhất lớp
Phạm Huy Hiểu | 26/12/2007 | Đại học Công nghệ Giao thông Vận tải |
Hoàng Hoài Lâm | 27/10/2007 | Đại học Kinh tế | sống tình cảm, deskmate của Khôi
Đỗ Khánh Linh | 12/11/2007 | Đại học Kinh tế Quốc dân | xinh gái, hay đi học muộn, chung thủy
Hà Khánh Ly | 24/06/2007 | Học viện Chính sách và Phát triển | chữ đẹp, bạn thân của Thảo
Trịnh Khánh Ly | 14/07/2007 | Học viện Hành chính Quốc gia | năm lớp 10 lowkey, mấy năm sau lộ bản chất
Tạ Xuân Mai | 10/04/2007 | Đại học Sư phạm Hà Nội | nhỏ nhắn cute, sống rất tình cảm
Đặng Phương Nam | 21/02/2007 | Báo chí và Tuyên truyền | lớp trưởng hay ăn chặn nhưng được việc, học với Khôi 12 năm
Nguyễn Hồng Nga | 14/11/2007 | |
Hạ Yên Nhi | 22/08/2007 | |
Nguyễn Ánh Phương | 18/12/2007 |Keimyung University| bạn thân Kiều Thoa, IQ cao học giỏi nhưng hơi láo, cãi thầy cô
Phan Quốc Thái | 29/09/2007 | Đại học Mỏ - Địa chất | sống tình cảm, đá bóng hay
Phương Đăng Thiện | 21/03/2007 | Đại học Kinh tế |
Nguyễn Kiều Thoa | 28/08/2007 | Đại học Thương mại | xinh nhất lớp, học giỏi, ngoan ngoãn
Đỗ Nhật Trường | 11/06/2006 | Đại học Kiến Trúc | đá bóng hay, đẹp trai
Ngô Hoàng Anh | 03/02/2007 | Bưu Chính Viễn Thông | đẹp trai, hát hay, sống tình cảm
Nguyễn Anh Khôi | 25/02/2007 | Đại học FPT | đẹp trai, đá bóng hay, hòa đồng tốt bụng, không có gì để bàn cãi
Khuất Huyền Linh | 13/04/2007 | Đại học Mở | ngây thơ kiểu đáng yêu
Phùng Đức Mạnh | 27/04/2007 | Đại học Phenikaa | lớp chơi bóng chuyền, bóng đá thua tại mày hết
Đào Phương Nam | 26/11/2007 | Đại học Thủy lợi | hậu vệ cánh hay nhất lịch sử A6, đẹp trai, tốt bụng
Phan Xuân Nam | 25/01/2007 | Giao thông vận tải | lowkey
Bùi Tuấn Nghĩa | 26/06/2007 | Đại học Thương mại | phật sống hay giảng đạo lý
Quách Thiện Nhân | 22/12/2007 | Kỹ thuật Mật mã | đẹp trai, tính nghịch, hay nghịch ngu, học giỏi
Nguyễn Mạnh Quỳnh | 31/08/2007 | Đại học Công nghiệp | học giỏi, đẹp trai và da đen
Nguyễn Bảo Diệp | 07/09/2007 | | cao ráo xinh
Võ Đức Duy | 24/07/2007 | Đại học Hà Nội | hậu vệ của đội, sống tình cảm, biết tiếng Trung
Sử Lam Giang | 29/12/2007 | Đại học Xây dựng Hà Nội | lowkey, bạn thân của Xuân Mai
Nguyễn Chí Trung | 19/09/2007 | Học viện Chính sách và Phát triển | đánh võ hay, sống hòa đồng thân thiện
Đỗ Anh Tú | 13/11/2007 | Đại học FPT | lowkey
Giang Tuấn Tú | 30/05/2007 | Giao Thông Vận Tải |
Lê Linh Hoàng Yến | 22/04/2007 | Học viện Âm nhạc Quốc gia | bắt t 11h vẫn tập múa, ngày xưa hát không ngủ được giờ hát ru con ngủ được rồi
`;
const lop=BANG_LOP.trim().split('\n').map(l=>{const [ten,sinh,truong,diem]=l.split(/\t|\|/).map(s=>(s||'').trim());return {ten,sinh,truong,diem,vaiTro:''}});
const VAI_TRO={"Đặng Phương Nam":"Lớp trưởng","Nguyễn Minh Cường":"Tổ trưởng","Hà Thị Thanh Thảo":"Thư ký"};
lop.forEach(p=>p.vaiTro=VAI_TRO[p.ten]||'');
/* Quan hệ giữa các bạn (Potato dùng để "nối" thông tin): [bạn A, bạn B, kiểu quan hệ] */
const QUAN_HE=[
 ["Hà Khánh Ly","Hà Thị Thanh Thảo","bạn thân"],
 ["Nguyễn Ánh Phương","Nguyễn Kiều Thoa","bạn thân"],
 ["Sử Lam Giang","Tạ Xuân Mai","bạn thân"],
 ["Đặng Phương Nam","Nguyễn Anh Khôi","bạn học cùng nhau 12 năm"],
];
const POTATO_LA="Nguyễn Anh Khôi";   // Potato nhập vai bạn này
const HIEN_NGAY_SINH=true;            // false = Potato không tiết lộ ngày sinh (nên tắt nếu đưa trang lên mạng công khai)

/* =====================================================================
   2) GIỚI THIỆU ĐỘI BÓNG ĐÁ — BẠN TỰ VIẾT (hiện trên trang album bóng đá)
   ---------------------------------------------------------------------
   • Đây là các ô TRỐNG: điền nội dung của bạn vào. Ô nào để trống tên ("ten") sẽ không hiện;
     nếu không điền ô nào thì cả khối "đội hình" ẩn đi.
   • Không liên quan gì đến mục 1 (dữ liệu của Potato) — hai bên độc lập hoàn toàn.
   Mỗi bạn:  ten (họ tên) · number (số áo) · role (vị trí) · quote (lời giới thiệu bạn tự viết) · photo (ảnh, vd "anh/khoi.jpg")
   ===================================================================== */
const doiHinhTieuDe="Đội hình bóng đá nam A6";
const doiHinh=[
 {ten:"Anh Khôi", number:"09", role:"Tiền đạo", quote:"Linh hồn đội bóng", photo:"anh12a6/cauthu/cauthu (3).jpg"},
 {ten:"Nhật Trường", number:"05", role:"Tiền vệ", quote:"Mọi người vì một người", photo:"anh12a6/cauthu/cauthu (4).jpg"},
 {ten:"Đức Duy", number:"17", role:"Hậu vệ", quote:"Bức tường cuối cùng của đội", photo:"anh12a6/cauthu/cauthu (5).jpg"},
 {ten:"Đào Nam", number:"04", role:"Hậu vệ", quote:"Hậu vệ cánh hay nhất lịch sử A6", photo:"anh12a6/cauthu/cauthu (1).jpg"},
 {ten:"Đức Mạnh", number:"27", role:"Thủ môn", quote:"Ae thua chửi thằng này thôi nhé", photo:"anh12a6/cauthu/cauthu (2).jpg"},
 {ten:"Phan Thái", number:"07", role:"Tiền đạo", quote:"Vinícius Júnior", photo:"anh12a6/10/doibong/doibong10 (7).JPEG"},
 {ten:"Chí Trung", number:"08", role:"Hậu vệ", quote:"Hay không bằng hên", photo:"anh12a6/cauthu/cauthu (6).jpg"}
];

/* =====================================================================
   3) ALBUM THEO NĂM  (Lớp 10: bóng đá + văn nghệ · Lớp 11: bóng đá + bóng chuyền · Lớp 12: hội trại + kỷ yếu)
   photos: ảnh thường "anh/a.jpg" hoặc ảnh có nhóm {file:"anh/a.jpg", nhom:"Ảnh chung", cap:"Chú thích"}
   profiles: (tuỳ chọn) danh sách bạn hiện trên trang bài viết · profilesTitle: tiêu đề khối đó
   video: (tuỳ chọn) {tieude, thoiLuong:"7:14", src:"video/ten-file.mp4"}  hoặc dùng YouTube: youtube:"mã-video" (phần sau v= trong link)
          poster: ảnh bìa video ("" = dùng ảnh đầu tiên của album). File video bỏ vào thư mục video/
   ===================================================================== */
const mem=[
 {id:"mem-bongda10", year:"10", cat:"Bóng đá & hội thao", title:"Giải Bóng Đá Nam Lớp 10", date:"Tháng 12 / 2022",
  summary:"Những bước chạy đầu tiên trên sân cỏ nhà trường của các tuyển thủ A6.",
  story:"Năm đội đông đủ nhất và nhiệt nhất. Trận nào đi đá đối cũng có các chị em đi xem. Từ sân sắn chuối, nhà máy đường rồi cả thanh mỹ đúng tuổi trẻ đá sung thật. Đợt đấy ae đá với Tin liên tục xong có hôm thắng nhìn đứa nào cũng vui...",
  profilesTitle:doiHinhTieuDe, profiles:doiHinh,
  photos:["anh12a6/10/doibong/doibong10 (8).JPG","anh12a6/10/doibong/doibong10 (2).PNG","anh12a6/10/doibong/doibong10 (1).JPEG","anh12a6/10/doibong/doibong10 (3).JPEG",
   "anh12a6/10/doibong/doibong10 (4).JPEG","anh12a6/10/doibong/doibong10 (5).JPEG",
   "anh12a6/10/doibong/doibong10 (6).JPEG","anh12a6/10/doibong/doibong10 (7).JPEG","anh12a6/10/doibong/doibong10 (9).PNG","anh12a6/10/doibong/doibong10 (10).JPEG",
   "anh12a6/10/doibong/doibong (11).jpg","anh12a6/10/doibong/doibong (12).jpg"]},
 {id:"mem-vannghe", year:"10", cat:"Văn nghệ", title:"Hội Diễn Văn Nghệ Chào Khóa Mới", date:"Tháng 11 / 2022",
  summary:"Tiết mục hát múa lần đầu tiên A6 trình diễn trước toàn trường.",
  story:"Gửi vào đây...vào đây..., những buổi tập muộn sau giờ học, có những hôm bị Yến chico cho tập đến 11h đêm. Vẫn nhớ cái không khí lạnh lạnh rồi bị bắt đi tập múa, nghĩ lại thấy nhớ các bạn.",
  photos:["anh12a6/vannghe/vannghe (3).jpg","anh12a6/vannghe/vannghe (2).jpg","anh12a6/vannghe/vannghe (4).jpg","anh12a6/vannghe/vannghe (5).JPG"

  ]},
 {id:"mem-bongda11", year:"11", cat:"Bóng đá & thể thao", title:"Giải Bóng Đá Nam Khối 11", date:"Tháng 12 / 2023",
  summary:"Hành trình của các chiến binh A6 và cả tập thể đứng sau cổ vũ.",
  story:"Năm mà ae gần chức vô địch nhất còn 2 phút mà anh em thiếu tập trung quá. Trung kết gặp hóa là ae mút rồi...tiếc ghê.",
  profilesTitle:doiHinhTieuDe, profiles:doiHinh,
  photos:["anh12a6/11/doibong/dabong11 (7).jpg","anh12a6/11/doibong/dabong11 (6).JPEG","anh12a6/11/doibong/dabong11 (4).JPEG","anh12a6/11/doibong/dabong11 (1).JPEG","anh12a6/11/doibong/dabong11 (5).JPEG","anh12a6/11/doibong/dabong11 (11).jpg",
   "anh12a6/11/doibong/dabong11 (2).JPEG","anh12a6/11/doibong/dabong11 (3).JPEG","anh12a6/11/doibong/dabong11 (10).jpg","anh12a6/11/doibong/dabong11 (9).jpg","anh12a6/11/doibong/dabong11 (8).jpg"

  ]},
 {id:"mem-bongchuyen", year:"11", cat:"Bóng chuyền & thể thao", title:"Giải Bóng Chuyền Khối 11", date:"Tháng 12 / 2023",
  summary:"Những pha cứu bóng, đập bóng nghẹt thở và tiếng cổ vũ vang cả nhà đa năng.",
  story:" Những bông hồng của lớp đánh bóng mà hài, ra sân đánh chửi nhau suốt. Xem đánh giải mà tiếc ai cũng cố gắng cố cơ hội thắng mà không giữ được .",
  photos:["anh12a6/11/bongchuyen/bongchuyen.jpg"]},
 {id:"mem-hoitrai", year:"12", cat:"Hội trại", title:"Hội Trại 12A6", date:"Tháng 03 / 2025",
  summary:"Dựng trại, trang trí gian hàng và cùng nhau tỏa sáng trong ngày hội trại cuối cấp.",
  story:"Lớp nào cũng đi tìm tre tự dựng trại, làm đồ thủ công các thứ. Lớp mình lấy mẹ khung sắt về làm chất thật. Nhưng cũng là kỉ niệm đáng nhớ năm lớp 12. ",
   photos:["anh12a6/hoitrai/hoitrai(1).JPG","anh12a6/hoitrai/hoitrai(54).JPG","anh12a6/hoitrai/hoitrai (53).JPG","anh12a6/hoitrai/hoitrai (7).JPG","anh12a6/hoitrai/hoitrai (2).JPG","anh12a6/hoitrai/hoitrai (3).JPG","anh12a6/hoitrai/hoitrai (4).JPG",
      "anh12a6/hoitrai/hoitrai (5).JPG","anh12a6/hoitrai/hoitrai (6).JPG","anh12a6/hoitrai/hoitrai (8).JPG","anh12a6/hoitrai/hoitrai (9).JPG","anh12a6/hoitrai/hoitrai (11).JPG","anh12a6/hoitrai/hoitrai (13).JPG",
      "anh12a6/hoitrai/hoitrai (14).JPG","anh12a6/hoitrai/hoitrai (15).JPG","anh12a6/hoitrai/hoitrai (16).JPG","anh12a6/hoitrai/hoitrai (17).JPG","anh12a6/hoitrai/hoitrai (19).JPG",
      ,"anh12a6/hoitrai/hoitrai (20).JPG","anh12a6/hoitrai/hoitrai (21).JPG","anh12a6/hoitrai/hoitrai (23).JPG","anh12a6/hoitrai/hoitrai (51).JPG","anh12a6/hoitrai/hoitrai (47).JPG",
      "anh12a6/hoitrai/hoitrai (46).JPG","anh12a6/hoitrai/hoitrai (44).JPG"
]},
 {id:"mem-kyyeu", year:"12", cat:"Kỷ yếu", title:"Ảnh Kỷ Yếu 12A6", date:"Tháng 05 / 2025",
  summary:"Buổi chụp kỷ yếu dưới gốc phượng và ngày chia tay mái trường.",
  story:"Hôm ấy, ai cũng đẹp. Cả lớp còn nghỉ cả buổi sáng để chuẩn bị cơ mà ... Nghĩ lại, mình thấy vui vì đã có dịp chụp chung với nhiều bạn. Ba năm cấp 3, hôm đấy mới có tấm chụp riêng với mỗi bạn. Mỗi người đều để lại trong mình một câu chuyện và những tháng ngày thật đáng nhớ. Lên đại học rồi mới hiểu vì sao người ta thường nói: những năm cấp ba là quãng thời gian đẹp nhất khi ta còn vô tư, háo hức với mọi trải nghiệm",
  video:{tieude:"Video kỷ yếu 12A6 (Các bạn xem hết nhé, hay lắm...)", src:"1CY6LGGk3q_UBzm96Wfa92I0cm-K3lb1F", youtube:"", poster:"anh12a6/kiyeu/kiyeu (14).jpg"},
  photos:["anh12a6/kiyeu/kiyeu (2).jpg","anh12a6/kiyeu/kiyeu (3).jpg","anh12a6/kiyeu/kiyeu (4).jpg","anh12a6/kiyeu/kiyeu (5).jpg","anh12a6/kiyeu/kiyeu (6).jpg","anh12a6/kiyeu/kiyeu (7).jpg",
   "anh12a6/kiyeu/kiyeu (8).jpg","anh12a6/kiyeu/kiyeu (9).jpg","anh12a6/kiyeu/kiyeu (10).jpg","anh12a6/kiyeu/kiyeu (11).jpg","anh12a6/kiyeu/kiyeu (12).jpg","anh12a6/kiyeu/kiyeu (13).jpeg","anh12a6/kiyeu/kiyeu (14).jpg"

  ]},
];
const chuyendi=[
 {id:"trip-1", ten:"Bản Làng Thái Hải – Thái Nguyên", noi:"Thái Nguyên", ngay:"Tháng 03 / 2023", 
  mota:"Chuyến đi chơi chung đầu tiên của cá lớp. ",
  photos:["anh12a6/trip/trip  (1).jpeg","anh12a6/trip/trip  (4).JPEG","anh12a6/trip/trip (10).jpg"]},
 {id:"trip-2", ten:"Sun World Ha Long", noi:"Quảng Ninh", ngay:"Tháng 03 / 2024", 
  mota:"Chuyến đi ấy khép lại ba năm học . Mọi người có lẽ đã chơi thật vui, còn mình thì  “ngất” sau Phi Long Thần Tốc. Vậy mà khi trở về ngồi trên xe, nghĩ rằng đây là chuyến đi cuối cùng cùng nhau, quãng thời gian học sinh đáng nhớ sắp kết thúc cảm giác khó tả lắm.",
  photos:["anh12a6/trip/trip  (5).JPG","anh12a6/trip/trip  (3).JPEG","anh12a6/trip/trip  (2).JPEG","anh12a6/trip/trip (6).jpg",
    "anh12a6/trip/trip (11).jpg","anh12a6/trip/trip (9).jpg","anh12a6/trip/trip (8).jpg","anh12a6/trip/trip (7).jpg"

  ]}
];

/* =====================================================================
   5) DAILY — khoảnh khắc thường ngày (tự chia theo Lớp 10/11/12 dựa vào ngày chụp)
   Ảnh: {file:"anh/xxx.jpg", ngay:"2023-11-14", chude:"Căng tin", chuthich:"..."}   (ngày dạng NĂM-THÁNG-NGÀY)
   ===================================================================== */
const dailyData=[
  {year:"10", poster:"anh12a6/10/daily/daily10 (27).JPG", photos:[
    "anh12a6/10/daily/daily10 (2).JPEG","anh12a6/10/daily/daily10 (2).jpg","anh12a6/10/daily/daily10 (3).JPEG","anh12a6/10/daily/daily10 (3).jpg","anh12a6/10/daily/daily10 (4).JPEG"
    ,"anh12a6/10/daily/daily10 (4).jpg","anh12a6/10/daily/daily10 (7).jpg","anh12a6/10/daily/daily10 (8).jpg","anh12a6/10/daily/daily10 (9).jpg","anh12a6/10/daily/daily10 (10).jpg","anh12a6/10/daily/daily10 (47).jpg"
    ,"anh12a6/10/daily/daily10 (48).jpg","anh12a6/10/daily/daily10 (10).jpg","anh12a6/10/daily/daily10 (11).JPG","anh12a6/10/daily/daily10 (13).JPG","anh12a6/10/daily/daily10 (14).JPG","anh12a6/10/daily/daily10 (15).JPG",
    "anh12a6/10/daily/daily10 (16).JPG","anh12a6/10/daily/daily10 (17).JPG","anh12a6/10/daily/daily10 (19).JPG","anh12a6/10/daily/daily10 (20).JPG","anh12a6/10/daily/daily10 (30).JPG",
    "anh12a6/10/daily/daily10 (31).JPG","anh12a6/10/daily/daily10 (32).JPG","anh12a6/10/daily/daily10 (33).JPG","anh12a6/10/daily/daily10 (45).JPG",
    "anh12a6/10/daily/daily10 (46).JPG","anh12a6/10/daily/daily10 (47).jpg","anh12a6/10/daily/daily10 (48).jpg"
  ]},
  {year:"11", poster:"anh12a6/11/daily/daily11 (18).JPG", photos:[
    "anh12a6/11/daily/daily11 (1).JPG","anh12a6/11/daily/daily11 (2).JPG","anh12a6/11/daily/daily11 (3).JPG","anh12a6/11/daily/daily11 (4).JPG","anh12a6/11/daily/daily11 (5).JPG","anh12a6/11/daily/daily11 (6).JPG","anh12a6/11/daily/daily11 (7).JPG",
    "anh12a6/11/daily/daily11 (8).JPG","anh12a6/11/daily/daily11 (9).JPG","anh12a6/11/daily/daily11 (11).JPG",,"anh12a6/11/daily/daily11 (12).JPG","anh12a6/11/daily/daily (19).jpg","anh12a6/11/daily/daily (20).jpg"
    ]},
  {year:"12", poster:"anh12a6/12/daily/daily12 (11).jpg", photos:[
    "anh12a6/12/daily/daily12 (1).JPEG","anh12a6/12/daily/daily12 (2).jpg","anh12a6/12/daily/daily12 (3).jpg","anh12a6/12/daily/daily12 (4).jpg"
    ,"anh12a6/12/daily/daily12 (5).jpg","anh12a6/12/daily/daily12 (6).jpg","anh12a6/12/daily/daily12 (7).jpg","anh12a6/12/daily/daily12 (8).jpg","anh12a6/12/daily/daily12 (9).jpg",
    "anh12a6/12/daily/daily12 (10).jpg","anh12a6/12/daily/daily12 (13).JPG","anh12a6/12/daily/daily12 (14).JPEG","anh12a6/12/daily/daily12 (15).JPG","anh12a6/12/daily/daily12 (16).JPG",
    "anh12a6/12/daily/daily (22).jpg","anh12a6/12/daily/daily (20).jpg","anh12a6/12/daily/daily (21).jpg",
    "anh12a6/12/daily/daily (23).jpg",
 ]},
];
// Poster mỗi năm. Nếu bỏ trống thì tự lấy ảnh đầu tiên của năm đó
const dailyPoster=Object.fromEntries(
  dailyData.map(d=>[d.year, d.poster||d.photos[0]])
);

// Tự chuyển sang định dạng cũ để phần hiển thị phía dưới không phải sửa
const DEF_NGAY={'10':'2022-09-05','11':'2023-09-05','12':'2024-09-05'};
const daily=dailyData.flatMap(d=>d.photos.map(f=>({
  file:f, ngay:DEF_NGAY[d.year], chude:"", chuthich:""
})));
const dailyChuong={
 "10":{tieude:"Những ngày đầu bỡ ngỡ", mota:"Lần đầu khoác áo trắng Chuyên Sơn Tây, từ xa lạ thành một tập thể."},
 "11":{tieude:"Mùa của nhiệt huyết", mota:"Sân bóng, nhà thi đấu và những buổi chiều không muốn về."},
 "12":{tieude:"Mùa cuối cùng", mota:"Mỗi ngày bình thường bỗng trở nên đáng giữ lại."}
};

/* =====================================================================
   6) LƯU BÚT MẪU · 7) KIẾN THỨC THÊM CHO POTATO
   potatoKienThuc: {hoi:[từ khóa...], tra:"câu trả lời"} · potatoGhiChu: ghi chú tự do (chỉ chế độ AI đọc)
   ===================================================================== */
const loiNhan=[
 {n:"Anh Khôi", m:"bóc tem"},
];
const potatoKienThuc=[
 {hoi:["cô chủ nhiệm","gvcn"], tra:"Hoàng Khánh Giang."}
];
const potatoGhiChu=[
 // "Câu thần chú của lớp trước mỗi kỳ thi: 'A6 không bỏ cuộc'.",
];
