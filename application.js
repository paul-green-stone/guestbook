/* Requires all of the modules we need */
let http = require('http');
let path = require('path');
let express = require('express');
let logger = require('morgan');
let body_parser = require('body-parser');

/* ================================================================ */
/* ==================== NECESSARY PREPARATIONS ==================== */
/* ================================================================ */

/* Makes an Express app */
let application = express();
/* Creates a server */
let server = http.createServer(application);
let server_port = 3000;

/* Tell Epress that the views are in the 'views' folder */
application.set('views', path.resolve(__dirname, 'views'));
/* The views will use the EJS engine */
application.set('view engine', 'ejs');

/* Global array for entries */
var entries = [];
/* Make this entries array available in all views */
application.locals.entries = entries;

/* ================================================================ */
/* ========================== MIDDLEWARE ========================== */
/* ================================================================ */

/* Uses Morgan to log every request */
application.use(logger('dev'));
/* Populates a variable called request.body if the user is submitting a form */
application.use(body_parser.urlencoded({ extended: false }));

/* ================================================================ */
/* ============================ ROUTES ============================ */
/* ================================================================ */

/* When visiting the site root, renders the homepage */
application.get('/', (request, response) => {
    response.render('index');
});

/* Renders the 'new entry' page */
application.get('/new-enty', (request, response) => {
    response.render('new-entry');
});

/* Defines a route when you POST to the 'new-entry' route */
application.post('/new-entry', (request, response) => {

    if (!request.body.title || !request.body.body) {
        response.status(400).send('Entries must have a title and a body');
        return ;
    }

    /* Adds a new entry to the list of them */
    entries.push({
        title: request.body.title,
        content: request.body.body,
        published: new Date()
    });

    /* Redirects to the homepage to see the newly created entry */
    response.redirect('/');
});

/* Renders a 404 page 'cause you're requesting an unknown source */
application.use((request, response) => {
    response.status(404).render('not-found');
})

/* ================================================================ */
/* ====================== RUNNING THE SERVER ====================== */
/* ================================================================ */

server.listen(server_port, () => {
    console.log(`Guestbook application started on port ${server_port}.`);
});
