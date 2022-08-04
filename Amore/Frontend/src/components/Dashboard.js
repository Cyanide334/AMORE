import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, Dropdown, Form } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { Redirect } from "react-router-dom";
import Navigation from "./Navigation";
import axios  from 'axios';
import { OrdersList } from "./OrdersList";

const Order = ({ order }) => {
  return (
    <tr className="btn-reveal-trigger">
      <td className="order py-2 align-middle white-space-nowrap">
        <a href="#">
          {" "}
          <strong>#{order.ordernum}</strong>
        </a>{" "}
        
      </td>
      <td className="address py-2 align-middle white-space-nowrap">
        <strong>{order.customer}</strong>

      </td>
      <td className="address py-2 align-middle white-space-nowrap">
        <a href="mailto:ricky@example.com">{order.email}</a>
      </td>
      <td className="address py-2 align-middle white-space-nowrap">
        <strong>{order.name}</strong>

      </td>
      <td className="date py-2 align-middle white-space-nowrap">{order.date}</td>

      <td className="status py-2 align-middle text-center fs-0 white-space-nowrap">
        <span className="badge badge rounded-pill d-block badge-soft-success">
          {order.status}
          <span
            className="ms-1 fas fa-check"
            data-fa-transform="shrink-2"
          ></span>
        </span>
      </td>
      <td className="amount py-2 align-middle text-end fs-0 fw-medium">
        {order.price}
      </td>
      <td className="py-2 align-middle white-space-nowrap text-end">
        <Dropdown>
          <Dropdown.Toggle className="btn btn-light btn-sm" id="dropdown-basic">
            <span className="fas fa-ellipsis-h "></span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Completed</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Processing</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Pending</Dropdown.Item>
            <Dropdown.Item href="#/action-3">On Hold</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger" href="#/action-3">
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export const Dashboard = ({user}) => {
  const ordersRef=useRef();
  const [checked, setChecked] = useState(false)
  useEffect(() => {
      axios
          .get('http://localhost:8080/orders/orderingStatus', {
              headers: {
                  'x-access-token': user.accessToken,
              },
          })
          .then((response) => {
              ordersRef.current.checked = response.data;
              setChecked(response.data);
          });
  }, []);
  const toggleOrders=()=>{
    axios
        .get('http://localhost:8080/orders/toggleOrders', {
            headers: {
                'x-access-token': user.accessToken,
            },
        })
        .then((response) => {
            ordersRef.current.checked = response.data;
            setChecked(response.data);
        });
  }
  
  if(!user.isAdmin){
    return <Redirect to="/"/>
  }
  const orders = [
    {
      ordernum: "196",
      date: "26/04/2019",
      price: "$69",
      status: "completed",
      email: "ashley@example.com",
      name: "Meal 1",
      customer: "Ashley Kirlin"
    },
    {
      ordernum: "196",
      date: "26/04/2019",
      price: "$69",
      status: "completed",
      email: "ashley@example.com",
      name: "Meal 1",
customer: "Ashley Kirlin"
    },
    {
      ordernum: "196",
      date: "26/04/2019",
      price: "$69",
      status: "completed",
      email: "ashley@example.com",
      name: "Meal 1",
customer: "Ashley Kirlin"
    },
    {
      ordernum: "196",
      date: "26/04/2019",
      price: "$69",
      status: "completed",
      email: "ashley@example.com",
      name: "Meal 1",
customer: "Ashley Kirlin"
    },
  ];
  
  return (
      <>
          <Card className='my-3'>
              <Card.Header>
                  <h3>Greetings Admin </h3>
              </Card.Header>
              <Card.Header>
                  <h4>Website Settings </h4>
                  <h5>
                      <Form.Check
                          ref={ordersRef}
                          onChange={toggleOrders}
                          type='switch'
                          id='custom-switch'
                          label='Enable / Disable Orders'
                      />
                  </h5>
              </Card.Header>
          </Card>

          <OrdersList itemsPerPage={20} statusFilter={'Pending'}/>
      </>
  );
};
