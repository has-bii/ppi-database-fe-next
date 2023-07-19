import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

function UserDashboard({ pageName, user }) {
  return (
    <div className="_myapp_header_container">
      <div className="_page_name">{pageName}</div>
      <div className="_user_info_container">
        <Image
          src={user.profile_photo_url}
          width={50}
          height={50}
          alt="user photo"
          className="_user_photo"
        />
        <div className="_user_info">
          <p className="_user_name">{user.name}</p>
          <span className="_user_role">{user.role.name}</span>
        </div>
      </div>
    </div>
  );
}

UserDashboard.propTypes = {
  pageName: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default UserDashboard;
