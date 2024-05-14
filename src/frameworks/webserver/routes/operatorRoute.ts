
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
         *     summary: Get livePlaqueImage By Id
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


    /** POST Methods */
    /**
     * @openapi
     * '/api/operator/gates/{gateId}/finishProcess':
     *  post:
     *     tags:
     *     - Operator Panel
     *     summary: finishProcess Detections
     *     parameters:
     *      - name: gateId
     *        in: path
     *        description: The unique Id of the gate
     *        required: true
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - tripNumber
     *            properties:
     *              tripNumber:
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

    app.post('/api/operator/gates/:gateId/finishProcess', operatorController().finishProcess);


    /** GET Methods
            * @openapi
            * '/api/operator/gates/{gateId}/detectionState':
            *  get:
            *     tags:
            *     - Operator Panel
            *     summary: Get detectionState 
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

    app.get('/api/operator/gates/:gateId/detectionState', operatorController().detectionState);











    /** POST Methods */
    /**
     * @openapi
     * '/api/operator/gates/{gateId}/identificationProcess/grid':
     *  post:
     *     tags:
     *     - Operator Panel
     *     summary: get  identificationProcess Grid
     *     parameters:
     *      - name: gateId
     *        in: path
     *        description: The unique Id of the gate
     *        required: true
     *      - name: dateTime
     *        in: query
     *        description: Type of Date
     *        required: false
     *        schema:
     *          type: Date
     *          default: ''
     *      - name: name
     *        in: query
     *        description: Type of string
     *        required: false
     *        schema:
     *          type: string
     *          default: ''
     *      - name: status
     *        in: query
     *        description: Type of number
     *        required: false
     *        schema:
     *          type: number
     *      - name: plaqueNo
     *        in: query
     *        description: Type of string
     *        required: false
     *        schema:
     *          type: string
     *          default: ''
     *      - name: trafficType
     *        in: query
     *        description: Type of number
     *        required: false
     *        schema:
     *          type: number
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

    app.post('/api/operator/gates/:gateId/identificationProcess/grid', operatorController().identificationProcessGrid);



    /** POST Methods */
    /**
     * @openapi
     * '/api/operator/gates/{gateId}/offlineTraffics/grid':
     *  post:
     *     tags:
     *     - Operator Panel
     *     summary: get  offlineTraffics Grid
     *     parameters:
     *      - name: gateId
     *        in: path
     *        description: The unique Id of the gate
     *        required: true
     *      - name: dateTime
     *        in: query
     *        description: Type of Date
     *        required: false
     *        schema:
     *          type: Date
     *          default: ''
     *      - name: tripNumber
     *        in: query
     *        description: Type of string
     *        required: false
     *        schema:
     *          type: string
     *          default: ''
     *      - name: plaqueNo
     *        in: query
     *        description: Type of string
     *        required: false
     *        schema:
     *          type: string
     *          default: ''
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

    app.post('/api/operator/gates/:gateId/offlineTraffics/grid', operatorController().offlineTrafficsGrid);



    /** DELETE Methods */
    /**
     * @openapi
     * '/api/operator/gates/{gateId}/cancelProcess':
     *  delete:
     *     tags:
     *     - Operator Panel
     *     summary: Delete gate by Id
     *     parameters:
     *      - name: gateId
     *        in: path
     *        description: The unique Id of the gate
     *        required: true
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

    app.delete('/api/operator/gates/:gateId/cancelProcess', operatorController().cancelProcess);

}