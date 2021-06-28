import 'bootstrap/dist/css/bootstrap.min.css';
import { React } from 'react';
import { Col, Row, Container, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MemeList(props) {
  return (
    <>

      <ListGroup horizontal={"sm"} className="d-flex flex-wrap mb-3">
        {
          props.meme.map((m) => {
            return <ListGroup.Item key={m.id} className=" pt-3 pl-1 mb-4 list-group-item-primary">
              <MemeCard>
              </MemeCard >
            </ListGroup.Item>
          })
        }

      </ListGroup>
    </>
  )
}


function MemeCard(props) {
  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>{props.meme.title}</Card.Title>
          <Card.Text>
            Created by: {props.meme.creator}
          </Card.Text>
          <Button variant="primary">View Meme</Button>
        </Card.Body>
      </Card>
    </>
  )
}

export default MemeList;