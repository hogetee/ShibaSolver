const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signSessionJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function cookieOpts() {
  const isProd = (process.env.NODE_ENV || "development") === "production";
  return {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
  };
}

exports.googleLogin = async (req, res) => {
  try {
    console.log("BODY /api/v1/auth/google:", req.body);
    console.log("GOOGLE_CLIENT_ID =", process.env.GOOGLE_CLIENT_ID);
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "id_token is required" },
      });
    }

    // verify id_token กับ Google
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(401).json({
        success: false,
        error: {
          code: "EMAIL_NOT_VERIFIED",
          message: "Google email not verified",
        },
      });
    }

    const pool = req.app.locals.pool;

    // หา user ด้วย google_account (เก็บ sub)
    let user = (
      await pool.query("SELECT * FROM users WHERE google_account=$1", [sub])
    ).rows[0];

    if (!user) {
      user = (
        await pool.query(
          `INSERT INTO users (google_account, email, display_name, profile_picture)
         VALUES ($1,$2,$3,$4)
         RETURNING *`,
          [sub, email, name || null, picture || null]
        )
      ).rows[0];
      const token = signSessionJwt({ uid: user.user_id });
      res.cookie("ss_token", token, cookieOpts());

      return res.status(201).json({
        success: true,
        new_user: true, // <<< ใช้เช็คฝั่ง FE
        data: {
          user_id: user.user_id,
          email: user.email,
          display_name: user.display_name,
          avatar_url: user.profile_picture,
        },
      });
    } else {
      // อัปเดตข้อมูลล่าสุดจาก Google
      await pool.query(
        `UPDATE users
            SET email=$2,
                updated_at=now()
         WHERE google_account=$1
         RETURNING *`,
        [sub, email]
      );
      const token = signSessionJwt({ uid: user.user_id });
      res.cookie("ss_token", token, cookieOpts());

      return res.status(200).json({
        success: true,
        new_user: false, // <<< ใช้เช็คฝั่ง FE
        data: {
          user_id: user.user_id,
          email: user.email,
          display_name: user.display_name,
          avatar_url: user.profile_picture,
        },
      });
    }
  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);
    return res.status(401).json({
      success: false,
      error: { code: "INVALID_ID_TOKEN", message: "Invalid Google id_token" },
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("ss_token", "", { ...cookieOpts(), maxAge: 0 });
  res.json({ success: true });
};



exports.getMe = async (req, res, next) => {
  try {
    const id  = req.user.uid;
    if (!/^\d+$/.test(id)) return res.status(400).json({ success:false, message:'Invalid id' });

    const pool = req.app.locals.pool;
    const { rows } = await pool.query(
      `SELECT * FROM public.users 
      WHERE user_id = $1`, [id]
    );
    if (rows.length === 0) return res.status(404).json({ success:false, message:'User not found' });

    return res.status(200).json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};