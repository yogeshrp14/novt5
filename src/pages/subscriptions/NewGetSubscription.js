import { property } from "lodash";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { DecryptLocalStorage } from "../../components/shared/local-storage/local-storage";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Collapse, Grid, Paper } from "@material-ui/core";
import services from '../../components/Services/service';
import SearchIcon from '@material-ui/icons/Search';
import Loader from '../../components/shared/spinner/spinner';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useToasts } from 'react-toast-notifications';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import ProductDetails from './product-details';
import GetSubscriptionInvoice from './Invoice-details';
import Box from '@material-ui/core/Box';
import SubscriptionActionButtons from './Subscription-action-buttons'
import SubscriptionUsageDetails from './Usage-details';


export default function NewGetSubscription(props) {
      const classes = useStyles();
      const [order, setOrder] = useState('desc');
      const [orderBy, setOrderBy] = useState('created');
      const [isExportButtonShowToPartner, setIsExportButtonShowToPartner] = useState(true);
      let [page, setPage] = useState(0)
      const [resetIpoSystemId, setResetIpoSystemId] = useState({ "ipoSystemId": "", "systemIdAvailable": "" });
      const [searchText, setSearchText] = useState('');
      const [isAssociate] = useState(props.isAssociate);
      const [isDirectCustomer] = useState(props.isDirectCustomer);
      const [linkId] = useState(props.linkId);
      const [reseller] = useState(props.isReseller);
      const [handleId] = useState(props.handleId);
      const [rowsPerPage, setRowsPerPage] = useState(5);
      const [loader, setLoader] = useState(false)
      const [rows, setRows] = useState(props.data)
      const [count, setCount] = useState(props.pageCount);
      const [isExportButtonShow, setIsExportButtonShow] = useState(true);
      const [isSearchActive, setIsSearchActive] = useState(false);
      const [preSearchedValue, setPreSearchedValue] = useState('');
      const [selectedRow, setSelectedRow] = useState('');
      const [isSystemIdEditable, setIsSystemIdEditable] = useState(false);
      const [tinyLoader, setTinyLoader] = React.useState(false);
      const [visibleWarning, setVisibleWarning] = useState(false);
      let { addToast } = useToasts();
      const [isrenewalFlag, setRenewalFlag] = React.useState(false);

      const headCells = [
            { id: "subscriptionName", numeric: false, disablePadding: true, label: "Subscription Name/Contract No", },
            { id: "endCustomerName", numeric: false, disablePadding: false, label: "End Customer Name", },
            { id: "partnerName", numeric: false, disablePadding: false, label: "Partner Name", },
            { id: "domain", numeric: false, disablePadding: false, label: "Domain" },
            { id: "poNumber", numeric: true, disablePadding: false, label: "PO Number", },
            { id: "activatedOn", numeric: true, disablePadding: false, label: "Start Date", },
            { id: "expirationDate", numeric: true, disablePadding: false, label: "End Date", },
            { id: "status", numeric: false, disablePadding: false, label: "Status" },
            { id: "rowStatus", numeric: false, disablePadding: false, label: "" },
      ];

      const columns = [
            { id: "materialCode", label: "First Name", align: "center", minWidth: 170 },
            { id: "productRatePlanName", label: "Last Name", align: "center", minWidth: 170, },
            { id: "qty", label: "Email Id", align: "center", minWidth: 170 },
            { id: "startDate", label: "Phone No.", align: "center", minWidth: 170 },
            { id: "endDate", label: "Country", align: "center", minWidth: 170 },
            { id: "action", label: "", align: "center", minWidth: 170 },
      ];

      function EnhancedTableHead(tableProps) {
            // const { classes, order, orderBy, onRequestSort } = tableProps;
            const createSortHandler = property => event => {
                  //   onRequestSort(event, property);
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

      EnhancedTableHead.propTypes = {
            classes: PropTypes.object.isRequired,
            onRequestSort: PropTypes.func.isRequired,
            order: PropTypes.oneOf(["asc", "desc"]).isRequired,
            orderBy: PropTypes.string.isRequired,
            rowCount: PropTypes.number.isRequired,
      };

      useEffect(() => {
            let bpLinkId = DecryptLocalStorage('bpLinkId')

            if (bpLinkId !== null) {
                  setIsExportButtonShowToPartner(true);
            }
            else {
                  setIsExportButtonShowToPartner(false);
            }
      }, [])
      let Page = page + 1;

      const TechnicalContactDetails = () => {

      }

      const fetchSubscriptionSearchResult = () => {
            let searchSubscriptionLinkId = ((isAssociate || isDirectCustomer) ? '' : linkId)
            if (isEmpty(searchText) || searchText === null || searchText === '') {
                  setLoader(true)
                  const res = services.getSubscriptionData(handleId, linkId, '', reseller, isDirectCustomer, 0, rowsPerPage);
                  res.then(response => {
                        setRows([response])
                        if (response.page != null) setCount(response.page.totalRecords);
                        setPage(0);
                        setLoader(false);
                        setIsExportButtonShow(true);
                        setIsSearchActive(false);
                        setPreSearchedValue('');
                  }, (error) => {
                        errorHandlerFunction(error)
                  })
            } else {
                  setLoader(true)
                  let searchSubscriptionLinkId = ((isAssociate || isDirectCustomer) ? '' : linkId);
                  let searchValue = '&subscriptionName=' + preSearchedValue + '&customerName=' + preSearchedValue + '&activationDate=' + preSearchedValue + '&expirationDate=' + preSearchedValue + '&status=' + preSearchedValue + '&poNumber=' + preSearchedValue + '&domain=' + preSearchedValue + '&sapContractNumber=' + preSearchedValue + '&isSearchRequest=true'
                  setLoader(true);
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
                  }, (error) => {
                        errorHandlerFunction(error)
                  })

            }

      }

      const checkForRenewalButtonStatus = (data) => {


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



      const exportAllSubscriptions = event => {
            services.downloadAllSubscriptions(handleId, linkId, reseller);
      }


      const errorHandlerFunction = (error) => {
            console.log("Error is =>" + error)
      }
      let isEmpty = (str) => {
            return !str.trim().length;
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
      const handleChangePage = (event, newPage) => {
            let prevNextPage;
            if (page > newPage) {
                  prevNextPage = Page - 1;
            } else {
                  prevNextPage = Page + 1
            }
            if (isSearchActive && !isEmpty(preSearchedValue)) {
                  setLoader(true)
                  let searchSubscriptionLinkId = ((isAssociate || isDirectCustomer) ? '' : linkId);
                  let searchValue = '&subscriptionName=' + preSearchedValue + '&customerName=' + preSearchedValue + '&activationDate=' + preSearchedValue + '&expirationDate=' + preSearchedValue + '&status=' + preSearchedValue + '&poNumber=' + preSearchedValue + '&domain=' + preSearchedValue + '&sapContractNumber=' + preSearchedValue + '&isSearchRequest=true'
                  const res = services.getSubscriptionData(handleId, searchSubscriptionLinkId, searchValue, reseller, isDirectCustomer, prevNextPage, rowsPerPage);
                  res.then(response => {
                        rows.splice(rowsPerPage * page - rowsPerPage, rowsPerPage, response)
                        setRows([response])
                        if (response.page !== null) setCount(response.page.totalRecords);
                        setLoader(false);
                        setIsExportButtonShow(false);
                        setSearchText(preSearchedValue);
                  }, (error) => {
                        console.log("Eroor =>" + error)
                  })
                  setPage(newPage)
            } else {
                  {
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

















      return <div>
            <ThemeProvider theme={theme}>
                  <div style={{ padding: "15px" }}>
                        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                              <Grid item xs={2}>
                                    <Paper className={classes.paper}>
                                          <input style={{ searchBoxStyle }} className='form-control' type='text' placeholder="Search Here" value={searchText} onChange={(event) => (setSearchText(event.target.value))} />
                                    </Paper>
                              </Grid>
                              <Grid item xs={2}>
                                    <Paper className={classes.paper}>
                                          <button className='btn btn-primary' style={searchButton} onClick={fetchSubscriptionSearchResult}><SearchIcon /></button>
                                    </Paper>
                              </Grid>
                              {isExportButtonShowToPartner && isExportButtonShow ?
                                    <Grid item xs={8}>
                                          <Paper className={classes.paper}>
                                                <span className="btn btn-primary" title="Export" disabled={(rows && rows[0] && rows[0].subscriptionList && rows[0].subscriptionList.length > 0) ? "" : "disabled"} style={exportButton} onClick={exportAllSubscriptions}>
                                                      <GetAppIcon />Export
                </span>
                                          </Paper>
                                    </Grid> : ''}

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
                                          {loader ? <TableCell align='center' colSpan={6}> <Loader /> </TableCell> :
                                                (rows.map(row => (row.subscriptionList) ? row.subscriptionList.map((data, rowIndex) => (
                                                      <React.Fragment key={rowIndex}>
                                                            <TableRow key={data.subscriptionName}>
                                                                  <TableCell align='left'>
                                                                        <div className='subrow_1'>{data.subscriptionName}(S)</div>
                                                                        {(data.sapContractNumber != null) ? <div className="subrow_2" style={{ color: "rgb(228, 147, 0)" }}>{data.sapContractNumber}(C)</div> : ""}
                                                                  </TableCell>
                                                                  <TableCell >{data.customerName}</TableCell>
                                                                  <TableCell >{data.partnerName}</TableCell>
                                                                  <TableCell >{data.domain}</TableCell>
                                                                  <TableCell >{data.poNumber}</TableCell>
                                                                  <TableCell >{data.startDate}</TableCell>
                                                                  <TableCell >{data.expiryDate}</TableCell>
                                                                  <TableCell >{data.status}</TableCell>
                                                                  <TableCell>
                                                                        {(selectedRow !== (data.subscriptionName + data.sapContractNumber)) ? <AddIcon onClick={() => {
                                                                              setSelectedRow(data.subscriptionName + data.sapContractNumber)
                                                                              if (data.ipoSystemId !== null) {
                                                                                    data.systemIdAvailable = true;
                                                                              } else {
                                                                                    data.systemIdAvailable = false;
                                                                              }
                                                                              setIsSystemIdEditable(data.systemIdAvailable)
                                                                              setResetIpoSystemId({ "ipoSystemId": data.ipoSystemId, "systemIdAvailable": data.systemIdAvailable });
                                                                              setVisibleWarning(false);
                                                                              checkForRenewalButtonStatus(data);

                                                                        }} /> : <RemoveIcon onClick={() => { setSelectedRow('') }} />}
                                                                  </TableCell>

                                                            </TableRow>
                                                            <Collapse
                                                                  in={selectedRow === (data.subscriptionName + data.sapContractNumber)}
                                                                  timeout='auto'
                                                                  component={collapseComponent}
                                                                  unmountOnExit
                                                                  rowName={data.subscriptionName}>
                                                                  <div className={classes.root}>
                                                                        <Grid container spacing={1}>
                                                                              <Grid container item xs={12} spacing={3}>
                                                                                    <div style={{ border: '1px solid lightgrey', margin: '5px 10px 0 10px', padding: '10px 5px', background: '#f9f9fa', maxWidth: "100%", minWidth: "100%" }}>
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
                                                                                          <ProductDetails data={data} isReseller={reseller} isDirect={isDirectCustomer}></ProductDetails>
                                                                                          <SubscriptionUsageDetails data={data}></SubscriptionUsageDetails>
                                                                                    </div>

                                                                              </Grid>

                                                                        </Grid>
                                                                  </div>

                                                            </Collapse>
                                                      </React.Fragment>

                                                )) : <TableCell align="center" colSpan={7}>No Data Found</TableCell>))}
                                    </TableBody>
                              </Table>

                        </TableContainer>
                  </Paper>

            </ThemeProvider>



      </div>;
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

