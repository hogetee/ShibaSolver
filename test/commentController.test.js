// __tests__/comments.controller.test.js
// แนะนำ: npm i --save-dev jest supertest
// ตั้งค่า Jest ให้รองรับ ESM/TS ตามโปรเจกต์คุณ (ตัวอย่างนี้ใช้ CJS ปกติ)

const {
  getMyComments,
  getTopComment,
  getComment,
  createComment,
  editComment,
  deleteComment,
  toggleMyCommentSolution,
  replyToComment,
  fetchCommentsByPost,
  getComments,
  getCommentsAccessControlled,
} = require('../controllers/commentsController'); // <= ปรับ path ให้ตรงโปรเจกต์

// ---------- helpers ----------
function makeReq({
  params = {},
  query = {},
  body = {},
  user = undefined, // { uid }
  pool = undefined,
} = {}) {
  return {
    params,
    query,
    body,
    user,
    app: { locals: { pool } },
  };
}
function makeRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}
function makeNext() {
  return jest.fn();
}

function makeMockClient(sequence = []) {
  // sequence: array ของค่าที่จะคืนจาก client.query ทีละ call
  let i = 0;
  return {
    query: jest.fn(async (...args) => {
      if (i >= sequence.length) {
        throw new Error(`Unexpected client.query call #${i + 1} with args: ${JSON.stringify(args)}`);
      }
      const ret = sequence[i];
      i += 1;
      if (ret instanceof Error) throw ret;
      return ret;
    }),
    release: jest.fn(),
  };
}

function makeMockPool({ querySequence = [], connectClient = null } = {}) {
  // pool.query ถูกเรียกตรง ๆ
  let q = 0;
  const pool = {
    query: jest.fn(async (...args) => {
      if (q >= querySequence.length) {
        throw new Error(`Unexpected pool.query call #${q + 1} with args: ${JSON.stringify(args)}`);
      }
      const ret = querySequence[q];
      q += 1;
      if (ret instanceof Error) throw ret;
      return ret;
    }),
    connect: jest.fn(async () => {
      if (connectClient) return connectClient;
      // ถ้าไม่ได้ส่ง client เฉพาะ ใช้ client ว่างๆ
      return makeMockClient();
    }),
  };
  return pool;
}

// สะดวกสำหรับสร้าง rows
const rows = (...arr) => ({ rows: arr, rowCount: arr.length });

// ---------- tests ----------
describe('commentsController soft-delete & branches', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- getMyComments ---
  test('getMyComments: 200 with data, ensures is_deleted=FALSE in SQL', async () => {
    const pool = makeMockPool({
      querySequence: [rows({ comment_id: 1 }, { comment_id: 2 })],
    });
    const req = makeReq({ user: { uid: 10 }, pool });
    const res = makeRes();
    await getMyComments(req, res, makeNext());

    expect(pool.query).toHaveBeenCalledTimes(1);
    const [sql, params] = pool.query.mock.calls[0];
    expect(sql).toMatch(/is_deleted\s*=\s*FALSE/i);
    expect(params).toEqual([10]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, count: 2 })
    );
  });

  // --- getTopComment ---
  test('getTopComment: 400 invalid postId', async () => {
    const req = makeReq({ params: { postId: 'x' }, pool: makeMockPool() });
    const res = makeRes();
    await getTopComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('getTopComment: 404 when no rows', async () => {
    const pool = makeMockPool({ querySequence: [rows()] });
    const req = makeReq({ params: { postId: 5 }, pool });
    const res = makeRes();
    await getTopComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('getTopComment: 200 returns one row', async () => {
    const pool = makeMockPool({ querySequence: [rows({ comment_id: 99 })] });
    const req = makeReq({ params: { postId: 5 }, pool });
    const res = makeRes();
    await getTopComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: { comment_id: 99 } })
    );
  });

  // --- getComment ---
  test('getComment: 400 invalid id', async () => {
    const req = makeReq({ params: { id: 'bad' }, pool: makeMockPool() });
    const res = makeRes();
    await getComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('getComment: 404 not found', async () => {
    const pool = makeMockPool({ querySequence: [rows()] });
    const req = makeReq({ params: { id: 7 }, pool });
    const res = makeRes();
    await getComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('getComment: 200 ok', async () => {
    const pool = makeMockPool({ querySequence: [rows({ comment_id: 7 })] });
    const req = makeReq({ params: { id: 7 }, pool });
    const res = makeRes();
    await getComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // --- createComment ---
  test('createComment: 401 when no user', async () => {
    const req = makeReq({ body: { post_id: 1, text: 'hi' }, pool: makeMockPool() });
    const res = makeRes();
    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('createComment: 400 bad post_id', async () => {
    const req = makeReq({ user: { uid: 1 }, body: { post_id: 'x', text: 'hi' }, pool: makeMockPool() });
    const res = makeRes();
    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('createComment: 400 no text', async () => {
    const req = makeReq({ user: { uid: 1 }, body: { post_id: 1, text: '   ' }, pool: makeMockPool() });
    const res = makeRes();
    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('createComment: 404 post not found (transaction rollback)', async () => {
    const client = makeMockClient([
      // BEGIN
      rows(),
      // SELECT post
      rows(), // rowCount=0
      // ROLLBACK
      rows(),
    ]);
    client.query.mockImplementation(async (sql) => {
      if (/^BEGIN/i.test(sql)) return rows();
      if (/FROM posts/i.test(sql)) return rows(); // 0
      if (/ROLLBACK/i.test(sql)) return rows();
      return rows();
    });
    const pool = makeMockPool({ connectClient: client });
    const req = makeReq({ user: { uid: 2 }, body: { post_id: 9, text: 'Hello' }, pool });
    const res = makeRes();
    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
  });

  test('createComment: 400 parent not exists', async () => {
    const client = makeMockClient();
    // mockด้วย manual switch
    client.query = jest.fn(async (sql, params) => {
      if (/^BEGIN/i.test(sql)) return rows();
      if (/FROM posts/i.test(sql)) return rows({ post_id: params[0] });
      if (/FROM comments/i.test(sql)) return rows(); // parent 0 row
      if (/ROLLBACK/i.test(sql)) return rows();
      return rows();
    });
    const pool = makeMockPool({ connectClient: client });
    const req = makeReq({
      user: { uid: 2 },
      body: { post_id: 9, text: 'Hello', parent_comment: 123 },
      pool,
    });
    const res = makeRes();
    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'parent_comment does not exist' }));
    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
  });

  test('createComment: 400 parent in different post', async () => {
    const client = makeMockClient();
    client.query = jest.fn(async (sql, params) => {
      if (/^BEGIN/i.test(sql)) return rows();
      if (/FROM posts/i.test(sql)) return rows({ post_id: params[0] });
      if (/FROM comments/i.test(sql)) return rows({ comment_id: 123, post_id: 999 }); // mismatch
      if (/ROLLBACK/i.test(sql)) return rows();
      return rows();
    });
    const pool = makeMockPool({ connectClient: client });
    const req = makeReq({
      user: { uid: 2 },
      body: { post_id: 9, text: 'Hello', parent_comment: 123 },
      pool,
    });
    const res = makeRes();
    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'parent_comment must belong to the same post' }));
    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
  });

  test('createComment: 400 FK violation 23503', async () => {
    const client = makeMockClient();
    client.query = jest.fn(async (sql) => {
      if (/^BEGIN/i.test(sql)) return rows();
      if (/FROM posts/i.test(sql)) return rows({ post_id: 1 });
      if (/INSERT INTO comments/i.test(sql)) {
        const e = new Error('fk');
        e.code = '23503';
        throw e;
      }
      return rows();
    });
    const pool = makeMockPool({ connectClient: client });
    const req = makeReq({ user: { uid: 1 }, body: { post_id: 1, text: 'ok' }, pool });
    const res = makeRes();
    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Foreign key violation' }));
  });

  test('createComment: 201 success commit', async () => {
    const inserted = { comment_id: 77, text: 'ok' };
    const client = makeMockClient();
    client.query = jest.fn(async (sql, params) => {
      if (/^BEGIN/i.test(sql)) return rows();
      if (/FROM posts/i.test(sql)) return rows({ post_id: params[0] });
      if (/FROM comments/i.test(sql)) return rows({ comment_id: params[0], post_id: params[0] });
      if (/INSERT INTO comments/i.test(sql)) return rows(inserted);
      if (/COMMIT/i.test(sql)) return rows();
      return rows();
    });
    const pool = makeMockPool({ connectClient: client });
    const req = makeReq({ user: { uid: 1 }, body: { post_id: 1, text: ' ok  ' }, pool });
    const res = makeRes();
    await createComment(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: inserted });
  });

  // --- editComment ---
  test('editComment: 400 invalid id', async () => {
    const req = makeReq({ params: { id: 'x' }, body: {}, user: { uid: 1 }, pool: makeMockPool() });
    const res = makeRes();
    await editComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('editComment: 400 nothing to update', async () => {
    const req = makeReq({ params: { id: 5 }, body: {}, user: { uid: 1 }, pool: makeMockPool() });
    const res = makeRes();
    await editComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('editComment: 404 not found/authorized', async () => {
    const pool = makeMockPool({ querySequence: [rows()] });
    const req = makeReq({ params: { id: 5 }, body: { text: 'x' }, user: { uid: 1 }, pool });
    const res = makeRes();
    await editComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('editComment: 200 ok', async () => {
    const pool = makeMockPool({ querySequence: [rows({ comment_id: 5 })] });
    const req = makeReq({ params: { id: 5 }, body: { text: 'x' }, user: { uid: 1 }, pool });
    const res = makeRes();
    await editComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // --- deleteComment (soft delete) ---
  test('deleteComment: 400 invalid id', async () => {
    const req = makeReq({ params: { id: 'bad' }, user: { uid: 1 }, pool: makeMockPool() });
    const res = makeRes();
    await deleteComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('deleteComment: 404 not found/authorized', async () => {
    const pool = makeMockPool({ querySequence: [rows()] });
    const req = makeReq({ params: { id: 9 }, user: { uid: 1 }, pool });
    const res = makeRes();
    await deleteComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('deleteComment: 200 sets is_deleted=TRUE', async () => {
    const pool = makeMockPool({ querySequence: [rows({ comment_id: 9 })] });
    const req = makeReq({ params: { id: 9 }, user: { uid: 1 }, pool });
    const res = makeRes();
    await deleteComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(200);
    const [sql] = pool.query.mock.calls[0];
    expect(sql).toMatch(/SET\s+is_deleted\s*=\s*TRUE/i);
  });

  // --- toggleMyCommentSolution ---
  test('toggleMyCommentSolution: 404 not found', async () => {
    const pool = makeMockPool({ querySequence: [rows()] });
    const req = makeReq({ params: { commentId: 1 }, user: { uid: 1 }, pool });
    const res = makeRes();
    await toggleMyCommentSolution(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('toggleMyCommentSolution: 403 not owner', async () => {
    const pool = makeMockPool({ querySequence: [rows({ comment_id: 1, user_id: 999, is_solution: false })] });
    const req = makeReq({ params: { commentId: 1 }, user: { uid: 1 }, pool });
    const res = makeRes();
    await toggleMyCommentSolution(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('toggleMyCommentSolution: 200 flips boolean', async () => {
    const select = rows({ comment_id: 1, user_id: 7, is_solution: true });
    const updated = rows({ comment_id: 1, user_id: 7, is_solution: false, is_updated: true });
    const pool = makeMockPool({ querySequence: [select, updated] });
    const req = makeReq({ params: { commentId: 1 }, user: { uid: 7 }, pool });
    const res = makeRes();
    await toggleMyCommentSolution(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // --- replyToComment ---
  test('replyToComment: 400 missing text', async () => {
    const pool = makeMockPool();
    const req = makeReq({ params: { commentId: 3 }, body: {}, user: { uid: 1 }, pool });
    const res = makeRes();
    await replyToComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('replyToComment: 404 parent not found (and rollback)', async () => {
    const client = makeMockClient();
    client.query = jest.fn(async (sql) => {
      if (/^BEGIN/i.test(sql)) return rows();
      if (/FROM comments/i.test(sql)) return rows(); // parent 0
      if (/ROLLBACK/i.test(sql)) return rows();
      return rows();
    });
    const pool = makeMockPool({ connectClient: client });
    const req = makeReq({ params: { commentId: 3 }, body: { text: 'hey' }, user: { uid: 1 }, pool });
    const res = makeRes();
    await replyToComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
  });

  test('replyToComment: 201 create + NOT notify when replying own comment', async () => {
    const client = makeMockClient();
    client.query = jest.fn(async (sql) => {
      if (/^BEGIN/i.test(sql)) return rows();
      if (/FROM comments/i.test(sql)) return rows({ comment_id: 3, parent_user_id: 42, post_id: 5 }); // parent
      if (/INSERT INTO comments/i.test(sql)) return rows({ comment_id: 88, user_id: 42 });
      if (/COMMIT/i.test(sql)) return rows();
      // เมื่อ actor = 42 เท่ากับ parent_user_id -> ไม่ควร INSERT notifications
      if (/INSERT INTO notifications/i.test(sql)) throw new Error('Should not notify self');
      return rows();
    });
    const pool = makeMockPool({ connectClient: client });
    const req = makeReq({ params: { commentId: 3 }, body: { text: 'hey' }, user: { uid: 42 }, pool });
    const res = makeRes();
    await replyToComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('replyToComment: 201 create + notify when replying others', async () => {
    let notified = false;
    const client = makeMockClient();
    client.query = jest.fn(async (sql) => {
      if (/^BEGIN/i.test(sql)) return rows();
      if (/FROM comments/i.test(sql)) return rows({ comment_id: 3, parent_user_id: 99, post_id: 5 });
      if (/INSERT INTO comments/i.test(sql)) return rows({ comment_id: 88, user_id: 42 });
      if (/INSERT INTO notifications/i.test(sql)) { notified = true; return rows({}); }
      if (/COMMIT/i.test(sql)) return rows();
      return rows();
    });
    const pool = makeMockPool({ connectClient: client });
    const req = makeReq({ params: { commentId: 3 }, body: { text: 'hey' }, user: { uid: 42 }, pool });
    const res = makeRes();
    await replyToComment(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(201);
    expect(notified).toBe(true);
  });

  // --- fetchCommentsByPost (internal) ---
  test('fetchCommentsByPost: default sort latest', async () => {
    const pool = makeMockPool({ querySequence: [rows({ comment_id: 1 })] });
    const result = await fetchCommentsByPost(pool, 10);
    expect(result).toHaveLength(1);
    const [sql] = pool.query.mock.calls[0];
    expect(sql).toMatch(/c\.is_deleted\s*=\s*FALSE/i);
    expect(sql).toMatch(/ORDER BY\s+c\.created_at DESC/i);
  });

  test('fetchCommentsByPost: sort popular', async () => {
    const pool = makeMockPool({ querySequence: [rows()] });
    await fetchCommentsByPost(pool, 10, 'popular');
    const [sql] = pool.query.mock.calls[0];
    expect(sql).toMatch(/ORDER BY\s+total_votes DESC/i);
  });

  test('fetchCommentsByPost: sort oldest', async () => {
    const pool = makeMockPool({ querySequence: [rows()] });
    await fetchCommentsByPost(pool, 10, 'oldest');
    const [sql] = pool.query.mock.calls[0];
    expect(sql).toMatch(/ORDER BY\s+c\.created_at ASC/i);
  });

  test('fetchCommentsByPost: sort ratio + filterSolutionsForAnonymous=true', async () => {
    const pool = makeMockPool({ querySequence: [rows()] });
    await fetchCommentsByPost(pool, 10, 'ratio', true);
    const [sql] = pool.query.mock.calls[0];
    expect(sql).toMatch(/ORDER BY\s+ratio DESC/i);
    // มี WHERE is_solution = FALSE (จาก flag)
    expect(sql).toMatch(/WHERE is_solution = FALSE/i);
  });

  // --- getComments ---
  test('getComments: 400 invalid postId', async () => {
    const req = makeReq({ params: { postId: 'no' }, pool: makeMockPool() });
    const res = makeRes();
    await getComments(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('getComments: 200 ok', async () => {
    const pool = makeMockPool({ querySequence: [rows({ comment_id: 1 })] });
    // fetchCommentsByPost จะถูกเรียก 1 ครั้ง
    const req = makeReq({ params: { postId: 5 }, query: { sort: 'latest' }, pool });
    const res = makeRes();
    await getComments(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // --- getCommentsAccessControlled ---
  test('getCommentsAccessControlled: 400 invalid postId', async () => {
    const req = makeReq({ params: { postId: 'x' }, pool: makeMockPool() });
    const res = makeRes();
    await getCommentsAccessControlled(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('getCommentsAccessControlled: 404 post not found', async () => {
    const pool = makeMockPool({ querySequence: [rows()] });
    const req = makeReq({ params: { postId: 7 }, pool });
    const res = makeRes();
    await getCommentsAccessControlled(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('getCommentsAccessControlled: anonymous & not recent -> restricted LOGIN_REQUIRED', async () => {
    // 1) post check -> is_recent=false
    const pool = makeMockPool({ querySequence: [rows({ post_id: 1, created_at: new Date(), is_recent: false })] });
    const req = makeReq({ params: { postId: 1 }, pool });
    const res = makeRes();
    await getCommentsAccessControlled(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ restricted: true, reason: 'LOGIN_REQUIRED' }));
  });

  test('getCommentsAccessControlled: logged in, not recent, not premium -> restricted PREMIUM_REQUIRED', async () => {
    // post row + user is_premium=false
    const pool = makeMockPool({ querySequence: [rows({ post_id: 1, is_recent: false }), rows({ is_premium: false })] });
    const req = makeReq({ params: { postId: 1 }, user: { uid: 777 }, pool });
    const res = makeRes();
    await getCommentsAccessControlled(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ restricted: true, reason: 'PREMIUM_REQUIRED' }));
  });

  test('getCommentsAccessControlled: anonymous & recent -> allowed + filterSolutionsForAnonymous', async () => {
    const pool = makeMockPool({
      querySequence: [
        rows({ post_id: 1, is_recent: true }),
        // no user lookup
        rows({ comment_id: 1 }), // fetchCommentsByPost result
      ],
    });
    const req = makeReq({ params: { postId: 1 }, query: { sort: 'ratio' }, pool });
    const res = makeRes();
    await getCommentsAccessControlled(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(200);
    // ตรวจว่า fetchCommentsByPost ถูกเรียกด้วย filterSolutionsForAnonymous=true ผ่าน SQL
    const lastSql = pool.query.mock.calls[1][0];
    expect(lastSql).toMatch(/WHERE is_solution = FALSE/i);
  });

  test('getCommentsAccessControlled: logged in & premium & not recent -> allowed', async () => {
    const pool = makeMockPool({
      querySequence: [
        rows({ post_id: 1, is_recent: false }),
        rows({ is_premium: true }),
        rows({ comment_id: 1 }),
      ],
    });
    const req = makeReq({ params: { postId: 1 }, user: { uid: 9 }, pool });
    const res = makeRes();
    await getCommentsAccessControlled(req, res, makeNext());
    expect(res.status).toHaveBeenCalledWith(200);
    const fetchSql = pool.query.mock.calls[2][0];
    expect(fetchSql).not.toMatch(/WHERE is_solution = FALSE/i); // ไม่ควรกรอง solution
  });
});