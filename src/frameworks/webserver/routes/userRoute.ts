import userController from '../../../adapters/userController';
import { Express } from 'express';

export default async function routes(app: Express) {

    /** PUT Methods */
    /**
     * @openapi
     * '/api/user/changePassword/{userId}':
     *  put:
     *     tags:
     *     - User
     *     summary: change password by userId
     *     parameters:
     *      - name: userId
     *        in: path
     *        description: The unique Id of the user
     *        required: true
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - newPassword
     *            properties:
     *              newPassword:
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

    app.put('/api/user/changePassword/:userId', userController().changeUserPassword);



 /** POST Methods */
    /**
     * @openapi
     * '/api/user/grid':
     *  post:
     *     tags:
     *     - User
     *     summary: get List User
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - searchTerm
     *              - pageIndex
     *              - pageSize
     *            properties:
     *              searchTerm:
     *                type: string
     *              pageIndex:
     *                type: number
     *              pageSize:
     *                type: number
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

    app.post('/api/user/grid', userController().getUserGrid);



}