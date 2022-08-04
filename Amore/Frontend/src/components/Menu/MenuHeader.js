import React from 'react';
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useRef } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import getItemFromLocalStorage from './../../helpers';


const MenuHeader = ({itemOffset,itemsPerPage,totalItems,isAdmin}) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const nameRef = useRef();
  const priceRef = useRef();
  const imageRef = useRef();
  const descriptionRef = useRef();
  const tagsRef = useRef();
  const dealRef = useRef();
  const discountRef = useRef();
  const history=useHistory()
  async function handleSubmit(e) {
    setLoading(true)
    let link = `http://localhost:8080/menuItems/`;
    let response
    try {
      let user = localStorage.getItem("user")
      
      if (user) {
        user = JSON.parse(user)
        let body = {
          name: nameRef.current.value,
          price:priceRef.current.value ,
          image:imageRef.current.value,
          description:descriptionRef.current.value ,
          tags:tagsRef.current.value,
          isDeal: dealRef.current.checked == true ? true : false,
          discount:discountRef.current.value,
        }
        if (body.name == "" || body.price == null) {
          alert("Name and price of meal cannot be empty!")
          return
        }
        console.log(body)
        response = await axios.post(link, body,{
          headers: { 'x-access-token': user.accessToken }
        });
        console.log("response : ",response);
      }else{
        console.log("User not signed in!")
      }
    } catch (error) {
        console.error(error);
    }
    setLoading(false)
    e.preventDefault() 
    handleClose()
    history.go(0)
  }
  
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Meal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Form onSubmit={handleSubmit}>               
                <Form.Group id="meal-name">
                  <Form.Label>Meal Name</Form.Label>
                  <Form.Control
                    type="Meal Name"
                    ref={nameRef}
                    required
                    
                  />
                </Form.Group>
                <Form.Group id="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    ref={priceRef}
                    placeholder="PKR 69420"
                  />
                </Form.Group>
                <Form.Group id="image">
                  <Form.Label>Image Link</Form.Label>
                  <Form.Control
                    type="text"
                    ref={imageRef}
                    placeholder="Enter image link"
                  />
                </Form.Group>
                <Form.Group id="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    ref={descriptionRef}
                    placeholder="Enter description"
                    style={{ height: '100px' }}

                  />
                </Form.Group>
                <Form.Group id="description">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    ref={tagsRef}
                    placeholder="Enter comma separated tags"
                  />
                </Form.Group>
                <Form.Group id="discount">
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    type="number"
                      min="0"
                      max="100"
                      ref={discountRef}
                       placeholder="Add a discount percentage e.g 20"
                  />
                </Form.Group>
                <Form.Group id="deal">
                  <Form.Label></Form.Label>

                  <Form.Check
                    type="checkbox"
                    id="deal"
                    label="Mark as deal"
                    ref = {dealRef}
                  />

                </Form.Group>
              </Form>
            </Row>
            <Row className="justify-content-end mt-4">
                <Col sm={2}>
                  {loading && <Spinner animation="border" variant="primary" />}
                </Col>
              <Col sm={2}>
                <Button variant="secondary" onClick={handleClose}>
                  <i className="fas fa-window-close"></i>
                </Button>

              </Col>
              <Col sm={2}>
                <Button variant="primary" onClick={handleSubmit}>
                  <i className='fas fa-save'></i>
                </Button></Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <Card className="mb-3">
        <Card.Body>
          <div className="row flex-between-center">
            <div className="col-sm-auto mb-2 mb-sm-0">
              <h5>Menu</h5>
              <h6 className="mb-0 text-muted mt-2">
                Showing {1}-{totalItems<=(itemOffset + itemsPerPage)? totalItems : itemOffset + itemsPerPage} of {totalItems}
              </h6>
            </div>
            <div className="col-sm-auto">
              <div className="row gx-2 align-items-center">
                <div className="col-auto">
                 {getItemFromLocalStorage('user').isAdmin ? <Button onClick={handleShow}><i className='fas fa-plus'></i> Add More </Button>:null}
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default MenuHeader;