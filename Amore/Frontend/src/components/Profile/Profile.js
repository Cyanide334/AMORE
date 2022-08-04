import React, { useState, useEffect} from "react";
import { Button, Card, Nav } from "react-bootstrap";
import ProfileDescription from "./ProfileDescription";
import ProfilePicture from "./ProfilePicture";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

    
const Profile = ({user}) => {
  console.log(user)
  return (
      <Card className='mt-3 bg-transparent shadow-none'>
          <Card.Body className='d-flex justify-content-center'>
              <Card className='mt-3 p-4 shadow-lg'>
                  <Card.Body>
                      <div className='position-relative rounded-top overflow-hidden text-center'>
                          <ProfilePicture

                              image={user.image}
                          />
                      </div>
                      <div className='p-3'>
                          <ProfileDescription
                              name={user.name}
                              email={user.email}
                              phone={user.phone}
                          />
                      </div>
                      <div className='d-flex justify-content-center mt-4'>
                          <Link
                              className='btn btn-primary'
                              to={`/edit/${user._id}`}
                          >
                              Edit Profile
                          </Link>
                      </div>
                      
                  </Card.Body>
              </Card>
          </Card.Body>
      </Card>
  );
};

export default Profile;
