const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /lectures:
 *  get:
 *    tags:
 *      - lectures
 *    summary: "Get the list of all lectures"
 *    description: "Use to request all the lectures"
 *    consumes:
 *       - "application/json"
 *    produces:
 *       - "application/json"
 *    responses:
 *       "200":
 *         description: "Successful response"
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/components/schemas/Lecture"
 *       "400":
 *         description: "Invalid status value"
 *    security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 */


router.get('/lectures', (req, res) => {
  //lectureDao.getAllLectures...
    res.status(200).json([{id:2,course_id: "01SQNOV"}]);
});


/**
 * @swagger
 * /lectures:
 *  post:
 *      tags:
 *      - "lectures"
 *      summary: "Add a new lecture"
 *      description: ""
 *      operationId: ""
 *      consumes:
 *      - "application/json"
 *      - "application/xml"
 *      produces:
 *      - "application/xml"
 *      - "application/json"
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Lecture object that needs to be added to the db"
 *        required: true
 *        schema:
 *          $ref: "#/components/schemas/Lecture"
 *      responses:
 *        "405":
 *          description: "Invalid input"
 *      security:
 *      - petstore_auth:
 *        - "write:pets"
 *    
 */
router.post('/lectures', (req, res) => {
  //lectureDao.getAllLectures...
    res.status(200).json({id:1});
});

module.exports = router;