function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return json({ error: 'Chỉ hỗ trợ POST' }, 405);
  }

  if (!env.AI) {
    return json({ error: 'Cloudflare Workers AI chưa được bật' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Dữ liệu gửi lên không hợp lệ' }, 400);
  }

  const { system, messages } = body || {};

  if (
    typeof system !== 'string' ||
    !Array.isArray(messages) ||
    messages.length < 1 ||
    messages.length > 12 ||
    messages.some(message =>
      !message ||
      !['user', 'assistant'].includes(message.role) ||
      typeof message.content !== 'string' ||
      message.content.length > 3000
    )
  ) {
    return json({ error: 'Dữ liệu gửi lên không hợp lệ' }, 400);
  }

  try {
    const result = await env.AI.run(
      '@cf/meta/llama-3.1-8b-instruct-fp8',
      {
        messages: [
          { role: 'system', content: system },
          ...messages
        ],
        max_tokens: 600
      }
    );

    const text = result?.response?.trim();

    if (!text) {
      return json({ error: 'AI không trả về nội dung' }, 502);
    }

    return json({ text });
  } catch {
    return json({ error: 'Cloudflare AI chưa xử lý được yêu cầu' }, 502);
  }
}