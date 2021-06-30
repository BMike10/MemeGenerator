import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState } from 'react';
import { Col, Row, Container, Card, Button, ListGroup, Modal, Form, Figure } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MemeList(props) {

  //Contiene il meme selezionato e che deve essere visualizzato
  const [currentMeme, setCurrentMeme] = useState({});
  const handleChangeMeme = (meme) => {
    setCurrentMeme(meme);
    setModalShowSelectedMeme(true);
  }

  //Visualizzazione del modale con l'immagine visualizzata
  const [modalShowSelectedMeme, setModalShowSelectedMeme] = useState(false);
  const handleModalSelectedMeme = (show) => {
    setModalShowSelectedMeme(show);
  }

  //Visualizzazione del modale per la creazione di un nuovo meme
  const [modalShowNewMeme, setModalShowNewMeme] = useState(false);
  const handleModalNewMeme = (show) => {
    setModalShowNewMeme(show);
  }



  return (
    <>
      {/* Il modale sarà visualizzato solo alla pressione del pulsante di un meme già esistente */}
      <MemeSelectedModal
        show={modalShowSelectedMeme}
        onHide={handleModalSelectedMeme}
        meme={currentMeme}
      />
      {/* Il modale sarà visualizzato solo alla pressione del pulsante per la creazione di un nuovo meme*/}
      <NewMemeModal
        show={modalShowNewMeme}
        onHide={handleModalNewMeme}
        meme={currentMeme}
        memeTemplates={props.memeTemplates}
      />
      <ListGroup horizontal={"sm"} className="d-flex flex-wrap mb-3">
        {

          props.meme.map((m, index) => {
            if (m.visibility) {
              return <ListGroup.Item key={index} className=" m-3">
                <MemeCard
                  meme={props.meme[index]}
                  handleChangeMeme={handleChangeMeme}
                  handleModalNewMeme={handleModalNewMeme}
                >
                </MemeCard  >
              </ListGroup.Item>
            } else return null
          })
        }

      </ListGroup>
    </>
  )
}


function MemeCard(props) {
  return <>
    <Card style={{ width: '26rem' }}>
      <Card.Img variant="top" src={props.meme.img} width={414} height={414} />
      <Card.Body>
        <Card.Title>{props.meme.title}</Card.Title>
        <Card.Text>
          Created by: {props.meme.creator.name}
        </Card.Text>
        {/*Bottone per la visualizzazione del modale con il meme -> Se l'id è undefined si tratta della card per la creazione di un nuovo meme*/}
        {props.meme.id ? <Button variant="primary" onClick={() => props.handleChangeMeme(props.meme)}>View Meme</Button>
          : <Button variant="primary" onClick={() => props.handleModalNewMeme(true)}>Create new Meme</Button>}
      </Card.Body>
    </Card>
  </>

}

function MemeSelectedModal(props) {
  return <Modal
    show={props.show}
    backdrop="static"
    keyboard={false}
    aria-labelledby="contained-modal-title-vcenter"
    size="lg"
    centered
  >
    <Modal.Header closeButton onClick={() => props.onHide(false)} >
      <Modal.Title>{props.meme.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group as={Row} controlId="formPlaintextCreator">
          <Form.Label column sm="2">
            CreatorName:
          </Form.Label>
          <Col sm="10">
            {props.meme.creator ? <Form.Control plaintext readOnly defaultValue={props.meme.creator.name} /> : null}
          </Col>
        </Form.Group>
      </Form>
      <Container>
        {props.meme.img && props.meme.sentences ?
          <>
            <figure className="position-relative memeContainer"
            >
              <img src={process.env.PUBLIC_URL + props.meme.img} alt={props.meme && props.meme.img.split(".").push()}
                className="img-fluid" >
              </img>
              {props.meme.sentences.map((s, index) => {
                return <figcaption className={s.position + " " + props.meme.font} key={index}>
                  {s.text}</figcaption>
              })}
            </figure>
          </>
          : null}

      </Container>
      <Form>
        {/*{props.sentences.map((s,index) => {
              <Form.Group as={Row} controlId='formPlaintextSentences${i}'>
                <Form.Label column sm="2">
                  Sentences n.{index}
                  (Cordinate x={s.x},y={s.y})
                </Form.Label>
                <Col sm="10">
                  <Form.Control plaintext readOnly defaultValue={s.text} />
                </Col>
              </Form.Group>
            })}
          */}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => props.onHide(false)}>
        Close
      </Button>
      <Button variant="primary">Save</Button>
    </Modal.Footer>
  </Modal>
}

function NewMemeModal(props) {

  //Contiene il template del meme selezionato. Il suo aggiornamento comporta la pulizia delle frasi compilate
  const [currentMemeTemplate, setCurrentMemeTemplate] = useState({});

  //Titolo del meme in fase di creazione. Viene salvato sul db solo all'atto di creazione effettiva
  const [title, setTitle] = useState("");

  //Contiene esclusivamente i testi dell'immagine selezionata che vengono compilati
  const [sentences, setSentences] = useState([]);

  //Gestione delle frasi. Vengono aggiornate quando inserisco testo. Vengono riazzerate quando viene cambiata base
  const handleSentences = (ev, i) => {
    console.log(ev.target.value, i, sentences[i])
    //Se trovo gia l'elemento iesimo devo aggiornarlo -> Vedo se è diversa solo da undefined perchè potrebbe anche essere una stringa
    //vuota nel caso in cui cancello tutto dal testo e non passerebbe un normale controllo sentences[i]?
    sentences[i]!==undefined ? setSentences(oldSentences => {
      //s-> singola frase, j indice della map
      return oldSentences.map((s, j) => {
        if (i === j) {
          //L'indice passato dalla map nel componente è uguale a quello che sto valutando ora, posso aggiornare
          return ev.target.value;
        } else return s;
      })
    }) : setSentences(oldSentences =>
      [
        ...oldSentences.slice(0, i),     // first half
        ev.target.value,                       // items to be inserted
        ...oldSentences.slice(i)         // second half
      ]
    );
    //altrimenti devo crearlo -> Per la gestione delle frasi di un templates, e quelle conservate in questo stato, è necessario che gli indici
    //delle rispettive frasi corrispondano, per cui è necessario aggiungere l'elemento alla stessa posizione del template
  }
  const handleChangeTemplate = (newTemplate) => {
    //Cambio il meme corrente con uquello selezionato
    setCurrentMemeTemplate(newTemplate);
    //Cambiando base, cambiano anche i testi
    setSentences([]);
  }

  return <Modal
    show={props.show}
    backdrop="static"
    keyboard={false}
    aria-labelledby="contained-modal-title-vcenter"
    size="lg"
    centered
  >
    <Modal.Header closeButton onClick={() => props.onHide(false)} >
      <Modal.Title>Creating new meme...</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group as={Row} controlId="formPlaintextCreator">
          <Form.Label column sm="2">
            Title:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Insert a title" value={title}
              onChange={(ev) => setTitle(ev.target.value)} />
          </Col>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Choose a template to start...</Form.Label>
          <Container>
            {props.memeTemplates && props.memeTemplates.map((mT, index) => {
              return <img width={50} height={50} key={index}
                src={process.env.PUBLIC_URL + mT.img} onClick={() => { handleChangeTemplate(mT) }}></img>
            })}
          </Container>


        </Form.Group>
        {
          currentMemeTemplate && currentMemeTemplate.sentences && sentences ?
            <>
              <figure className="position-relative memeContainer">
                <img className="img-fluid" src={currentMemeTemplate.img} ></img>
                {currentMemeTemplate.sentences.map((s, index) => {
                  return <figcaption className={s.position} key={index}>
                    {sentences[index]}</figcaption>
                  // Ricorda che l'associazione tra sentences[index] e currentMemeTemplate.s[index] è garantita
                  //al momento della creazione di sentences
                })}
              </figure>
              <Container fluid >
                {/* Per ognuno dei testi del template selezionato visualizzo il form */}
                {currentMemeTemplate.sentences.map((s, index) => {
                  return <Form.Group as={Row} controlId='formPlaintextSentences${i}'>
                    <Form.Label column sm="2">
                      Text n.{index}
                    </Form.Label>
                    <Col sm="10">
                      {/* Quando compilo un testo devo modificare lo stato delle sentences andando a settarlo come ciò che è stato scritto */}
                      <Form.Control value={sentences[index] ? sentences[index] : ""}
                        onChange={(ev) => handleSentences(ev, index)} />
                    </Col>
                  </Form.Group>
                })}
              </Container>
            </> : null
        }
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => props.onHide(false)}>
        Close
      </Button>
      <Button variant="primary">Save</Button>
    </Modal.Footer>
  </Modal>
}

export default MemeList;