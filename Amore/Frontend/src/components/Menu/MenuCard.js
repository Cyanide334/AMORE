import React, { useLayoutEffect } from 'react';
import { Button, Card, Col, Container, InputGroup, Row, Spinner } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useState,useEffect } from 'react';

import { useRef } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios'
import {  useHistory } from 'react-router-dom';

const MenuCard = ({
    _id,
    name,
    price,
    image,
    description,
    tags,
    isDeal,
    discount,
    likes,
  isAdmin, 
  ordersEnabled=false
}) => {
  let user = localStorage.getItem("user")
  let cart=JSON.parse(localStorage.getItem('cart'));
  user = JSON.parse(user)
  const [show, setShow] = useState(false);
  const [like, setLike] = useState(likes)
  const [liked, setLiked] = useState(user.likedMeals.includes(_id))
  const [loading, setLoading] = useState(false)
  
  let isCarted = false
  let inCart = 0
  if (cart) {
    for (let i = 0; i < cart.items.length; i++) {
      if (cart.items[i]?._id === _id) {
        isCarted = true
        inCart = cart.items[i].count
        break;
      }
    }
  }
  const [carted, setCarted] = useState(isCarted);
  const [cartCount, setCartCount] = useState(inCart);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const nameRef = useRef();
  const priceRef = useRef();
  const imageRef = useRef();
  const descriptionRef = useRef();
  const tagsRef = useRef();
  const dealRef = useRef();
  const discountRef = useRef();
  const history = useHistory();

  const handleAddToCart=()=>{
    
    const menuItem = {
        _id,
        name,
        price,
        image,
        description,
        tags,
        isDeal,
        discount,
        likes,
        count:1
    };
    let cart=JSON.parse(localStorage.getItem('cart'));
    if(!cart)
    localStorage.setItem('cart',JSON.stringify({items:[menuItem]}));
    else{
      if(!cart.items[0]){
          cart.items=[];
      }
      let newItem=true;
      for(let i=0;i<cart.items.length;i++){
        if(cart.items[i]?._id===menuItem._id){
          cart.items[i].count++;
          newItem=false;
          break;
        }
      }
      if(newItem){
        cart.items.push(menuItem);
        setCartCount(cartCount+1)

      }
      else {
        setCartCount(cartCount+1)
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      setCarted(true)
    }

  }
  const handleUnlike = async(e) => {
    let link = `http://localhost:8080/menuItems/unlike/${_id}`;
    setLike(like - 1)
    setLiked(false)
    let response
    try {      
      if (user) {     
        response = await axios.put(link,null, {
          headers: { 'x-access-token': user.accessToken },
        });
        if (response.status == 200) {
          user.likedMeals = response.data.likedMeals
          localStorage.setItem('user', JSON.stringify(user))
        }
      }
    } catch (error) {
        console.error(error);
    }
    e.preventDefault()
  }

  const handleLike = async(e) => {
    let link = `http://localhost:8080/menuItems/like/${_id}`;
    setLike(like + 1)
    setLiked(true)
    let response
    try {
      let user = localStorage.getItem("user")
      
      if (user) {
        user=JSON.parse(user)
        response = await axios.put(link,null, {
          headers: { 'x-access-token': user.accessToken },
        });
        if (response.status == 200) {
          user.likedMeals = response.data.likedMeals
          localStorage.setItem('user', JSON.stringify(user))
        }
      }
    } catch (error) {
        console.error(error);
    }
    e.preventDefault()
  }

  async function handleSubmit(e) {
    setLoading(true)
    let link = `http://localhost:8080/menuItems/${_id}`;
    let response
    try {
      let user = localStorage.getItem("user")
      
      if (user) {
        user = JSON.parse(user)
        let body = {
          name: nameRef.current.value != "" ? nameRef.current.value : name,
          price:priceRef.current.value != "" ? priceRef.current.value : price,
          image:imageRef.current.value != "" ? imageRef.current.value : image,
          description:descriptionRef.current.value != "" ? descriptionRef.current.value : description,
          tags:tagsRef.current.value != "" ? tagsRef.current.value : tags,
          isDeal: dealRef.current.checked == true ? true : false,
          discount:discountRef.current.value != "" ? discountRef.current.value : discount,
        }
        response = await axios.put(link,body, {
          headers: { 'x-access-token': user.accessToken }
        });
        
    }
    } catch (error) {
        console.error(error);
    }
    e.preventDefault() 
    handleClose()
    history.go(0)
  }
  const handleDelete = async(e) => {
    setLoading(true)
    let link = `http://localhost:8080/menuItems/${_id}`;
    let response
    try {
      let user = localStorage.getItem("user")
      
      if (user) {
        user = JSON.parse(user)
        
        response = await axios.delete(link, {
          headers: { 'x-access-token': user.accessToken }
        });
        cart.items=cart.items.filter(item=>item._id!==_id)
        
        localStorage.setItem('cart', JSON.stringify(cart));

      }
    } catch (error) {
        console.error(error);
    }
    setLoading(false)
    e.preventDefault() 
    history.go(0)
  }
    return (
        <>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>
              Edit Meal
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Form onSubmit={handleSubmit}>               
                <Form.Group id="meal-name">
                  <Form.Label>Meal Name</Form.Label>
                  <Form.Control 
                      type="text"
                      ref={nameRef}
                      placeholder={name}
                  />
                </Form.Group>
                <Form.Group id="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                      ref={priceRef}
                       placeholder={price}
                  />
                </Form.Group>
                <Form.Group id="image">
                  <Form.Label>Image Link</Form.Label>
                  <Form.Control
                    type="text"
                      ref={imageRef}
                       placeholder={image}
                  />
                </Form.Group>
                <Form.Group id="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                      ref={descriptionRef}
                       placeholder={description}
                    style={{ height: '100px' }}

                  />
                </Form.Group>
                <Form.Group id="tags">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                      ref={tagsRef}
                       placeholder={tags}
                  />
                  </Form.Group>
                <Form.Group id="discount">
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    type="number"
                      min="0"
                      max="100"
                      ref={discountRef}
                       placeholder={discount}
                  />
                </Form.Group>
                <Form.Group id="deal">
                  <Form.Label></Form.Label>

                  <Form.Check
                    type="checkbox"
                    id="deal"
                    label="Mark as deal"
                      ref={dealRef}
                      defaultChecked={isDeal}
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
        <Card className="shadow-xl menucard">
            <Card.Img variant="top" src={image} />
            {
                isDeal ? <span className="fs-xl-0 badge rounded-pill bg-danger position-absolute mt-2 me-2 z-index-2 top-0 end-0">Deal</span> : null
            }
            <Card.Body>     
                <div className="py-3">
              <h5 className="fs-0">{name}</h5>
              {discount!=0 &&
                  <h5 className="fs-md-0 text-warning mb-0 d-flex align-items-center"><s> PKR {Math.round(price)}</s></h5>     
              } 
              <h5 className="fs-md-2 text-warning mb-0 d-flex align-items-center"> PKR {Math.round(price-price*discount/100)}
                {discount>0 &&
                  <span className="fs-xl-0 badge rounded-pill bg-warning ms-auto">-{discount}%</span>
                }
              </h5>
                    
                    <p className="fs--1 mb-1">{description}</p>
                    <p className="fs--1 mb-1">{tags.split(',').map((element,idx) => {
                        return <span key={idx} className="badge rounded-pill bg-secondary me-1">{element}</span>;
                    })}
                    </p>
                </div>
            <div>
              
              {liked ? (
                <button className="btn btn-sm btn-falcon-default me-2 text-danger mt-xl-1" onClick={handleUnlike}>
                    <span className="fas fa-heart"></span>
                    <span className='text-danger ms-2'>{like}</span>
                </button>
              ): (
                  <button className="btn btn-sm btn-falcon-default me-2 mt-xl-1" onClick={handleLike}>
                    <span className="fas fa-heart"></span>
                    <span className='text-secondary ms-2'>{like}</span>
                </button>
              ) }
              
              {ordersEnabled ?
                (
                  <>
                    {carted ? (
                      <a className="btn btn-sm btn-falcon-default me-2 text-warning" onClick={handleAddToCart}>
                        <span className="fas fa-cart-plus"></span>
                        <span className='text-warning ms-2'>{cartCount}</span>
                      </a>
                    ) : (
                        <a className="btn btn-sm btn-falcon-default me-2" onClick={handleAddToCart}>
                          <span className="fas fa-cart-plus"></span>
                        </a>
                    )}
                      
                  </>
                ): ""
               } 
              {isAdmin &&
                <>
                        <button className="btn btn-sm btn-falcon-default me-2 mt-xl-1" onClick={handleShow} >
                            <span className="fas fa-pen"></span>
                        </button>
                       <button className="btn btn-sm btn-falcon-default mt-xl-1" onClick={handleDelete} >
                            <span className="fas fa-trash"></span>
                </button>
                </>
                    }
                </div>   
            </Card.Body>
            </Card>
        </>
    );
};

export default MenuCard;