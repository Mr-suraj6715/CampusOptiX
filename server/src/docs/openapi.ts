import { Request, Response } from 'express';

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'CampusOptiX REST API Documentation',
    version: '1.0.0',
    description:
      'Enterprise-grade Smart Campus Resource, Timetable & Classroom Optimizer RESTful API specification.',
    contact: {
      name: 'CampusOptiX Engineering Team',
      email: 'support@campusoptix.edu',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local Development Server (/api)',
    },
    {
      url: 'http://localhost:5000/api/v1',
      description: 'API v1 Endpoint (/api/v1)',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT authorization token (e.g. Bearer eyJhbGciOi...)',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
          errorCode: { type: 'string', example: 'BAD_REQUEST' },
          details: { type: 'array', items: { type: 'object' } },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@campusoptix.edu' },
          password: { type: 'string', example: 'Admin@123' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Dr. Priya Mehta' },
          email: { type: 'string', format: 'email', example: 'priya.mehta@campusoptix.edu' },
          password: { type: 'string', example: 'Faculty@123' },
          role: { type: 'string', enum: ['ADMIN', 'HOD', 'FACULTY', 'LAB_INCHARGE', 'STUDENT'], example: 'HOD' },
          departmentId: { type: 'string', example: 'dept-cse-id' },
        },
      },
      RecommendationRequest: {
        type: 'object',
        required: ['conflictId'],
        properties: {
          conflictId: { type: 'string', example: 'conf-1' },
          weights: {
            type: 'object',
            properties: {
              capacity: { type: 'number', example: 25 },
              equipment: { type: 'number', example: 20 },
              availability: { type: 'number', example: 20 },
              roomType: { type: 'number', example: 15 },
              utilization: { type: 'number', example: 10 },
              facultyPreference: { type: 'number', example: 5 },
              studentTravel: { type: 'number', example: 5 },
            },
          },
        },
      },
      EmergencyRequest: {
        type: 'object',
        required: ['resourceId'],
        properties: {
          resourceId: { type: 'string', example: 'lab-b' },
          startTime: { type: 'string', example: '14:00' },
          endTime: { type: 'string', example: '17:00' },
          reason: { type: 'string', example: 'Power grid disruption' },
        },
      },
      SimulationRequest: {
        type: 'object',
        required: ['scenarioType'],
        properties: {
          scenarioType: {
            type: 'string',
            enum: ['ROOM_UNAVAILABLE', 'ADDITIONAL_STUDENTS', 'FACULTY_UNAVAILABLE', 'NEW_CLASS', 'CUSTOM'],
            example: 'ROOM_UNAVAILABLE',
          },
          scenarioData: {
            type: 'object',
            properties: {
              roomId: { type: 'string', example: 'lab-b' },
              studentSurge: { type: 'number', example: 25 },
              startTime: { type: 'string', example: '14:00' },
              endTime: { type: 'string', example: '17:00' },
            },
          },
        },
      },
    },
  },
  paths: {
    '/dashboard': {
      get: {
        summary: 'Section 44: Campus KPI Dashboard Metrics',
        tags: ['Dashboard'],
        responses: {
          '200': { description: 'Dashboard metrics payload', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Section 21: User Login',
        tags: ['Authentication'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
        responses: {
          '200': { description: 'Authenticated successfully with JWT token' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Section 21: Register User Account',
        tags: ['Authentication'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } },
        responses: {
          '201': { description: 'User account created' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Section 21: Get Current User Profile',
        security: [{ BearerAuth: [] }],
        tags: ['Authentication'],
        responses: {
          '200': { description: 'Current user profile without password' },
        },
      },
    },
    '/rooms': {
      get: {
        summary: 'Section 23: List Campus Rooms',
        tags: ['Rooms'],
        parameters: [
          { name: 'building', in: 'query', schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'capacity', in: 'query', schema: { type: 'number' } },
        ],
        responses: {
          '200': { description: 'List of rooms' },
        },
      },
      post: {
        summary: 'Section 23: Create Room (Admin only)',
        security: [{ BearerAuth: [] }],
        tags: ['Rooms'],
        responses: { '201': { description: 'Room created' } },
      },
    },
    '/labs': {
      get: {
        summary: 'Section 24: List Specialized Laboratories',
        tags: ['Labs'],
        responses: { '200': { description: 'List of labs' } },
      },
    },
    '/courses': {
      get: {
        summary: 'Section 25: List Academic Courses',
        tags: ['Courses'],
        responses: { '200': { description: 'List of courses' } },
      },
    },
    '/classes': {
      get: {
        summary: 'Section 25: List Class Offerings & Cohorts',
        tags: ['Classes'],
        responses: { '200': { description: 'List of classes' } },
      },
    },
    '/faculty': {
      get: {
        summary: 'Section 26: List Faculty Profiles & Workloads',
        tags: ['Faculty'],
        responses: { '200': { description: 'List of faculty' } },
      },
    },
    '/timetable': {
      get: {
        summary: 'Section 27: List Master Timetable Slots',
        tags: ['Timetable'],
        responses: { '200': { description: 'Master timetable matrix' } },
      },
      post: {
        summary: 'Section 27: Book Timetable Slot with Collision Guard',
        security: [{ BearerAuth: [] }],
        tags: ['Timetable'],
        responses: { '201': { description: 'Slot booked' } },
      },
    },
    '/conflicts': {
      get: {
        summary: 'Section 14: List Detected Conflicts',
        tags: ['Conflicts'],
        responses: { '200': { description: 'List of active & resolved conflicts' } },
      },
    },
    '/conflicts/detect': {
      post: {
        summary: 'Section 28: Trigger Deterministic Conflict Detection Scan',
        security: [{ BearerAuth: [] }],
        tags: ['Conflicts'],
        responses: { '200': { description: 'Scan results with detected anomalies' } },
      },
    },
    '/optimizer/conflicts/{conflictId}/candidates': {
      get: {
        summary: 'Section 31: Search & Rank Candidate Rooms for Conflict',
        tags: ['Optimizer'],
        parameters: [{ name: 'conflictId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Ranked candidate rooms with 7-criteria soft breakdown' } },
      },
    },
    '/optimizer/recommend': {
      post: {
        summary: 'Section 32, 33, 34: Generate Explainable Recommendation with Before vs After',
        tags: ['Optimizer'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RecommendationRequest' } } } },
        responses: { '200': { description: 'Structured recommendation with rationale & before/after delta' } },
      },
    },
    '/recommendations/{id}/approve': {
      post: {
        summary: 'Section 35: Approve Room Reallocation (Atomic Transaction)',
        security: [{ BearerAuth: [] }],
        tags: ['Optimizer'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Committed to master timetable' } },
      },
    },
    '/recommendations/{id}/reject': {
      post: {
        summary: 'Section 35: Reject Recommendation',
        security: [{ BearerAuth: [] }],
        tags: ['Optimizer'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Recommendation rejected' } },
      },
    },
    '/optimizer/emergency': {
      post: {
        summary: 'Section 36: Emergency Reallocation Impact Solver',
        security: [{ BearerAuth: [] }],
        tags: ['Optimizer'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/EmergencyRequest' } } } },
        responses: { '200': { description: 'Emergency reallocation analysis' } },
      },
    },
    '/optimizer/underutilized': {
      get: {
        summary: 'Section 29: Underutilization Space Scanner',
        tags: ['Optimizer'],
        responses: { '200': { description: 'Underutilized rooms list' } },
      },
    },
    '/optimization/history': {
      get: {
        summary: 'Section 43: Get Optimization Audit History',
        tags: ['Optimizer'],
        responses: { '200': { description: 'Optimization audit log' } },
      },
    },
    '/simulation/run': {
      post: {
        summary: 'Section 37: Run In-Memory What-If Campus Simulation',
        security: [{ BearerAuth: [] }],
        tags: ['Simulation'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SimulationRequest' } } } },
        responses: { '200': { description: 'Simulation outcome' } },
      },
    },
    '/analytics/overview': {
      get: {
        summary: 'Section 41: Campus Infrastructure Overview',
        tags: ['Analytics'],
        responses: { '200': { description: 'Overview statistics' } },
      },
    },
    '/analytics/utilization': {
      get: {
        summary: 'Section 41: Space Utilization Analytics',
        tags: ['Analytics'],
        responses: { '200': { description: 'Utilization by building & room type' } },
      },
    },
    '/analytics/conflicts': {
      get: {
        summary: 'Section 41: Conflict Analytics & Category Distribution',
        tags: ['Analytics'],
        responses: { '200': { description: 'Conflicts breakdown' } },
      },
    },
    '/analytics/optimization': {
      get: {
        summary: 'Section 41: Optimization Efficiency & HVAC Savings',
        tags: ['Analytics'],
        responses: { '200': { description: 'Optimization metrics' } },
      },
    },
    '/notifications': {
      get: {
        summary: 'Section 42: List Notifications',
        security: [{ BearerAuth: [] }],
        tags: ['Notifications'],
        responses: { '200': { description: 'List of alerts' } },
      },
      post: {
        summary: 'Section 42: Broadcast Notification',
        security: [{ BearerAuth: [] }],
        tags: ['Notifications'],
        responses: { '201': { description: 'Notification created' } },
      },
    },
  },
};

/**
 * Controller to serve OpenAPI JSON and Interactive Swagger UI
 */
export const docsController = {
  getOpenApiSpec(req: Request, res: Response) {
    return res.json(openApiSpec);
  },

  getSwaggerUI(req: Request, res: Response) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CampusOptiX API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.11.0/favicon-32x32.png" />
  <style>
    body { margin: 0; padding: 0; background: #fafafa; font-family: sans-serif; }
    .topbar { display: none !important; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;
    return res.type('html').send(html);
  },
};
