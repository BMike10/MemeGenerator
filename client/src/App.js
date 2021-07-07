import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import API from './API';
import MyNavBar from './MyNavBar';
import { LoginForm } from './Login';
import { MemeList, CopyMemeModal } from './MemeList';
import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

//PROBLEMA1 : Perchè ogni volta non riesce una map o una filter di uno stato nonostante fossero questi sempre inizializzati?
//SOLUZIONE1 : Il problema nasce dal fatto che le proprietà passate agli stessi componenti sono differenti in molti casi, per cui 
//se alla prima MemeList non passo ad esempio i memeTemplate, quello non ha alcuna proprietà di quel tipo, e quando andrà a valutarla 
//si ritroverà un undefined. Per risolvere questo problema ci sono due soluzioni, o le proprietà vengono passate sempre ma modificandone il 
//contenuto, oppure si fa sempre un controllo per valutare se esiste quella proprietà -> Ho scelto la seconda

//PROBLEMA2 : Utilizzare un modale mantenendo la struttura a pagine, in modo da utilizzare ad esempio anche il passaggio di uno stato
//attraverso l'utilizzo dell'hook useLocation. La decisione è ricaduta sull'utilizzo di un nuovo componente a parte e di una nuova ruote che 
//lo rendirizza

//PROBLEMA3 : Come e cosa richiedere di reidratare? Al momento la decisione è ricaduta sull'intero meme, che viene gia costruito all'interno
//del db, per cui non è necessario andare ad utilizzare delle useEffect con il compito di scaricare le frasi perchè vengono presi in maniera
//diretta quando viene preso il meme. 
//Può essere un problema caricare tutto insieme? E consigliabile caricare poco alla volta?

//PROBLEMA4 : Al momento non c'è differenza tra un utente loggato e non al livello di richieste al db. In entrambi i casi richiedono tutti
//i meme disponibili, che vengono poi filtrati sul client a seconda che l'utente sia loggato o no. 
//Se si volesse evitare ciò si dovrebbe aggiornare la useEffect dei meme, in modo tale da valutare se l'utente è o non è loggato, 
//e a seconda dei casi, caricare solo quelli pubblici o tutti 


function App() {

  //Stato che mi permette di tenere conto del fatto che l'utente si sia loggato o no
  const [loggedIn, setLoggedIn] = useState(false);

  //Viene settato a true quando ci sono operazioni alla quale deve seguire una reidratazione dello stato meme
  const [dirtyMeme, setDirtyMeme] = useState(false);

  //Stato contenente i meme disponibili sulla pagina
  const [meme, setMeme] = useState([]);

  //Stato contenente i template dei meme disponibili sulla pagina da creare
  //La scelta è quella di avere dei font e dei colori disponibili per tutti e non per ogni tipo di meme per cui non è necessario
  //salvare questa info nel template, mentre va tenuta nei meme veri e propri
  const [memeTemplates, setMemeTemplates] = useState([]);

  //Mantiene l'utente corrente (Per mostrare i meme personali, cancellarli e crearli)
  const [currentUser, setCurrentUser] = useState(null);


  //Use Effect:

  //Scarico dal db i template delle immagini del sito
  useEffect(() => {
    const getTemplate = async () => {
      const template = await API.getAllMemeTemplate();
      setMemeTemplates(template);
      setDirtyMeme(true);
    };
    getTemplate()
      .catch(err => {
        //setMessage({ msg: "Impossible to load meme template! Please, try again later...", type: 'danger' });
        console.error(err);
      });
  }, [loggedIn]);

  //Scarico dal db i meme disponibili -> Ha senso una useEffect per i meme del creatore dal momento che comunque ho neccessità
  //di scaricarli tutti perchè li devo sempre visualizzare insieme?
  useEffect(() => {
    const getMeme = async () => {
      const meme = await API.getAllMeme();
      setMeme(meme);
      setDirtyMeme(false);
    };
    if (dirtyMeme || loggedIn) {
      getMeme().catch(err => {
        //setMessage({ msg: 'Impossible to load your exams! Please, try again later...', type: 'danger' });
        console.error(err);
      });
    }
  }, [dirtyMeme, loggedIn]);


  //Al momento si è deciso di lasciare al database il compito di scaricare contemporaneamente un meme completo, comprensivo 
  //di testi, per cui nessuna useEffect ha il compito di scaricare i testi singoli


  //Scarico le informazioni dell'utente loggato
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const user = await API.getUserInfo();
        console.log(user)
        setCurrentUser(user);
        setLoggedIn(true);
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  //Logica applicativa
  //Aggiunta di un nuovo meme
  const addMeme = (m) => {
    //Quando viene creato un meme, gli aggiungo una proprietà status che mi permetterà di tenerlo
    //sotto controllo sino a che non viene aggiutno al db. Potrei anche non aggiornare lo stato se non fosse per tenere conto
    //della nuova proprietà che ho aggiunto
    m.status = 'added';
    setMeme(oldMeme => [...oldMeme, m]);

    //Un meme è stato aggiunto, devo andare ad aggiornare il db.  Sfrutto tale
    //inserimento per ricaricare i meme disponibili settando dirty a true, in questo modo nella nuova ricarica avrò anche il meme che 
    //ho appena aggiunta al db
    //Attenzione il meme "state" è un oggetto completo, non accettato  dalla tabella. 
    //O si crea una post in grado di gestire l'aggiunta in due tabelle oppure si chiama sia la addMeme sia la
    //addSentence, come facciamo qui. Questo però comporta lo spacchettamento dell'oggetto(non posso farmelo dare
    //gia solo con i pezzi che mi servono perchè comunque vado a risettare lo stato in cui voglio il meme intero)
    const sentences = m.sentences.map(s => {
      return { text: s.text, sentencesTemplateId: s.sentencesTemplateId };
    });
    API.addMeme({
      title: m.title, img: m.img,
      font: m.font, color: m.color, visibility: m.visibility,
      creatorId: m.creator.id,
      templateId: m.templateId
    })
      .then((memeId) => {
        addSentences(sentences.map((s) => {
          return {
            ...s,
            memeId: memeId
          }
        }))
      })
      .then(() => setDirtyMeme(true))
      .catch(err => {
        //setErrorMsg("Impossible to upload sentences! Please, try again later...");
        console.error(err);
      });
  };

  //Aggiunta di frasi relativi ad un meme aggiunto (Viene chiamata in conseguenza alla aggiunta di un meme)
  const addSentences = (sentences) => {
    let promises = []
    for (let i = 0; i < sentences.length; i++) {
      const promise = API.addSentence(sentences[i]);
      promises.push(promise);
    }
    Promise.all(promises).then(
      () => {
        console.log("OK");
      }
    ).catch(err => {
      //setErrorMsg("Impossible to upload sentences! Please, try again later...");
      console.error(err);
    });
  };

  //Eliminazione di un meme
  const deleteMeme = (id, sentencesId) => {
    //Questo mi permetterà di vederlo ad esempio in rosso, non lo sto eliminando in realtà.Lo eliminerò direttamente dal db
    //e farò in modo che la useEffect ricarichi i meme, in questo modo il meme eliminato non ci sarà più
    //Se lo eliminassi non potrei più vedere lo status
    //Per il momento visto che non c'è ancora il server lo eliminiamo sul serio
    setMeme(oldMeme => {
      return oldMeme.map(meme => {
        if (meme.id === id)
          return { ...meme, status: 'deleted' };
        else
          return meme;
      });
    });
    //A questo punto avviene l'effettiva eliminazione dal db. Cambio il valore del dirty cosi da ricaricare
    API.deleteMeme(id)
      .then(() => deleteSentences(sentencesId))
      .then(() => setDirtyMeme(true))
      .catch(err => {
        //setErrorMsg("Impossible to upload sentences! Please, try again later...");
        console.error(err);
      });
  };

  //Rimozione di frasi relative ad un meme eliminato (Viene chiamata in conseguenza alla rimozione di un meme)
  const deleteSentences = (sentencesId) => {
    let promises = []
    for (let i = 0; i < sentencesId.length; i++) {
      const promise = API.deleteSentence(sentencesId[i]);
      promises.push(promise);
    }
    Promise.all(promises).then(
      () => {
        console.log("OK");
      }
    ).catch(err => {
      //setErrorMsg("Impossible to upload sentences! Please, try again later...");
      console.error(err);
    });
  };

  //Funzioni per il login e logout dell'utente
  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setCurrentUser(user);
      setLoggedIn(true);
      //setMessage({msg: `Welcome, ${user}!`, type: 'success'});
    } catch (err) {
      //setMessage({msg: err, type: 'danger'});
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setCurrentUser(null);
    // Non è necessario pulire perchè i meme li posso vedere anche se non sono loggato

  }


  return (
    <Router>
      <MyNavBar loggedIn={loggedIn} logout={doLogOut} />
      <Switch>
        {/*Route login. Non è la schemata di ingresso, ma viene visualizzata solo alla pressione del tasto login*/}
        <Route path="/login" render={() =>
          <>{loggedIn ? <Redirect to="/home" /> : <LoginForm login={doLogIn} />}</>
        } >
        </Route>
        {/*Route home visualizzatore -> Vengono visualizzate i meme già creati pubblici*/}
        <Route exact path='/' render={() =>
          <>{loggedIn ? <Redirect to="/home" /> :
          <Container fluid className="vh-100">
            <Row className="h-100">
              <Container fluid className="p-4">
                <h2 className="fs-1">All meme more funny is here! Enjoy with us</h2>
                <MemeList meme={meme.filter((m) => m.visibility === 1)} memeTemplates={memeTemplates}
                />
              </Container>
            </Row>
          </Container>
          }</>
        }>
        </Route>
        {/*Route home admin -> Vengono visualizzate i meme già creati(tutti) + i meme personali + possibilità di creazione/copia/eliminazione*/}
        <Route exact path='/home' render={() => <>
          {
            loggedIn ?
              <Container fluid className="vh-100">
                <Row className="h-100">
                  <Container fluid className="p-4">
                    <h2 className="fs-1">All meme more funny is here! Enjoy with us</h2>
                    <MemeList meme={meme} loggedIn={loggedIn} memeTemplates={memeTemplates}

                    />
                    <h2 className="fs-1">My funny meme!</h2>
                    <MemeList meme={meme.filter((m) => m.creator.id === currentUser.id).concat({
                      id: undefined, title: "Create new meme", img: "make-meme.jpg",
                      sentences: [], font: "font2", color: "",
                      visibility: 1, creator: { id: currentUser.id, username: currentUser.username }
                    })}
                      loggedIn={loggedIn}
                      memeTemplates={memeTemplates}
                      addMeme={addMeme}
                      deleteMeme={deleteMeme}    //Delete meme è passato solo da questa pagina e con questo componente,
                      // Tutti gli altri non avranno questa props(sarà undefined)
                      currentUser={currentUser}
                    />
                  </Container>
                </Row>
              </Container> : <Redirect to="/login" />
          }
        </>
        }>
        </Route>
        {/*Route home admin -> Viene visualizzata la lista di home ma con il modale aperto per la modifica del meme copiato
          Mi servo di una route perchè mi permette di passare lo stato dell'oggetto
          Potrebbe non essere necessario, dal momento che la schermata di home, non avendo la exact, rimanda li ogni volta che vede home
          nel path. L'idea sarebbe quella di non avere un nuovo modale ma lo stesso della creazione con un pò di modifiche, 
          ma la gestione del passaggio della location e della attivazione del modale diventa più complessa, perchè significa riusare lo stesso
          stato per lo show per entrambe le funzionalità
          */}

        <Route exact path='/home/copyMeme' render={() => <> {
          loggedIn ?
            <>
              <Container fluid className="vh-100">
                <Row className="h-100">
                  <Container fluid className="p-4">
                    <h2 className="fs-1">All meme more funny is here! Enjoy with us</h2>
                    <MemeList meme={meme} loggedIn={loggedIn} memeTemplates={memeTemplates}
                              path={"/"}
                    />
                    <h2 className="fs-1">My funny meme!</h2>
                    <MemeList meme={meme.filter((m) => m.creator.id === currentUser.id).concat({
                      id: undefined, title: "Create new meme", img: "make-meme.jpg",
                      sentences: [], font: "font2", color: "",
                      visibility: 1, creator: { id: currentUser.id, username: currentUser.username }
                    })}
                      loggedIn={loggedIn}
                      memeTemplates={memeTemplates}
                      addMeme={addMeme}
                      deleteMeme={deleteMeme}    //Delete meme è passato solo da questa pagina e con questo componente,
                      // Tutti gli altri non avranno questa props(sarà undefined)
                      currentUser={currentUser}
                      path={"/"}
                    />
                  </Container>
                </Row>
              </Container>
              <CopyMemeModal show={true} addMeme={addMeme} currentUser={currentUser}></CopyMemeModal>
            </> : <Redirect to="/login" />
        }
        </>
        }>
        </Route>
      </Switch>
    </Router >

  );
}

export default App;
