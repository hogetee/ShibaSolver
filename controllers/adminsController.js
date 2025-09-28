/**
 * @desc    Get all admins
 * @route   GET /api/v1/admins
 * @access  Private/Admin
 */
exports.getAllAdmins = (req, res) => {
  res.status(200).json({ success: true, where: "listAdmins", data: [] });
};

/**
 * @desc    Get a single admin by ID
 * @route   GET /api/v1/admins/:id
 * @access  Private/Admin
 */
exports.getAdmin = (req, res) => {
  res.status(200).json({ success: true, where: "getAdmin", id: req.params.id });
};