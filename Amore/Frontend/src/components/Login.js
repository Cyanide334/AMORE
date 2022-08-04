import React, { useRef, useState } from "react";
import {  Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FacebookAuthProvider } from 'firebase/auth';

const fbprovider = new FacebookAuthProvider();
const provider = new GoogleAuthProvider();

export default function Login({setUser}) {
  

  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const auth=getAuth();
  const login = async ( email, password) => {
    console.log("login request Submitted")

    let response = await axios
          .post('http://localhost:8080/users/login', {
              email,
              password,
          })
          .catch((error) => {
            console.log(error.response.data)
            let err=<Alert variant="danger">{error.response.data}</Alert>;
             
              setError(err);
              return false;
          });
      if (response.status === 200) {
        
          setUser(response.data);
          console.log('LOGGED IN DATA', response.data)
          localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.status === 200;
  };
  function handleSubmit(e) {
      e.preventDefault();
      console.log("Submitted")
      setError(false);
      setLoading(true);

      login(
          emailRef.current.value,
          passwordRef.current.value
      ).then((success) => {
          if (success) {
              setLoading(false);
              window.location.assign("/")
          }
      });
      
      setLoading(false);
  }
  const signInWithGoogle = () => {
      signInWithPopup(auth, provider)
          .then((result) => {
              const user = result.user;
              login(
                  user.email,
                  user.uid
              ).then((success) => {
                  if (success) {
                    window.location.assign("/")

                  }
              });
          })
          .catch((error) => {
              console.log(error);
          });
  };
  const signInWithFb = () => {
      signInWithPopup(auth, fbprovider)
          .then((result) => {
              const user = result.user;
              login(
                  user.email,
                  user.uid
              ).then((success) => {
                  if (success) {
                     window.location.assign("/")
                  }
              });
          })
          .catch((error) => {
              console.log(error);
          });
  };
  return (
      <>
          <div className='container-fluid'>
              <div className='row min-vh-100 flex-center g-0'>
                  <div className='col-lg-8 col-xxl-6 py-3 position-relative'>
                      <img
                          className='bg-auth-circle-shape'
                          src='../../../assets/img/icons/spot-illustrations/bg-shape.png'
                          alt=''
                          width={250}
                      />
                      <img
                          className='bg-auth-circle-shape-2'
                          src='../../../assets/img/icons/spot-illustrations/shape-1.png'
                          alt=''
                          width={150}
                      />
                      <div className='card overflow-hidden z-index-1'>
                          <div className='card-body p-0'>
                              <div className='row g-0 h-100'>
                                  <div className='col-md-5 text-center bg-card-gradient'>
                                      <div className='position-relative p-4 pt-md-5 pb-md-7 light'>
                                          <div
                                              className='bg-holder bg-auth-card-shape'
                                              style={{
                                                  backgroundImage:
                                                      'url(../../../assets/img/icons/spot-illustrations/half-circle.png)',
                                              }}
                                          ></div>
                                          {/*/.bg-holder*/}
                                          <div className='z-index-1 position-relative'>
                                              <a
                                                  className='link-light mb-4 font-sans-serif fs-4 d-inline-block fw-bolder'
                                                  href='/'
                                              >
                                                  AMOS
                                              </a>
                                              <p className='opacity-75 text-light '>
                                                  Your favourite food a tap
                                                  away!
                                              </p>
                                          </div>
                                      </div>
                                      <div className='mt-3 mb-4 mt-md-4 mb-md-5 light'>
                                          <p className='text-white'>
                                              Don't have an account?
                                              <br />
                                              <a
                                                  className='btn btn-outline-light mt-2 px-4'
                                                  href='/signup '
                                              >
                                                  Sign Up!
                                              </a>
                                          </p>
                                          {/* <p className="mb-0 mt-4 mt-md-5 fs--1 fw-semi-bold text-white opacity-75">
                        Read our{" "}
                        <a
                          className="text-decoration-underline text-white"
                          href="#!"
                        >
                          terms and conditions 
                        </a>
                      </p> */}
                                      </div>
                                  </div>
                                  <div className='col-md-7 d-flex flex-center'>
                                      <div className='p-4 p-md-5 flex-grow-1'>
                                          <div className='row flex-between-center'>
                                              {error}
                                              <div className='col-auto'>
                                                  <h3>Account Login</h3>
                                              </div>
                                          </div>
                                          <form onSubmit={handleSubmit}>
                                              <div className='mb-3'>
                                                  <label
                                                      className='form-label'
                                                      htmlFor='card-email'
                                                  >
                                                      Email address
                                                  </label>
                                                  <input
                                                      className='form-control'
                                                      id='card-email'
                                                      type='email'
                                                      ref={emailRef}
                                                  />
                                              </div>
                                              <div className='mb-3'>
                                                  <div className='d-flex justify-content-between'>
                                                      <label
                                                          className='form-label'
                                                          htmlFor='card-password'
                                                      >
                                                          Password
                                                      </label>
                                                  </div>
                                                  <input
                                                      className='form-control'
                                                      id='card-password'
                                                      type='password'
                                                      ref={passwordRef}
                                                  />
                                              </div>
                                              <div className='row flex-between-center'>
                                                  <div className='col-auto'>
                                                      <div className='form-check mb-0'>
                                                          <input
                                                              className='form-check-input'
                                                              type='checkbox'
                                                              id='card-checkbox'
                                                              defaultChecked='checked'
                                                          />
                                                          <label
                                                              className='form-check-label mb-0'
                                                              htmlFor='card-checkbox'
                                                          >
                                                              Remember me
                                                          </label>
                                                      </div>
                                                  </div>
                                                  <div className='col-auto'>
                                                      <Link to='/forgot-password'>
                                                          Forgot Password?
                                                      </Link>
                                                  </div>
                                              </div>
                                              <div className='mb-3'>
                                                  <button
                                                      className='btn btn-primary d-block w-100 mt-3'
                                                      type='submit'
                                                      name='submit'
                                                  >
                                                      Log in
                                                  </button>
                                              </div>
                                          </form>
                                          <div className='position-relative mt-4'>
                                              <hr className='bg-300' />
                                              <div className='divider-content-center'>
                                                  or log in with
                                              </div>
                                          </div>
                                          <div className='row g-2 mt-2'>
                                              <div className='col-sm-6 mb-2'>
                                                  <a
                                                      className='btn btn-outline-google-plus btn-sm d-block w-100'
                                                      onClick={signInWithGoogle}
                                                  >
                                                      <i className='fa-google-plus-g fab'></i>
                                                      {/* <span class="fab fa-google-plus-g me-2" data-fa-transform="grow-8"></span> Font Awesome fontawesome.com */}{' '}
                                                      google
                                                  </a>
                                              </div>
                                              <div className='col-sm-6'>
                                                  <a
                                                      className='btn btn-outline-facebook btn-sm d-block w-100'
                                                      onClick={signInWithFb}
                                                  >
                                                      <i className='fa-facebook-square fab'></i>
                                                      {/* <span class="fab fa-facebook-square me-2" data-fa-transform="grow-8"></span> Font Awesome fontawesome.com */}{' '}
                                                      facebook
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </>
  );
}
