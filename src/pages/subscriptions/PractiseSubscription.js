import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { AppBar, Tab, Tabs } from "@material-ui/core";
import Loader from "../../components/shared/spinner/spinner";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import services from "../../components/Services/service";
import {
  ValidateLocalStoragealue,
  DecryptLocalStorage,
} from "../../components/shared/local-storage/local-storage";
import { DecryptRBAC } from "../../components/shared/rbac-system/rbac-control";
import GetSubscriptions from '../subscriptions/GetSubscription';
import PractiseGetSubscription from '../subscriptions/PractiseGetSubscription'

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
const useStyles = makeStyles({
  root: {
    display: "block",
    width: "100%",
    background: "transparent",
    boxShadow: "none",
  },
});
function a11yProps(index) {
      return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
      };
    }
export default function PractiseSubscription(props) {
  const classes = useStyles();
  let [isDirectCustomer, setIsDirectCustomer] = useState(false);
  let [value, setValue] = useState(0);
  let [loader, setLoader] = useState(true);
  let handleId = DecryptLocalStorage("handleId");

  let rolebaseControl = DecryptRBAC("RBAC");
  const [associate] = useState(!ValidateLocalStoragealue("bpLinkId"));
  const theme = useTheme();
  let [linkId, setLinkId] = useState("");
  let [rows, setRows] = useState([]);
  let [count, setCount] = useState(0);
  let reseller = false;

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
  
   

  return (
    <div className={classes.root} style={{ padding: "20px 0px 7px" }}>
      {!isDirectCustomer ? (
        <div>
          <AppBar position="static" color="default">
            <Tabs
              style={{ width: "100%", float: "left" }}
              value={value}
              onChange={handleChangeIndex}
              initialSelectedIndex={value}
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab
                style={{
                  width: "10%",
                  margin: "0 auto",
                  border: "2px solid #ffffff",
                  color: "black",
                  backgroundColor: "#ffffff",
                }}
                label="Business Partner's Subscription"
                {...a11yProps(0)}
              ></Tab>

              <Tab
                style={{
                  width: "10%",
                  margin: "0 auto",
                  border: "2px solid #ffffff",
                  color: "black",
                  backgroundColor: "#ffffff",
                }}
                label="Reseller's Subscription "
                {...a11yProps(1)}
              ></Tab>
            </Tabs>
          </AppBar>
        </div>
      ) : null}
      <TabPanel value={value} index={0} dir={theme.direction} >
        {!loader ? (<PractiseGetSubscription data={rows} pageCount={count} isReseller={false} isAssociate={associate} isDirectCustomer={isDirectCustomer} handleId={handleId} linkId={linkId} />) : <Loader />}
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction} >
        {!loader ? (<PractiseGetSubscription data={rows} pageCount={count} isReseller={true} isAssociate={associate} isDirectCustomer={isDirectCustomer} handleId={handleId} linkId={linkId} />) : <Loader />}
      </TabPanel>
    </div>
  );
}
