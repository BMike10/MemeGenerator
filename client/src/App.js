import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyNavBar from './MyNavBar';
import MySideBar from './MySideBar';
import MemeList from './MemeList';
import { MyForm, MyNewForm, CompiledForm } from './MyForm';
import React, { useState, useEffect } from 'react';
import API from './API';
import { LoginForm, LoginButton, LogoutButton } from './MyLogin';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

function App() {

  //Stato contenente i meme disponibili sulla pagina
  const [meme, setMeme] = useState([{ id: 1, title: "Meme1", Image: "", sentences: ["sei scemo", "haha che ridere"], visibility: 0, creator: "Michele" },
  { id: 2, title: "Meme2", Image: "", sentences: ["sei scemo", "haha che ridere"], visibility: 0, creator: "Carlo" },
  { id: 3, title: "Meme3", Image: "", sentences: ["sei scemo", "haha che ridere"], visibility: 0, creator: "Gianni" }
  ]);


  return (
    <Router>
      <Container>
        <MyNavBar loggedIn={loggedIn} logout={doLogOut} />
        <Switch>
          {/*Route home visualizzatore -> Vengono visualizzate i meme già creati*/}
          <Route exact path='/' render={() =>
            <Container fluid className="p-1">
              <Row>
                <Container fluid className="p-4">
                  <h2 className="fs-1">All meme more funny is here! Enjoy with us</h2>
                  <MemeList meme={meme}/>
                </Container>
              </Row>
            </Container>
          }>
          </Route>
        </Switch>
      </Container>
    </Router >
  );
}

export default App;
