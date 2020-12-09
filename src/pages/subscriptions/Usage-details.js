/* eslint-disable */
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import services from "../../components/Services/service";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import GetAppIcon from "@material-ui/icons/GetApp";
import Grid from "@material-ui/core/Grid";
import { createMuiTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import "./GetSubscription.scss";
import { Card } from "react-simple-card";
import { useToasts } from "react-toast-notifications";
//import moment from 'moment';
import * as moment from "moment";
// import * as moment from "moment/moment.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../../components/shared/spinner/spinner";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";

export default function SubscriptionUsageDetails(props) {
  const [data] = useState(props.data);
  const classes = useStyles();
  const [upage, setUpage] = useState(0);
  const [usagesRowsPerPage, setUsageRowsPerPage] = useState(5);
  const [loader, setLoader] = React.useState(false);
  const [usagesData, setUsagesData] = React.useState([]);
  const [billcycleUsagesData, setBillcycleUsagesData] = React.useState([]);
  const [usageStartDate, setUsageStartDate] = useState(new Date());
  const [inputUsageStartDate, setInputUsageStartDate] = useState(new Date());
  const [usageEndDate, setUsageEndDate] = useState(new Date());
  const [inputUsageEndDate, setInputUsageEndDate] = useState(new Date());
  const [usageCount, setUsageCount] = useState("");
  const [billcycleUsageCount, setBillcycleUsageCount] = useState("");
  const [showUsageFields, setShowUsageFields] = React.useState(false);
  const [showDailyUsageDetails, setShowDailyUsageDetails] = React.useState(
    false
  );
  const [
    showBillcycleUsageDetails,
    setShowBillcycleUsageDetails,
  ] = React.useState(false);
  const [showUsageMsg, setShowUsageMsg] = React.useState(false);
  const [showBillcycleUsageMsg, setShowBillcycleUsageMsg] = React.useState(
    false
  );
  const [showDownloadUsage, setShowDownloadUsage] = React.useState(false);
  const [subscriptionNo, setSubscriptionNo] = useState();
  const [contractNo, setContractNo] = useState();
  const [startDateValidError, setStartDateValidError] = React.useState("");
  const [internalErrorMsg, setInternalErrorMsg] = React.useState("");
  let { addToast } = useToasts();
  let [startSelectedDate, setSelectedStartDate] = useState();
  let [endSelectedDate, endSelectedStartDate] = useState();

  const usageDetails = {
    marginTop: "2%",
    marginLeft: "2%",
  };

  const usageContainer = {
    marginLeft: "8px",
    width: "99%",
    display: "inline-block",
  };

  const dateFieldWidth = {
    maxWidth: "10.99%",
  };
  const usageColumns = [
    {
      id: "materialNumber",
      label: "Material Code",
      align: "center",
      minWidth: 170,
    },
    {
      id: "usageStartDate",
      label: "Usage Date(UTC)",
      align: "center",
      minWidth: 170,
    },
    {
      id: "serviceType",
      label: "Service Type",
      align: "center",
      minWidth: 170,
    },
    {
      id: "usageQuantity",
      label: "Usage Quantity",
      align: "center",
      minWidth: 170,
    },
  ];

  const billcycleUsageColumns = [
    {
      id: "materialNumber",
      label: "Material Code",
      align: "center",
      minWidth: 170,
    },
    {
      id: "usageStartDate",
      label: "Usage Start Date(UTC)",
      align: "center",
      minWidth: 170,
    },
    {
      id: "usageEndDate",
      label: "Usage End Date(UTC)",
      align: "center",
      minWidth: 170,
    },
    {
      id: "serviceType",
      label: "Service Type",
      align: "center",
      minWidth: 170,
    },
    {
      id: "usageQuantity",
      label: "Usage Quantity",
      align: "center",
      minWidth: 170,
    },
  ];

  useEffect(() => {
    // const date = new Date();
    // const copy = new Date(Number(date))
    // copy.setDate(date.getDate() + 90)
    // setMaxEndDate(copy);
    // setInputUsageStartDate(date);
    
console.log("InputUsageStartDate useeffect=>"+inputUsageStartDate)
console.log("usageenddate useeffect=>"+usageEndDate)
   
  });

  // const startDateChange = (value) => {
  //   // const startDate = moment(value).format("MM/dd/yyyy");
  //   // const formattedStartDate = startDate.replace("+", " ");
  //   setInputUsageStartDate(value);
  //   // setUsageStartDate(formattedStartDate);
  //   // console.log("startDateChange from USAGE-DETAILS  - > ", inputUsageStartDate, value);
  //   console.log("Input UASGE START DATE AFTER =>"+inputUsageStartDate)
  // };
   const startDateChange=(value)=>{
    setInputUsageStartDate(value)
 console.log("Usage input start date  "+inputUsageStartDate)
  }

  const endDateChange=(value)=>{
setUsageEndDate(value)
console.log("Usage input end date  "+usageEndDate)
  }

  // const endDateChange = (value) => {
  //   // const endDate = moment(value).format("MM/dd/yyyy");
  //   // const formattedEndDate = endDate.replace("+", " ");
  //   setInputUsageEndDate(value);
  //   setUsageEndDate(value);
  //   // console.log("Input UASGE START DATE AFTER =>"+inputUsageStartDate)
  //   // console.log("setInputUsageEndDate"+value)
    
  //   console.log("setUsageEndDate FROM USAGEDETAILS=>  " + value);
  //   // setUsageEndDate(formattedEndDate);
  // };

  const getUsagedetails = (subscriptionNo, contractNo) => {
    if (subscriptionNo) {
      setSubscriptionNo(subscriptionNo);
    }
    if (contractNo) {
      setContractNo(contractNo);
    }
    if (usageStartDate) {
      setUsageStartDate(usageStartDate);
    }
    if (usageEndDate) {
      setUsageEndDate(usageEndDate);
    }
    if (usageStartDate > usageEndDate) {
      setStartDateValidError(
        "Selected start date should not be greater than end date"
      );
    } else {
      setStartDateValidError("");
    }
    if (startDateValidError === "") {
      setLoader(true);
      setUpage("");
      setUpage(0);
      services
        .getSubscriptionUsagesDetails(
          subscriptionNo,
          contractNo,
          usageStartDate,
          usageEndDate,
          upage,
          usagesRowsPerPage
        )
        .then(
          (res) => {
            if (res.status && res.status != 200) {
              setLoader(false);
              setInternalErrorMsg("Internal server error.");
              setShowUsageFields(true);
              setShowDailyUsageDetails(true);
              setUsageCount(0);
              setShowDownloadUsage(false);
            } else {
              setInternalErrorMsg("");
              setLoader(false);
              if (res.content.length > 0) {
                if (res.content[0].billGenType === "D") {
                  setUsagesData(res.content);
                  setUsageCount(res.totalElements);
                  setShowDailyUsageDetails(true);
                  setShowDownloadUsage(true);
                  setShowUsageMsg(true);
                  setShowBillcycleUsageDetails(false);
                  setShowBillcycleUsageMsg(false);
                } else if (res.content[0].billGenType === "B") {
                  setBillcycleUsagesData(res.content);
                  setBillcycleUsageCount(res.totalElements);
                  setShowBillcycleUsageDetails(true);
                  setShowBillcycleUsageMsg(true);
                  setShowDownloadUsage(true);
                  setShowDailyUsageDetails(false);
                  setShowUsageMsg(false);
                }
              } else {
                setLoader(false);
                setShowDownloadUsage(false);
                setShowUsageMsg(false);
                setShowBillcycleUsageMsg(false);
                setShowDailyUsageDetails(true);
                setShowBillcycleUsageDetails(false);
                setUsagesData([]);
                setBillcycleUsagesData([]);
                setUsageCount(0);
                setBillcycleUsageCount(0);
              }
            }
          },
          (error) => {
            setLoader(false);
            addToast("Internal server error", {
              appearance: "error",
              position: "top-right",
              autoDismiss: true,
              autoDismissTimeout: 10000,
            });
          }
        );
    }
  };

  const downloadSubscriptionUsageDetails = (subscriptionNo, contractNo) => {
    let page = 0;
    if (showDailyUsageDetails === true && usagesData) {
      console.log("usageCount", usageCount);
      services.downloadUsageDetails(
        subscriptionNo,
        contractNo,
        usageStartDate,
        usageEndDate,
        page,
        usageCount
      );
    } else if (showBillcycleUsageDetails === true && billcycleUsagesData) {
      console.log("billcycleUsageCount", billcycleUsageCount);
      services.downloadUsageDetails(
        subscriptionNo,
        contractNo,
        usageStartDate,
        usageEndDate,
        page,
        billcycleUsageCount
      );
    }
  };

  const handleUsagesChangePage = (event, newPage) => {
    if (upage > newPage) {
      let prevPage = upage - 1;
      setLoader(true);
      const res = services.getSubscriptionUsagesDetails(
        subscriptionNo,
        contractNo,
        usageStartDate,
        usageEndDate,
        prevPage,
        usagesRowsPerPage
      );
      res.then(
        (response) => {
          if (response.content[0].billGenType === "D") {
            usagesData.splice(
              usagesRowsPerPage * upage - usagesRowsPerPage,
              usagesRowsPerPage,
              response
            );
            setUsagesData(response.content);
          } else {
            billcycleUsagesData.splice(
              usagesRowsPerPage * upage - usagesRowsPerPage,
              usagesRowsPerPage,
              response
            );
            setBillcycleUsagesData(response.content);
          }
          setLoader(false);
        },
        (error) => {
          setLoader(false);
        }
      );
      setUpage(newPage);
    } else {
      let nextPage = upage + 1;
      setLoader(true);
      const res = services.getSubscriptionUsagesDetails(
        subscriptionNo,
        contractNo,
        usageStartDate,
        usageEndDate,
        nextPage,
        usagesRowsPerPage
      );
      res.then(
        (response) => {
          if (response.content[0].billGenType === "D") {
            usagesData.splice(
              usagesRowsPerPage * upage - usagesRowsPerPage,
              usagesRowsPerPage,
              response
            );
            setUsagesData(response.content);
          } else {
            billcycleUsagesData.splice(
              usagesRowsPerPage * upage - usagesRowsPerPage,
              usagesRowsPerPage,
              response
            );
            setBillcycleUsagesData(response.content);
          }

          setLoader(false);
        },
        (error) => {
          setLoader(false);
        }
      );
      setUpage(newPage);
    }
  };

  const handleUsageChangeRowsPerPage = (event) => {
    let selectedRowsPerPage = parseInt(event.target.value);
    setLoader(true);
    setUpage(0);
    let pageNumber = 0;
    const res = services.getSubscriptionUsagesDetails(
      subscriptionNo,
      contractNo,
      usageStartDate,
      usageEndDate,
      pageNumber,
      selectedRowsPerPage
    );
    res.then(
      (response) => {
        setLoader(false);
        if (response.content && response.content.length > 0) {
          if (response.content[0].billGenType === "D") {
            setUsagesData(response.content);
            setUsageRowsPerPage(parseInt(event.target.value));
          } else {
            setBillcycleUsagesData(response.content);
            setUsageRowsPerPage(parseInt(event.target.value));
          }
        } else {
          setLoader(false);
          if (showDailyUsageDetails) {
            setUsagesData([]);
            setUsageRowsPerPage(parseInt(event.target.value));
          } else if (showBillcycleUsageDetails) {
            setBillcycleUsagesData([]);
            setUsageRowsPerPage(parseInt(event.target.value));
          }
        }
      },
      (error) => {
        setLoader(false);
      }
    );
  };

  return (
    <div>
      {/* Loader Componant */}
      {loader ? <Loader /> : null}
      {/* Start Usages Data */}

      {data.showUsages ? (
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          style={{ paddingBottom: 15 }}
        >
          <Grid item xs={12}>
            <Paper>
              <ExpansionPanelSummary
                className={classes.expandIcon}
                expandIcon={
                  showUsageFields ? (
                    <RemoveIcon
                      onClick={() => {
                        setShowUsageFields(false);
                        setInputUsageEndDate("");
                        setShowDailyUsageDetails(false);
                        setShowBillcycleUsageDetails(false);
                        setInputUsageStartDate("");
                        setShowDownloadUsage(false);
                      }}
                    />
                  ) : (
                    <AddIcon
                      onClick={() => {
                        setShowUsageFields(true);
                        setInputUsageEndDate("");
                        setShowDailyUsageDetails(false);
                        setShowBillcycleUsageDetails(false);
                        setInputUsageStartDate("");
                        setShowDownloadUsage(false);
                      }}
                    />
                  )
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Box
                  fontWeight="fontWeightBold"
                  className={classes.productTitle}
                  m={1}
                >
                  Usages Details
                </Box>
              </ExpansionPanelSummary>

              {/* /// */}
              {showUsageFields ? (
                <Card style={usageContainer}>
                  <div style={usageDetails}>
                    <div>
                      <div className={classes.container}>
                        <div className="row mb-3">
                          <div className="mt-1" style={{ padding: "0 15px" }}>
                            <label> Start Date </label>
                          </div>
                          <div style={dateFieldWidth}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container>
                                <KeyboardDatePicker
                                  style={{ width: "100%" }}
                                  disableToolbar
                                  variant="inline"
                                  format="MM/dd/yyyy"
                                  margin="normal"
                                  value={inputUsageStartDate}
                                  minDate={new Date()}
                                  onChange={(value) => startDateChange(value)}
                                  autoOk={true}
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          </div>
                          <div className="mt-1" style={{ padding: "0 15px" }}>
                            <label> End Date </label>
                          </div>
                          <div style={dateFieldWidth}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container>
                                <KeyboardDatePicker
                                  style={{ width: "100%" }}
                                  disableToolbar
                                  variant="inline"
                                  format="MM/dd/yyyy"
                                  margin="normal"
                                  minDate={new Date(inputUsageStartDate)}
                                  value={usageEndDate}
                                  onChange={(value) => endDateChange(value)}
                                  required
                                  autoOk={true}
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          </div>
                          <div className="col-1">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              onClick={() =>
                                getUsagedetails(
                                  data.subscriptionName,
                                  data.sapContractNumber
                                )
                              }
                            >
                              Submit
                            </button>
                          </div>
                          {internalErrorMsg ? (
                            <div
                              className="col-12 mt-3"
                              style={{ color: "red" }}
                            >
                              {internalErrorMsg}
                            </div>
                          ) : (
                            ""
                          )}

                          {showDownloadUsage ? (
                            <div
                              title="Download Usages"
                              className="col-6 ml-3 mt-1"
                            >
                              <a>
                                <GetAppIcon
                                  style={{ color: "#DA291C" }}
                                  onClick={() =>
                                    downloadSubscriptionUsageDetails(
                                      data.subscriptionName,
                                      data.sapContractNumber
                                    )
                                  }
                                />
                              </a>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        {startDateValidError ? (
                          <div className="row">
                            {" "}
                            <span style={{ color: "red", marginLeft: "15px" }}>
                              {startDateValidError}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    {showDailyUsageDetails ? (
                      <TableContainer style={{ maxWidth: "98%" }}>
                        <Table
                          className={classes.table}
                          aria-label="simple table"
                        >
                          <TableHead className="table-header">
                            <TableRow>
                              {usageColumns.map((column) => (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {showUsageMsg ? (
                              usagesData.map((usage, index) => (
                                <TableRow key={index}>
                                  <TableCell align="left">
                                    {usage.materialNumber}
                                  </TableCell>
                                  <TableCell align="left">
                                    {usage.usageStartDate}
                                  </TableCell>
                                  <TableCell align="left">
                                    {usage.serviceType}
                                  </TableCell>
                                  <TableCell align="left">
                                    {usage.usageQuantity}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableCell align="center" colSpan={7}>
                                There are no usages for the given date range.
                              </TableCell>
                            )}
                          </TableBody>
                        </Table>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 15, 20]}
                          component="div"
                          count={usageCount}
                          rowsPerPage={usagesRowsPerPage}
                          page={upage}
                          onChangePage={handleUsagesChangePage}
                          onChangeRowsPerPage={handleUsageChangeRowsPerPage}
                        />
                      </TableContainer>
                    ) : (
                      ""
                    )}

                    {showBillcycleUsageDetails ? (
                      <TableContainer style={{ maxWidth: "98%" }}>
                        <Table
                          className={classes.table}
                          aria-label="simple table"
                        >
                          <TableHead className="table-header">
                            <TableRow>
                              {billcycleUsageColumns.map((column) => (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {showBillcycleUsageMsg ? (
                              billcycleUsagesData.map((usage, index) => (
                                <TableRow key={index}>
                                  <TableCell align="left">
                                    {usage.materialNumber}
                                  </TableCell>
                                  <TableCell align="left">
                                    {usage.usageStartDate}
                                  </TableCell>
                                  <TableCell align="left">
                                    {usage.usageEndDate}
                                  </TableCell>
                                  <TableCell align="left">
                                    {usage.serviceType}
                                  </TableCell>
                                  <TableCell align="left">
                                    {usage.usageQuantity}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableCell align="center" colSpan={7}>
                                There are no usages for the given date range.
                              </TableCell>
                            )}
                          </TableBody>
                        </Table>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 15, 20]}
                          component="div"
                          count={billcycleUsageCount}
                          rowsPerPage={usagesRowsPerPage}
                          page={upage}
                          onChangePage={handleUsagesChangePage}
                          onChangeRowsPerPage={handleUsageChangeRowsPerPage}
                        />
                      </TableContainer>
                    ) : (
                      ""
                    )}
                  </div>
                </Card>
              ) : (
                ""
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
      {/* End Usages Date */}
    </div>
  );
}

const theme = createMuiTheme({
  typography: {
    subtitle1: {
      fontSize: 16,
      fontWeight: 500,
    },
    body1: {
      fontWeight: 500,
    },
  },
});

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  root: {
    width: "100%",
    flexGrow: 1,
  },
  container: {
    // minHeight: 440,
  },
  paper: {
    textAlign: "left",
    boxShadow: "none",
    // paddingLeft: '5%'
  },
  labelBackground: {
    textAlign: "left",
    boxShadow: "none",
    background: "#f9f9fa !important",
  },
  productTitle: {
    borderBottom: "3px solid #DA291C",
    width: "auto !important",
    fontWeight: "500",
    fontSize: "15px",
  },
  expandTab: {
    minHeight: "400px",
  },
  minifyTab: {
    width: "auto",
  },
  systemTitle: {
    borderBottom: "3px solid #DA291C",
    width: "max-content",
    fontWeight: "500",
    fontSize: "15px",
  },
  tablePaper: {
    textAlign: "left",
    boxShadow: "none",
  },
  customPaper: {
    textAlign: "left",
    boxShadow: "none",
  },
  customExpand: {
    fontSize: "13px",
    fontWeight: "600",
    display: "inline-block",
    minWidth: "207px",
  },
  detailsTableCell: {
    borderBottom: "1px solid #ccc",
    background: "#f1f1f3",
    cursor: "auto",
    fontWeight: "normal",
    whiteSpace: "normal",
  },
});

const searchBoxStyle = {
  width: "100%",
  borderRadius: "0px",
};

const searchButton = {
  marginRight: "72.5%",
  padding: "7px 26px 6px",
};

const exportButton = {
  float: "right",
};
