const swaggerUi = require('swagger-ui-express'),
    swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PULSEBS Express API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
        },
        servers: [
            {
                url: "http://localhost:3001/api/",
            },
        ],
    },
    apis: ["./routes/*.js", "./models/*.js"],
};

const specs = swaggerJsdoc(options);
const swaggerSetup = [swaggerUi.serve,  swaggerUi.setup(specs, { explorer: true })];

module.exports = swaggerSetup;