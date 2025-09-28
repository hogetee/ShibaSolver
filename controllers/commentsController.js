/**
 * @desc    Get all comments
 * @route   GET /api/v1/comments
 * @access  Private
 */
exports.getAllComments = (req, res) => {
  res.status(200).json({ success: true, where: 'listComments', data: [] });
};

/**
 * @desc    Get a single comment by ID
 * @route   GET /api/v1/comments/:id
 * @access  Private
 */
exports.getComment = (req, res) => {
  res.status(200).json({ success: true, where: 'getComment', id: req.params.id });
};