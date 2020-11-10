const express = require('express');

const PORT = 3001;

const morgan = require("morgan");

//const booksRoute = require('./routes/books');
app = new express();

app.use(morgan('dev'));
app.use(express.json());

const swaggerOptions = require('./config/swaggerOptions');
const lectureRoute = require('./routes/lecturesRoute');

app.use('/api-docs',swaggerOptions);
app.use('/', lectureRoute);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));