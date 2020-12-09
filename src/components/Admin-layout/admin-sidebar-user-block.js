import React, { useEffect, useState } from 'react'
import { Collapse } from 'reactstrap';
import adminProfile from '../../assets/images/user/01.png'
import { DecryptLocalStorage } from '../shared/local-storage/local-storage';

function AdminSidebarUserBlock(props) {
  let userName = DecryptLocalStorage('handleId')
  return (
    <div>
      <div className="item user-block">
        {/* User picture */}
        <div className="user-block-picture">
          <div className="user-block-status">
            <img className="img-thumbnail rounded-circle" src={adminProfile} alt="Avatar" width="60" height="60" />
            <div className="circle bg-success circle-lg"></div>
          </div>
        </div>
        {/* Name and Job */}
        <div className="user-block-info">
          <span className="user-block-name">Hello, {userName}</span>
          <span className="user-block-role">Super Admin</span>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebarUserBlock;
