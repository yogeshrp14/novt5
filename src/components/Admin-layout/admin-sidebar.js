import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Collapse, Badge } from 'reactstrap';

import AdminSidebarUserBlock from './admin-sidebar-user-block';

import Menu from '../shared/_helper/Menu';

/** Component to display headings on sidebar */
const SidebarItemHeader = ({ item }) => (
  <li className="nav-heading">
    <span> {item.heading} </span>
  </li>
)

/** Normal items for the sidebar */
const SidebarItem = ({ item, isActive }) => (
  <>
      <li className={isActive ? 'active' : ''}>
        <Link to={item.path} title={item.name}>
          {item.label && <Badge tag="div" className="float-right" color={item.label.color}>{item.label.value}</Badge>}
          {item.icon && <em className={item.icon}></em>}
          <span> {item.name} </span>
        </Link>
      </li>
  </>
)

function Sidebar(props) {
  useEffect(() => {
  },[]);

  const routeActive = (paths) => {
    paths = Array.isArray(paths) ? paths : [paths];
    return paths.some(p => props.location.pathname.indexOf(p) > -1)
  }


  /** map menu config to string to determine which element to render */
  const itemType = item => {
    if (item.heading) return 'heading';
    if (!item.submenu) return 'menu';
    if (item.submenu) return 'submenu';
  }

  const validRole = role => {
    var currentUserRole = "associate"
    const userdetails = JSON.parse(localStorage.getItem('currentUser'))
    if (userdetails != null && userdetails != "") {
      currentUserRole = userdetails.role
    }
    let validroles = role.validRoles.some(function (value) {
      return value == currentUserRole
    });
    if (validroles) return true
    else return false
  }

  return (
    <aside className='aside-container'>
      <div className="aside-inner">
        <nav data-sidebar-anyclick-close="" className="sidebar">
          <ul className="sidebar-nav">
            <li className="has-user-block">
              <AdminSidebarUserBlock />
            </li>
            {
              Menu.map((item, i) => {
                // heading
                if (itemType(item) === 'heading')
                  return (
                    <SidebarItemHeader item={item} key={i} />
                  )
                else {
                  if (itemType(item) === 'menu')
                    return (
                      <SidebarItem isActive={routeActive(item.path)} item={item} key={i}/>
                    )
                }
                return null; // unrecognized item
              })
            }
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default withRouter(Sidebar);
