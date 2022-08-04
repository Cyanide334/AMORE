import React from 'react'
import MenuPaginatedGrid from './MenuPaginatedGrid';
import MenuHeader from './MenuHeader';
import { Container } from 'react-bootstrap';
import { useState } from 'react'

const Menu = () => {
  const [likedOnly, setLikedOnly] = useState(0)
  
  return (
    <>
    <Container className="mt-3" >        
        <MenuPaginatedGrid itemsPerPage={12} likedonly={likedOnly} loggedInUser/>
    </Container>
    </>
  )
}

export default Menu