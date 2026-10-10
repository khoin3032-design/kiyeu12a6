const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

const COLORS = new Set(["#FFE88A", "#FFC9C0", "#BFE3D0", "#C9D8FF"]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS
  });
}

async function ensureGuestbookTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#FFE88A',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

export async function onRequestGet({ env }) {
  try {
    if (!env.DB) return json({ error: "D1 binding DB chưa được cấu hình." }, 500);

    await ensureGuestbookTable(env.DB);
    const { results = [] } = await env.DB
      .prepare("SELECT name, message, color FROM guestbook ORDER BY id DESC LIMIT 100")
      .all();

    return json(results.reverse());
  } catch (error) {
    console.error("Không tải được lưu bút:", error);
    return json({ error: "Không tải được lời nhắn." }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) return json({ error: "D1 binding DB chưa được cấu hình." }, 500);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Dữ liệu gửi lên không phải JSON hợp lệ." }, 400);
    }

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const color = COLORS.has(body?.color) ? body.color : "#FFE88A";

    if (!name || !message) {
      return json({ error: "Vui lòng nhập tên và lời nhắn." }, 400);
    }
    if (name.length > 30 || message.length > 140) {
      return json({ error: "Tên tối đa 30 ký tự, lời nhắn tối đa 140 ký tự." }, 400);
    }

    await ensureGuestbookTable(env.DB);
    await env.DB
      .prepare("INSERT INTO guestbook (name, message, color) VALUES (?, ?, ?)")
      .bind(name, message, color)
      .run();

    return json({ ok: true }, 201);
  } catch (error) {
    console.error("Không lưu được lời nhắn:", error);
    return json({ error: "Không lưu được lời nhắn." }, 500);
  }
}
