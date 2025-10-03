const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    const cookieToken = req.cookies?.ss_token;

    let token = null;
    if (bearer?.startsWith("Bearer ")) token = bearer.slice(7);
    else if (cookieToken) token = cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Missing session token" },
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { uid: payload.uid };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid or expired session" },
    });
  }
};
//อนุญาตให้ผู้ใช้ที่ไม่ได้ล็อกอินเข้ามาดูได้ แต่ถ้าล็อกอินเข้ามาจะดูเฉลยได้
exports.optionalAuth = (req, _res, next) => {
  try {
    const bearer = req.headers.authorization;
    const cookieToken = req.cookies?.ss_token;
    let token = null;
    if (bearer?.startsWith("Bearer ")) token = bearer.slice(7);
    else if (cookieToken) token = cookieToken;
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { uid: payload.uid };
    next();
  } catch {
    next();
  }
};
