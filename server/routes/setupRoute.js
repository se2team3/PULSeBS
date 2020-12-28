const express = require('express');
const app = express.Router();
const setupService = require('../services/setupService');
const authorize = require('../services/authorizeService');
const role = require('../utils/roles');

//authorize should receive an array 
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