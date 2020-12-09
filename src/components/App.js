/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import cookie from 'react-cookies';
import services from '../components/Services/service.js';
// components
import Layout from "../components/Layout/Layout";
import AdminLayout from "./Admin-layout/Admin-Layout";
// import AccessDenied from "./shared/access-denied/Access-denied";
import RedirectingPage from './shared/redirecting-page/Redirecting-page';
import { useIdleTimer } from 'react-idle-timer'
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [accessDenied, setAccessDenied] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOnIdle = event => {
    console.log('user is idle')
    console.log('last active', getLastActiveTime())
    handleShow();
  }

  const handleOnActive = event => {
    console.log('user is active')
    console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (e) => {
    // console.log('user did something')
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 60 * 40 * 1000,
    // timeout: 30 * 1000,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  })

  let LogOut = () => {
    const logoutUrl = services.getLogoutUrl();
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace(logoutUrl);
    let smsession = document.cookie.replace(/(?:(?:^|.*;\s*)SMSESSION\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // if (smsession === 'No' || smsession === 'LOGGEDOFF') {
    //   console.log('Reloading page...')
    //   window.location.reload();
    // }
  }

  useEffect(() => {
    let smSessionCookie = cookie.load('SMSESSION');
    let smsession = document.cookie.replace(/(?:(?:^|.*;\s*)SMSESSION\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (smsession === 'No') {
      console.log('Reloading page...')
      window.location.reload();
    }
    else {
      setAccessDenied(false);
    }

    if (smSessionCookie && (smSessionCookie.toUpperCase() === 'NO' || smSessionCookie.toUpperCase() === 'LOGGEDOFF')) {
      console.log('Reloading page...')
      window.location.reload();
      setAccessDenied(true);
    } else {
      setAccessDenied(false);
    }
  }, []);

  return (
    <div>
      {accessDenied ? <RedirectingPage /> :
        <HashRouter>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard/viewquotes" />} />
            <Route
              exact
              path="/dashboard"
              render={() => <Redirect to="/dashboard/viewquotes" />}
            />
            <PrivateRoute path="/dashboard" component={Layout} />
            <Route exact path="/admin" render={() => <Redirect to="/admin/group" />} />        
            <PrivateRoute path="/admin" component={AdminLayout} />
          </Switch>
        </HashRouter>
      }

      {/* Modal box for delete */}
      <Modal size="sm" aria-labelledby="example-modal-sizes-title-sm" show={show} backdrop="static" keyboard={false} onHide={handleClose}>
        <Modal.Header closeButton={false} style={{ background: '#da291c', color: 'white' }}>
          <Modal.Title style={{ 'font-size': '16px' }}>Session Expired</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your session has expired. Please Login again</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={LogOut}>
            Ok
            </button>
          {/* <button className="btn btn-primary" onClick={() => { window.location.reload() }}>
            Reload
          </button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          React.createElement(component, props)
        }
      />
    );
  }
}
