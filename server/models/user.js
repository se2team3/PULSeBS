/**
 * For swagger data types refer to: https://swagger.io/docs/specification/data-models/data-types/
 * For swagger live editor visit: https://editor.swagger.io/?_ga=2.139478195.1827220927.1604945624-383726330.1604945624
 */


/**
 * @swagger
 *
 * components:
 *  schemas:
 *   User:
 *     type: object
 *     required:
 *       - id
 *       - university_id
 *       - email
 *       - hash
 *       - name
 *       - surname
 *       - role
 *     properties:
 *       id:
 *         type: number
 *       university_id:
 *         type: string
 *         format: byte 
 *       email:
 *         type: string
 *         format: email 
 *       hash:
 *         type: string
 *         format: byte
 *       name:
 *         type: string
 *         format: byte  
 *       surname:
 *         type: string
 *         format: byte  
 *       role:
 *         type: string
 *         format: byte  
 */

class User{
    constructor(id,university_id,email,hash,name,surname,role){
            this.id = id;
            this.university_id = university_id;
            this.email = email;
            this.hash = hash;
            this.name = name;
            this.surname = surname;
            this.role = role;
    }
}
module.exports = User;