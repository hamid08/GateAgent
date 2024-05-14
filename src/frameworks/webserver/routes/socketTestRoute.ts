import socketTestController from '../../../adapters/socketTestController';
import { Express } from 'express';

export default async function routes(app: Express) {

    /** GET Methods
   * @openapi
   * '/api/socketTest/anprSocket':
   *  get:
   *     tags:
   *     - Socket Test
   *     summary: Test ANPR Socket
   *     parameters:
   *      - name: found
   *        in: query
   *        description: 
   *        required: true
   *        schema:
   *          type: boolean
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

    app.get('/api/socketTest/anprSocket', socketTestController().anprTest);


    /** GET Methods
* @openapi
* '/api/socketTest/identityResultBox':
*  get:
*     tags:
*     - Socket Test
*     summary: Test identityResultBox
*     parameters:
*      - name: type
*        in: query
*        description: 
*        required: true
*        schema:
*          type: integer
*          default: 1
*      - name: messageType
*        in: query
*        description: 
*        required: true
*        schema:
*          type: integer
*          default: 1
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

    app.get('/api/socketTest/identityResultBox', socketTestController().identityResultBox);



    /** GET Methods
    * @openapi
    * '/api/socketTest/hfData':
    *  get:
    *     tags:
    *     - Socket Test
    *     summary: Test hfData
    *     parameters:
    *      - name: found
    *        in: query
    *        description: 
    *        required: true
    *        schema:
    *          type: boolean
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

    app.get('/api/socketTest/hfData', socketTestController().hfData);


    /** GET Methods
    * @openapi
    * '/api/socketTest/rfidData':
    *  get:
    *     tags:
    *     - Socket Test
    *     summary: Test rfidData
    *     parameters:
    *      - name: found
    *        in: query
    *        description: 
    *        required: true
    *        schema:
    *          type: boolean
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

    app.get('/api/socketTest/rfidData', socketTestController().rfidData);


    /** GET Methods
    * @openapi
    * '/api/socketTest/finishProcess':
    *  get:
    *     tags:
    *     - Socket Test
    *     summary: Test finishProcess
    *     parameters:
    *      - name: needTripNumber
    *        in: query
    *        description: 
    *        required: true
    *        schema:
    *          type: boolean
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

    app.get('/api/socketTest/finishProcess', socketTestController().finishProcess);


    /** GET Methods
           * @openapi
           * '/api/socketTest/identificationStatus':
           *  get:
           *     tags:
           *     - Socket Test
           *     summary: Test identificationStatus
           *     parameters:
           *      - name: type
           *        in: query
           *        description: 
           *        required: true
           *        schema:
           *          type: integer
           *          default: 1
           *      - name: status
           *        in: query
           *        description: 
           *        required: true
           *        schema:
           *          type: integer
           *          default: 1
           *     responses:
           *      200:
           *        description: Fetched successfully
           *      400:
           *        description: Bad Request
           *      404:
           *        description: Not Found
           *      500:
           *        description: Server Error
           */


    app.get('/api/socketTest/identificationStatus', socketTestController().identificationStatus);



    /** GET Methods
               * @openapi
               * '/api/socketTest/identificationReadData':
               *  get:
               *     tags:
               *     - Socket Test
               *     summary: Test identificationReadData
               *     parameters:
               *      - name: type
               *        in: query
               *        description: 
               *        required: true
               *        schema:
               *          type: integer
               *          default: 1
               *     responses:
               *      200:
               *        description: Fetched successfully
               *      400:
               *        description: Bad Request
               *      404:
               *        description: Not Found
               *      500:
               *        description: Server Error
               */


    app.get('/api/socketTest/identificationReadData', socketTestController().identificationReadData);

}