import React from 'react'

import { Card } from 'react-bootstrap'
import { useState } from 'react';
import { useEffect } from 'react';
import  axios  from 'axios';
import { useRef } from 'react';
import { Button } from 'react-bootstrap';
import getItemFromLocalStorage from '../helpers';
import { useHistory } from 'react-router-dom';

const Item = ({ _id,name,image, price,discount, count, setCount,removeItem }) => {
    const countRef =useRef();
    useEffect(()=>{
        countRef.current.value=count;
    })
    const updateCount= (increment)=>{
        countRef.current.value = parseInt(countRef.current.value)+increment;
        if (countRef.current.value>0) setCount(_id, countRef.current.value);
        else removeItem(_id);
    }

    return (
        <div className='row gx-card mx-0 align-items-center border-bottom border-200'>
            <div className='col-8 py-3'>
                <div className='d-flex align-items-center'>
                   
                        <img
                            className='img-fluid rounded-1 me-3 d-none d-md-block'
                            src={image}
                            alt=''
                            width='60'
                        />
                    <div className='flex-1'>
                        <h5 className='fs-0'>
                           
                                {name}
                        </h5>
                        <div className='fs--2 fs-md--1'>
                            <a
                                className='text-danger'
                                href='#!'
                                onClick={() => removeItem(_id)}
                            >
                                Remove
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-4 py-3'>
                <div className='row align-items-center'>
                    <div className='col-md-8 d-flex justify-content-end justify-content-md-center order-1 order-md-0'>
                        <div>
                            <div
                                className='input-group input-group-sm flex-nowrap'
                                data-quantity='data-quantity'
                            >
                                <button
                                    className='btn btn-sm btn-outline-secondary border-300 px-2'
                                    data-type='minus'
                                    onClick={() => updateCount(-1)}
                                >
                                    -
                                </button>
                                <input
                                    className='form-control text-center px-2 input-spin-none'
                                    type='number'
                                    min='1'
                                    ref={countRef}
                                    aria-label='Amount (to the nearest rupee)'
                                    style={{ width: '50px' }}
                                />
                                <button
                                    className='btn btn-sm btn-outline-secondary border-300 px-2'
                                    data-type='plus'
                                    onClick={() => updateCount(1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 text-end ps-0 order-0 order-md-1 mb-2 mb-md-0 text-600'>
                        PKR{' '}
                        {Math.round(
                            parseInt(price) -
                                (parseInt(price) * discount) / 100
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ShoppingCart = ({user}) => {
    const [data,setData]=useState([]);
    useEffect(()=>{
        let cart = getItemFromLocalStorage('cart');
        console.log(cart)
        if (cart) {

            cart.items[0] && setData(cart.items);
        }
    },[])
    const setCount=(_id,count)=>{
        let cart = getItemFromLocalStorage('cart');

        if (cart) {
            for (let i = 0; i < cart.items.length; i++) {
                if (cart.items[i]._id === _id) {
                    cart.items[i].count = count;
                    break;
                }
            }
            setData(cart.items);

            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    const removeItem = (_id) => {
        let cart = getItemFromLocalStorage('cart');
        if (cart) {

                cart.items=cart.items.filter(item=>item._id!==_id)
                setData(cart.items);
                localStorage.setItem('cart', JSON.stringify(cart));
        }
    };
    const placeOrder= ()=>{
        let menuItems= data.map((item)=>{
            return {item:item._id,count:item.count};
        })
        let price = data.reduce(
            (x, item) =>
                x +
                Math.round(
                    parseInt(item.price) -
                        (parseInt(item.price) * item.discount) / 100
                ) *
                    parseInt(item.count),
            0
        );

        let order = {
            menuItem: menuItems,
            status: 'Pending',
            date: Date.now(),
            user: user._id,
            price:price
        ,
        };
        axios.post(
            'http://localhost:8080/orders/',
            { ...order },
            {
                headers: { 'x-access-token': user.accessToken }
            }
        ).then((response)=>{
           window.location.href="/checkout/"+response.data._id
        });
    }
    return (
        <Card className='mt-3'>
            <Card.Header>
                <div className='row justify-content-between'>
                    <div className='col-md-auto'>
                        <h5 className='mb-3 mb-md-0'>
                            Shopping Cart (
                            {data.reduce(
                                (x, item) => x + parseInt(item.count),
                                0
                            )}{' '}
                            Items)
                        </h5>{' '}
                        {/*use state here for n items */}
                    </div>
                    <div className='col-md-auto'>
                        <a
                            className='btn btn-sm btn-outline-secondary border-300 me-2'
                            href='/menu'
                        >
                            <span
                                className='fas fa-chevron-left me-1'
                                data-fa-transform='shrink-4'
                            ></span>
                            Continue Shopping
                        </a>
                        <a className='btn btn-sm btn-primary' href='/checkout'>
                            Checkout
                        </a>
                    </div>
                </div>
            </Card.Header>
            <Card.Body className='p-0'>
                <div className='row gx-card mx-0 bg-200 text-900 fs--1 fw-semi-bold'>
                    <div className='col-9 col-md-8 py-2'>Name</div>
                    <div className='col-3 col-md-4'>
                        <div className='row'>
                            <div className='col-md-8 py-2 d-none d-md-block text-center'>
                                Quantity
                            </div>
                            <div className='col-12 col-md-4 text-end py-2'>
                                Price
                            </div>
                        </div>
                    </div>
                </div>

                {data.map(
                    (item, index) =>
                        item && (
                            <Item
                                key={index}
                                {...item}
                                setCount={setCount}
                                removeItem={removeItem}
                            ></Item>
                        )
                )}

                <div className='row fw-bold gx-card mx-0'>
                    <div className='col-9 col-md-8 py-2 text-end text-900'>
                        Total
                    </div>
                    <div className='col px-0'>
                        <div className='row gx-card mx-0'>
                            <div className='col-md-8 py-2 d-none d-md-block text-center'>
                                {data.reduce(
                                    (x, item) => x + parseInt(item.count),
                                    0
                                )}{' '}
                                (Items)
                            </div>{' '}
                            {/*again use state here*/}
                            <div className='col-12 col-md-4 text-end py-2'>
                                PKR{' '}
                                {data.reduce(
                                    (x, item) =>
                                        x +
                                        Math.round(
                                            parseInt(item.price) -
                                                (parseInt(item.price) *
                                                    item.discount) /
                                                    100
                                        ) *
                                            parseInt(item.count),
                                    0
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card.Body>

            <Card.Footer className='bg-light d-flex justify-content-end'>
                <Button className='btn btn-sm btn-primary' onClick={placeOrder}>
                    Checkout
                </Button>
            </Card.Footer>
        </Card>
    );
}
