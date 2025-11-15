const jsonResponse = (description, schema) => ({
  description,
  content: {
    'application/json': {
      schema,
    },
  },
});

const baseResponseRef = { $ref: '#/components/schemas/BaseResponse' };
const errorResponseRef = { $ref: '#/components/schemas/ErrorResponse' };

module.exports = {
  '/': {
    get: {
      tags: ['Feed'],
      summary: 'Root welcome message',
      responses: {
        200: jsonResponse('Server is reachable', baseResponseRef),
      },
    },
  },

  // Auth
  '/api/v1/auth/google': {
    post: {
      tags: ['Auth'],
      summary: 'Authenticate with Google ID token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/GoogleLoginRequest' },
          },
        },
      },
      responses: {
        200: jsonResponse('Existing user logged in', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                new_user: { type: 'boolean', example: false },
                data: { $ref: '#/components/schemas/UserDetail' },
              },
            },
          ],
        }),
        201: jsonResponse('New user created via Google sign-in', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                new_user: { type: 'boolean', example: true },
                data: { $ref: '#/components/schemas/UserDetail' },
              },
            },
          ],
        }),
        400: jsonResponse('Missing or malformed id_token', errorResponseRef),
        401: jsonResponse('Invalid Google token', errorResponseRef),
      },
    },
  },
  '/api/v1/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Clear the ss_token cookie',
      responses: {
        200: jsonResponse('Logout successful', baseResponseRef),
      },
    },
  },
  '/api/v1/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get current user profile',
      security: [{ UserBearerAuth: [] }],
      responses: {
        200: jsonResponse('Authenticated user profile', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/UserDetail' },
              },
            },
          ],
        }),
        401: jsonResponse('Missing or invalid session token', errorResponseRef),
      },
    },
  },

  // Admin auth
  '/api/v1/adminAuth/login': {
    post: {
      tags: ['Admin Auth'],
      summary: 'Admin login using email and password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AdminLoginRequest' },
          },
        },
      },
      responses: {
        200: jsonResponse('Admin authenticated', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description:
                    'JWT that is also stored inside the admin_access_token cookie.',
                },
                data: { $ref: '#/components/schemas/AdminSummary' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid payload', errorResponseRef),
        401: jsonResponse('Invalid credentials', errorResponseRef),
      },
    },
  },
  '/api/v1/adminAuth/logout': {
    post: {
      tags: ['Admin Auth'],
      summary: 'Clear admin session token',
      security: [{ AdminBearerAuth: [] }],
      responses: {
        200: jsonResponse('Logout successful', baseResponseRef),
        401: jsonResponse('Not authenticated as admin', errorResponseRef),
      },
    },
  },

  // Admin moderation
  '/api/v1/admins': {
    get: {
      tags: ['Admins'],
      summary: 'List admins with optional search and pagination',
      security: [{ AdminBearerAuth: [] }],
      parameters: [
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by admin name or email',
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20, maximum: 100 },
          description: 'Page size (max 100)',
        },
        {
          name: 'offset',
          in: 'query',
          schema: { type: 'integer', default: 0 },
          description: 'Offset for pagination',
        },
      ],
      responses: {
        200: jsonResponse('Admin list', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                total: { type: 'integer' },
                pagination: { $ref: '#/components/schemas/PaginationMeta' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/AdminSummary' },
                },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
        403: jsonResponse('Forbidden', errorResponseRef),
      },
    },
  },
  '/api/v1/admins/users/banned': {
    get: {
      tags: ['Admins'],
      summary: 'List banned users',
      security: [{ AdminBearerAuth: [] }],
      parameters: [
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by username, display name or email',
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20, maximum: 100 },
          description: 'Page size (max 100)',
        },
        {
          name: 'offset',
          in: 'query',
          schema: { type: 'integer', default: 0 },
          description: 'Offset for pagination',
        },
      ],
      responses: {
        200: jsonResponse('Banned users list', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                total: { type: 'integer' },
                pagination: { $ref: '#/components/schemas/PaginationMeta' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/BannedUserSummary' },
                },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
        403: jsonResponse('Forbidden', errorResponseRef),
      },
    },
  },
  '/api/v1/admins/posts/{postId}': {
    delete: {
      tags: ['Admins'],
      summary: 'Soft-delete any post and cascade its comments',
      security: [{ AdminBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/PostId' }],
      responses: {
        200: jsonResponse('Post removed', baseResponseRef),
        400: jsonResponse('Invalid post id', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Post not found or already deleted', errorResponseRef),
      },
    },
  },
  '/api/v1/admins/comments/{commentId}': {
    delete: {
      tags: ['Admins'],
      summary: 'Soft-delete any comment',
      security: [{ AdminBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/CommentId' }],
      responses: {
        200: jsonResponse('Comment removed', baseResponseRef),
        400: jsonResponse('Invalid comment id', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Comment not found or already deleted', errorResponseRef),
      },
    },
  },
  '/api/v1/admins/users/{userId}/ban': {
    patch: {
      tags: ['Admins'],
      summary: 'Ban a user account',
      security: [{ AdminBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UserId' }],
      responses: {
        200: jsonResponse('User banned', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    user_id: { type: 'integer' },
                    user_state: { type: 'string', enum: ['ban', 'normal'] },
                  },
                },
                alreadyBanned: { type: 'boolean' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid user id', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('User not found', errorResponseRef),
      },
    },
  },
  '/api/v1/admins/users/{userId}/unban': {
    patch: {
      tags: ['Admins'],
      summary: 'Restore a banned user',
      security: [{ AdminBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/UserId' }],
      responses: {
        200: jsonResponse('User unbanned', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    user_id: { type: 'integer' },
                    user_state: { type: 'string', enum: ['normal', 'ban'] },
                  },
                },
                alreadyNormal: { type: 'boolean' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid user id', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('User not found', errorResponseRef),
      },
    },
  },
  '/api/v1/admins/accounts/{reportId}/status': {
    patch: {
      tags: ['Admins'],
      summary: 'Update any report status',
      security: [{ AdminBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/ReportId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status'],
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'accepted', 'rejected'],
                },
              },
            },
          },
        },
      },
      responses: {
        200: jsonResponse('Report updated', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/Report' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid payload', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Report not found', errorResponseRef),
      },
    },
  },
  '/api/v1/admins/accounts': {
    get: {
      tags: ['Admins'],
      summary: 'View reported accounts',
      security: [{ AdminBearerAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['pending', 'accepted', 'rejected'],
          },
          description: 'Optional status filter',
        },
      ],
      responses: {
        200: jsonResponse('Account reports', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/AccountReport' },
                },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/admins/posts': {
    get: {
      tags: ['Admins'],
      summary: 'View reported posts',
      security: [{ AdminBearerAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['pending', 'accepted', 'rejected'],
          },
          description: 'Optional status filter',
        },
      ],
      responses: {
        200: jsonResponse('Post reports', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/PostReport' },
                },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/admins/comments': {
    get: {
      tags: ['Admins'],
      summary: 'View reported comments',
      security: [{ AdminBearerAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['pending', 'accepted', 'rejected'],
          },
          description: 'Optional status filter',
        },
      ],
      responses: {
        200: jsonResponse('Comment reports', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CommentReport' },
                },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/users': {
    put: {
      tags: ['Users'],
      summary: 'Update selected user fields',
      security: [{ UserBearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateUserPayload' },
          },
        },
      },
      responses: {
        200: jsonResponse('User updated', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/UserDetail' },
              },
            },
          ],
        }),
        400: jsonResponse('No valid fields to update', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        403: jsonResponse('Attempted to edit privileged fields', errorResponseRef),
        404: jsonResponse('User not found', errorResponseRef),
      },
    },
    delete: {
      tags: ['Users'],
      summary: 'Delete the authenticated user',
      security: [{ UserBearerAuth: [] }],
      responses: {
        200: jsonResponse('User deleted', baseResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('User not found', errorResponseRef),
      },
    },
  },
  '/api/v1/users/premium': {
    put: {
      tags: ['Users'],
      summary: 'Mark current user as premium',
      security: [{ UserBearerAuth: [] }],
      responses: {
        200: jsonResponse('Premium flag updated', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    user_id: { type: 'integer' },
                    is_premium: { type: 'boolean' },
                    updated_at: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/users/canclePremium': {
    put: {
      tags: ['Users'],
      summary: 'Downgrade current user from premium status',
      security: [{ UserBearerAuth: [] }],
      responses: {
        200: jsonResponse('Premium flag updated', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    user_id: { type: 'integer' },
                    is_premium: { type: 'boolean' },
                    updated_at: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/users/{username}': {
    get: {
      tags: ['Users'],
      summary: 'Get profile by username',
      parameters: [{ $ref: '#/components/parameters/Username' }],
      responses: {
        200: jsonResponse('User profile', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/PublicUserProfile' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid username', errorResponseRef),
        404: jsonResponse('User not found', errorResponseRef),
      },
    },
  },
  '/api/v1/users/{username}/shibameter': {
    get: {
      tags: ['Users', 'Ratings'],
      summary: 'Calculate trust ratio (ShibaMeter) for an author',
      parameters: [{ $ref: '#/components/parameters/Username' }],
      responses: {
        200: jsonResponse('ShibaMeter calculated', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/ShibaMeterResponse' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid username', errorResponseRef),
        404: jsonResponse('User not found', errorResponseRef),
      },
    },
  },
  '/api/v1/users/{userID}/posts': {
    get: {
      tags: ['Users', 'Posts'],
      summary: 'List posts authored by a specific user',
      parameters: [
        {
          name: 'userID',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
        },
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 100 },
        },
      ],
      responses: {
        200: jsonResponse('Posts for user', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                meta: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    total: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    hasNext: { type: 'boolean' },
                    nextPage: { type: 'integer', nullable: true },
                  },
                },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Post' },
                },
              },
            },
          ],
        }),
        404: jsonResponse('User not found', errorResponseRef),
      },
    },
  },

  // Posts & bookmarks
  '/api/v1/posts': {
    get: {
      tags: ['Posts'],
      summary: 'List posts ordered by creation date',
      responses: {
        200: jsonResponse('Post feed', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                rows: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/PostRecord' },
                },
              },
            },
          ],
        }),
      },
    },
    post: {
      tags: ['Posts'],
      summary: 'Create a new post',
      security: [{ UserBearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreatePostRequest' },
          },
        },
      },
      responses: {
        201: jsonResponse('Post created', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/PostRecord' },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
          ],
        }),
        400: jsonResponse('Validation error (missing title/description/tags)', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/posts/{postId}': {
    get: {
      tags: ['Posts'],
      summary: 'Get full post with aggregated ratings',
      parameters: [{ $ref: '#/components/parameters/PostId' }],
      responses: {
        200: jsonResponse('Post detail', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/Post' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid post id', errorResponseRef),
        404: jsonResponse('Post not found', errorResponseRef),
      },
    },
    put: {
      tags: ['Posts'],
      summary: 'Edit a post and replace its tags',
      security: [{ UserBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/PostId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdatePostRequest' },
          },
        },
      },
      responses: {
        200: jsonResponse('Post updated', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/PostRecord' },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid payload or missing tags', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Post not found or not owned by user', errorResponseRef),
      },
    },
    delete: {
      tags: ['Posts'],
      summary: 'Soft-delete own post and cascade comments',
      security: [{ UserBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/PostId' }],
      responses: {
        200: jsonResponse('Post deleted', baseResponseRef),
        400: jsonResponse('Invalid post id', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Post not found or not owned by user', errorResponseRef),
      },
    },
  },
  '/api/v1/posts/bookmarks': {
    get: {
      tags: ['Posts'],
      summary: 'List bookmarks of current user',
      security: [{ UserBearerAuth: [] }],
      responses: {
        200: jsonResponse('Bookmarks', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Post' },
                },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/posts/bookmarks/{postId}': {
    post: {
      tags: ['Posts'],
      summary: 'Bookmark a post',
      security: [{ UserBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/PostId' }],
      responses: {
        201: jsonResponse('Bookmark created', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    user_id: { type: 'integer' },
                    post_id: { type: 'integer' },
                    created_at: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          ],
        }),
        200: jsonResponse('Already bookmarked', baseResponseRef),
        400: jsonResponse('Invalid ids', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
    delete: {
      tags: ['Posts'],
      summary: 'Remove a bookmark',
      security: [{ UserBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/PostId' }],
      responses: {
        200: jsonResponse('Bookmark removed', baseResponseRef),
        400: jsonResponse('Invalid ids', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Bookmark not found', errorResponseRef),
      },
    },
  },

  // Feed
  '/api/v1/feeds': {
    get: {
      tags: ['Feed'],
      summary: 'Curated feed with tags and top comment preview',
      responses: {
        200: jsonResponse('Feed items', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Post' },
                },
              },
            },
          ],
        }),
      },
    },
  },

  // Comments
  '/api/v1/comments': {
    post: {
      tags: ['Comments'],
      summary: 'Create a comment or reply',
      security: [{ UserBearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateCommentRequest' },
          },
        },
      },
      responses: {
        201: jsonResponse('Comment created', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/CommentBasic' },
              },
            },
          ],
        }),
        400: jsonResponse('Validation error', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Post or parent comment not found', errorResponseRef),
      },
    },
  },
  '/api/v1/comments/{id}': {
    get: {
      tags: ['Comments'],
      summary: 'Fetch a single comment',
      security: [{ UserBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/CommentResourceId' }],
      responses: {
        200: jsonResponse('Comment detail', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/CommentSummary' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid comment id', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Comment not found', errorResponseRef),
      },
    },
    put: {
      tags: ['Comments'],
      summary: 'Edit own comment',
      security: [{ UserBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/CommentResourceId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateCommentRequest' },
          },
        },
      },
      responses: {
        200: jsonResponse('Comment updated', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/CommentBasic' },
              },
            },
          ],
        }),
        400: jsonResponse('Nothing to update', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Comment not found or not owned', errorResponseRef),
      },
    },
    delete: {
      tags: ['Comments'],
      summary: 'Soft-delete own comment',
      security: [{ UserBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/CommentResourceId' }],
      responses: {
        200: jsonResponse('Comment deleted', baseResponseRef),
        400: jsonResponse('Invalid comment id', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Comment not found or not owned', errorResponseRef),
      },
    },
  },
  '/api/v1/comments/{commentId}/replies': {
    post: {
      tags: ['Comments'],
      summary: 'Reply to a comment',
      security: [{ UserBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/CommentId' }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ReplyCommentRequest' },
          },
        },
      },
      responses: {
        201: jsonResponse('Reply created', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/CommentBasic' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid comment id or payload', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Parent comment not found', errorResponseRef),
      },
    },
  },
  '/api/v1/comments/{commentId}/solution': {
    patch: {
      tags: ['Comments'],
      summary: 'Toggle your comment as a solution',
      security: [{ UserBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/CommentId' }],
      responses: {
        200: jsonResponse('Solution flag toggled', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/CommentBasic' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid comment id', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        403: jsonResponse('Not the owner of the comment', errorResponseRef),
        404: jsonResponse('Comment not found', errorResponseRef),
      },
    },
  },
  '/api/v1/comments/user/{userId}': {
    get: {
      tags: ['Comments'],
      summary: 'List comments written by a user',
      security: [{ UserBearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/UserId' },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 10 },
        },
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
        },
        {
          name: 'sort',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['latest', 'oldest', 'popular'],
            default: 'latest',
          },
        },
      ],
      responses: {
        200: jsonResponse('User comments', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                meta: { $ref: '#/components/schemas/PaginationMeta' },
                viewingSelf: { type: 'boolean' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CommentSummary' },
                },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid user id', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/comments/post/{postId}': {
    get: {
      tags: ['Comments'],
      summary: 'List comments of a post with access control (30-day/premium rule)',
      security: [{ UserBearerAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/PostId' },
        {
          name: 'sort',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['latest', 'oldest', 'popular', 'ratio'],
            default: 'latest',
          },
        },
      ],
      responses: {
        200: jsonResponse('Comments with access metadata', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                restricted: { type: 'boolean' },
                reason: {
                  type: 'string',
                  enum: [null, 'LOGIN_REQUIRED', 'PREMIUM_REQUIRED'],
                  nullable: true,
                },
                post: {
                  type: 'object',
                  properties: {
                    post_id: { type: 'integer' },
                    created_at: { type: 'string', format: 'date-time' },
                    is_recent_30d: { type: 'boolean' },
                  },
                },
                count: { type: 'integer' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CommentSummary' },
                },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid post id', errorResponseRef),
        404: jsonResponse('Post not found', errorResponseRef),
      },
    },
  },
  '/api/v1/comments/post/{postId}/top': {
    get: {
      tags: ['Comments'],
      summary: 'Retrieve the most popular comment for a post',
      parameters: [{ $ref: '#/components/parameters/PostId' }],
      responses: {
        200: jsonResponse('Top comment', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/CommentSummary' },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid post id', errorResponseRef),
        404: jsonResponse('No comments found', errorResponseRef),
      },
    },
  },

  // Ratings
  '/api/v1/ratings': {
    post: {
      tags: ['Ratings'],
      summary: 'Like or dislike a post/comment',
      security: [{ UserBearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RateRequest' },
          },
        },
      },
      responses: {
        200: jsonResponse('Rating stored', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    target_type: { type: 'string' },
                    target_id: { type: 'integer' },
                    rating: {
                      type: 'object',
                      properties: {
                        rating_id: { type: 'integer' },
                        rating_type: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                      },
                    },
                    summary: {
                      type: 'object',
                      properties: {
                        likes: { type: 'integer' },
                        dislikes: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          ],
        }),
        400: jsonResponse('Validation error', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
    delete: {
      tags: ['Ratings'],
      summary: 'Remove current rating',
      security: [{ UserBearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UnrateRequest' },
          },
        },
      },
      responses: {
        200: jsonResponse('Rating removed (if existed)', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                summary: {
                  type: 'object',
                  properties: {
                    likes: { type: 'integer' },
                    dislikes: { type: 'integer' },
                  },
                },
              },
            },
          ],
        }),
        400: jsonResponse('Validation error', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/ratings/summary': {
    get: {
      tags: ['Ratings'],
      summary: 'Batch rating summary for posts or comments',
      security: [{ UserBearerAuth: [] }],
      parameters: [
        {
          name: 'target_type',
          in: 'query',
          required: true,
          schema: { type: 'string', enum: ['post', 'comment'] },
        },
        {
          name: 'ids',
          in: 'query',
          required: true,
          schema: { type: 'string', example: '1,2,3' },
          description: 'Comma-separated list of ids',
        },
      ],
      responses: {
        200: jsonResponse('Rating summary', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                target_type: { type: 'string' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/RatingSummary' },
                },
              },
            },
          ],
        }),
        400: jsonResponse('Invalid parameters', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },

  // Reports
  '/api/v1/reports/accounts': {
    post: {
      tags: ['Reports'],
      summary: 'Report a user account',
      security: [{ UserBearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ReportAccountRequest' },
          },
        },
      },
      responses: {
        201: jsonResponse('Account reported', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/Report' },
              },
            },
          ],
        }),
        400: jsonResponse('Validation error', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Target user not found', errorResponseRef),
        429: jsonResponse('Duplicated report within 24h', errorResponseRef),
      },
    },
  },
  '/api/v1/reports/content': {
    post: {
      tags: ['Reports'],
      summary: 'Report a post or comment',
      security: [{ UserBearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ReportContentRequest' },
          },
        },
      },
      responses: {
        201: jsonResponse('Content reported', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/Report' },
              },
            },
          ],
        }),
        400: jsonResponse('Validation error', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Target content not found', errorResponseRef),
        429: jsonResponse('Duplicated report within 24h', errorResponseRef),
      },
    },
  },

  // Search
  '/api/v1/search/users': {
    get: {
      tags: ['Search'],
      summary: 'Search users by display name or username',
      parameters: [
        {
          name: 'query',
          in: 'query',
          required: true,
          schema: { type: 'string' },
        },
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20, maximum: 50 },
        },
      ],
      responses: {
        200: jsonResponse('User search results', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                page: { type: 'integer' },
                has_next_page: { type: 'boolean' },
                users: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/UserPublic' },
                },
              },
            },
          ],
        }),
        400: jsonResponse('Query parameter is required', errorResponseRef),
      },
    },
  },
  '/api/v1/search/posts': {
    get: {
      tags: ['Search'],
      summary: 'Search posts by keyword and/or tags',
      parameters: [
        {
          name: 'query',
          in: 'query',
          schema: { type: 'string' },
        },
        {
          name: 'tags',
          in: 'query',
          schema: { type: 'string', example: 'math,geometry' },
          description: 'Comma-separated list of tags. Post must contain all tags when provided.',
        },
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20, maximum: 50 },
        },
      ],
      responses: {
        200: jsonResponse('Post search results', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                page: { type: 'integer' },
                has_next_page: { type: 'boolean' },
                posts: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Post' },
                },
              },
            },
          ],
        }),
        400: jsonResponse('Either query or tags is required', errorResponseRef),
      },
    },
  },

  // Notifications
  '/api/v1/notifications': {
    get: {
      tags: ['Notifications'],
      summary: 'List notifications for current user',
      security: [{ UserBearerAuth: [] }],
      parameters: [
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20, maximum: 100 },
        },
        {
          name: 'offset',
          in: 'query',
          schema: { type: 'integer', default: 0 },
        },
      ],
      responses: {
        200: jsonResponse('Notifications', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                total: { type: 'integer' },
                pagination: { $ref: '#/components/schemas/PaginationMeta' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Notification' },
                },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/notifications/unread': {
    get: {
      tags: ['Notifications'],
      summary: 'List unread notifications',
      security: [{ UserBearerAuth: [] }],
      parameters: [
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20, maximum: 100 },
        },
        {
          name: 'offset',
          in: 'query',
          schema: { type: 'integer', default: 0 },
        },
      ],
      responses: {
        200: jsonResponse('Unread notifications', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                count: { type: 'integer' },
                total: { type: 'integer' },
                pagination: { $ref: '#/components/schemas/PaginationMeta' },
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Notification' },
                },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/notifications/unread-count': {
    get: {
      tags: ['Notifications'],
      summary: 'Get unread notification count',
      security: [{ UserBearerAuth: [] }],
      responses: {
        200: jsonResponse('Unread count', {
          allOf: [
            baseResponseRef,
            {
              type: 'object',
              properties: {
                unread: { type: 'integer' },
              },
            },
          ],
        }),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
  '/api/v1/notifications/{id}/read': {
    patch: {
      tags: ['Notifications'],
      summary: 'Mark a single notification as read',
      security: [{ UserBearerAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/NotificationId' }],
      responses: {
        200: jsonResponse('Notification marked as read', baseResponseRef),
        400: jsonResponse('Invalid notification id', errorResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
        404: jsonResponse('Notification not found', errorResponseRef),
      },
    },
  },
  '/api/v1/notifications/read-all': {
    patch: {
      tags: ['Notifications'],
      summary: 'Mark all notifications as read',
      security: [{ UserBearerAuth: [] }],
      responses: {
        200: jsonResponse('All notifications marked as read', baseResponseRef),
        401: jsonResponse('Not authenticated', errorResponseRef),
      },
    },
  },
};
