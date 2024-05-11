import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gate Agent',
      version: '1.0.0',
      description: 'سرویس گیت هوشمند',
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/frameworks/webserver/routes/**/*.ts'], // Path to the API docs
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};

const specs = swaggerJsdoc(options);

export default (app: any) => {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui.topbar { display: none }',
    customSiteTitle: 'Gate Agent',
  }));
};