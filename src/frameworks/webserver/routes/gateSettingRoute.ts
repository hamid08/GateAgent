import gateSettingController from '../../../adapters/gateSettingController';
import { Express } from 'express';


export default async function routes(app: Express) {


    /** PUT Methods */
    /**
     * @openapi
     * '/api/gateSetting/basicConfig':
     *  put:
     *     tags:
     *     - Gate Setting
     *     summary: Modify a Basic Config
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - basicConfigType
     *              - value
     *            properties:
     *              basicConfigType:
     *                type: number
     *              value:
     *                type: string
     *     responses:
     *      200:
     *        description: Modified
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
    app.put('/api/gateSetting/basicConfig', gateSettingController().editBasicConfig);


    /** GET Methods
    * @openapi
    * '/api/gateSetting/basicConfig/test':
    *  get:
    *     tags:
    *     - Gate Setting
    *     summary: Test BasicConfig
    *     parameters:
    *      - name: basicConfigType
    *        in: query
    *        required: true
    *        schema:
    *          type: number
    *      - name: value
    *        in: query
    *        required: false
    *        schema:
    *          type: string
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

    app.get('/api/gateSetting/basicConfig/test', gateSettingController().testBasicConfig);



    /** GET Methods
        * @openapi
        * '/api/gateSetting/basicConfig':
        *  get:
        *     tags:
        *     - Gate Setting
        *     summary: Get basic Config
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

    app.get('/api/gateSetting/basicConfig', gateSettingController().getBasicConfig);




    /** GET Methods
     * @openapi
     * '/api/gateSetting/syncData':
     *  get:
     *     tags:
     *     - Gate Setting
     *     summary: Get List Updated
     *     parameters:
     *      - name: type
     *        in: query
     *        description: Type of List
     *        required: false
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

    app.get('/api/gateSetting/syncData', gateSettingController().getSyncData);


    /** GET Methods
        * @openapi
        * '/api/gateSetting/sendSyncDataRequest':
        *  get:
        *     tags:
        *     - Gate Setting
        *     summary: Send Sync Data Request
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

    app.get('/api/gateSetting/sendSyncDataRequest', gateSettingController().sendSyncDataRequest);


    /** POST Methods */
    /**
     * @openapi
     * '/api/gateSetting/gates':
     *  post:
     *     tags:
     *     - Gate Setting
     *     summary: Create a Gate
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - gateId
     *            properties:
     *              gateId:
     *                type: string
     *                default: '' 
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

    app.post('/api/gateSetting/gates', gateSettingController().addGateId);




    /** DELETE Methods */
    /**
     * @openapi
     * '/api/gateSetting/gates/{gateId}':
     *  delete:
     *     tags:
     *     - Gate Setting
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

    app.delete('/api/gateSetting/gates/:gateId', gateSettingController().removeGateId);



    /** GET Methods
   * @openapi
   * '/api/gateSetting/gates':
   *  get:
   *     tags:
   *     - Gate Setting
   *     summary: Get Gates
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

    app.get('/api/gateSetting/gates', gateSettingController().getSmartGates);


    /** GET Methods
       * @openapi
       * '/api/gateSetting/gates/{gateId}':
       *  get:
       *     tags:
       *     - Gate Setting
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

    app.get('/api/gateSetting/gates/:gateId', gateSettingController().getSmartGateById);



    /** POST Methods */
    /**
     * @openapi
     * '/api/gateSetting/gates/{gateId}/trafficGroups':
     *  post:
     *     tags:
     *     - Gate Setting
     *     summary: get Gate TrafficGroups By Id
     *     parameters:
     *      - name: gateId
     *        in: path
     *        description: The unique Id of the gate
     *        required: true
     *      - name: fromDate
     *        in: query
     *        description: Type of Date
     *        required: false
     *        schema:
     *          type: Date
     *          default: ''
     *      - name: toDate
     *        in: query
     *        description: Type of Date
     *        required: false
     *        schema:
     *          type: Date
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

    app.post('/api/gateSetting/gates/:gateId/trafficGroups', gateSettingController().getTrafficGroupsByGateId);



    /** POST Methods */
    /**
     * @openapi
     * '/api/gateSetting/gateServices':
     *  post:
     *     tags:
     *     - Gate Setting
     *     summary: Create a GateService
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - type
     *            properties:
     *              type:
     *                type: number
     *                default: '' 
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

    app.post('/api/gateSetting/gateServices', gateSettingController().addGateService);




    /** DELETE Methods */
    /**
     * @openapi
     * '/api/gateSetting/gateServices/{token}':
     *  delete:
     *     tags:
     *     - Gate Setting
     *     summary: Delete gateService by token
     *     parameters:
     *      - name: token
     *        in: path
     *        description: The unique token of the gateService
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

    app.delete('/api/gateSetting/gateServices/:token', gateSettingController().removeGateServiceByToken);



    /** GET Methods
    * @openapi
    * '/api/gateSetting/gateServices':
    *  get:
    *     tags:
    *     - Gate Setting
    *     summary: Get gateServices
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

    app.get('/api/gateSetting/gateServices', gateSettingController().getGateServices);

}