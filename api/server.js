const express = require('express');
const session = require('express-session');

const knexSessionStore = require('connect-session-knex')(session);

const helmet = require('helmet');
const cors = require('cors');

const apiRouter = require('./api-router.js');
const configureMiddleware = require('./configure-middleware.js');

const server = express();

const sessionConfig = {
    name: 'monkey', // defaults to sid
    secret: 'keep it secret, keep it safe!',
    cookie: {
        maxAge: 1000 * 30,
        secure: false, // true in production
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true, // GDPR laws against setting cookies automatically

    store: new knexSessionStore({
        knex: require('../data/db-config'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
}

configureMiddleware(server);
server.use(session(sessionConfig));

server.use('/api', apiRouter);

module.exports = server;