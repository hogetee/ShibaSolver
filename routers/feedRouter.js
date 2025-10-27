const express = require('express');
const feedCtrl = require('../controllers/feedsController');

const router = express.Router();

//GET
router.get('/', feedCtrl.getFeed);

//POST

//PUT

//DELETE


//API Documentation Tags
/**
 * @swagger
 * tags:
 *   name: Feeds
 *   description: API endpoints for managing and retrieving user feeds
*/

/**
 * @swagger
 * /api/v1/feeds:
 *   get:
 *     summary: Get feed of posts
 *     description: Retrieve a list of posts with author info, like/dislike summary, tags, and top comments.
 *     tags:
 *       - Feeds
 *     responses:
 *       200:
 *         description: Successful response with posts and related info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       post_id:
 *                         type: integer
 *                         example: 101
 *                       title:
 *                         type: string
 *                         example: "How to debug SQL JOIN?"
 *                       description:
 *                         type: string
 *                         example: "I'm trying to join posts and tags but it returns null..."
 *                       post_image:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       is_solved:
 *                         type: boolean
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-27T13:20:00.000Z"
 *                       user_id:
 *                         type: integer
 *                         example: 100
 *                       display_name:
 *                         type: string
 *                         example: "phongsakorn"
 *                       profile_picture:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
 *                       likes:
 *                         type: integer
 *                         example: 5
 *                       dislikes:
 *                         type: integer
 *                         example: 1
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["sql", "join", "postgres"]
 *                       top_comment:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           comment_id:
 *                             type: integer
 *                             example: 3001
 *                           text:
 *                             type: string
 *                             example: "Try using LEFT JOIN instead!"
 *                           created_at:
 *                             type: string
 *                             example: "2025-10-27T13:30:00.000Z"
 *                           user_id:
 *                             type: integer
 *                             example: 102
 *                           display_name:
 *                             type: string
 *                             example: "shibasolver_user"
 *                           profile_picture:
 *                             type: string
 *                             example: "https://example.com/avatar2.jpg"
 *                           likes:
 *                             type: integer
 *                             example: 4
 *                           dislikes:
 *                             type: integer
 *                             example: 0
 *       500:
 *         description: Server error
 */


// export router
module.exports = router;