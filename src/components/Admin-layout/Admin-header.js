/* eslint-disable */
import React, { useEffect, useState } from 'react'
import Logo from '../../assets/svg/logo.svg'
import services from '../Services/service';
import '../Header/header.scss';
import AccountImg from '../../assets/images/Account.png'
import HelpImg from '../../assets/images/Help.png'
import logOut from '../../assets/images/logout.png'
import search from '../../assets/images/search1.png'
import service from '../Services/service'
import Loader from '../shared/spinner/spinner';
import { Navbar, Nav } from 'react-bootstrap'
import * as _ from "lodash";
import { EncryptLocalStorage, DecryptLocalStorage } from '../shared/local-storage/local-storage';
import { RbacControl } from '../shared/rbac-system/rbac-control';
// import { history } from '../shared/_helper/history';


export default function AdminHeader(props) {
  let [firstName, setFirstName] = useState();
  const [loader, setLoader] = React.useState(false);
  localStorage.setItem('currentRouteLocation', props.history.location.pathname);
  const [partnerNavigation, setpartnerNavigation] = useState(false);
  const [profileNavigation, setprofileNavigation] = useState(false);
  let currentLocation = props.history.location.pathname;
  console.log("history ==>", history)

  useEffect(() => {

    async function fetcAccounthData() {
      setLoader(true);
      await services.getAccountData().then(res => {
        RbacControl(_.get(res, "handleId", ""))
        setFirstName(_.get(res, "firstName", ""));
        EncryptLocalStorage('handleId', _.get(res, "handleId", ""))
        EncryptLocalStorage("isShowUsageUpload", _.get(res, "isShowUsageUpload", ""))
        var role = parseInt(_.get(res, "bpLinkId", ""), _.trim);
        if (role > 0) {
          EncryptLocalStorage('bpLinkId', role)
          setLoader(true);
          console.log("URL from address bar: " + currentLocation);
          let redirectionPath = currentLocation.match(/dashboard\/orders(\/[a-z0-9]*)?/);
          if (res.hasRBACAdminAccess == false) { props.history.push("/") }
          else if (currentLocation === '/dashboard/orders' || currentLocation === '/dashboard/subscription' || ((redirectionPath) && redirectionPath.length > 0)) {
            props.history.push(currentLocation)
          }
          else {
            props.history.push('/admin/group')
          }
          setLoader(false);
        }
        setLoader(false);
      }, (err) => {
        console.log(err)
        setLoader(false);

      })
    }
    fetcAccounthData();
  }, []);

  useEffect(() => {
    let bpLinkId = DecryptLocalStorage('bpLinkId')
    if (currentLocation === '/dashboard/profile') {
      setprofileNavigation(false);
    }
    else if (bpLinkId !== null) {
      setprofileNavigation(true);
    }
    else {
      setprofileNavigation(false);
    }

    if (currentLocation === '/dashboard/partner') {
      setpartnerNavigation(false);
    }
    else if (bpLinkId === null) {
      setpartnerNavigation(true);
    }
    else {
      setpartnerNavigation(false);
    }
  })

  let LogOut = () => {
    const logoutUrl = service.getLogoutUrl();
    window.location.replace(logoutUrl);
    localStorage.clear();
    sessionStorage.clear();
    let smsession = document.cookie.replace(/(?:(?:^|.*;\s*)SMSESSION\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (smsession === 'No') {
      window.location.reload();
    }
  }

  const changeUrl = (url) => {
    if (url == "viewquotes") {
      let handleId = DecryptLocalStorage('handleId');
      RbacControl(handleId)
    }
    let routerUrl = "/dashboard/" + url
    props.history.push(routerUrl)
  }

  return (
    <>
      {/* Loader Block */}
      {loader ? <Loader /> : null}
      <Navbar className="navbar-style" bg="*" expand="sm">
        <Navbar.Brand href="#" style={{ padding: "0" }}>
          <div className="av-logo">
            <div className="">
              <div className="logo"></div>
              <div className="image-container">
                <img alt="Logo" src={Logo} />
              </div>
            </div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <div className="product-title">
              <h1 className="Header">Enterprise Account Dashboard</h1>
              <h6 className="SubHeader">Manage your Avaya account information for your business in one location</h6>
            </div>
          </Nav>
          <Nav className="mr-auto" style={{ width: "100%" }}>
            <div className="secondary-section">
              <div className="login">
                <div className="user-login">
                  <div> Welcome:{firstName}
                  </div>
                  <div className="">
                    {partnerNavigation ?
                      <div className="partner-menu">
                        <button className="anchor-button" onClick={() => changeUrl('partner')}>  <img alt="Search" className="search" src={search} />Partner Search
                    </button>
                      </div> : null}
                    {profileNavigation ?
                      <div className="partner-menu">
                        <button className="anchor-button" onClick={() => changeUrl('profile')}>  <img alt="Search" className="search" src={search} />Profile Search
                        </button>
                      </div>
                      : null}
                    <div className="account-menu">
                      <button className="anchor-button" onClick={() => changeUrl('account')}>  <img alt="Account" className="Billing" src={AccountImg} />Account
                    </button>
                    </div>
                    <div className="partner-menu">
                      <button className="anchor-button" onClick={() => changeUrl('viewquotes')}>  <img alt="Account" className="Billing" src={AccountImg} />Dashboard
                    </button>
                    </div>
                    {/* <div className="Help-menu">
                      <button className="anchor-button" onClick={() => changeUrl('help')}>
                        <img alt="Quotes" className="Quotes" src={HelpImg} />Help
                    </button>
                    </div> */}
                    <div className="logOut">
                      <button className="anchor-button" onClick={LogOut}>
                        <img alt="logout" className="Billing" src={logOut} />Logout
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}
