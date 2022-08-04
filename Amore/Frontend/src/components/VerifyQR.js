import React, { useRef } from "react";
import { QrReader } from "react-qr-reader";
import QRCode from "react-qr-code";
import { useState } from "react";
import { Alert, Card } from "react-bootstrap";
import  axios  from 'axios';
import getItemFromLocalStorage from "../helpers";
import {CheckoutInvoice} from './Checkout';
import ReactToPdf from 'react-to-pdf';
const VerifyQR = ({user}) => {
  const [data, setData] = useState("No result");
  const [verified, setVerified] = useState(false);
  const [order,setOrder]=useState(false);
  const invoiceRef = useRef();

  const verifyQR = (value)=>{
  const user = getItemFromLocalStorage('user');
    axios
    .get(`http://localhost:8080/orders/${value}`, {
        headers: { 'x-access-token': user.accessToken },
    })
    .then((response) => {
        console.log(response.data)
       
          setOrder(response.data);
          setVerified(true);

          updateOrderStatus(data,"Completed");
       
    }).catch((err)=>{
        
    });
  }
  const updateOrderStatus = (_id, status) => {
        const user = getItemFromLocalStorage('user');
        axios.put(
            'http://localhost:8080/orders/' + _id,
            { status },
            {
                headers: { 'x-access-token': user.accessToken },
            }
        );
      };
  return (
      <Card className='mt-3'>
          <Card.Body className='text-center'>
              <QrReader
                  onResult={(result, error) => {
                      if (!!result) {
                          setData(result?.text);
                          verifyQR(result.text);
                      }

                      if (!!error) {
                          console.info(error);
                      }
                  }}
                  style={{ width: '100%' }}
              />
              {verified ? (
                  <>
                      <Alert variant='success'>
                          <Alert.Heading>Verified</Alert.Heading>
                          <p>well i'll be damned, you're not lying.</p>
                          <hr />
                          <p className='mb-0'>Order ID: {data}</p>
                      </Alert>
                      <ReactToPdf
                          filename={"verified"+order._id + '.pdf'}
                          targetRef={invoiceRef}
                          options={{
                              orientation: 'landscape',
                          }}
                      >
                          {({ toPdf }) => (
                              <button
                                  className='btn btn-falcon-default btn-sm me-1 mb-2 mb-sm-0'
                                  type='button'
                                  onClick={toPdf}
                              >
                                  <span className='fas fa-arrow-down me-1'>
                                      {' '}
                                  </span>
                                  Download (.pdf)
                              </button>
                          )}
                      </ReactToPdf>
                      <div ref={invoiceRef}>
                          <CheckoutInvoice order={order} verified />
                      </div>
                  </>
              ) : (
                  <Alert variant='danger'>
                      <Alert.Heading>Failure</Alert.Heading>
                      <p>not this time, shenk.</p>
                  </Alert>
              )}
          </Card.Body>
      </Card>
  );
};

export default VerifyQR;
