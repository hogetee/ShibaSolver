const jwt = require('jsonwebtoken');

function adminProtect(req, res, next) {
  try {
    const bearer = req.headers.authorization;
    const cookieToken = req.cookies?.admin_access_token;
    const token = cookieToken || (bearer?.startsWith('Bearer ') ? bearer.split(' ')[1] : null);
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.scope !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    req.admin = { adminId: payload.uid };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid/Expired token' });
  }
}

module.exports = { adminProtect };