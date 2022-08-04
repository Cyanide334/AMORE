import React, { useMemo } from "react"
import { Route, Redirect } from "react-router-dom"

export default function PrivateRoute({ children }) {
   let loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
        return <Redirect to='/login'/>
    }else{
      loggedInUser=JSON.parse(loggedInUser)
    }
    
    const childrenWithProps = React.Children.map(children, (child) => {
        // Checking isValidElement is the safe way and avoids a typescript
        // error too.
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { user:loggedInUser });
        }
        return child;
    });

      return <>{childrenWithProps}</>;
}
