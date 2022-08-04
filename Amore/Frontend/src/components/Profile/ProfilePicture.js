import React from "react";

const ProfilePicture = ({image}) => {
  return (
    <img
    src={image}
    width="100"
    className="rounded-circle"
  />
  );
};

export default ProfilePicture;
