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
      user_id TEXT,
      avatar_url TEXT NOT NULL DEFAULT '',
      photo_url TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  for (const [column, definition] of [['user_id', 'TEXT'], ['avatar_url', "TEXT NOT NULL DEFAULT ''"], ['photo_url', "TEXT NOT NULL DEFAULT ''"]]) {
    try { await db.prepare(`ALTER TABLE guestbook ADD COLUMN ${column} ${definition}`).run(); } catch {}
  }

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
      env.DB.prepare("SELECT id, name, message, color, avatar_url, photo_url FROM guestbook ORDER BY id DESC LIMIT 100").all(),
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

    const cookie = request.headers.get("Cookie") || "";
    const sessionToken = cookie.split(";").map(x => x.trim()).find(x => x.startsWith("a6_session="))?.slice(11);
    if (!sessionToken) return json({ error: "Đăng nhập để gửi lưu bút." }, 401);
    const tokenHash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sessionToken)))).map(x => x.toString(16).padStart(2, "0")).join("");
    const account = await env.DB.prepare("SELECT a.id, a.username, a.display_name, a.avatar_url, a.must_change_password FROM account_sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires_at>?").bind(tokenHash, Math.floor(Date.now()/1000)).first();
    if (!account) return json({ error: "Phiên đăng nhập hết hạn. Hãy đăng nhập lại." }, 401);
    if (account.must_change_password) return json({ error: "Hãy đổi mật khẩu tạm trước khi gửi lưu bút." }, 403);
    const name = account.display_name || account.username;
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const color = COLORS.has(body?.color) ? body.color : "#FFE88A";
    const photoUrl = typeof body?.photoUrl === "string" ? body.photoUrl : "";

    if (photoUrl && !/^\/api\/image\?id=[0-9a-f-]{36}$/i.test(photoUrl)) return json({ error: "Ảnh đính kèm không hợp lệ." }, 400);

    if (!message) {
      return json({ error: "Vui lòng nhập lời nhắn." }, 400);
    }
    if (message.length > 140) {
      return json({ error: "Lời nhắn tối đa 140 ký tự." }, 400);
    }

    await env.DB
      .prepare("INSERT INTO guestbook (name, message, color, user_id, avatar_url, photo_url) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(name, message, color, account.id, account.avatar_url || "", photoUrl)
      .run();

    return json({ ok: true }, 201);
  } catch (error) {
    console.error("Không lưu được lời nhắn:", error);
    return json({ error: "Không lưu được lời nhắn." }, 500);
  }
}
