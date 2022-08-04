import React from "react";

const ProfileDescription = ({name, email, phone}) => {
  return (
    <>
      <h4 className="text-center">
        <a className="text-dark" href="/">
          {name}
        </a>
      </h4>
      <h5 className=" text-success mb-0 d-flex align-items-center mb-3">
        {" "}
        {email}
      </h5>
      <h5 className=" text-600 text-center mb-1">{phone}</h5>
    </>
  );
};

export default ProfileDescription;
