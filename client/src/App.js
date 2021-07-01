import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyNavBar from './MyNavBar';
import { LoginForm, LogoutButton, LoginButton } from './Login';
import { MemeList, CopyMemeModal } from './MemeList';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';

//PROBLEMA1 : Perchè ogni volta non riesce una map o una filter di uno stato nonostante fossero questi sempre inizializzati?
//SOLUZIONE1 : Il problema nasce dal fatto che le proprietà passate agli stessi componenti sono differenti in molti casi, per cui 
//se alla prima MemeList non passo ad esempio i memeTemplate, quello non ha alcuna proprietà di quel tipo, e quando andrà a valutarla 
//si ritroverà un undefined. Per risolvere questo problema ci sono due soluzioni, o le proprietà vengono passate sempre ma modificandone il 
//contenuto, oppure si fa sempre un controllo per valutare se esiste quella proprietà -> Ho scelto la seconda

//PROBLEMA2 : Utilizzare un modale mantenendo la struttura a pagine, in modo da utilizzare ad esempio anche il passaggio di uno stato
//attraverso l'utilizzo dell'hook useLocation


function App() {

  const [loggedIn, setLoggedIn] = useState(true);


  //Stato contenente i meme disponibili sulla pagina
  const [meme, setMeme] = useState([
    {
      id: 1, title: "Meme1", img: "drake.png",
      sentences: [{ text: "Studiare tutta la settimana per poi consegnare e non cominciare di nuovo tutto da capo", position: "top_rigth_2texts" }, { text: "Studiare tutta la settimana per poi non consegnare e perdere tutto il lavoro", position: "bottom_right_2texts" }],
      font: "font2", color: "", visibility: 1, creator: { id: 1, username: "Michele" }, templateId: 1
    },
    {
      id: 2, title: "Meme2", img: "pacha-meme.jpg",
      sentences: [{ text: "Vieira: L'Italia non andrà avanti", position: "center_bottom" }], font: "font1", color: "", visibility: 1, creator: { id: 2, username: "Carlo" }, templateId: 2
    },
    {
      id: 3, title: "Meme3", img: "spongebob1.jpg",
      sentences: [{ text: "Ingegneri vs Ingegneri", position: "top_rigth_3texts" }, { text: "Ingegneri vs Architetti", position: "center_rigth_3texts" }, { text: "Ingegneri vs Gestionali", position: "bottom_rigth_3texts" }], font: "font2", color: "",
      visibility: 1, creator: { id: 2, username: "Carlo" }, templateId: 3
    },
  ]);

  //Stato contenente i template dei meme disponibili sulla pagina da creare
  //La scelta è quella di avere dei font e dei colori disponibili per tutti e non per ogni tipo di meme per cui non è necessario
  //salvare questa info nel template, mentre va tenuta nei meme veri e propri
  const [memeTemplates, setMemeTemplates] = useState([
    {
      id: 1, nome: "Drake", img: "drake.png",
      sentences: [{ text: "", position: "top_rigth_2texts" }, { text: "", position: "bottom_right_2texts" }]
    },
    {
      id: 2, nome: "Pacha", img: "pacha-meme.jpg",
      sentences: [{ text: "", position: "center_bottom" }]
    },
    {
      id: 3, nome: "Spongebob", img: "spongebob1.jpg",
      sentences: [{ text: "", position: "top_rigth_3texts" }, { text: "", position: "center_rigth_3texts" }, { text: "", position: "bottom_rigth_3texts" }]
    },
  ]);

  //Mantiene l'utente corrente (Per mostrare i meme personali, cancellarli e crearli)
  const [currentUser, setCurrentUser] = useState({ id: 2, name: "Carlo" });


  //Logica applicativa
  //Aggiunta di un nuovo meme
  const addMeme = (meme) => {
    //meme.status = 'added';
    setMeme((oldMeme) => [...oldMeme, meme]);

    // API.addTask(task)
    //   .then(() => setDirty(true))
  };

  //Eliminazione di un meme
  const deleteMeme = (id) => {
    setMeme(oldMeme => oldMeme.filter((m) => m.id !== id));
    //return oldMeme.map(meme => {
    //if (meme.id === id)
    //Questo mi permetterà di vederlo ad esempio in rosso, non lo sto eliminando in realtà. Lo eliminerò direttamente dal db 
    //e farò in modo che la useEffect ricarichi i meme, in questo modo il meme eliminato non ci sarà più
    // return { ...meme, status: 'deleted' };
    //Per il momento visto che non c'è ancora il server lo eliminiamo sul serio

    //else
    //return task;
    //});
    //});
    // API.deleteTask(id)
    //   .then(() => setDirty(true));
  };


  return (
    <Router>
      <MyNavBar />
      <Switch>
        {/*Route home visualizzatore -> Vengono visualizzate i meme già creati pubblici*/}
        <Route exact path='/' render={() =>
          <Container fluid className="vh-100">
            <Row className="h-100">
              <Container fluid className="p-4">
                <h2 className="fs-1">All meme more funny is here! Enjoy with us</h2>
                <MemeList meme={meme.filter((m) => m.visibility === 1)} />
              </Container>
            </Row>
          </Container>
        }>
        </Route>
        {/*Route home admin -> Vengono visualizzate i meme già creati(tutti) + i meme personali + possibilità di creazione/copia/eliminazione*/}
        <Route exact path='/home' render={() =>
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
                  visibility: 1, creator: { id: currentUser.id, name: currentUser.name }
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
          </Container>
        }>
        </Route>
        {/*Route home admin -> Viene visualizzata la lista di home ma con il modale aperto per la modifica del meme copiato
          Mi servo di una route perchè mi permette di passare lo stato dell'oggetto
          Potrebbe non essere necessario, dal momento che la schermata di home, non avendo la exact, rimanda li ogni volta che vede home
          nel path. L'idea sarebbe quella di non avere un nuovo modale ma lo stesso della creazione con un pò di modifiche, 
          ma la gestione del passaggio della location e della attivazione del modale diventa più complessa, perchè significa riusare lo stesso
          stato per lo show per entrambe le funzionalità
          */}

        <Route path='/home/copyMeme' render={() =>
          <>
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
                    visibility: 1, creator: { id: currentUser.id, name: currentUser.name }
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
            </Container>
            <CopyMemeModal show={true} addMeme={addMeme} currentUser={currentUser}
              addMeme={addMeme}></CopyMemeModal>
          </>
        }>
        </Route>
      </Switch>
    </Router >

  );
}

export default App;
