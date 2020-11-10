const express = require('express');

const PORT = 3001;

const morgan = require("morgan");

//const booksRoute = require('./routes/books');
app = new express();

app.use(morgan('dev'));
app.use(express.json());


const swaggerUi = require('swagger-ui-express'),
    swaggerJsdoc = require("swagger-jsdoc");

const lectureRoute = require('./routes/lecturesRoute');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LogRocket Express API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3001/",
            },
        ],
    },
    apis: ["./routes/*.js","./models/*.js"],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs,{explorer: true}));
app.use('/',lectureRoute);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));