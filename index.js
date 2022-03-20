require('dotenv').config();
require('./mongo');

const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const express = require('express');
const app = express();
const cors = require('cors');
const User = require('./models/User');
const Note = require('./models/Note');

const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');
const usersRouter = require('./controllers/users');
const notesRouter = require('./controllers/notes');

app.use(cors());
app.use(express.json());
app.use('/images',express.static('images'));

Sentry.init({
  dsn: 'https://a72cfef8915a4ba4922914d19672c0de@o1167412.ingest.sentry.io/6258535',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/', (request, response) => {
  response.send('<h1>Hola Fco</h1>');
});

//ROUTER para arreglar el desorden
app.use('/api/users', usersRouter);
app.use('/api/notes', notesRouter);

app.use(notFound);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(handleErrors);

// const PORT = 3001;
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = {app,server};
// module.exports = {app};