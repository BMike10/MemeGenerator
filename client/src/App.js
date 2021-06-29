import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyNavBar from './MyNavBar';
import { LoginForm, LogoutButton, LoginButton } from './Login';
import MemeList from './MemeList';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Meme from './Meme';

function App() {

  //Stato contenente i meme disponibili sulla pagina
  const [meme, setMeme] = useState([
    {
      id: 1, title: "Meme1", img: "drake.png",
      sentences: [{ text: "Studiare tutta la settimana per poi consegnare e non cominciare di nuovo tutto da capo", position: "top_rigth_2texts" }, { text: "Studiare tutta la settimana per poi non consegnare e perdere tutto il lavoro", position: "bottom_right_2texts" }],
      font: "font2", color: "", visibility: 1, creator: { id: 1, name: "Michele" }
    },
    {
      id: 2, title: "Meme2", img: "pacha-meme.jpg",
      sentences: [{ text: "Vieira: L'Italia non andrà avanti", position: "center_bottom" }], font: "font1", color: "", visibility: 1, creator: { id: 2, name: "Carlo" }
    },
    {
      id: 3, title: "Meme3", img: "spongebob1.jpg",
      sentences: [{ text: "Ingegneri vs Ingegneri", position: "top_rigth_3texts" }, { text: "Ingegneri vs Architetti", position: "center_rigth_3texts" }, { text: "Ingegneri vs Gestionali", position: "bottom_rigth_3texts" }], font: "font2", color: "",
      visibility: 1, creator: { id: 2, name: "Carlo" }
    },
  ]);

  //Stato contenente i template dei meme disponibili sulla pagina da creare
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

  return (
    <Router>
      <MyNavBar />
      <Switch>
        {/*Route home visualizzatore -> Vengono visualizzate i meme già creati*/}
        <Route exact path='/' render={() =>
          <Container fluid className="vh-100">
            <Row className="h-100">
              <Container fluid className="p-4">
                <h2 className="fs-1">All meme more funny is here! Enjoy with us</h2>
                <MemeList meme={meme} />
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
                <MemeList meme={meme} />
                <h2 className="fs-1">My funny meme!</h2>
                <MemeList meme={meme.filter((m) => m.creator.id === currentUser.id).concat({
                  id: undefined, title: "Create new meme", img: "make-meme.jpg",
                  sentences: [], font: "font2", color: "",
                  visibility: 1, creator: { id: currentUser.id, name: currentUser.name }
                })}
                  memeTemplates={memeTemplates}
                />
              </Container>
            </Row>
          </Container>
        }>
        </Route>
      </Switch>
    </Router >

  );
}

export default App;
