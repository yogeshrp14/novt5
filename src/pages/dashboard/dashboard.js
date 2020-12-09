/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import Billing from '../../assets/images/Billing.png';
import Subscription from '../../assets/images/Subscription.png';
import './dashboard.scss'
import Icon from '@material-ui/core/Icon';
import Uploads from '../usageupload/usageupload';
import { ValidateLocalStoragealue, DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
import { DecryptRBAC } from '../../components/shared/rbac-system/rbac-control';
import WarinigDialog from '../../components/shared/rbac-system/warning-dialog';
import Loader from '../../components/shared/spinner/spinner';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
function Dashboard(props) {
  const [loader, setLoader] = React.useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showUploadTab, setShowUsageUploadTab] = useState(true);
  let currentLocation = localStorage.getItem("currentRouteLocation");
  const forceUpdate = React.useReducer(bool => !bool)[1];
  const [warningMessage, setWarningMessage] = React.useState("");
  let rolebaseControl = DecryptRBAC("RBAC")
  const [showsAccessControlWaring, setShowsAccessControlWaring] = useState(false);
  const AccessControlWaringOpenModal = () => setShowsAccessControlWaring(true);
  const AccessControlWaringCloseModal = () => setShowsAccessControlWaring(false);

  useEffect(() => {
    setDisabled((currentLocation === '/dashboard/partner' || currentLocation === '/dashboard/profile') ? false : true);
    if (ValidateLocalStoragealue('bpLinkId')) {
      setShowUsageUploadTab(false);
    }
    else {
      setShowUsageUploadTab(DecryptLocalStorage('isShowUsageUpload') == "true");
    }

    if (rolebaseControl == null || rolebaseControl == undefined) {
      console.log("Force update dashboard")
      setLoader(true);
      forceUpdate();
    }
    else {
      console.log("Force update dashboard completed")

      setLoader(false);
    }

  })

  let onClickHandler = (key) => {
    // setWarningMessage("You dont have permission to Access " + key + " tab");
    setWarningMessage("You are not eligible for " + key + " functionality");
    AccessControlWaringOpenModal()
  }

  return (
    <div>
      {/* Loader Componant */}
      {loader ? <Loader /> : null}
      {/* warinig Block */}
      <WarinigDialog closeModal={AccessControlWaringCloseModal} show={showsAccessControlWaring} message={warningMessage} />
      <div className="dashboard-product-title">
        <h1 className="dashboard-Header">Enterprise Account Dashboard</h1>
        <h6 className="dashboard-SubHeader">Manage your Avaya account information for your business in one location</h6>
      </div>
      {/* {disabled ?
        <nav>
          <div className="dashboard-menu">
          { rolebaseControl && rolebaseControl.ViewQuotes ?
            <div className="accounts-menu">
              <NavLink to="/dashboard/viewquotes" activeClassName="selected"  >
                <img className="Quotes" src={Billing} alt="" />
              View  Quotes</NavLink>
            </div>: null }
            { rolebaseControl && rolebaseControl.Orders ?
            <div className="accounts-menu">
              <NavLink to="/dashboard/orders" activeClassName="selected">
                <img className="Billing" src={Billing} alt="" />
              Orders </NavLink>
            </div> : null }
            { rolebaseControl && rolebaseControl.Subscription ?
            <div className="subscriptions-menu">
              <NavLink to="/dashboard/subscriptions" activeClassName="selected" >
                <img className="Subscriptions" src={Subscription} alt="" />
              Subscriptions</NavLink>
            </div> : null }
            {showUploadTab ? <div className="subscriptions-menu">
              <NavLink to="/dashboard/usageupload" activeClassName="selected" >
                <Icon style={{ color: "#737373" }}>cloud_upload</Icon>
              Uploads</NavLink>
            </div>
              : null}
          </div>
        </nav> : ""} */}
      {disabled ?
        <nav>
          <div className="dashboard-menu">
            <div className="accounts-menu">
              <NavLink to="/dashboard/viewquotes" activeClassName="selected"  >
                <img className="Quotes" src={Billing} alt="" />
              View  Quotes</NavLink>
            </div>
            {rolebaseControl && rolebaseControl.Orders ?
              <div className="accounts-menu">
                <NavLink to="/dashboard/orders" activeClassName="selected">
                  <img className="Billing" src={Billing} alt="" />
              Orders </NavLink>
              </div> :
              <div className="accounts-menu">
                <div onClick={() => { onClickHandler("Orders") }} >
                  <img className="Billing" src={Billing} alt="" />
                  Orders
                </div>
              </div>}

            {rolebaseControl && rolebaseControl.Subscription ?
              <div className="subscriptions-menu">
                <NavLink to="/dashboard/subscriptions" activeClassName="selected" >
                  <img className="Subscriptions" src={Subscription} alt="" />
              Subscriptions</NavLink>
              </div> :
              <div className="accounts-menu">
                <div onClick={() => { onClickHandler("Subscriptions") }} >
                  <img className="Subscriptions" src={Subscription} alt="" />
                  Subscriptions
                </div>
              </div>}

            {/* {showUploadTab ? <div className="subscriptions-menu">
              <NavLink to="/dashboard/usageupload" activeClassName="selected" >
                <Icon style={{ color: "#737373" }}>cloud_upload</Icon>
              Uploads</NavLink>
            </div>
              : null} */}
             
              {rolebaseControl && rolebaseControl.Subscription ?
              <div className="subscriptions-menu">
                <NavLink to="/dashboard/accountdetails" activeClassName="selected" >
                  {/* <img className="Subscriptions" src={Subscription} alt="" /> */}
                  <AccountCircleIcon className="accountdetails" alt="" />
              Account-Details</NavLink>
              </div> :
              <div className="accounts-menu">
                <div onClick={() => { onClickHandler("Account-Details") }} >
                  {/* <img className="Subscriptions" src={Subscription} alt="" /> */}
                  <AccountCircleIcon className="accountdetails" alt="" style={{opacity:0.5,paddingBottom:"4px"}} />
                  Account-Details
                </div>
              </div>}
          </div>
        </nav> : ""}
    </div>
  )
}
export default Dashboard
