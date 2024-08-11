const {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");
const { UnauthorizedError, ForbiddenError } = require("../utils/errors");

const authenticateToken = (req, _, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("No token provided", "TOKEN_MISSING"));
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return next(new ForbiddenError("Invalid or expired token"));
  }

  req.user = decoded;
  next();
};

const refreshTokens = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(
      new UnauthorizedError(
        "No refresh token provided",
        "REFRESH_TOKEN_MISSING"
      )
    );
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    res.clearCookie("refreshToken");
    return next(new ForbiddenError("Invalid or expired refresh token"));
  }

  const newAccessToken = generateAccessToken(decoded);
  const newRefreshToken = generateRefreshToken(decoded);

  // Send the new tokens
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
  });

  res.json({ accessToken: newAccessToken });
};

module.exports = {
  authenticateToken,
  refreshTokens,
};
