'use strict';

const express = require('express');
const dayjs = require('dayjs');
const morgan = require('morgan'); // logging middleware
const { check, param, validationResult } = require('express-validator'); // validation middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions

const meme_dao = require('./meme_dao'); // module for accessing the DB
const users_dao = require('./users_dao'); // module for accessing the DB

// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());


/*** Set up Passport ***/

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    users_dao.getUser(username, password).then((user) => {
      console.log(user);
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  users_dao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


/*** APIs ***/
/*
Bozza possibili API:

GET:
GET /api/meme
GET /api/meme/:id
GET /api/memeTemplate
GET /api/sessions/current

??? GET /api/meme/myMeme
??? GET /api/memeTemplate/id

POST:
POST /api/meme -> Nuovo meme


PUT:
I meme una volta pubblicati non possono essere modificati ma solo copiati, per cui non verrà mai inviato una richiesta di modifica
al server. Durante la copia infatti dovremo comunque aggiungere un nuovo elemento al db per cui sfrutteremo la Post

DELETE:
DELETE /api/meme/:id -> Elimina meme

*/

//GET /api/meme
app.get('/api/meme', async (req, res) => {
  try {
    const meme = await meme_dao.listMeme();
    res.status(200).json(meme);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
})


//GET /api/meme/:id


//GET /api/memeTemplate