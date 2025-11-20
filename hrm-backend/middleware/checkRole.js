const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Bạn không có quyền thực hiện hành động này" });
  }
  next();
};
module.exports = checkRole;