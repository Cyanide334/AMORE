import React from 'react';
import Signup from './Signup';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Navigation from './Navigation';
import { OrdersList } from './OrdersList';
import { OrderDetails } from './OrderDetails';
import { Checkout } from './Checkout';
import Menu from './Menu/Menu';
import { ShoppingCart } from './ShoppingCart';
import Profile from './Profile/Profile';
import EditProfile from './Profile/EditProfile';
import VerifyQR from './VerifyQR';
import { useState, useEffect } from 'react';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

function App() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            const userSet = (foundUser) => setUser(foundUser);
            userSet(foundUser);
        }
        
    }, []);
    return (
        <>
            <Navigation isAdmin='true' user={user} setUser={setUser} />
            <Container
                className='d-flex  justify-content-center'
                style={{
                    minHeight: '100vh',
                    background: 'url(https://ibb.co/9qLcyMG)',
                }}
            >
                <div className='w-100'>
                    <Router>
                        <>
                            <Switch>
                                <Route
                                    exact
                                    path='/'
                                    render={(props) => (
                                        <PrivateRoute>
                                            <Menu />
                                        </PrivateRoute>
                                    )}
                                />
                                <Route
                                    exact
                                    path='/dashboard'
                                    render={(props) => (
                                        <PrivateRoute>
                                            <Dashboard />
                                        </PrivateRoute>
                                    )}
                                />
                                <Route
                                    exact
                                    path='/profile/:id'
                                    render={(props) => (
                                        <PrivateRoute>
                                            <Profile />
                                        </PrivateRoute>
                                    )}
                                />
                                <Route
                                    path='/edit/:id'
                                    render={(props) => (
                                        <PrivateRoute>
                                            <EditProfile setUser={setUser}/>
                                        </PrivateRoute>
                                    )}
                                />
                                <Route
                                    path='/signup'
                                    render={(props) => (
                                        <PublicRoute>
                                            <Signup setUser={setUser} />
                                        </PublicRoute>
                                    )}
                                />
                                <Route
                                    path='/login'
                                    render={(props) => (
                                        <PublicRoute>
                                            <Login user={user} setUser={setUser} />
                                        </PublicRoute>
                                    )}
                                />
                                <Route
                                    path='/forgot-password'
                                    render={(props) => (
                                        <PublicRoute>
                                            <ForgotPassword />
                                        </PublicRoute>
                                    )}
                                />
                                <Route
                                    path='/orders'
                                    render={(props) => (
                                        <PrivateRoute>
                                            <OrdersList itemsPerPage={20} />
                                        </PrivateRoute>
                                    )}
                                />
                                <Route
                                    path='/order'
                                    render={(props) => (
                                        <PrivateRoute>
                                            <OrderDetails />
                                        </PrivateRoute>
                                    )}
                                />
                                <Route
                                    path='/checkout/:id'
                                    render={(props) => (
                                        <PrivateRoute>
                                            <Checkout />
                                        </PrivateRoute>
                                    )}
                                />
                                <Route
                                    path='/cart'
                                    render={(props) => (
                                        <PrivateRoute>
                                            <ShoppingCart />
                                        </PrivateRoute>
                                    )}
                                />
                                <Route
                                    path='/menu'
                                    render={(props) => (
                                        <PrivateRoute>
                                            <Menu />
                                        </PrivateRoute>
                                    )}
                                />
                                <Route
                                    path='/verify'
                                    render={(props) => (
                                        <PrivateRoute>
                                            <VerifyQR />
                                        </PrivateRoute>
                                    )}
                                />
                            </Switch>
                        </>
                    </Router>
                </div>
            </Container>
        </>
    );
}

export default App;
