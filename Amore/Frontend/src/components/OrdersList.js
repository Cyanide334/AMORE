import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Card, Dropdown, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import getItemFromLocalStorage from './../helpers';


const getItems = async (limit, offset, user,statusFilter) => {
    let response = { data: { orders: [] } };
    
    let link = `http://localhost:8080/orders/?offset=${offset}&&limit=${limit}&&status=${statusFilter}`;
    if (user.accessToken) {
        try {
            response = await axios.get(link, {
                headers: { 'x-access-token': user.accessToken },
            });
        } catch (error) {
            console.error(error);
        }
    }
    return response.data.orders;
};

const getTotalItems = async (user) => {
    if (!user) {
        return 0;
    }
    let link = 'http://localhost:8080/orders/count';

    let response = await axios.get(link, {
        headers: { 'x-access-token': user.accessToken },
    });
    return response.data.count;
};

const Order = ({ _id, menuItems, date, status, price }) => {
    let statusColors = {
        Pending: 'danger',
        Completed: 'success',
        Processing: 'primary',
        'On Hold': 'secondary',
    };
            const user = getItemFromLocalStorage('user');

        const history=useHistory()
    const updateOrderStatus = (_id, status) => {
        const user = getItemFromLocalStorage('user');
        axios.put(
            'http://localhost:8080/orders/' + _id,
            { status },
            {
                headers: { 'x-access-token': user.accessToken },
            }
        );
history.go(0);

    };
    const deleteOrder = (_id) => {
        const user = getItemFromLocalStorage('user');
        axios.delete('http://localhost:8080/orders/' + _id, {
            headers: { 'x-access-token': user.accessToken },
        });
        history.go(0);


    };
    const placeOrder = () => {
        const user = getItemFromLocalStorage('user');

        let order = {
            menuItem: menuItems,
            status: 'Pending',
            date: Date.now(),
            user: user._id,
            price: price,
        };
        axios
            .post(
                'http://localhost:8080/orders/',
                { ...order },
                {
                    headers: { 'x-access-token': user.accessToken },
                }
            )
            .then((response) => {
                window.location.href = '/checkout/' + response.data._id;
            });
    };
    return (
        <tr className='btn-reveal-trigger'>
            <td className='order py-2 align-middle white-space-nowrap'>
                <a href={'/checkout/'+_id}>
                    {' '}
                    <strong>#{_id}</strong>
                </a>{' '}
            </td>
            <td className='order py-2 align-middle white-space-nowrap'>
                <strong>{user.name}</strong>
                <br />
            </td>
            <td className='order py-2 align-middle white-space-nowrap'>
                <a href={'mailto:' + user.email}>{user.email}</a>
            </td>
            <td className='order py-2 align-middle white-space-nowrap'>
                <Dropdown>
                    <Dropdown.Toggle
                        className='btn btn-light btn-sm'
                        id='dropdown-basic'
                    >
                        View Order
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <table className='table table-sm table-striped fs--1 mb-0'>
                            <thead className='bg-200 text-900'>
                                <tr>
                                    <th
                                        className='sort pe-1 align-middle white-space-nowrap'
                                        data-sort='order'
                                    >
                                        Name
                                    </th>
                                    <th
                                        className='sort pe-1 align-middle white-space-nowrap'
                                        data-sort='order'
                                    >
                                        Quantity
                                    </th>
                                </tr>
                            </thead>
                            {menuItems.map(({ item, count }, idx) => {
                                return (
                                    <tr
                                        key={idx}
                                        className='btn-reveal-trigger'
                                    >
                                        <td className='order py-2 align-middle white-space-nowrap'>
                                            <strong>{item.name}</strong>
                                        </td>
                                        <td className='order py-2 align-middle white-space-nowrap'>
                                            <strong>{count}</strong>
                                        </td>
                                    </tr>
                                );
                            })}
                            <tbody
                                className='list '
                                id='table-orders-body'
                            ></tbody>
                        </table>
                    </Dropdown.Menu>
                </Dropdown>
            </td>
            <td className='date py-2 align-middle white-space-nowrap'>
                {date.slice(0, 10)}
            </td>

            <td className='status py-2 align-middle text-center fs-0 white-space-nowrap'>
                <span
                    className={
                        'badge badge rounded-pill d-block badge-soft-' +
                        statusColors[status]
                    }
                >
                    {status}
                </span>
            </td>
            <td className='amount py-2 align-middle text-end fs-0 fw-medium'>
                PKR {price}
            </td>
            <td className='py-2 align-middle white-space-nowrap text-end'>
                <Dropdown>
                    <Dropdown.Toggle
                        className='btn btn-light btn-sm'
                        id='dropdown-basic'
                    >
                        <span className='fas fa-ellipsis-h '></span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            className='text-success'
                            onClick={() => placeOrder()}
                        >
                            Repeat Order
                        </Dropdown.Item>
                        <Dropdown.Divider />

                        <Dropdown.Item
                            onClick={() => updateOrderStatus(_id, 'Completed')}
                        >
                            Completed
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => updateOrderStatus(_id, 'Processing')}
                        >
                            Processing
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => updateOrderStatus(_id, 'Pending')}
                        >
                            Pending
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => updateOrderStatus(_id, 'On Hold')}
                        >
                            On Hold
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                            className='text-danger'
                            onClick={() => deleteOrder(_id)}
                        >
                            Delete
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </td>
        </tr>
    );
};

export const OrdersList = ({ itemsPerPage, statusFilter }) => {
    const [data, setCurrentItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [totalHits, setTotalHits] = useState(1);
    const [itemOffset, setItemOffset] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [user, setUser] = useState(false);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }
    }, []);
    useEffect(() => {
        const paginate = async () => {
            if (!hasMore || !user) {
                console.log('Not paginated');

                return;
            }
            console.log('paginated');
            // Fetch items from another resources.
            setTotalItems(await getTotalItems(user));

            const endOffset = itemOffset + itemsPerPage;
            let items = await getItems(
                itemsPerPage,
                itemOffset,
                user,
                statusFilter
            );
            console.log('Items retrieved');

            setCurrentItems([...data, ...items]);
        };

        paginate();
    }, [itemsPerPage, user, totalHits]);
    const fetchNextData = () => {
        const newOffset = totalHits * itemsPerPage;
        if (newOffset >= totalItems) {
            setHasMore(false);
        } else {
            setItemOffset(newOffset);
        }
        setTotalHits(totalHits + 1);
    };

    return (
        <Card className='my-3 h-100'>
            <Card.Header>
                <div className='row flex-between-center'>
                    <div className='col-4 col-sm-auto d-flex align-items-center pe-0'>
                        <h5 className=' mb-0 text-nowrap py-2 py-xl-0'>
                            Orders
                        </h5>
                    </div>
                </div>
            </Card.Header>
            <Card.Body className='p-0 h-100'>
                <div className='table-responsive scrollbar h-100'>
                    <InfiniteScroll
                        dataLength={data.length}
                        next={fetchNextData}
                        hasMore={hasMore}
                        loader={
                            <div className='row justify-content-center'>
                                <Spinner animation='border' variant='primary' />
                            </div>
                        }
                        height={1000}
                        endMessage={
                            <Card className='mb-3 shadow-lg text-center'>
                                <Card.Body>
                                    You have seen it all, now get back to work!
                                </Card.Body>
                            </Card>
                        }
                    >
                        <table className='table table-sm table-striped fs--1 mb-0'>
                            <thead className='bg-200 text-900'>
                                <tr>
                                    <th
                                        className='sort pe-1 align-middle white-space-nowrap'
                                        data-sort='order'
                                    >
                                        #
                                    </th>
                                    <th
                                        className='sort pe-1 align-middle white-space-nowrap'
                                        data-sort='address'
                                    >
                                        Customer
                                    </th>
                                    <th
                                        className='sort pe-1 align-middle white-space-nowrap'
                                        data-sort='order'
                                    >
                                        Email
                                    </th>
                                    <th
                                        className='sort pe-1 align-middle white-space-nowrap'
                                        data-sort='order'
                                    >
                                        Order
                                    </th>
                                    <th
                                        className='sort pe-1 align-middle white-space-nowrap pe-7'
                                        data-sort='date'
                                    >
                                        Date
                                    </th>

                                    <th
                                        className='sort pe-1 align-middle white-space-nowrap text-center'
                                        data-sort='status'
                                    >
                                        Status
                                    </th>
                                    <th
                                        className='sort pe-1 align-middle white-space-nowrap text-end'
                                        data-sort='amount'
                                    >
                                        Amount
                                    </th>
                                    <th className='no-sort'></th>
                                </tr>
                            </thead>
                            <tbody
                                className='list h-100'
                                id='table-orders-body'
                            >
                                {data.map((order, idx) => (
                                    <Order key={idx} {...order}></Order>
                                ))}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                </div>
            </Card.Body>
        </Card>
    );
};
