import React, { useEffect } from 'react';
import MenuGrid from './MenuGrid';
import MenuHeader from './MenuHeader'
import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component";

const getItems = async (limit, offset, user, likedOnly) => {
    let response = { data: { menuItems: [] } };
    let link = `http://localhost:8080/menuItems?offset=${offset}&&limit=${limit}`;
    if(user.accessToken){

    try {
        response = await axios.get(link, {
            headers: { 'x-access-token': user.accessToken },
        });
    } catch (error) {
        console.error(error);
    }
    }
    return response.data.menuItems;
};

const getTotalItems = async (user, likedOnly) => {
    if (!user) {
        return 0;
    }
    let link = 'http://localhost:8080/menuItems/count';
    
    let response = await axios.get(link, {
        headers: { 'x-access-token': user.accessToken },
    });
    return response.data.count;
};


const MenuPaginatedGrid = ({ itemsPerPage, likedOnly }) => {
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
            if(!hasMore){
                console.log('Not paginated');
                return;
            }
            console.log("paginated")
            // Fetch items from another resources.
            setTotalItems(await getTotalItems(user, likedOnly));
            
            const endOffset = itemOffset + itemsPerPage;
            let items = await getItems(
                itemsPerPage,
                itemOffset,
                user,
                likedOnly
            )
            console.log("Items retrieved")
            console.log(items)
            setCurrentItems([...data, ...items]);

        }

        paginate();
    }, [ itemsPerPage, user,totalHits]);
    const fetchNextData = () => {

        const newOffset = ((totalHits) * itemsPerPage);
        if (newOffset >= totalItems) {
            setHasMore(false)
        
        }

        else {
            setItemOffset(newOffset);
        }
        setTotalHits(totalHits + 1)
    };
    return (
        <>
            <MenuHeader
                itemOffset={itemOffset}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                isAdmin={user.isAdmin}
            />
            
            <Card className='mb-3 bg-transparent shadow-none'>
                <InfiniteScroll
                        dataLength={data.length}
                        next={fetchNextData}
                        hasMore={hasMore}
                        loader={
                            <div className=' d-flex justify-content-center'>
                            <Spinner animation='border' variant='primary' />
                            </div>
                        }
                        height={1000}
                        endMessage={
                            <Card className='mb-3 shadow-lg text-center'>
                                <Card.Body>
                                    You have seen it all, now order something to
                                    satisfy your tastebuds ^_^!
                                </Card.Body>
                            </Card>
                        }
            >
                <Card.Body>
                    
                        <MenuGrid data={data} isAdmin={user.isAdmin} />
                   
                    </Card.Body>
                    </InfiniteScroll>
                </Card>
            
        </>
    );
};

export default MenuPaginatedGrid;