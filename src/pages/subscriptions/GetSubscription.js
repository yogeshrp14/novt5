/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import services from '../../components/Services/service';
import SearchIcon from '@material-ui/icons/Search';
import { Collapse } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import SaveIcon from '@material-ui/icons/Save';
import Loader from '../../components/shared/spinner/spinner';
import CircularProgress from '@material-ui/core/CircularProgress';
import "./GetSubscription.scss"
import { useToasts } from 'react-toast-notifications';
import "react-datepicker/dist/react-datepicker.css";
import ProductDetails from './product-details';
import GetSubscriptionInvoice from './Invoice-details';
import SubscriptionActionButtons from './Subscription-action-buttons'
import SubscriptionUsageDetails from './Usage-details';
import { DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
import GetAppIcon from '@material-ui/icons/GetApp';

export default function GetSubscriptions(props) {
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('created');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState(props.data);
  const [count, setCount] = useState(props.pageCount);
  const [reseller] = useState(props.isReseller);
  const [handleId] = useState(props.handleId);
  const [linkId] = useState(props.linkId);
  const [isAssociate] = useState(props.isAssociate);
  const [isDirectCustomer] = useState(props.isDirectCustomer);
  const [selectedRow, setSelectedRow] = useState('');
  const [loader, setLoader] = React.useState(false);
  const [tinyLoader, setTinyLoader] = React.useState(false);
  const [visibleWarning, setVisibleWarning] = useState(false);
  let { addToast } = useToasts();
  const [isExportButtonShow, setIsExportButtonShow] = React.useState(true);
  const [isExportButtonShowToPartner, setIsExportButtonShowToPartner] = React.useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSystemIdEditable, setIsSystemIdEditable] = useState(false);
  const [resetIpoSystemId, setResetIpoSystemId] = useState({ "ipoSystemId": "", "systemIdAvailable": "" });
  const [visibleWarningMessage, setVisibleWarningMessage] = useState('');
  const [isrenewalFlag, setRenewalFlag] = React.useState(false);

  const headCells = [
    { id: 'subscriptionName', numeric: false, disablePadding: true, label: 'Subscription Name/Contract No' },
    { id: 'endCustomerName', numeric: false, disablePadding: false, label: 'End Customer Name' },
    { id: 'partnerName', numeric: false, disablePadding: false, label: 'Partner Name' },
    { id: 'domain', numeric: false, disablePadding: false, label: 'Domain' },
    { id: 'poNumber', numeric: true, disablePadding: false, label: 'PO Number' },
    { id: 'activatedOn', numeric: true, disablePadding: false, label: 'Start Date' },
    { id: 'expirationDate', numeric: true, disablePadding: false, label: 'End Date' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'rowStatus', numeric: false, disablePadding: false, label: '' }
  ];

  const columns = [
    { id: 'materialCode', label: 'First Name', align: 'center', minWidth: 170 },
    { id: 'productRatePlanName', label: 'Last Name', align: 'center', minWidth: 170 },
    { id: 'qty', label: 'Email Id', align: 'center', minWidth: 170 },
    { id: 'startDate', label: 'Phone No.', align: 'center', minWidth: 170 },
    { id: 'endDate', label: 'Country', align: 'center', minWidth: 170 },
    { id: 'action', label: '', align: 'center', minWidth: 170 },
  ];
  

  const [searchText, setSearchText] = useState('');
  const [preSearchedValue, setPreSearchedValue] = useState('');

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  useEffect(() => {
    let bpLinkId = DecryptLocalStorage('bpLinkId')
    console.log('This is order:' + order)
    console.log('This is orderBy:' + orderBy)
    console.log(rows)
    if (bpLinkId !== null) {
      setIsExportButtonShowToPartner(true);
    }
    else {
      setIsExportButtonShowToPartner(false);
    }
  }, [])

  let Page = page + 1;

  function EnhancedTableHead(tableProps) {
    // const { classes, order, orderBy, onRequestSort } = tableProps;
    const createSortHandler = property => event => {
      onRequestSort(event, property);
    };


    return (
      <TableHead className="table-header">
        <TableRow>
          {headCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align='center'
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const TechnicalContactDetails = (datas) => {
    const [actionButton, setActionButton] = React.useState(false);
    const [contactFirstName, setContactFirstName] = useState('');
    const [contactLastName, setContactLastName] = useState('');
    const [contactEmailAddress, setContactEmailAddress] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactCountry, setContactCountry] = useState('');

    let data = datas.data;
    const setContactInputValue = (data1) => {
      console.log("data ==> ", data1.technicalContactDetail)
      if (data1.technicalContactDetail) {
        setContactFirstName(data1.technicalContactDetail.contactFirstName);
        setContactLastName(data1.technicalContactDetail.contactLastName);
        setContactEmailAddress(data1.technicalContactDetail.contactEmailID);
        setContactPhone(data1.technicalContactDetail.contactPhone);
        setContactCountry(data1.technicalContactDetail.country);
      }
    }

    const updateContactDeatils = (subscriptionName) => {
      setLoader(true);
      let requestOptions = {
        "contactEmailID": contactEmailAddress,
        "contactFirstName": contactFirstName,
        "contactLastName": contactLastName,
        "contactPhone": contactPhone,
        "country": contactCountry,
        "subscriptionNumber": subscriptionName
      }
      const res = services.updateTechnicalcontact(requestOptions);
      res.then(response => {
        setLoader(false);
        fetchSubscriptionSearchResult();
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }

    return (
      <>
        {/* START Technical Contact Details */}
        <Grid container style={{ paddingTop: "13px" }}>
          <Grid item xs={2} style={{ maxWidth: "200px" }} >
            <Paper className={classes.tablePaper} style={{ background: '#f9f9fa' }}>
              <Box className="itemLabel" fontWeight="fontWeightBold" m={1}>Technical Contact details
                                </Box>
            </Paper>
          </Grid>
          {!actionButton ?
            <Grid item xs={3}>
              <Paper className={classes.tablePaper} style={{ background: '#f9f9fa', paddingTop: "9px", paddingLeft: "0" }}>
                <i className="fa fa-edit" style={{ fontSize: "18px", paddingTop: "7px", color: "#dd3636", cursor: "pointer" }} onClick={() => { setActionButton(true); setContactInputValue(data) }}></i>
              </Paper>
            </Grid>
            : <Grid item xs={3}>
              <Paper className={classes.tablePaper} style={{ background: '#f9f9fa', paddingTop: "9px", paddingLeft: "0" }}>
                <i className="fa fa-edit" style={{ fontSize: "18px", paddingTop: "7px", color: "#808080" }} onClick={() => setActionButton(true)}></i>
              </Paper>
            </Grid>}
        </Grid>

        <Grid item xs={12} style={{ width: 'inherit' }}>
          <Paper className={classes.tablePaper}>
            <TableContainer >
              <Table className={classes.table} aria-label="simple table" style={{
                padding: '15px 15px 15px 0',
                border: '1px solid #aeaeae',
                minWidth: 'auto !important'
              }}>
                <TableHead className="table-header">
                  <TableRow style={{
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    height: '50px !important',
                    fontSize: '13px',
                    fontWeight: 'bold !important',
                    background: '#f9f9fa'
                  }}>
                    {
                      columns.map(column => (
                        <>
                          {column.id == "action" && !actionButton ? null :
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                minWidth: '169px', padding: '0 20px 0 40px',
                                fontWeight: 'bold',
                                borderBottom: '2px solid gray',
                                cursor: 'pointer',
                                gridAutoFlow: 'column',
                                alignItems: 'center',
                                height: '50px !important',
                                fontSize: '13px',
                                color: '#000'
                              }}>
                              {column.label}
                            </TableCell>}
                        </>
                      ))
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow >
                    <TableCell className={classes.detailsTableCell} style={!actionButton ? {} : { background: "white" }}>
                      {!actionButton ? <span>{data.technicalContactDetail ? data.technicalContactDetail.contactFirstName : null}</span> :
                        <input style={inputStyle} className="form-control" type="text" value={contactFirstName} placeholder="Enter First Name" onChange={(e) => setContactFirstName(e.target.value)} />
                      }
                    </TableCell>
                    <TableCell className={classes.detailsTableCell} style={!actionButton ? {} : { background: "white" }}>
                      {!actionButton ? <span>{data.technicalContactDetail ? data.technicalContactDetail.contactLastName : null}</span> :
                        <input style={inputStyle} className="form-control" type="text" value={contactLastName} placeholder="Enter Last Name" onChange={(e) => setContactLastName(e.target.value)} />
                      }
                    </TableCell>
                    <TableCell className={classes.detailsTableCell} style={!actionButton ? {} : { background: "white" }}>
                      {!actionButton ? <span>{data.technicalContactDetail ? data.technicalContactDetail.contactEmailID : null}</span> :
                        <input style={inputStyle} className="form-control" type="email" value={contactEmailAddress} placeholder="Enter Email Id" onChange={(e) => setContactEmailAddress(e.target.value)} />
                      }
                    </TableCell>
                    <TableCell className={classes.detailsTableCell} style={!actionButton ? {} : { background: "white" }}>
                      {!actionButton ? <span>{data.technicalContactDetail ? data.technicalContactDetail.contactPhone : null}</span> :
                        <input style={inputStyle} className="form-control" type="text" value={contactPhone} placeholder="Enter Phone" onChange={(e) => setContactPhone(e.target.value)} />
                      }
                    </TableCell>
                    <TableCell className={classes.detailsTableCell} style={!actionButton ? {} : { background: "white" }}>
                      {!actionButton ? <span>{data.technicalContactDetail ? data.technicalContactDetail.country : null}</span> :
                        <input style={inputStyle} className="form-control" type="text" value={contactCountry} placeholder="Enter Country" onChange={(e) => setContactCountry(e.target.value)} />
                      }
                    </TableCell>
                    {!actionButton ? null :
                      <TableCell className={classes.detailsTableCell} style={!actionButton ? {} : { background: "white" }}>
                        <button type="submit" style={{ padding: "4px 20px" }} className="btn btn-secondary" onClick={() => { setActionButton(false); updateContactDeatils(data.subscriptionName) }}>Save</button>
                        <button type="submit" style={{ marginRight: "10px", padding: "4px 20px" }} className="btn btn-secondary" onClick={() => setActionButton(false)}>Cancel</button></TableCell>}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        {/* END Technical Contact Details */}
      </>
    );
  };

  //Check min & max length
  const checkLength = (obj) => {
    return ((obj !== null) && (obj.length >= 10 && obj.length < 32) && obj !== resetIpoSystemId.ipoSystemId);
  }

  //Sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    const sortOrder = isAsc ? 'desc' : 'asc';
    if (preSearchedValue === null || preSearchedValue === '') {
      let finalsearchText = '&sortBy=' + property + '&sortDir=' + sortOrder;
      setLoader(true);
      const res = services.getSubscriptionData(handleId, linkId, finalsearchText, reseller, isDirectCustomer, page, rowsPerPage);
      res.then(response => {
        setRows([response]);
        if (response.page !== null) setCount(response.page.totalRecords);
        setOrder(sortOrder);
        setOrderBy(property);
        setLoader(false);
        setIsExportButtonShow(true);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    } //Search Result Sorting
    else {
      let finalsearchText = '&sortBy=' + property + '&sortDir=' + sortOrder + '&subscriptionName=' + preSearchedValue + '&customerName=' + preSearchedValue + '&activationDate=' + preSearchedValue + '&expirationDate=' + preSearchedValue + '&status=' + preSearchedValue + '&poNumber=' + preSearchedValue + '&sapContractNumber=' + preSearchedValue + '&isSearchRequest=true';
      setLoader(true);
      // let isDirectCustomerForSearch = false;
      const res = services.getSubscriptionData(handleId, linkId, finalsearchText, reseller, isDirectCustomer, page, rowsPerPage);
      res.then(response => {
        setRows([response]);
        if (response.page !== null) setCount(response.page.totalRecords);
        setOrder(sortOrder);
        setOrderBy(property);
        setLoader(false);
        setIsExportButtonShow(false);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
  };

  const handleChangePage = (event, newPage) => {
    let prevNextPage;
    if (page > newPage) {
      prevNextPage = Page - 1;
    }
    else prevNextPage = Page + 1;
    if (isSearchActive && !isEmpty(preSearchedValue)) {
      setLoader(true);
      let searchSubscriptionLinkId = ((isAssociate || isDirectCustomer) ? '' : linkId);
      let searchValue = '&subscriptionName=' + preSearchedValue + '&customerName=' + preSearchedValue + '&activationDate=' + preSearchedValue + '&expirationDate=' + preSearchedValue + '&status=' + preSearchedValue + '&poNumber=' + preSearchedValue + '&domain=' + preSearchedValue + '&sapContractNumber=' + preSearchedValue + '&isSearchRequest=true'
      // let isDirectCustomerForSearch = false;
      const res = services.getSubscriptionData(handleId, searchSubscriptionLinkId, searchValue, reseller, isDirectCustomer, prevNextPage, rowsPerPage);
      res.then(response => {
        rows.splice(rowsPerPage * page - rowsPerPage, rowsPerPage, response);
        setRows([response]);
        if (response.page !== null) setCount(response.page.totalRecords);
        setLoader(false);
        setIsExportButtonShow(false);
        setSearchText(preSearchedValue);
      },
        (error) => {
          errorHandlerFunction(error);
        }
      );
      setPage(newPage)
    }
    else {
      setIsSearchActive(false)
      setLoader(true);
      const res = services.getSubscriptionData(handleId, linkId, '', reseller, isDirectCustomer, prevNextPage, rowsPerPage);
      res.then(response => {
        rows.splice(rowsPerPage * page - rowsPerPage, rowsPerPage, response);
        setRows([response]);
        if (response.page !== null) setCount(response.page.totalRecords);
        setLoader(false);
        setIsExportButtonShow(true);
        setSearchText('');
        setPreSearchedValue('');
      },
        (error) => {
          errorHandlerFunction(error);
        }
      );
      setPage(newPage)
    }
  }
   
  const handleChangeRowsPerPage = event => {

    let selectedRowsPerPage = parseInt(event.target.value);
    if (isEmpty(preSearchedValue) === true || preSearchedValue === null || preSearchedValue === '') {
      setLoader(true);
      const res = services.getSubscriptionData(handleId, linkId, '', reseller, isDirectCustomer, 0, selectedRowsPerPage);
      res.then(response => {
        setRows([response]);
        setRowsPerPage(parseInt(event.target.value));
        if (response.page !== null) setCount(response.page.totalRecords);
        setPage(0);
        setLoader(false);
        setIsExportButtonShow(true);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
    else {
      setLoader(true);
      let searchSubscriptionLinkId = ((isAssociate || isDirectCustomer) ? '' : linkId);
      let searchValue = '&subscriptionName=' + preSearchedValue + '&customerName=' + preSearchedValue + '&activationDate=' + preSearchedValue + '&expirationDate=' + preSearchedValue + '&status=' + preSearchedValue + '&poNumber=' + preSearchedValue + '&domain=' + preSearchedValue + '&sapContractNumber=' + preSearchedValue + '&isSearchRequest=true'
      // let isDirectCustomerForSearch = false;
      const res = services.getSubscriptionData(handleId, searchSubscriptionLinkId, searchValue, reseller, isDirectCustomer, 0, selectedRowsPerPage);
      res.then(response => {
        setRows([response]);
        setRowsPerPage(parseInt(event.target.value));
        if (response.page !== null) setCount(response.page.totalRecords);
        setPage(0);
        setLoader(false);
        setIsExportButtonShow(false);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
  };

  let isEmpty = (str) => {
    return !str.trim().length;
  }

  const fetchSubscriptionSearchResult = () => {
    let searchSubscriptionLinkId = ((isAssociate || isDirectCustomer) ? '' : linkId);
    if (isEmpty(searchText) === true || searchText === null || searchText === '') {
      setLoader(true);
      const res = services.getSubscriptionData(handleId, linkId, '', reseller, isDirectCustomer, 0, rowsPerPage);
      console.log(res)
      res.then(response => {
        setRows([response]);
        console.log("this is setrows", rows)
        if (response.page !== null) setCount(response.page.totalRecords);
        setRowsPerPage(rowsPerPage);
        setPage(0);
        setLoader(false);
        setIsExportButtonShow(true);
        setIsSearchActive(false);
        setPreSearchedValue('');
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
    else {
      let searchValue = '&subscriptionName=' + searchText + '&customerName=' + searchText + '&activationDate=' + searchText + '&expirationDate=' + searchText + '&status=' + searchText + '&poNumber=' + searchText + '&domain=' + searchText + '&sapContractNumber=' + searchText + '&isSearchRequest=true'
      setLoader(true);
      // let isDirectCustomerForSearch = false;
      const res = services.getSubscriptionData(handleId, searchSubscriptionLinkId, searchValue, reseller, isDirectCustomer, 0, rowsPerPage);
      res.then(response => {
        setRows([response]);
        if (response.page !== null) setCount(response.page.totalRecords);
        setRowsPerPage(rowsPerPage);
        setPage(0);
        setLoader(false);
        setIsExportButtonShow(false);
        setIsSearchActive(true); 
        setPreSearchedValue(searchText);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
  }

  const errorHandlerFunction = (error) => {
    console.log("error ==> ", error)
    setLoader(false);
  }

  const updateSystemId = (subscriptionName, index, newIpoSystemId) => {
    //setLoader(true);
    setTinyLoader(true)
    let newSubscriptionListArr = [...rows];
    newSubscriptionListArr[0]["subscriptionList"][index]["systemIdAvailable"] = true;
    setRows(newSubscriptionListArr);

    let requestOptions = {
      subscription_number: subscriptionName,
      systemId: newIpoSystemId
    }
    // const isValidLength = checkLength(newIpoSystemId);
    let isValidLength = false
    isValidLength = checkLength(newIpoSystemId);
    if (isValidLength) {
      setVisibleWarning(false)
      const systemIdRes = services.updateSystemId(requestOptions);
      systemIdRes.then(res => {
        if (res.status === 200 || res.status === "success") {
          setIsSystemIdEditable(true)
          console.log("success ==> ", res.status)
          //fetchSubscriptionSearchResult();
          setVisibleWarning(false);
          setTinyLoader(false);
          //setLoader(false);
        }
        else {
          setVisibleWarning(true);
          setTinyLoader(false);
          //setLoader(false)

          console.log("Error", res.status)
        }
        //Changes for disabling systemId edit box 
        let newSubscriptionListArr = [...rows];
        newSubscriptionListArr[0]["subscriptionList"][index]["systemIdAvailable"] = true;
        setRows(newSubscriptionListArr);
      })
    } else {
      setVisibleWarning(true);
      console.log('Validation false');
      if (newIpoSystemId.length < 10 || newIpoSystemId.length >= 32) {
        setVisibleWarningMessage("Please provide valid System Id")
      }
      else if (newIpoSystemId === resetIpoSystemId.ipoSystemId) {
        setVisibleWarningMessage("Same System Id value has been found. Please enter different value.")
      }
      else {
        setVisibleWarningMessage("Please provide valid System Id")
      }
      // setVisible(true);
      //setLoader(false);
      let newSubscriptionListArr = [...rows];
      newSubscriptionListArr[0]["subscriptionList"][index]["systemIdAvailable"] = false;
      setRows(newSubscriptionListArr);
      setTinyLoader(false);
    }
  }

  const systemIdValidation = (input, rowIndex, systemIdAvailable, ipoSystemIds) => {
    if (input == "edit") {
      setIsSystemIdEditable(false)
      let newSubscriptionListArr = [...rows];
      newSubscriptionListArr[0]["subscriptionList"][rowIndex]["systemIdAvailable"] = false;
      setRows(newSubscriptionListArr);
    }              
    else if (input == "clear") {
      setIsSystemIdEditable(resetIpoSystemId.systemIdAvailable)
      setVisibleWarning(false);
      let newSubscriptionListArr = [...rows];
      newSubscriptionListArr[0]["subscriptionList"][rowIndex]["ipoSystemId"] = resetIpoSystemId.ipoSystemId;
      newSubscriptionListArr[0]["subscriptionList"][rowIndex]["systemIdAvailable"] = resetIpoSystemId.systemIdAvailable;
      setRows(newSubscriptionListArr);
    }
  }

  const checkForRenewalButtonStatus = (data) => {

    // Algorithm for Powered By Virtualized Materials

    //     check eligibleForRenewal
    //     if true then
    //     check validForRenewal
    //     if true then
    //     get poweredByVirtualizedMaterials node value
    //     if poweredByVirtualizedMaterials not blank
    //     call web service & get response
    //     if response = true then
    //     enable renew button
    //         else
    //   disable renew button
    //       else
    //   enable renew button
    //     else
    //        if poweredByVirtualizedMaterials not blank
    //          disable renew button
    //        else 
    //          enable renew button
    // else
    //   disable renew button

    if (data.eligibleForRenewal) {
      if (data.validForRenewal) {
        if (data.poweredByVirtualizedMaterials !== "" && data.poweredByVirtualizedMaterials !== null) {
          setRenewalFlag(true)
        }
      } else {
        if (data.poweredByVirtualizedMaterials !== "" && data.poweredByVirtualizedMaterials !== null) {
          setRenewalFlag(false)
        }
        else {
          setRenewalFlag(true)
        }
      }
    }
    else {
      setRenewalFlag(false)
    }
  }

  const collapseComponent = (tableProps) => (
    <tr>
      <td colSpan={headCells.length}>
        <div className={tableProps.className}>

          {tableProps.children}
        </div>
      </td>
    </tr>
  )

  const setSystemIDValue = rowIndex => e => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      let newSubscriptionListArr = [...rows];
      newSubscriptionListArr[0]["subscriptionList"][rowIndex]["ipoSystemId"] = e.target.value;
      setRows(newSubscriptionListArr);
    }
  }

  const exportAllSubscriptions = event => {
    services.downloadAllSubscriptions(handleId, linkId, reseller);
  }

  return (
    <div>
      {/* <div className="App">
        <Auth />
      </div> */}
      <ThemeProvider theme={theme}>
        <div style={{ paddingBottom: '15px' }}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Grid item xs={2}>
              <Paper className={classes.paper}>
                <input style={searchBoxStyle} className="form-control" type="text" placeholder="SEARCH HERE" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
              </Paper>
            </Grid>
            <Grid item xs={2}>
              <Paper className={classes.paper}>
                <button className="btn btn-primary" style={searchButton} onClick={fetchSubscriptionSearchResult}>
                  <SearchIcon />
                </button>
              </Paper>
            </Grid>
            {isExportButtonShowToPartner && isExportButtonShow ?
              <Grid item xs={8}>
                <Paper className={classes.paper}>
                  <span className="btn btn-primary" title="Export" disabled={(rows && rows[0] && rows[0].subscriptionList && rows[0].subscriptionList.length > 0) ? "" : "disabled"} style={exportButton} onClick={exportAllSubscriptions}>
                    <GetAppIcon />Export
                </span>
                </Paper>
              </Grid>
              : ''}
          </Grid>
        </div>


        <Paper className={classes.root} style={{ boxShadow: '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)' }}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {loader ? <TableCell align="center" colSpan={6}><Loader /> </TableCell> :
                  (rows.map(row => (row.subscriptionList) ? row.subscriptionList.map((data, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <TableRow key={data.subscriptionName}>
                        <TableCell align="left">
                          <div className="subrow_1">{data.subscriptionName}(S)</div>
                          {(data.sapContractNumber != null) ? <div className="subrow_2" style={{ color: "rgb(228, 147, 0)" }}>{data.sapContractNumber}(C)</div> : ""}
                        </TableCell>
                        <TableCell >{data.customerName}</TableCell>
                        <TableCell >{data.partnerName}</TableCell>
                        <TableCell >{data.domain}</TableCell>
                        <TableCell >{data.poNumber}</TableCell>
                        <TableCell >{data.startDate}</TableCell>
                        <TableCell >{data.expiryDate}</TableCell>
                        <TableCell >{data.status}</TableCell>
                        <TableCell >{(selectedRow !== (data.subscriptionName + data.sapContractNumber)) ? <AddIcon onClick={() => {
                          setSelectedRow(data.subscriptionName + data.sapContractNumber);
                          if (data.ipoSystemId !== null) {
                            data.systemIdAvailable = true;
                          }
                          else {
                            data.systemIdAvailable = false;
                          }
                          setIsSystemIdEditable(data.systemIdAvailable);
                          setResetIpoSystemId({ "ipoSystemId": data.ipoSystemId, "systemIdAvailable": data.systemIdAvailable });
                          setVisibleWarning(false);
                          checkForRenewalButtonStatus(data);
                          // setCollapse(true);
                          // setShowUsageFields(false)
                          // setShowDownloadUsage(false)
                          // setExpand(false)
                        }} /> : <RemoveIcon onClick={() => {
                          setSelectedRow('');
                          // setCollapse(false)
                        }} />}</TableCell>
                      </TableRow>
                      <Collapse
                        in={selectedRow === (data.subscriptionName + data.sapContractNumber)}
                        timeout="auto"
                        component={collapseComponent}
                        unmountOnExit
                        rowName={data.subscriptionName}>
                        <div className={classes.root}>
                          <Grid container spacing={1}>
                            <Grid container item xs={12} spacing={3}>
                              <div   >
                                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "15px" }}>
                                  <Grid item xs={2.5} className={classes.paper} style={{ background: '#f9f9fa !important' }}>
                                    <Paper className={classes.labelBackground}><Box className={classes.customExpand} >Subscription Owner Name :</Box></Paper>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Paper className={classes.labelBackground} ><Box fontWeight="fontWeightLight" fontSize="13px">{data.subscriptionOwnerName}</Box></Paper>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <Paper className={classes.labelBackground} ><Box className={classes.customExpand} background="#f9f9fa" m={1}>Invoice Owner Name :</Box></Paper>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Paper className={classes.labelBackground} ><Box fontWeight="fontWeightLight" fontSize="13px" m={1}>{data.invoiceOwnerName}</Box></Paper>
                                  </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "15px" }}>
                                  <Grid item xs={2.5}>
                                    <Paper className={classes.labelBackground} ><Box className={classes.customExpand} background="#f9f9fa">Subscription Owner Account :</Box></Paper>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Paper className={classes.labelBackground} ><Box fontWeight="fontWeightLight" fontSize="13px">{data.subscriptionOwnerAccount}</Box></Paper>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <Paper className={classes.labelBackground} ><Box className={classes.customExpand} background="#f9f9fa" m={1}>Invoice Owner Account :</Box></Paper>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Paper className={classes.labelBackground} ><Box fontWeight="fontWeightLight" fontSize="13px" m={1}>{data.invoiceOwnerAccount}</Box></Paper>
                                  </Grid>
                                </Grid>
                                {/* START Technical Contact Details */}
                                <div className="App">
                                  <TechnicalContactDetails data={data} />
                                </div>
                                {/* END Technical Contact Details */}

                                {/* #######  Product details Start ########    */}
                                <ProductDetails data={data} isReseller={reseller}></ProductDetails>
                                {/* #######  Invoice Table Start ########    */}
                                <GetSubscriptionInvoice data={data} isReseller={reseller} isDirect={isDirectCustomer} ></GetSubscriptionInvoice>

                                {/* Start Usages Data */}
                                <SubscriptionUsageDetails data={data}></SubscriptionUsageDetails>
                                {/* #######  System ID Input Start ########    */}
                                {data.showSystemId ?
                                  <Grid container direction="row" justify="flex-start" style={{ marginTop: "15px" }} alignItems="flex-start">
                                    <Grid item xs={2}>
                                      <Paper style={{ background: '#f9f9fa' }} className={classes.customPaper}>
                                        <Box fontWeight="fontWeightBold" m={1} ><span className="systemLabel">System Id:</span></Box>
                                      </Paper>
                                    </Grid>
                                    <Grid item xs={2}>
                                      <Paper className={classes.tablePaper}>
                                        <input className="form-control" type="text" value={data.ipoSystemId} onChange={setSystemIDValue(rowIndex)} disabled={data.systemIdAvailable} placeholder="Enter System Id" ref={(input) => { input && window.requestAnimationFrame(() => { input.focus() }) }} />
                                        {tinyLoader ? <div class="icon-container">
                                          <i class="loader"></i>
                                        </div> : null}
                                      </Paper>
                                    </Grid>
                                    {!isSystemIdEditable && data.systemIdEditable ?
                                      <Grid item xs={1}>
                                        <Paper className={classes.customPaper}>
                                          <button className="btn btn-primary"
                                            style={searchButton}
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            disabled={(!data.systemIdAvailable && data.ipoSystemId !== null && data.ipoSystemId !== '') ? "" : "disabled"}
                                            onClick={() => updateSystemId(data.subscriptionName, rowIndex, data.ipoSystemId)}
                                            startIcon={<SaveIcon />}>Update</button>
                                        </Paper>
                                      </Grid> : null}
                                    {isSystemIdEditable && data.systemIdEditable ?
                                      <Grid item xs={1}>
                                        <Paper className={classes.customPaper}>
                                          <button className="btn btn-primary"
                                            style={searchButton}
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={() => systemIdValidation("edit", rowIndex, data.systemIdAvailable, data.ipoSystemId)}>Edit</button>
                                        </Paper>
                                      </Grid> : null}
                                    {!isSystemIdEditable && data.systemIdEditable && data.ipoSystemId !== null ?
                                      <Grid item xs={1}>
                                        <Paper className={classes.customPaper}>
                                          <button className="btn btn-primary"
                                            style={searchButton}
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            disabled={(!data.systemIdAvailable) ? "" : "disabled"}
                                            onClick={() => systemIdValidation("clear", rowIndex, data.systemIdAvailable, data.ipoSystemId)}>Clear</button>
                                        </Paper>
                                      </Grid> : null}
                                    {/* {tinyLoader ?
                                    <Grid item xs={1}>
                                      <Paper className={classes.customPaper}>
                                        <CircularProgress />
                                      </Paper>
                                    </Grid>: null }                             */}
                                  </Grid> : null}
                                <Grid item xs={12} style={{ marginLeft: "17%" }}>
                                  {visibleWarning ? <p style={{ fontSize: "13px", color: "red" }}> {visibleWarningMessage}</p> : null}
                                </Grid>
                                <br />

                                {/* #######  Subscription Action Buttons #######  */}
                                <SubscriptionActionButtons data={data} isrenewalFlag={isrenewalFlag} isDirectCustomer={isDirectCustomer} linkId={linkId}></SubscriptionActionButtons>
                              </div>
                              <br />
                            </Grid>
                          </Grid>
                        </div>
                      </Collapse>
                    </React.Fragment>
                  )) : <TableCell align="center" colSpan={7}>No Data Found</TableCell>))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </ThemeProvider>
    </div>
  );
}

const theme = createMuiTheme({
  typography: {
    subtitle1: {
      fontSize: 16,
      fontWeight: 500
    },
    body1: {
      fontWeight: 500,
    }
  },
});

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  root: {
    width: '100%',
    flexGrow: 1
  },
  container: {
    // minHeight: 440,
  },
  paper: {
    textAlign: 'left',
    boxShadow: 'none',
    // paddingLeft: '5%'
  },
  labelBackground: {
    textAlign: 'left',
    boxShadow: 'none',
    background: '#f9f9fa !important',
  },
  productTitle: {
    borderBottom: '3px solid #DA291C',
    width: 'auto !important',
    fontWeight: '500',
    fontSize: '15px',
  },
  expandTab: {
    minHeight: '400px'
  },
  minifyTab: {
    width: 'auto'
  },
  systemTitle: {
    borderBottom: '3px solid #DA291C',
    width: 'max-content',
    fontWeight: '500',
    fontSize: '15px',
  },
  tablePaper: {
    textAlign: 'left',
    boxShadow: 'none',
  },
  customPaper: {
    textAlign: 'left',
    boxShadow: 'none'
  },
  customExpand: {
    fontSize: '13px',
    fontWeight: '600',
    display: 'inline-block',
    minWidth: '207px'
  },
  detailsTableCell: {
    borderBottom: '1px solid #ccc',
    background: '#f1f1f3',
    cursor: 'auto',
    fontWeight: 'normal',
    whiteSpace: 'normal'
  },

});
const inputStyle = {
  fontSize: "14px",
}
const searchBoxStyle = {
  width: '100%',
  borderRadius: '0px',
  height: '39px'
}

const searchButton = {
  marginRight: '72.5%',
  padding: '7px 26px 6px'
}

const exportButton = {
  float: 'right'
}
