import React, { useRef, useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import ProfilePicture from "./ProfilePicture";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditProfile = ({ user , setUser}) => {
  const loggedInUser = user;
  const nameRef = useRef();
  const emailRef = useRef();
  //TODO: make two refs, one for password, one for confirm password.
  //password should not be outputted so no need to set passwordref.current.value.
  //Create two fields, one for password, one for confirm password.
  //If passwordref.current.value isnt an empty string, it must match confirmpasswordref.current.value
  // before you allow the request to be sent. send an alert saying passwords must match if the check fails.
  //const passwordRef = useRef();
  const phoneRef = useRef();
  const imageRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  useEffect(() => {
    nameRef.current.value = loggedInUser.name;
    emailRef.current.value = loggedInUser.email;
    phoneRef.current.value = loggedInUser.phone;
    imageRef.current.value = loggedInUser.image
      ? loggedInUser.image
      : "https://i.pinimg.com/originals/e5/20/ab/e520abb28d73437af847eb09e6db7323.png";
  });

  const params = useParams();

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (nameRef.current.value === "") {
      alert("Title Cannot Be Empty!");
      return;
    }
    if (emailRef.current.value === "") {
      alert("Email Cannot Be Empty!");
      return;
    }
    if (passwordRef.current.value !== "") {
      if (passwordConfirmRef.value === "") {
        alert("Confirm password!");
        return;
      }else{
        if(passwordRef.current.value !== passwordConfirmRef.current.value){
          alert("Passwords must match!");
          return;
        }
      }
    }
    
    // if (imageRef.current.value === "") {
    //   alert("Image Link Cannot Be Empty!");
    //   return;
    // }

    let newUser = {
      id: params.id,
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: passwordRef.current.value,
      image: imageRef.current.value,
      date: new Date(),
      isAdmin: false,
      token: loggedInUser.accessToken,
    };
    console.log(newUser);
    axios
      .patch("http://localhost:8080/users/edit", newUser, {
        headers: { "x-access-token": loggedInUser.accessToken },
      })
      .then((res) => {
        
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));

      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
    <Card className="mt-3 bg-light shadow-lg">
      <Card.Header className="text-center">
          <ProfilePicture image={user.image} />
          <h3>Edit Profile</h3>
      </Card.Header>
      <Card.Body className="d-flex justify-content-center">
        <Card className="px-4 shadow-none">
          <Card.Body>
            <form
              acceptCharset="UTF-8"
              //action='https://getform.io/f/{your-form-endpoint-goes-here}'
              method="POST"
              encType="multipart/form-data"
              target="_blank"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="exampleInputName">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  className="form-control border rounded-1"
                  id="exampleInputName"
                  placeholder={user.name}
                  required="required"
                  ref={nameRef}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1" required="required">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder={user.email}
                  ref={emailRef}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1" required="required">
                  Phone Numbers
                </label>
                <input
                  className="form-control"
                  placeholder={user.phone}
                  ref={phoneRef}
                />
              </div>
              <hr />
              <div className="form-group">
                <label htmlFor="InputImage">Image Link</label>
                <input
                  type="text"
                  name="fullname"
                  className="form-control border rounded-1"
                  id="InputImage"
                  placeholder={user.name}
                  required="required"
                  ref={imageRef}
                />
              </div>
              <div className="form-group row gx-2">
                <div className="mb-3 col-sm-6 col-md-12 col-lg-6">
                  <label className="form-label" htmlFor="card-password">
                    Password
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    autoComplete="on"
                    id="card-password"
                    ref={passwordRef}
                  />
                </div>
                <div className="mb-3 col-sm-6 col-md-12 col-lg-6">
                  <label className="form-label" htmlFor="card-confirm-password">
                    Confirm Password
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    autoComplete="on"
                    id="card-confirm-password"
                    ref={passwordConfirmRef}
                  />
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Card.Body>
      </Card>
      </>
  );
};

export default EditProfile;
