const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginAdmin = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email/Password required' });
    }

    const { rows } = await pool.query(
      `SELECT admin_id, name, email, password
       FROM admins
       WHERE email = $1
       LIMIT 1`,
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const admin = rows[0];

    const ok = await bcrypt.compare(password, admin.password || '');
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ uid: admin.admin_id, scope: 'admin' }, process.env.JWT_SECRET, { expiresIn: '60m' });

    res.cookie('admin_access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    return res.json({
      success: true,
      token,
      data: { admin_id: admin.admin_id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error(err.stack);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.logoutAdmin = async (req, res) => {
  res.clearCookie('admin_access_token', { path: '/' });
  return res.json({ success: true });
};
