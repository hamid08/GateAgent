
import operatorController from '../../../adapters/operatorController';
import { Express } from 'express';


export default async function routes(app: Express) {


    /** GET Methods
     * @openapi
     * '/api/operator/gates':
     *  get:
     *     tags:
     *     - Operator Panel
     *     summary: Get Gate List
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

    app.get('/api/operator/gates', operatorController().getGates);




    /** GET Methods
       * @openapi
       * '/api/operator/gates/{gateId}':
       *  get:
       *     tags:
       *     - Operator Panel
       *     summary: Get Gate By Id
       *     parameters:
       *      - name: gateId
       *        in: path
       *        description: The unique Id of the gate
       *        required: true
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

    app.get('/api/operator/gates/:gateId', operatorController().getGateDetailsById);


    /** GET Methods
          * @openapi
          * '/api/operator/gates/{gateId}/connectionTest':
          *  get:
          *     tags:
          *     - Operator Panel
          *     summary: Test Gate Items
          *     parameters:
          *      - name: gateId
          *        in: path
          *        description: The unique Id of the gate
          *        required: true
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

    app.get('/api/operator/gates/:gateId/connectionTest', operatorController().connectionTest);



    /** GET Methods
         * @openapi
         * '/api/operator/gates/{gateId}/livePlaqueImage':
         *  get:
         *     tags:
         *     - Operator Panel
         *     summary: Get Gate By Id
         *     parameters:
         *      - name: gateId
         *        in: path
         *        description: The unique Id of the gate
         *        required: true
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

    app.get('/api/operator/gates/:gateId/livePlaqueImage', operatorController().getLivePlaqueImage);

}