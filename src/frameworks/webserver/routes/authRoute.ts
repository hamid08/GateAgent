import authController from '../../../adapters/authController';
import { Express } from 'express';
import {verifyAccessToken} from '../../../application/services/jwtService';

export default async function routes(app: Express) {


/** POST Methods */
    /**
     * @openapi
     * '/api/auth/login':
     *  post:
     *     tags:
     *     - Auth 
     *     summary: Auth Login
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - userName
     *              - password
     *            properties:
     *              userName:
     *                type: string
     *              password:
     *                type: string
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */

    app.post('/api/auth/login', authController().login);



   /** GET Methods
   * @openapi
   * '/api/auth/refresh-token':
   *  get:
   *     tags:
   *     - Auth
   *     summary: Get Token
   *     security:
   *       - bearerAuth: []
   *     responses:
   *      200:
   *        description: Fetched successfully
   *      400:
   *        description: Bad Request
   *      404:
   *        description: Not Found
   *      500:
   *        description: Server Error
   *     components:
   *       securitySchemes:
   *         bearerAuth:
   *           type: http
   *           scheme: bearer
   *           bearerFormat: JWT
   */

    app.get('/api/auth/refresh-token', authController().refreshToken);




    /** POST Methods */
    /**
     * @openapi
     * '/api/auth/logout':
     *  post:
     *     tags:
     *     - Auth
     *     summary: Delete Refresh Token
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - refreshToken
     *            properties:
     *              refreshToken:
     *                type: string
     *     responses:
     *      200:
     *        description: Removed
     *      400:
     *        description: Bad request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */

    app.post('/api/auth/logout', authController().logout);


   /** GET Methods
   * @openapi
   * '/api/auth/profile':
   *  get:
   *     tags:
   *     - Auth
   *     summary: Get Profile Info
   *     security:
   *       - bearerAuth: []
   *     responses:
   *      200:
   *        description: Fetched successfully
   *      400:
   *        description: Bad Request
   *      404:
   *        description: Not Found
   *      500:
   *        description: Server Error
   *     components:
   *       securitySchemes:
   *         bearerAuth:
   *           type: http
   *           scheme: bearer
   *           bearerFormat: JWT
   */

   app.get('/api/auth/profile', verifyAccessToken,authController().profile);







    /** GET Methods
   * @openapi
   * '/api/auth/test':
   *  get:
   *     tags:
   *     - Auth
   *     summary: Test Authorize
   *     security:
   *       - bearerAuth: []
   *     responses:
   *      200:
   *        description: Fetched successfully
   *      400:
   *        description: Bad Request
   *      404:
   *        description: Not Found
   *      500:
   *        description: Server Error
   *     components:
   *       securitySchemes:
   *         bearerAuth:
   *           type: http
   *           scheme: bearer
   *           bearerFormat: JWT
   */

   app.get('/api/auth/test', verifyAccessToken,authController().authorizeTest);






}