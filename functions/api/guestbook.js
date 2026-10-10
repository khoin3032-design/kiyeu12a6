const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

const COLORS = new Set(["#FFE88A", "#FFC9C0", "#BFE3D0", "#C9D8FF"]);
const REACTIONS = new Set(["heart", "laugh", "potato"]);

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

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS guestbook_reactions (
      note_id INTEGER NOT NULL,
      visitor_id TEXT NOT NULL,
      reaction TEXT NOT NULL CHECK (reaction IN ('heart', 'laugh', 'potato')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (note_id, visitor_id),
      FOREIGN KEY (note_id) REFERENCES guestbook(id) ON DELETE CASCADE
    )
  `).run();
}

export async function onRequestGet({ env }) {
  try {
    if (!env.DB) return json({ error: "D1 binding DB chưa được cấu hình." }, 500);

    await ensureGuestbookTable(env.DB);
    const [notesResponse, reactionsResponse] = await Promise.all([
      env.DB.prepare("SELECT id, name, message, color FROM guestbook ORDER BY id DESC LIMIT 100").all(),
      env.DB.prepare("SELECT note_id, reaction, COUNT(*) AS count FROM guestbook_reactions GROUP BY note_id, reaction").all()
    ]);

    const countsByNote = new Map();
    for (const row of reactionsResponse.results || []) {
      const counts = countsByNote.get(row.note_id) || { heart: 0, laugh: 0, potato: 0 };
      counts[row.reaction] = Number(row.count) || 0;
      countsByNote.set(row.note_id, counts);
    }

    const notes = (notesResponse.results || []).map(note => ({
      ...note,
      reactions: countsByNote.get(note.id) || { heart: 0, laugh: 0, potato: 0 }
    }));

    return json(notes.reverse());
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

    await ensureGuestbookTable(env.DB);

    if (body?.action === "react") {
      const noteId = Number(body.noteId);
      const visitorId = typeof body.visitorId === "string" ? body.visitorId : "";
      const reaction = body.reaction;

      if (!Number.isSafeInteger(noteId) || noteId < 1 || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
        return json({ error: "Thông tin biểu cảm không hợp lệ." }, 400);
      }
      if (reaction !== null && !REACTIONS.has(reaction)) {
        return json({ error: "Biểu cảm không được hỗ trợ." }, 400);
      }

      const note = await env.DB.prepare("SELECT id FROM guestbook WHERE id = ?").bind(noteId).first();
      if (!note) return json({ error: "Không tìm thấy lời nhắn." }, 404);

      if (reaction === null) {
        await env.DB.prepare("DELETE FROM guestbook_reactions WHERE note_id = ? AND visitor_id = ?")
          .bind(noteId, visitorId)
          .run();
      } else {
        await env.DB.prepare(`
          INSERT INTO guestbook_reactions (note_id, visitor_id, reaction)
          VALUES (?, ?, ?)
          ON CONFLICT(note_id, visitor_id) DO UPDATE SET
            reaction = excluded.reaction,
            created_at = CURRENT_TIMESTAMP
        `).bind(noteId, visitorId, reaction).run();
      }

      return json({ ok: true });
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