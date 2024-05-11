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
* '/api/socketTest/identityResultBox_info':
*  get:
*     tags:
*     - Socket Test
*     summary: Test identityResultBox_info
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

    app.get('/api/socketTest/identityResultBox_info', socketTestController().identityResultBox_info);


    /** GET Methods
* @openapi
* '/api/socketTest/identityResultBox_Error':
*  get:
*     tags:
*     - Socket Test
*     summary: Test identityResultBox_Error
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

    app.get('/api/socketTest/identityResultBox_Error', socketTestController().identityResultBox_Error);


    /** GET Methods
* @openapi
* '/api/socketTest/identityResultBox_Success':
*  get:
*     tags:
*     - Socket Test
*     summary: Test identityResultBox_Success
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

    app.get('/api/socketTest/identityResultBox_Success', socketTestController().identityResultBox_Success);



/** GET Methods
* @openapi
* '/api/socketTest/hfData':
*  get:
*     tags:
*     - Socket Test
*     summary: Test hfData
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
* '/api/socketTest/scanTicketModal':
*  get:
*     tags:
*     - Socket Test
*     summary: Test scanTicketModal
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

app.get('/api/socketTest/scanTicketModal', socketTestController().scanTicketModal);

}