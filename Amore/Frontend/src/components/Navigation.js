import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Nav} from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import getItemFromLocalStorage from './../helpers';
const Navigation = ({ setUser}) => {
    const logout=()=>{
        setUser(null); 
        setLocalUser(null);
        localStorage.clear();
    }
    const [orderingStatus, setOrderingStatus] = useState(false);
    const [user,setLocalUser] = useState(getItemFromLocalStorage('user'))
    useEffect(() => {

        if (user) {
            try {
                axios
                    .get('http://localhost:8080/orders/orderingStatus', {
                        headers: {
                            'x-access-token': user.accessToken,
                        },
                    })
                    .then((response) => {
                    console.log("ORDERING STATUS: ",response.data)
                    setOrderingStatus(response.data);
                });
            } catch (err) {
                console.log(err)
            }
        }
},[])
  return (
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
          <Navbar.Brand href='/'>AMOS</Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav className='mr-auto'>
                  {user?.isAdmin ? (
                      <>
                          <Nav.Link href='/dashboard'>Admin Dashboard</Nav.Link>
                      </>
                  ) : null}
                  {user ? <Nav.Link href='/'>Menu</Nav.Link> : ''}
                  {orderingStatus && user ? (
                      <>
                          <Nav.Link href='/orders'>Orders</Nav.Link>
                          <Nav.Link href='/cart'>Cart</Nav.Link>
                          <Nav.Link href='/checkout'>Checkout</Nav.Link>
                      </>
                  ) : null}
                  {user ? (
                      <Nav.Link href='/verify'>Verify QR Code</Nav.Link>
                  ) : (
                      ''
                  )}
                  {user ? (
                      <Nav.Link href={'/profile/' + user?._id}>
                          Profile
                      </Nav.Link>
                  ) : (
                      ''
                  )}
              </Nav>
              <Nav className='ms-auto'>
                  {(!user) && (
                      <>
                          {' '}
                          <Nav.Link href='/login'>Login</Nav.Link>
                          <Nav.Link href='/signup'>Sign Up</Nav.Link>
                      </>
                  )}
                  {(user) && (
                      <>
                          <Nav.Link onClick={logout}>Logout</Nav.Link>
                      </>
                  )}
              </Nav>
          </Navbar.Collapse>
      </Navbar>
  );
}

export default Navigation