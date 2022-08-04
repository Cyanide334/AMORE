import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap';
import getItemFromLocalStorage from '../../helpers';
import MenuCard from './MenuCard';

const MenuGrid = ({ data, isAdmin}) => {
  const [user, setUserLocal] = useState(false);
  const [orderingStatus, setOrderingStatus] = useState(false);
  useEffect(() => {
      let loggedInUser = getItemFromLocalStorage('user');
      setUserLocal(loggedInUser);
      try {
          axios
              .get('http://localhost:8080/orders/orderingStatus', {
                  headers: {
                      'x-access-token': loggedInUser.accessToken,
                  },
              })
              .then((response) => {
                  setOrderingStatus(response.data);
              });
      } catch (err) {
          console.log(err);
      }
  }, []);
  let group=[];
  let groupedData=[];
  data.map((element,idx)=>{
    if (idx%4!==3) {
      group.push(element);
    }else{
      group.push(element);
      groupedData.push(group);
      group = []
    }
  })
  if(group.length>0){
    groupedData.push(group);

  }
  console.log(groupedData)

  return (
    
      <Card className="mb-3 bg-transparent shadow-none">
        <Card.Body>
        <Container >
          {groupedData.map((element,idx) => {
            return( 
            <>
            <Row key={idx}>
              {
                element.map((data,idx)=>{
                  return (
                      <Col className='mt-4' md={6} lg={4} xl={3}>
                          <MenuCard
                              key={idx}
                              {...data}
                              isAdmin={isAdmin}
                              ordersEnabled={orderingStatus}
                          />
                      </Col>
                  );
                })
              }
            </Row>
            </>
            )
          })
        }
          
          
        </Container>
        </Card.Body>
      </Card>
    
  )
}

export default MenuGrid