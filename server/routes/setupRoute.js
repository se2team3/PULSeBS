const express = require('express');
const app = express.Router();
const setupService = require('../services/setupService');
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');

/**
 * @swagger
 * /setup:
 *  post:
 *    tags:
 *      - Support Officer
 *    summary: "Initializate the database"
 *    description: "Using CSV files the support officer can fill the database"
 *    requestBody:
 *      schema:
 *          type: object
 *          properties:
 *              teachers:
 *                  type: object
 *              students:
 *                  type: object
 *              courses:
 *                  type: object
 *              enrollment:
 *                  type: object 
 *              schedule:
 *                  type: object
 *    responses:
 *       "201":
 *         description: "Successful deletion"
 *         schema:
 *           type: "object"
 *       "304":
 *         description: "Nothing to delete"
 *         schema:
 *           type: "object"
 *       "400":
 *         description: "Invalid status value"
 *    security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 */

app.post('/setup', authorize([role.SupportOfficer]), async(req,res) =>{
  
    const dictionary = req.body;

    try{
        await setupService.setupInsert(dictionary);
        return res.status(201).json()
      
     } catch(error){
        console.log(error)
        res.status(400).json(error);
     }

})

module.exports = app;