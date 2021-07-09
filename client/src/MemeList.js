import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState } from 'react';
import { Col, Row, Container, Card, Button, ListGroup, Modal, Form, Alert } from 'react-bootstrap';
import { Link, useLocation, useHistory } from 'react-router-dom';

function MemeList(props) {

  //Permette di salvare uno stato da usare quando sto copiando un meme
  const location = useLocation();


  //Contiene il meme selezionato e che deve essere visualizzato
  const [currentMeme, setCurrentMeme] = useState(location.state ? location.state.currentMeme : {});
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

  //Visualizzazione del modale per la copia di un meme -> Non usato
  //const [modalShowCopyMeme, setModalShowCopyMeme] = useState(location.state ? location.state.modalShowNewMeme : false);
  //const handleModalCopyMeme = (show) => {
  //  setModalShowCopyMeme(show);
  //}


  return (
    <>
      {/* Il modale sarà visualizzato solo alla pressione del pulsante di un meme già esistente */}
      <MemeSelectedModal
        show={modalShowSelectedMeme}
        onHide={handleModalSelectedMeme}
        meme={currentMeme}
        memeTemplate={props.memeTemplates ? props.memeTemplates.filter((mt) => mt.id === currentMeme.templateId)[0] : undefined}
      />
      {/* Il modale sarà visualizzato solo alla pressione del pulsante per la creazione di un nuovo meme*/}
      <NewMemeModal
        show={modalShowNewMeme}
        onHide={handleModalNewMeme}
        meme={currentMeme}
        memeTemplates={props.memeTemplates ? props.memeTemplates : undefined}
        addMeme={props.addMeme}
        currentUser={props.currentUser}
      />
      <ListGroup horizontal={"sm"} className="d-flex flex-wrap mb-3">
        {

          props.meme.map((m, index) => {
            return <ListGroup.Item key={index} className=" m-3">
              <MemeCard
                path={props.path}
                meme={props.meme[index]}
                memeTemplate={props.memeTemplates ? props.memeTemplates.filter((mt) => mt.id === m.templateId)[0] : undefined}
                handleChangeMeme={handleChangeMeme}
                handleModalNewMeme={handleModalNewMeme}
                deleteMeme={props.deleteMeme}
                loggedIn={props.loggedIn}
              >
              </MemeCard  >
            </ListGroup.Item>
          })
        }

      </ListGroup>
    </>
  )
}


function MemeCard(props) {

  //Logica per la visione della card a seconda del proprio status. Ci deve essere anche un caso di default
  //perchè non sempre la proprietà è presente
  let statusClass = null
  switch (props.meme.status) {
    case 'added':
      statusClass = 'success';
      break;
    case 'deleted':
      statusClass = 'danger';
      break;
    default:
      statusClass = "primary"
      break;
  }

  return <>
    <Card style={{ width: '26rem' }} bg={statusClass}>  
      <Card.Img variant="top" 
      src={ props.path? (props.meme.id? "/" + props.memeTemplate.img : "/" + props.meme.img) :
       (props.meme.id? props.memeTemplate.img : props.meme.img)} 
       width={414} height={414} />
      <Card.Body>
        <Card.Title>{props.meme.title}</Card.Title>
        <Card.Text>
          Created by: {props.meme.creator.username}
        </Card.Text>
        {/*Bottone per la copia del meme -> Se l'utente è loggato è un creator e da tale può copiare il meme*/}
        {props.loggedIn && props.meme.id ? <Link to={{
          pathname: "/home/copyMeme",
          state: {
            currentMeme: props.meme, modalShowCopyMeme: true, id: props.meme.id, title: props.meme.title, color: props.meme.color, font: props.meme.font, visibility: props.meme.visibility,
            sentences: props.meme.sentences.map((s) => {
              return s.text;
            }), currentMemeTemplate: props.memeTemplate
          }
        }}><Button variant="light">Copy the meme</Button>
        </Link> : null}
        {/*Bottone per la visualizzazione del modale con il meme -> Se l'id è undefined si tratta della card per la creazione di un nuovo meme*/}
        {props.meme.id ? <Button variant="light" onClick={() => props.handleChangeMeme(props.meme)}>View Meme</Button>
          : <Button variant="light" onClick={() => props.handleModalNewMeme(true)}>Create new Meme</Button>}
        {/* Se mi è stata inviata anche la props delete vuol dire che sono nel caso del creator e che voglio un ulteriore
        pulsante per l'eliminazione dei meme da me creati. Questo pulsante non deve comparire nel caso della carta di creazione 
        oovero quando l'id è undefined */}
        {props.deleteMeme && props.meme.id ? <Button variant="danger"
          onClick={() => props.deleteMeme(props.meme.id, props.meme.sentences.map((s) => {
            return s.id
          }))}>Delete Meme</Button> : null}
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
            {props.meme.creator ? <Form.Control plaintext readOnly defaultValue={props.meme.creator.username} /> : null}
          </Col>
        </Form.Group>
      </Form>
      <Container>
        {props.meme && props.meme.sentences && props.memeTemplate ?
          <>
            <figure className="position-relative memeContainer"
            >
              <img src={props.memeTemplate.img} alt={props.meme && props.memeTemplate.img.split(".").push()}
                className="img-fluid" >
              </img>
              {props.memeTemplate.sentences.map((s, index) => {
                return <figcaption className={s.position + " " + props.meme.font + " text-" +props.meme.color} key={index}>
                  {props.meme.sentences[index].text}</figcaption>
              })}
            </figure>
          </>
          : null}

      </Container>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => props.onHide(false)}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
}

function NewMemeModal(props) {

  //Contiene l'eventuale errore che non permette di effettuare il submit
  const [error, setError] = useState("");


  //Contiene la visibilità del meme: 0->Privato ; 1->Pubblico
  const [visibility, setVisibility] = useState(0);
  const handleVisibility = () => {
    setVisibility(oldVisibility => oldVisibility === 1 ? 0 : 1);
  }


  //Contiene il colore del meme in fase di creazione
  const [color, setColor] = useState("Black");
  const handleColor = (value) => {
    const newValue = value.split("-")[1];
    switch(value){
      case "Yellow":
        setColor("warning-Yellow");
        break;
      case "Red":
        setColor("danger-Red");
        break;
      case "White":
        setColor("light-White");
        break;
      case "Blue":
        setColor("primary-Blue");
        break;
      case "Light Blue":
        setColor("info-Light Blue");
        break;
      case "Green":
        setColor("success-Green");
        break;
      case "Violet":
        setColor("secondary-Violet");
        break;
      default:
        setColor("dark");
        break;
    }
  }
  //Contiene il font del meme in fase di creazione
  const [font, setFont] = useState("font1");


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
    sentences[i] !== undefined ? setSentences(oldSentences => {
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


  const handleSubmit = (event) => {
    event.preventDefault();

    //Variabile che mi permette di sapere se ho trovato errori
    var err = false;
    //VALIDAZIONE

    //Almeno un testo deve essere presente(controllo sia undefined sia vettore vuoto) +
    //+ Almeno un testo non deve essere vuoto + Ogni testo non deve superare tot caratteri
    if (sentences && sentences.length !== 0) {
      sentences.map((s) => {
        if (s.length > 100) {
          err = true;
          setError("You seem to have written too large text, please edit it");
        }
      })
    } else {
      //Vettore vuoto o indefinito
      setError("Please, write at least one text");
      err = true;
    }

    //Il titolo è obbligatorio + Titolo almeno 5 caratteri
    if (!title || title.length < 5) {
      err = true;
      setError("The title is mandatory and must contain at least 5 characters")
    } else if (title.length > 20) {
      err = true;
      setError("Title is too large, please edit it");
    }

    if (!err) {
      //NESSUNA VIOLAZIONE DI VINCOLO -> Creo nuovo meme e lo aggiungo a quelli disponibili -> L'Id sarà definito dal db
      const meme = {
        title: title, img: currentMemeTemplate.img,
        sentences: currentMemeTemplate.sentences.map((s, index) => {
          console.log("hey: " + index);
          return {
            sentencesTemplateId: s.id,
            text: sentences[index] ? sentences[index] : "",
            position: s.position
          }
        }),
        font: font, color: color.split("-")[0], visibility: visibility,
        creator: { id: props.currentUser.id, username: props.currentUser.username },
        //Viene passato lo user corrente per cui cambia il proprietario
        templateId: currentMemeTemplate.id,

      };

      //Aggiungo il nuovo meme alla lista dei tast
      console.log(meme);
      props.addMeme(meme);
      props.onHide(false);

      //Clean state -> Close of modal does not clean state automatically
      //Questo può essere fatto anche nel caso in cui non si fa il submit, ma può essere utile mantenere lo stato precedente in quel caso
      setColor("");
      setTitle("");
      setVisibility(0);
      setCurrentMemeTemplate({});
      setFont("");
      setSentences([]);
    }


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
        {error ? <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert> : false}
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
                src={mT.img} onClick={() => { handleChangeTemplate(mT) }}></img>
            })}
          </Container>


        </Form.Group>
        {
          currentMemeTemplate && currentMemeTemplate.sentences && sentences ?
            <>
              <figure className="position-relative memeContainer">
                <img className="img-fluid" src={currentMemeTemplate.img} ></img>
                {currentMemeTemplate.sentences.map((s, index) => {
                  return <figcaption className={s.position + " " + font + " text-" + color.split("-")[0]} key={index}>
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
        <Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Choose your favorite font?</Form.Label>
            <Form.Control as="select" value={font} onChange={(ev) => setFont(ev.target.value)}>
              <option>font1</option>
              <option>font2</option>
              <option>font3</option>
              <option>font4</option>
            </Form.Control>
          </Form.Group>
        </Form.Group>
        <Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect2">
            <Form.Label>Choose a color for the text?</Form.Label>
            <Form.Control as="select" value={ color.split("-")[1]} onChange={(ev) => handleColor(ev.target.value)}>
              <option>Black</option>
              <option>White</option>
              <option>Red</option>
              <option>Blue</option>
              <option>Light Blue</option>
              <option>Yellow</option>
              <option>Green</option>
              <option>Violet</option>
            </Form.Control>
          </Form.Group>
        </Form.Group>
        <Form.Group>
          <Form.Check

            type="checkbox"
            label="Click here if you want to make this meme public"
            value={visibility}
            checked={visibility}
            onChange={handleVisibility}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => props.onHide(false)}>
        Close
      </Button>
      <Button variant="primary" onClick={handleSubmit}>Publish</Button>
    </Modal.Footer>
  </Modal>
}

function CopyMemeModal(props) {

  //History serve per cambiare il path ma gestendo il tutto con una funzione, cosa che non mi permette di fare il link
  //Questo è utile sia nel caso del close button, così da sfruttarlo nel onClick, sia alla submit
  const history = useHistory();
  const routeChange = () => {
    let path = `/home`;
    history.push(path);
  }


  const location = useLocation();

  //Contiene l'eventuale errore che non permette di effettuare il submit
  const [error, setError] = useState("");


  //Contiene il meme copiato, mi serve sopratutto per l'informazione sul suo creatore
  const [currentMeme] = useState(location.state ? location.state.currentMeme : {});


  //Contiene la visibilità del meme: 0->Privato ; 1->Pubblico
  const [visibility, setVisibility] = useState(location.state ? location.state.visibility : 0);
  const handleVisibility = () => {
    setVisibility(oldVisibility => oldVisibility === 1 ? 0 : 1);
  }


  //Contiene il colore del meme in fase di creazione
  const [color, setColor] = useState(location.state ? location.state.color : "Black");
  const handleColor = (value) => {
    switch(value){
      case "Yellow":
        setColor("warning");
        break;
      case "Red":
        setColor("danger");
        break;
      case "White":
        setColor("light");
        break;
      case "Blue":
        setColor("primary");
        break;
      case "Light Blue":
        setColor("info");
        break;
      case "Green":
        setColor("success");
        break;
      case "Violet":
        setColor("secondary");
        break;
      default:
        setColor("dark");
        break;
    }
  }
  //Contiene il font del meme in fase di creazione
  const [font, setFont] = useState(location.state ? location.state.font : "font1");


  //Contiene il template del meme selezionato. Il suo aggiornamento comporta la pulizia delle frasi compilate
  const [currentMemeTemplate] = useState(location.state ? location.state.currentMemeTemplate : {});


  //Titolo del meme in fase di creazione. Viene salvato sul db solo all'atto di creazione effettiva
  const [title, setTitle] = useState(location.state ? location.state.title : "");


  //Contiene esclusivamente i testi dell'immagine selezionata che vengono compilati
  const [sentences, setSentences] = useState(location.state ? location.state.sentences : []);


  //Gestione delle frasi. Vengono aggiornate quando inserisco testo. Vengono riazzerate quando viene cambiata base
  const handleSentences = (ev, i) => {
    console.log(ev.target.value, i, sentences[i])
    //Se trovo gia l'elemento iesimo devo aggiornarlo -> Vedo se è diversa solo da undefined perchè potrebbe anche essere una stringa
    //vuota nel caso in cui cancello tutto dal testo e non passerebbe un normale controllo sentences[i]?
    sentences[i] !== undefined ? setSentences(oldSentences => {
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

  const handleSubmit = (event) => {
    event.preventDefault();

    //Variabile che mi permette di sapere se ho trovato errori
    var err = false;
    //VALIDAZIONE

    //Almeno un testo deve essere presente(controllo sia undefined sia vettore vuoto) +
    //+ Almeno un testo non deve essere vuoto + Ogni testo non deve superare tot caratteri
    if (sentences && sentences.length !== 0) {
      sentences.map((s) => {
        if (s.length > 100) {
          err = true;
          setError("You seem to have written too large text, please edit it");
        }
      })
    } else {
      //Vettore vuoto o indefinito
      setError("Please, write at least one text");
      err = true;
    }

    //Il titolo è obbligatorio + Titolo almeno 5 caratteri
    if (!title || title.length < 5) {
      err = true;
      setError("The title is mandatory and must contain at least 5 characters")
    } else if (title.length > 20) {
      err = true;
      setError("Title is too large, please edit it");
    }

    if (!err) {
      //NESSUNA VIOLAZIONE DI VINCOLO -> Creo nuovo meme e lo aggiungo a quelli disponibili -> L'Id sarà definito dal db
      const meme = {
        title: title, img: currentMemeTemplate.img,
        sentences: [currentMemeTemplate.sentences.map((s, index) => {
          return {
            sentencesTemplateId: s.id,
            text: sentences[index] ? sentences[index] : "",
            position: s.position
          }
        })],
        font: font, color:  color.split("-")[0], visibility: visibility,
        creator: { id: props.currentUser.id, username: props.currentUser.username },
        templateId: currentMemeTemplate.id
      };

      //Aggiungo il nuovo meme alla lista dei tast
      props.addMeme(meme);
      routeChange();
    }


  }

  return <Modal
    show={props.show}
    backdrop="static"
    keyboard={false}
    aria-labelledby="contained-modal-title-vcenter"
    size="lg"
    centered
  >
    <Modal.Header closeButton onClick={routeChange}>
      <Modal.Title>Copying a meme...</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        {error ? <Alert variant='danger' onClose={() => setError('')} dismissible>{error}</Alert> : false}
        <Form.Group as={Row} controlId="formPlaintextCreator">
          <Form.Label column sm="2">
            Title:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Insert a title" value={title}
              onChange={(ev) => setTitle(ev.target.value)} />
          </Col>
        </Form.Group>
        {
          currentMemeTemplate && currentMemeTemplate.sentences && sentences ?
            <>
              <figure className="position-relative memeContainer">
                <img className="img-fluid" src={"/" + currentMemeTemplate.img} ></img>
                {currentMemeTemplate.sentences.map((s, index) => {
                  return <figcaption className={s.position + " " + font + " text-" + color} key={index}>
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
        <Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Choose your favorite font?</Form.Label>
            <Form.Control as="select" value={font} onChange={(ev) => setFont(ev.target.value)}>
              <option>font1</option>
              <option>font2</option>
              <option>font3</option>
              <option>font4</option>
            </Form.Control>
          </Form.Group>
        </Form.Group>
        <Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect2">
            <Form.Label>Choose a color for the text?</Form.Label>
            <Form.Control as="select" value={color} onChange={(ev) => handleColor(ev.target.value)}>
              <option>Black</option>
              <option>White</option>
              <option>Red</option>
              <option>Blue</option>
              <option>Light Blue</option>
              <option>Yellow</option>
              <option>Green</option>
              <option>Violet</option>
            </Form.Control>
          </Form.Group>
        </Form.Group>
        <Form.Group>
          <Form.Check

            type="checkbox"
            label="Click here if you want to make this meme public"
            value={visibility}
            checked={visibility}
            onChange={handleVisibility}
            //Se il meme è porprio la visibilità può essere cambiata in ogni caso
            //Se il meme non è proprio, la visibilità può essere cambiato solo se è pubblico
            //Si noti che non posso usare lo stato visibility, altrimenti al momento che questo cambia è diventa privato non riesco
            //più a cambiarlo anche se all'inizio era pubblico
            disabled={props.currentUser.id === currentMeme.creator.id ||
              (location.state.currentMeme.visibility === 1 && props.currentUser.id !== currentMeme.creator.id) ? false : true}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Link to="/home"><Button variant="secondary" >Close</Button></Link>
      <Link to="/home"><Button variant="primary" onClick={handleSubmit}>Publish</Button></Link>
    </Modal.Footer>
  </Modal>
}


export { MemeList, CopyMemeModal };