/**
 * For swagger data types refer to: https://swagger.io/docs/specification/data-models/data-types/
 * For swagger live editor visit: https://editor.swagger.io/?_ga=2.139478195.1827220927.1604945624-383726330.1604945624
 */


/**
 * @swagger
 *
 * components:
 *  schemas:
 *   Room:
 *     type: object
 *     required:
 *       - id
 *       - name
 *       - seats
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 *         format: byte 
 *       seats:
 *         type: number
 */

class Room{
    constructor(id,name,seats){
            this.id = id;
            this.name = name;
            this.seats = seats;
    }
}
module.exports = Room;