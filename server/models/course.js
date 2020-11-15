/**
 * For swagger data types refer to: https://swagger.io/docs/specification/data-models/data-types/
 * For swagger live editor visit: https://editor.swagger.io/?_ga=2.139478195.1827220927.1604945624-383726330.1604945624
 */


/**
 * @swagger
 *
 * components:
 *  schemas:
 *   Course:
 *     type: object
 *     required:
 *       - id
 *       - code
 *       - name
 *       - teacher_id
 *     properties:
 *       id:
 *         type: number
 *       code:
 *         type: string
 *         format: byte 
 *       name:
 *         type: string
 *         format: byte 
 *       teacher_id:
 *         type: number
 */


class Course{
    constructor(id,code,name,teacher_id){
            this.id = id;
            this.code = code;
            this.name = name;
            this.teacher_id = teacher_id;
    }
}
module.exports = Course;