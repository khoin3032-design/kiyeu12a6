export async function onRequestGet({request,env}){
 const id=new URL(request.url).searchParams.get("id");
 if(!/^[0-9a-f-]{36}$/i.test(id||""))return new Response("Không tìm thấy ảnh.",{status:404});
 if(!env.DB)return new Response("D1 chưa được cấu hình.",{status:500});
 try{
  const row=await env.DB.prepare("SELECT data,content_type FROM uploaded_images WHERE id=?").bind(id).first();
  if(!row)return new Response("Không tìm thấy ảnh.",{status:404});
  return new Response(row.data,{headers:{"Content-Type":row.content_type,"Cache-Control":"public, max-age=31536000, immutable","X-Content-Type-Options":"nosniff"}});
 }catch(error){console.error("Image read:",error);return new Response("Không tải được ảnh.",{status:500})}
}
