import React, { useRef } from 'react';
import { Card } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import ReactToPdf from 'react-to-pdf';
const Item = ({ item }) => {
    let count = item.count;
    item = item.item;

    return (
        <tr className='border-200'>
            <td className='align-middle'>
                <h6 className='mb-0 text-nowrap'>{item.name}</h6>
                <p className='mb-0'>{item.description}</p>
            </td>
            <td className='align-middle text-center'>{count}</td>
            <td className='align-middle text-end'>
                {Math.round(
                    parseInt(item.price) -
                        (parseInt(item.price) * item.discount) / 100
                )}
            </td>
            <td className='align-middle text-end'>
                PKR{' '}
                {parseInt(count) *
                    Math.round(
                        parseInt(item.price) -
                            (parseInt(item.price) * item.discount) / 100
                    )}
            </td>
        </tr>
    );
};

const InvoiceTable = (order) => {
    return (
        <div className='table-responsive scrollbar mt-4 fs--1'>
            <table className='table table-striped border-bottom'>
                <thead className='light'>
                    <tr className='bg-primary text-white dark__bg-1000'>
                        <th className='border-0'>Products</th>
                        <th className='border-0 text-center'>Quantity</th>
                        <th className='border-0 text-end'>Rate</th>
                        <th className='border-0 text-end'>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {order.menuItems.map((elem, idx) => (
                        <Item key={idx} item={elem}></Item>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const CheckoutInvoice = ({ order,verified }) => {
    return (
        <Card className='my-3'>
            <Card.Body>
                <div className='row align-items-center text-center mb-3'>
                    {!verified && <div className='col-sm-6 text-sm-start'>
                        <QRCode value={order._id} size={128} />
                    </div>}
                    <div className='col text-sm-end mt-3 mt-sm-0'>
                        <h2 className='mb-3'>{verified && "verified "}Invoice</h2>
                        <h5>A M O S</h5>
                        <p className='fs--1 mb-0'>
                            Sabzi Mandi
                            <br />
                            Tariq Road
                        </p>
                    </div>
                    <div className='col-12'>
                        <hr />
                    </div>
                </div>
                <div className='row align-items-center'>
                    <div className='col'>
                        <h6 className='text-500'>Invoice to</h6>
                        <h5>{order.user.name}</h5>
                        <p className='fs--1'>
                            <a href='mailto:example@gmail.com'>
                                {order.user.email}
                            </a>
                        </p>
                    </div>
                    <div className='col-sm-auto ms-auto'>
                        <div className='table-responsive'>
                            <table className='table table-sm table-borderless fs--1'>
                                <tbody>
                                    <tr>
                                        <th className='text-sm-end'>
                                            Order Number:
                                        </th>
                                        <td>{order._id}</td>
                                    </tr>
                                    <tr>
                                        <th className='text-sm-end'>
                                            Invoice Date:
                                        </th>
                                      <td>{!verified && order.date.slice(0, 10)} {verified && Date.now().toLocaleString()}</td>
                                    </tr>
                                  {!verified &&  <tr>
                                        <th className='text-sm-end'>
                                            Payment Due:
                                        </th>
                                        <td>Upon receipt</td>
                                    </tr>
                                    }
                                    <tr className='alert-success fw-bold'>
                                        <th className='text-sm-end'>
                                            Amount Due:
                                        </th>
                                        <td>PKR {order.price}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <InvoiceTable {...order} />

                <div className='row justify-content-end'>
                    <div className='col-auto'>
                        <table className='table table-sm table-borderless fs--1 text-end'>
                            <tr className=' fw-bolder text-900'>
                                <th>Amount Due:</th>
                                <td>PKR {order.price}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer className='bg-light'>
                <p className='fs--1 mb-0'>
                    <strong>Notes: </strong>We really appreciate your business
                    and if there’s anything else we can do, please let us know!
                    Coz i hate Webdev
                </p>
            </Card.Footer>
        </Card>
    );
};

export const Checkout = ({ user }) => {
    const params = useParams();
    const [order, setOrder] = useState(false);
    useEffect(() => {
        let id = params.id;
        axios
            .get(`http://localhost:8080/orders/${id}`, {
                headers: { 'x-access-token': user.accessToken },
            })
            .then(({ data }) => {
                setOrder(data);
            });
    }, []);
    const invoiceRef= useRef();
    return order ? (
        <>
            <Card className='mt-3'>
                <Card.Body>
                    <div className='row justify-content-between align-items-center'>
                        <div className='col-md'>
                            <h5 className='mb-2 mb-md-0'>Order #{order._id}</h5>
                        </div>
                        <div className='col-auto'>
                            <ReactToPdf
                                filename={order._id + '.pdf'}
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
                        </div>
                    </div>
                </Card.Body>
            </Card>
            <div ref={invoiceRef}>
                <CheckoutInvoice order={order} />
            </div>
        </>
    ) : null;
};
