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
const PORT = 3001;

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



/*** APIs ***/
/*
Bozza possibili API:

GET:
GET /api/meme
GET /api/memeTemplate
GET /api/creator/:creatorId/meme
GET /api/sessions/current

??? GET /api/meme/myMeme
??? GET /api/memeTemplate/id

POST:
POST /api/meme -> Nuovo meme
POST /api/sentences -> Nuova frase

PUT:
I meme una volta pubblicati non possono essere modificati ma solo copiati, per cui non verrà mai inviato una richiesta di modifica
al server. Durante la copia infatti dovremo comunque aggiungere un nuovo elemento al db per cui sfrutteremo la Post

DELETE:
DELETE /api/meme/:id -> Elimina meme
DELETE /api/sentences/:id -> Elimina frase

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


//GET /api/memeTemplate
app.get('/api/memeTemplate', async (req, res) => {
  try {
    const memeTemplate = await meme_dao.listMemeTemplate();
    res.status(200).json(memeTemplate);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
})


//GET /api/creator/:creatorId/meme
app.get('/api/creator/:creatorId/meme', async (req, res) => {
  //VALIDATION REQUIRED
  try {
    const result = await meme_dao.getMemeByCreator(req.params.creatorId);
    if (result.error)
      res.status(404).json(result);
    else
      res.status(200).json(result);
  } catch (err) {
    res.status(500).end();
  }
})

//POST:

//POST /api/meme -> Nuovo meme
app.post('/api/meme', isLoggedIn, [
  check('visibility').isInt({ min: 0, max: 1 }),
  check('templateId').isInt({ min: 0 }),
  check('creatorId').isInt({ min: 0 }),
  check('title').isLength({ min: 1, max: 20 }),
], async (req, res) => {

    //Se qualche check non è andato a buon fine
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    //ToDo : VALIDAZIONE SU COLOR E FONT -> Compresi all'interno delle cassi predefinite

    const meme = {
      title: req.body.title,
      visibility: req.body.visibility,
      color: req.body.color,
      font: req.body.font,
      templateId: req.body.templateId,
      creatorId: req.body.creatorId
    };

    try {
      //req.body.creatorId dovrebbe già contenere l'utente che sta creando il meme, ma per evitare problematiche sfruttiamo
      //req.user.id che è invece 'utente corrente che gestiamo con passport
      const result = await meme_dao.createMeme(meme, req.user.id);
      //TimeOut per visualizzare i momenti di attesta attraverso uno stato 
      //setTimeout(() => res.status(201).end(), 2000);
      res.json(result);

    } catch (err) {
      res.status(503).json({ error: `Database error during creation of a meme.` });
    }

  })

  //POST /api/sentences -> Nuovo meme
app.post('/api/sentences', isLoggedIn, [
  check('memeId').isInt({ min: 0 }),
  check('sentencesTemplateId').isInt({ min: 0 }),
  check('text').isLength({ min: 0, max: 100 }),
], async (req, res) => {
    //da controllare anche che almeno uno dei tesi abbia almeno un testo
    
    //Se qualche check non è andato a buon fine
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const sentence = {
      text: req.body.text,
      memeId: req.body.memeId,
      sentencesTemplateId: req.body.sentencesTemplateId
    };

    try {
      await meme_dao.createSentence(sentence);
      //TimeOut per visualizzare i momenti di attesta attraverso uno stato 
      setTimeout(() => res.status(201).end(), 2000);

    } catch (err) {
      res.status(503).json({ error: `Database error during creation of a meme.` });
    }

  })


//DELETE

// DELETE /api/meme/:id
app.delete('/api/meme/:id',isLoggedIn ,param('id').isInt({ min: 1}), async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
  }
  try {
      await meme_dao.deleteMeme(req.params.id,req.user.id);
      res.status(204).end();

  } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of meme ${req.params.id}.` });
  }
});

// DELETE /api/sentences/:id
app.delete('/api/sentences/:id',isLoggedIn ,param('id').isInt({ min: 1}), async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
  }
  try {
      await meme_dao.deleteSentence(req.params.id);
      res.status(204).end();

  } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of meme ${req.params.id}.` });
  }
});


/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);

        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});


// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});


// Activate the server
app.listen(PORT, () => {
  console.log(`react-score-server listening at http://localhost:${PORT}`);
});