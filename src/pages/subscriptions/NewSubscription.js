/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import GetSubscriptions from '../subscriptions/GetSubscription';
import services from '../../components/Services/service';
import Loader from '../../components/shared/spinner/spinner';
import "./subscription.scss";
import { ValidateLocalStoragealue, DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
import { DecryptRBAC } from '../../components/shared/rbac-system/rbac-control';
import NewGetSubscription from '../subscriptions/NewGetSubscription';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{value === index && children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    width: '100%',
    background: 'transparent',
    boxShadow: 'none'
  },
}));

export default function Subscriptions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = React.useState(true);
  const [count, setCount] = useState(0);
  // const [linkId] = useState((localStorage.getItem('bpLinkId') !== '' && localStorage.getItem('bpLinkId') !== null && parseInt(localStorage.getItem('bpLinkId')) > 0) ? parseInt(localStorage.getItem('bpLinkId')) : parseInt(localStorage.getItem('linkId')));
  // const [handleId] = useState((localStorage.getItem('handleId') !== '' && localStorage.getItem('handleId') !== null) ? localStorage.getItem('handleId') : null);
  // const [associate] = useState((localStorage.getItem('bpLinkId') !== '' && localStorage.getItem('bpLinkId') !== null && parseInt(localStorage.getItem('bpLinkId')) > 0) ? false : true);
  const [associate] = useState(!ValidateLocalStoragealue('bpLinkId'));
  //let linkId;
  let [linkId, setLinkId] = React.useState('');
  let handleId = DecryptLocalStorage('handleId');
  let reseller = false;
  let rolebaseControl = DecryptRBAC("RBAC")
  let [isDirectCustomer, setIsDirectCustomer] = React.useState(false);

  const getSubscriptionListData = (page, rowPerPage, tabIdx) => {
    let isDirectCustomerValue = false;
    if (linkId == -1) {
      setIsDirectCustomer(true);
      isDirectCustomerValue = true;
      // linkId = null;
    }
    else {
      setIsDirectCustomer(false);
      isDirectCustomerValue = false;
    }
    setLinkId(linkId);
    reseller = (tabIdx === 1);
    const res = services.getSubscriptionData(handleId, linkId, '', reseller, isDirectCustomerValue, page, rowPerPage);
    res.then(response => {
      rows.splice(0, rows.length); //Clean up earlier data
      setRows([response]);
      if (response.page && response.page !== null) {
        setCount(response.page.totalRecords);
      }
      //Disable loader
      setLoader(false);
    },
      (error) => {
        errorHandlerFunction(error);
      });
  }

  const errorHandlerFunction = (error) => {
    console.log("error ==> ", error)
    setLoader(false);
  }

  const handleChangeIndex = (event, index) => {
    console.log("Active tab:" + index)
    setValue(index);
    setLoader(true);
    getSubscriptionListData(0, 5, index);
  };

  useEffect(() => {
    if (ValidateLocalStoragealue('bpLinkId')) {
      linkId = DecryptLocalStorage('bpLinkId')
      getSubscriptionListData(0, 5, 0);
    }
    else if (ValidateLocalStoragealue('linkId')) {
      linkId = DecryptLocalStorage('linkId');
      getSubscriptionListData(0, 5, 0);
    }
    else {
      props.history.push('/dashboard/partner');
    }
  }, [linkId, handleId]);

  useEffect(() => {
  });

  // const validateLocalStoragealue = (value) => {
  //   if (localStorage.getItem(value) && localStorage.getItem(value) !== null && localStorage.getItem(value) !== '' && localStorage.getItem(value) !== 'null') return true
  //   else return false;
  // }

  return (
    <div className={classes.root} style={{ padding: "20px 0px 7px" }}>
      {!isDirectCustomer ?
        <div>
          <AppBar position="static" color="default">
            <Tabs style={
              {
                width: '100%',
                float: 'left'
              }
            }
              value={value} onChange={handleChangeIndex}
              initialSelectedIndex={value}
              indicatorColor="secondary" textColor="secondary"
              variant="fullWidth" aria-label="full width tabs example">
              {/* {rolebaseControl && rolebaseControl.SubscriptionPartner ? */}
              <Tab style={
                {
                  width: '10%',
                  margin: '0 auto',
                  border: '2px solid #ffffff',
                  color: 'black',
                  backgroundColor: '#ffffff'
                }
              }
                label="Business Partner's Subscription" {...a11yProps(0)}
              />
              {/* //  : null } */}

              {/* {rolebaseControl && rolebaseControl.SubscriptionReseller ? */}
              <Tab style={
                {
                  width: '10%',
                  margin: '0 auto',
                  border: '2px solid #ffffff',
                  color: 'black',
                  backgroundColor: '#ffffff'
                }
              }
                label="Reseller's Subscription"  {...a11yProps(1)} />
            {/* // : null } */}
            </Tabs>
          </AppBar>
        </div> : null}
      <TabPanel value={value} index={0} dir={theme.direction} >
        {!loader ? (<NewGetSubscription data={rows} pageCount={count} isReseller={false} isAssociate={associate} isDirectCustomer={isDirectCustomer} handleId={handleId} linkId={linkId} />) : <Loader />}
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction} >
        {!loader ? (<NewGetSubscription data={rows} pageCount={count} isReseller={true} isAssociate={associate} isDirectCustomer={isDirectCustomer} handleId={handleId} linkId={linkId} />) : <Loader />}
      </TabPanel>
    </div>)
}
