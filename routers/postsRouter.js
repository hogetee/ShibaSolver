const express = require("express");
const postsCtrl = require("../controllers/postsController");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const router = express.Router();

//GET
router.get("/", postsCtrl.refreshFeed);
router.get('/:postId',optionalAuth, postsCtrl.getPost);
router.get("/bookmarks/:user_id", requireAuth, postsCtrl.getBookmarks);

//POST
router.post("/bookmarks", requireAuth, postsCtrl.addBookmark);
router.post("/", requireAuth,postsCtrl.createPost);

//PUT
router.put('/:postId', requireAuth, postsCtrl.editPost)

//DELETE
router.delete("/:postId", requireAuth, postsCtrl.deletePost);
// export router
module.exports = router;

//API Documentation 
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - user_id
 *         - description
 *         - title
 *       properties:
 *         post_id:
 *           type: integer
 *           format: int64
 *           description: Auto-incremented unique ID of the post
 *           example: 101
 *         user_id:
 *           type: integer
 *           format: int64
 *           description: ID of the user who created the post
 *           example: 1001
 *         is_solved:
 *           type: boolean
 *           description: Whether the post is marked as solved
 *           default: false
 *           example: false
 *         is_deleted:
 *           type: boolean
 *           description: Whether the post has been soft-deleted
 *           default: false
 *           example: false
 *         description:
 *           type: string
 *           description: Content/body of the post
 *           example: "I’m having trouble connecting to my database in Node.js."
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was created
 *           example: "2025-10-27T13:15:00.000Z"
 *         title:
 *           type: string
 *           description: Title of the post
 *           example: "Database connection issue"
 *         post_image:
 *           type: string
 *           nullable: true
 *           description: Optional image URL attached to the post
 *           example: "https://example.com/image.jpg"
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts
 */

/**
 * @swagger
 * /api/v1/posts/{postId}:
 *   get:
 *     summary: Get a single post by ID
 *     description: Retrieve a single post with author info, like/dislike counts, user's rating status, and tags.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 101
 *         description: ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     post_id:
 *                       type: integer
 *                       example: 101
 *                     title:
 *                       type: string
 *                       example: "How to connect PostgreSQL in Node.js?"
 *                     description:
 *                       type: string
 *                       example: "I cannot connect my Express backend to Postgres, any idea?"
 *                     post_image:
 *                       type: string
 *                       example: "https://example.com/image.png"
 *                     is_solved:
 *                       type: boolean
 *                       example: false
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-27T10:00:00Z"
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *                     author:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                           example: 201
 *                         display_name:
 *                           type: string
 *                           example: "phongsakorn"
 *                         profile_picture:
 *                           type: string
 *                           example: "https://example.com/avatar.png"
 *                     likes:
 *                       type: integer
 *                       example: 5
 *                     dislikes:
 *                       type: integer
 *                       example: 1
 *                     my_rating:
 *                       type: boolean
 *                       nullable: true
 *                       description: true = liked, false = disliked, null = not rated
 *                       example: true
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["postgres", "nodejs", "express"]
 *       400:
 *         description: Invalid post ID
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with title, description, image, and tags.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *                 example: "How to use Supabase client in Node.js"
 *               description:
 *                 type: string
 *                 example: "I got error 400 when trying to connect to Supabase."
 *               post_image:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/image.jpg"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["nodejs", "supabase"]
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["nodejs", "supabase"]
 *       400:
 *         description: Missing fields or invalid tags
 *       500:
 *         description: Server error
 */
