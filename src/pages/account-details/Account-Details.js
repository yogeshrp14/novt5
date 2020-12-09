import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import services from '../../components/Services/service';
import Loader from '../../components/shared/spinner/spinner';
import Box from '@material-ui/core/Box';
import "./account-details.scss";
import { ValidateLocalStoragealue, DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
import { DecryptRBAC } from '../../components/shared/rbac-system/rbac-control';
import AccountSubscription from './AccountSubscription'
import NewAccount from './NewAccount'




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


const AccountDetails = (props) => {

  const [value, setValue] = useState(0)
  const [loader, setLoader] = useState(true)
  const classes = useStyles();
  const [count, setCount] = useState(0);
  const theme = useTheme();
  let [isDirectCustomer, setIsDirectCustomer] = useState(false)
  let [linkId, setLinkId] = React.useState('');
  let handleId = DecryptLocalStorage('handleId');
  const [rows, setRows] = useState([]);
  const [associate] = useState(!ValidateLocalStoragealue('bpLinkId'));
  let reseller = false;
  let rolebaseControl = DecryptRBAC("RBAC")
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
     setCount(response.subscriptionList.length)
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

  return (
    <div>
      <div className={classes.root} style={{ padding: "20px 0px 7px" }}>
        {!isDirectCustomer ? <div>
          <AppBar position="static" color="default">
            <Tabs style={{ width: '100%', float: 'left' }}
              value={value} onChange={handleChangeIndex} initialSelectedIndex={value}
              indicatorColor="secondary" textColor="secondary"
              variant="fullWidth" aria-label="full width tabs example">
              <Tab style={{ width: '10%', margin: '0 auto', border: '2px solid #ffffff', color: 'black', backgroundColor: '#ffffff' }}
                label="User Subscription" {...a11yProps(0)} />
            </Tabs>
          </AppBar>
        </div> : null}
        <TabPanel value={value} index={0} dir={theme.direction}>
          {!loader ? (<AccountSubscription data={rows} pageCount={count} isReseller={true} isAssociate={associate} isDirectCustomer={isDirectCustomer} handleId={handleId} linkId={linkId} />) : <Loader />}
          {/* { !loader ? (<NewAccount  data={rows} pageCount={count} isReseller={true} isAssociate={associate} isDirectCustomer={isDirectCustomer} handleId={handleId} linkId={linkId} />) : <Loader />} */}
        </TabPanel>
      </div>
    </div>
  )
}

export default AccountDetails
