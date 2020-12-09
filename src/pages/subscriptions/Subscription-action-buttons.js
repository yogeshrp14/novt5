/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import services from '../../components/Services/service';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import SaveIcon from '@material-ui/icons/Save';
import Loader from '../../components/shared/spinner/spinner';
import "./GetSubscription.scss"
import { useToasts } from 'react-toast-notifications';
import { Button, Modal } from 'react-bootstrap';
import { DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
  customPaper: {
    textAlign: 'left',
    boxShadow: 'none'
  },
  customExpand: {
    fontSize: '13px',
    fontWeight: '600',
    display: 'inline-block',
    minWidth: '207px'
  }
});

const searchButton = {
  // marginRight: '72.5%',
  padding: '7px 26px 6px !important'
}

export default function SubscriptionActionButtons(props) {
  const [data] = useState(props.data);
  const [isrenewalFlag] = useState(props.isrenewalFlag);
  const classes = useStyles();
  const [linkId] = useState(props.linkId);
  const [subscriptionId, setSubscriptionId] = useState('');
  const [show, setShow] = useState(false);
  const [actionType, setActionType] = useState('');
  const [isDirectCustomer] = useState(props.isDirectCustomer);
  const [isValidForRegisterAco, setIsValidForRegisterAco] = useState(false);
  let userType =  DecryptLocalStorage('userType');
  const showAcoMessage = `Click here to Initiate the ACO Quoting Process`;
  const [dassMessageShow, setDassMessageShow] = useState(false);  

  const handleRedirect = () => {
    setShow(false);
    window.location.assign(services.getSubscriptionActionUrl(subscriptionId, linkId, actionType));
  };

  const handleClose = () => {
    setShow(false);
  }

  const handleDassMessageClose = () => {
    setDassMessageShow(false);
  }
  const handleShow = (subscriptionId, actionType) => {
    setShow(true);
    setSubscriptionId(subscriptionId);
    setActionType(actionType);
  }

  const handleShowDassMessage = (actionName) => {
    setDassMessageShow(true);
    setActionType(actionName);
  }

  useEffect(() => {
    console.log('isDirectCustomer==>>>',isDirectCustomer)
    console.log('Powered By Virtualized',data.poweredByVirtualized )
	  setIsValidForRegisterAco(data.hasPoweredByACOCountry && data.poweredByVirtualized);
  }, [])

  const changeSubscription = (actionName, subscriptionId, linkId, hasDaasProductCheck) => {
    if(!hasDaasProductCheck) {
      if (actionName === 'Change' || actionName === 'Cancel' || actionName === 'Renew') {
        if (actionName === 'Cancel') {
          handleShow(subscriptionId, actionName);
        }
        else window.location.assign(services.getSubscriptionActionUrl(subscriptionId, linkId, actionName));
      }
    } else{
      handleShowDassMessage(actionName);
    }
  }

  const registerAco = (contractNumber) => {
    console.log('User Type==>',userType)
    let registrationUrl = services.redirectAcoToRegister('', contractNumber, userType)
    console.log('Registration Url==>',registrationUrl)
    window.open(registrationUrl, '_blank');
  }

  return (
    <div>
      {data.status === 'Active' ?
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-start" style={{ paddingRight: "13px" }}>
          <Grid item xs={1} style={{ marginRight: "5px", maxWidth: "none" }}>
            <Paper className={classes.customPaper}>
              <button className="btn btn-primary"
                style={searchButton}
                variant="contained"
                color="primary"
                size="large"
                onClick={() => changeSubscription('Cancel', data.subscriptionName, linkId, data.hasDaasProduct)}>Cancel </button>
            </Paper>
          </Grid>
          <Grid item xs={1} style={{ marginRight: "5px", maxWidth: "none"}}>
            <Paper className={classes.customPaper}>
              <button className="btn btn-primary"
                style={searchButton}
                variant="contained"
                color="primary"
                size="large"
                disabled={(data.tollFree === true) ? "" : "disabled"}
                onClick={() => changeSubscription('Change', data.subscriptionName, linkId, data.hasDaasProduct)}>Change </button>
            </Paper>
          </Grid>
          
          {data.showRenewal === true && isValidForRegisterAco === false  ? 
           <Grid item xs={1} style={{ maxWidth: "none", marginRight: "5px" }}>
            <Paper className={classes.customPaper}>
              <button className="btn btn-primary"
                style={{ padding: '7px 26px 6px'}}
                variant="contained"
                color="primary"
                size="large"
                disabled={(isrenewalFlag) ? "" : "disabled"}
                onClick={() => changeSubscription('Renew', data.subscriptionName, linkId, data.hasDaasProduct)}>
                  {data.trial == 1 ? "Trial To Paid" : "Renewal" }
                  </button>
            </Paper>
          </Grid> : null }

        {isValidForRegisterAco === true ?
            <Grid item xs={1} style={{ maxWidth: "none" }}>
              <Paper className={classes.customPaper}>

              <Tooltip title={showAcoMessage}>
                <button className="btn btn-primary"
                variant="contained"
                color="primary"
                style={{ width: "max-content"}}
                size="large"
                onClick={() => registerAco(data.sapContractNumber)}>Register ACO</button>
              </Tooltip>
              </Paper>
            </Grid>
          : null }        
        </Grid>
        : null}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton style={{ background: '#da291c' }}>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>Order cancellation is in progress.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRedirect}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={dassMessageShow} onHide={handleDassMessageClose}>
        <Modal.Header closeButton style={{ background: '#da291c' }}>
          <Modal.Title> Warning
          {/* <ReportProblemRoundedIcon style={{color: '#e8e112', width: '37px', height: '32px' }}/>  */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>You can not perform this action on DaaS Subscription</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDassMessageClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// For Renewal Button


// Algorithm for validForRenewal
// set validForRenewal = false
// if eligibleForRenewal = true && poweredByVirtualized = true then
//   if customerType contains 'Indirect' then
//      if endCustomerCountry contains "BHD" Or "BRL" or "CLP" or "MYR" or "MUR" or "MXN" or "OMR" or "ZAR" then
//        set validForRenewal = true
//      end if
//   elif customerType contains 'Direct' then
//     if soldtoCountry contains "BHD" Or "BRL" or "CLP" or "MYR" or "MUR" or "MXN" or "OMR" or "ZAR" then
//        set validForRenewal = true
//     end if
//   end if
// end if



//  showRenewal flag To show and hide renewal button ==> 
// if Eligible means 90 days renewal period && PoweredBy & Virtualised

    // - if customerType is Direct Then
    //    validForRenewal flag For enable and disable ===>  
          // - if SoldToCountry is - Bahrain-BHD OR Brazil-BRL OR Chile-CLP OR Malaysia-MYR OR Mauritius-MUR OR Mexico-MXN OR Oman-OMR OR South Africa-ZAR
          //       show Renewal
          //   else
          //      Disable Renewal
          
    // - else if customerType is Indirect Then
    //   validForRenewal flag For enable and disable ===> 
        //  - if endCustomerCountry is Bahrain-BHD OR Brazil-BRL OR Chile-CLP OR Malaysia-MYR OR Mauritius-MUR OR Mexico-MXN OR Oman-OMR OR South Africa-ZAR
        //       show Renewal
        //   else
        //      Disable Renewal

//   else hide
