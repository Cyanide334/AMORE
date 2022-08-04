import React from "react"
import {  Redirect } from "react-router-dom"

export default function PublicRoute({ children }) {
   const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
        return <Redirect to='/'/>
    }
      return (
    children
  )
}
