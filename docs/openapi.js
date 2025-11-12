const serverUrl =
  process.env.SWAGGER_SERVER_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:5000';

const baseResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', nullable: true },
  },
};

const errorResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string' },
    error: {
      type: 'object',
      nullable: true,
      additionalProperties: true,
    },
  },
};

const paths = require('./paths');

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'ShibaSolver API',
    version: '1.0.0',
    description:
      'REST API that powers the ShibaSolver platform. Authentication relies on short-lived JWTs that can be supplied through the `Authorization: Bearer <token>` header or via the `ss_token` / `admin_access_token` cookies.',
    contact: {
      name: 'ShibaSolver Team',
      url: 'https://github.com/hogetee/ShibaSolver',
    },
  },
  servers: [
    {
      url: serverUrl,
      description: 'Current environment',
    },
    {
      url: 'https://api.shibasolver.local',
      description: 'Example production URL',
    },
  ],
  tags: [
    { name: 'Auth', description: 'End-user authentication' },
    { name: 'Admin Auth', description: 'Admin authentication' },
    { name: 'Admins', description: 'Administrative actions' },
    { name: 'Users', description: 'User profile management' },
    { name: 'Posts', description: 'Problem posts, bookmarks and feed' },
    { name: 'Comments', description: 'Post comments and replies' },
    { name: 'Ratings', description: 'Like / dislike interactions' },
    { name: 'Reports', description: 'Content and account reports' },
    { name: 'Search', description: 'User and post search' },
    { name: 'Feed', description: 'Aggregated home feed' },
    { name: 'Notifications', description: 'In-app notifications' },
  ],
  components: {
    securitySchemes: {
      UserBearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'User session token. The same token is also accepted via the `ss_token` cookie.',
      },
      AdminBearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Admin session token. The same token is also accepted via the `admin_access_token` cookie.',
      },
    },
    parameters: {
      PostId: {
        name: 'postId',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1 },
      },
      CommentId: {
        name: 'commentId',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1 },
      },
      CommentResourceId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1 },
      },
      UserId: {
        name: 'userId',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1 },
      },
      Username: {
        name: 'username',
        in: 'path',
        required: true,
        schema: { type: 'string', pattern: '^[\\w-]+$' },
      },
      NotificationId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1 },
      },
      ReportId: {
        name: 'reportId',
        in: 'path',
        required: true,
        schema: { type: 'integer', minimum: 1 },
      },
    },
    schemas: {
      BaseResponse: baseResponse,
      ErrorResponse: errorResponse,
      PaginationMeta: {
        type: 'object',
        properties: {
          limit: { type: 'integer', example: 20 },
          offset: { type: 'integer', example: 0 },
          page: { type: 'integer', example: 1 },
          total: { type: 'integer', example: 200 },
          totalPages: { type: 'integer', example: 10 },
          hasNext: { type: 'boolean' },
          nextPage: { type: 'integer', nullable: true },
        },
      },
      UserPublic: {
        type: 'object',
        properties: {
          user_id: { type: 'integer' },
          user_name: { type: 'string' },
          display_name: { type: 'string', nullable: true },
          profile_picture: { type: 'string', nullable: true },
        },
      },
      PublicUserProfile: {
        type: 'object',
        properties: {
          user_id: { type: 'integer' },
          user_name: { type: 'string' },
          display_name: { type: 'string', nullable: true },
          profile_picture: { type: 'string', nullable: true },
          bio: { type: 'string', nullable: true },
          education_level: { type: 'string', nullable: true },
          interested_subjects: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
          },
          like: { type: 'integer', nullable: true },
          dislike: { type: 'integer', nullable: true },
          created_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      UserDetail: {
        type: 'object',
        properties: {
          user_id: { type: 'integer' },
          email: { type: 'string', format: 'email', nullable: true },
          user_name: { type: 'string', nullable: true },
          display_name: { type: 'string', nullable: true },
          profile_picture: { type: 'string', nullable: true },
          bio: { type: 'string', nullable: true },
          education_level: { type: 'string', nullable: true },
          interested_subjects: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
          },
          like: { type: 'integer', nullable: true },
          dislike: { type: 'integer', nullable: true },
          is_premium: { type: 'boolean' },
          user_state: {
            type: 'string',
            enum: ['normal', 'ban'],
            default: 'normal',
          },
          created_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      AdminSummary: {
        type: 'object',
        properties: {
          admin_id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
      Post: {
        type: 'object',
        properties: {
          post_id: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string' },
          post_image: { type: 'string', nullable: true },
          is_solved: { type: 'boolean' },
          is_deleted: { type: 'boolean', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
          author: { $ref: '#/components/schemas/UserPublic' },
          likes: { type: 'integer', example: 5 },
          dislikes: { type: 'integer', example: 1 },
          my_rating: {
            type: 'string',
            enum: ['like', 'dislike', null],
            nullable: true,
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
          },
          bookmarked_at: { type: 'string', format: 'date-time', nullable: true },
          top_comment: {
            $ref: '#/components/schemas/CommentSummary',
          },
        },
      },
      CommentSummary: {
        type: 'object',
        properties: {
          comment_id: { type: 'integer' },
          user_id: { type: 'integer' },
          post_id: { type: 'integer' },
          parent_comment: { type: 'integer', nullable: true },
          text: { type: 'string' },
          comment_image: { type: 'string', nullable: true },
          is_solution: { type: 'boolean' },
          is_updated: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          likes: { type: 'integer' },
          dislikes: { type: 'integer' },
          total_votes: { type: 'integer' },
          ratio: { type: 'number', nullable: true },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          notification_id: { type: 'integer' },
          notification_type: { type: 'string' },
          message: { type: 'string' },
          link: { type: 'string', nullable: true },
          is_read: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Report: {
        type: 'object',
        properties: {
          report_id: { type: 'integer' },
          reporter_id: { type: 'integer' },
          target_type: {
            type: 'string',
            enum: ['user', 'post', 'comment'],
          },
          target_id: { type: 'integer' },
          reason: { type: 'string' },
          status: {
            type: 'string',
            enum: ['pending', 'accepted', 'rejected'],
          },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      AccountReport: {
        type: 'object',
        properties: {
          report_id: { type: 'integer' },
          reporter_id: { type: 'integer' },
          target_id: { type: 'integer' },
          reporter_name: { type: 'string' },
          target_name: { type: 'string' },
          target_username: { type: 'string' },
          reason: { type: 'string' },
          status: {
            type: 'string',
            enum: ['pending', 'accepted', 'rejected'],
          },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      PostReport: {
        type: 'object',
        properties: {
          report_id: { type: 'integer' },
          reporter_id: { type: 'integer' },
          target_id: { type: 'integer' },
          reporter_name: { type: 'string' },
          post_title: { type: 'string' },
          post_owner_name: { type: 'string' },
          post_owner_username: { type: 'string' },
          reason: { type: 'string' },
          status: {
            type: 'string',
            enum: ['pending', 'accepted', 'rejected'],
          },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      CommentReport: {
        type: 'object',
        properties: {
          report_id: { type: 'integer' },
          reporter_id: { type: 'integer' },
          target_id: { type: 'integer' },
          reporter_name: { type: 'string' },
          comment_text: { type: 'string' },
          comment_owner_name: { type: 'string' },
          comment_owner_username: { type: 'string' },
          reason: { type: 'string' },
          status: {
            type: 'string',
            enum: ['pending', 'accepted', 'rejected'],
          },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      RatingSummary: {
        type: 'object',
        properties: {
          id: { type: 'integer', nullable: true },
          target_type: {
            type: 'string',
            enum: ['post', 'comment'],
            nullable: true,
          },
          target_id: { type: 'integer', nullable: true },
          likes: { type: 'integer' },
          dislikes: { type: 'integer' },
          my_rating: {
            type: 'string',
            enum: ['like', 'dislike', null],
            nullable: true,
          },
        },
      },
      GoogleLoginRequest: {
        type: 'object',
        required: ['id_token'],
        properties: {
          id_token: { type: 'string', description: 'Google ID token' },
        },
      },
      AdminLoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
      },
      CreatePostRequest: {
        type: 'object',
        required: ['title', 'description', 'tags'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          post_image: { type: 'string', nullable: true },
          tags: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
          },
        },
      },
      UpdatePostRequest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          post_image: { type: 'string', nullable: true },
          is_solved: { type: 'boolean' },
          tags: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
          },
        },
      },
      CreateCommentRequest: {
        type: 'object',
        required: ['post_id', 'text'],
        properties: {
          post_id: { type: 'integer' },
          text: { type: 'string' },
          parent_comment: { type: 'integer', nullable: true },
          comment_image: { type: 'string', nullable: true },
        },
      },
      ReplyCommentRequest: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string' },
          comment_image: { type: 'string', nullable: true },
        },
      },
      UpdateCommentRequest: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          comment_image: { type: 'string', nullable: true },
        },
      },
      RateRequest: {
        type: 'object',
        required: ['target_type', 'target_id', 'rating_type'],
        properties: {
          target_type: { type: 'string', enum: ['post', 'comment'] },
          target_id: { type: 'integer' },
          rating_type: { type: 'string', enum: ['like', 'dislike'] },
        },
      },
      UnrateRequest: {
        type: 'object',
        required: ['target_type', 'target_id'],
        properties: {
          target_type: { type: 'string', enum: ['post', 'comment'] },
          target_id: { type: 'integer' },
        },
      },
      ReportAccountRequest: {
        type: 'object',
        required: ['target_id', 'reason'],
        properties: {
          target_id: { type: 'integer' },
          reason: { type: 'string', minLength: 3 },
        },
      },
      ReportContentRequest: {
        type: 'object',
        required: ['target_type', 'target_id', 'reason'],
        properties: {
          target_type: { type: 'string', enum: ['post', 'comment'] },
          target_id: { type: 'integer' },
          reason: { type: 'string', minLength: 3 },
        },
      },
      UpdateUserPayload: {
        type: 'object',
        required: ['new_data'],
        properties: {
          new_data: {
            type: 'object',
            description:
              'Only the provided fields are updated. Allowed keys: is_premium, user_state, user_name, display_name, education_level, like, dislike, bio, interested_subjects, profile_picture',
            additionalProperties: true,
          },
        },
      },
      AccessControlledComments: {
        type: 'object',
        properties: {
          post: {
            type: 'object',
            properties: {
              post_id: { type: 'integer' },
              created_at: { type: 'string', format: 'date-time' },
              is_recent_30d: { type: 'boolean' },
            },
          },
          restricted: { type: 'boolean' },
          reason: {
            type: 'string',
            enum: [null, 'LOGIN_REQUIRED', 'PREMIUM_REQUIRED'],
            nullable: true,
          },
          count: { type: 'integer' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/CommentSummary' },
          },
        },
      },
      ShibaMeterResponse: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          shibaMeter: { type: 'number', example: 82.5 },
        },
      },
    },
  },
  paths,
};
