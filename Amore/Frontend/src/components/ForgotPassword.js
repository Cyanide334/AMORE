import axios from "axios";
import React, { useRef, useState } from "react";
import {Alert } from "react-bootstrap";

export default function ForgotPassword() {
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const emailRef =useRef();
  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      await sendEmail(emailRef.current.value);
    } catch(err) {
      console.log(err)
      setError("Failed to reset password")
    }

  }

  const sendEmail = async (email) => {
      if (email === '') {
                setError('');

      } else {
          try {
              const response = await axios.post(
                  'http://localhost:8080/users/forgotPassword',
                  {
                      email,
                  }
              );
              console.log(response.data);
              if (response.data === 'recovery email sent') {
              
                        setMessage('recovery email sent');

              }
          } catch (error) {
              console.error(error.response.data);
              if (error.response.data === 'email not in db') {
                        setError('email not in db');
              }
          }
      }
  };
  return (
      <>
          <div className='container-fluid'>
              <div className='row min-vh-100 flex-center g-0'>
                  <div className='col-lg-8 col-xxl-5 py-3 position-relative'>
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
                                                  href='../../../index.html'
                                              >
                                                  AMOS
                                              </a>
                                              <p className='opacity-75 text-white'>
                                                  Your favourite food a tap away
                                              </p>
                                          </div>
                                      </div>
                                      <div className='mt-3 mb-4 mt-md-4 mb-md-5 light'>
                                          <p className='mb-0 mt-4 mt-md-5 fs--1 fw-semi-bold text-white opacity-75'>
                                              Read our{' '}
                                              <a
                                                  className='text-decoration-underline text-white'
                                                  href='#!'
                                              >
                                                  terms
                                              </a>{' '}
                                              and{' '}
                                              <a
                                                  className='text-decoration-underline text-white'
                                                  href='#!'
                                              >
                                                  conditions{' '}
                                              </a>
                                          </p>
                                      </div>
                                  </div>
                                  <div className='col-md-7 d-flex flex-center'>
                                      <div className='p-4 p-md-5 flex-grow-1'>
                                          <div className='text-center text-md-start'>
                                              <h4 className='mb-0'>
                                                  {' '}
                                                  Forgot your password?
                                              </h4>
                                              <p className='mb-4'>
                                                  Enter your email and we'll
                                                  send you a reset link.
                                              </p>
                                          </div>
                                          <div className='row justify-content-center'>
                                              {error && (
                                                  <Alert variant='danger'>
                                                      {error}
                                                  </Alert>
                                              )}
                                              {message && (
                                                  <Alert variant='success'>
                                                      {message}
                                                  </Alert>
                                              )}
                                              <div className='col-sm-8 col-md'>
                                                  <form
                                                      className='mb-3'
                                                      onSubmit={handleSubmit}
                                                  >
                                                      <input
                                                          className='form-control'
                                                          type='email'
                                                          placeholder='Email address'
                                                          ref={emailRef}
                                                      />
                                                      <div className='mb-3' />
                                                      <button
                                                          className='btn btn-primary d-block w-100 mt-3'
                                                          type='submit'
                                                          name='submit'
                                                      >
                                                          Send reset link
                                                      </button>
                                                  </form>
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
