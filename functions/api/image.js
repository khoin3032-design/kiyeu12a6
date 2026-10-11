export async function onRequestGet({request,env}){
 const id=new URL(request.url).searchParams.get("id");
 if(!/^[0-9a-f-]{36}$/i.test(id||""))return new Response("Không tìm thấy ảnh.",{status:404});

 try{
  if(env.IMAGES){
   const object=await env.IMAGES.get("images/"+id);
   if(object){
    const headers={
     "Content-Type":object.httpMetadata?.contentType||"application/octet-stream",
     "Cache-Control":"public, max-age=31536000, immutable",
     "X-Content-Type-Options":"nosniff"
    };
    if(Number.isFinite(object.size))headers["Content-Length"]=String(object.size);
    return new Response(object.body,{headers});
   }
  }

  // Tương thích ảnh cũ đã lưu trong D1 trước khi chuyển sang R2.
  if(!env.DB)return new Response("Không tìm thấy ảnh.",{status:404});
  const row=await env.DB.prepare("SELECT data,content_type FROM uploaded_images WHERE id=?").bind(id).first();
  if(!row)return new Response("Không tìm thấy ảnh.",{status:404});
  return new Response(row.data,{headers:{
   "Content-Type":row.content_type||"application/octet-stream",
   "Cache-Control":"public, max-age=31536000, immutable",
   "X-Content-Type-Options":"nosniff"
  }});
 }catch(error){
  console.error("Image read:",error);
  return new Response("Không tải được ảnh.",{status:500});
 }
}