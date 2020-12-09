/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import services from '../../components/Services/service';
import Loader from '../../components/shared/spinner/spinner';
import queryString from 'query-string';
import { ValidateLocalStoragealue, EncryptLocalStorage, DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
import { Collapse } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { environment } from '../../environment';
import { DecryptRBAC } from '../../components/shared/rbac-system/rbac-control';
import WarinigDialog from '../../components/shared/rbac-system/warning-dialog';
import * as moment from 'moment';
import { Next } from 'react-bootstrap/PageItem';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array = [], cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: 'poNumber', numeric: true, disablePadding: false, label: 'PO Number' },
  { id: 'solutionId', numeric: false, disablePadding: false, label: 'Solution ID' },
  { id: 'orderType', numeric: false, disablePadding: false, label: 'Order Type' },
  { id: 'orderStatus', numeric: true, disablePadding: false, label: 'Order Status' },
  { id: 'submittedDate', numeric: false, disablePadding: false, label: 'Submitted Date' },
  { id: 'partnerName', numeric: false, disablePadding: false, label: 'Partner Name' },
  { id: 'accountName', numeric: true, disablePadding: false, label: 'End Customer Name' },
  { id: 'rowStatus', numeric: false, disablePadding: false, label: '' }
];

const eventTableColumns = [
  // { id: 'srNo', label: 'No.', align: 'center', minWidth: 30 },
  { id: 'eventTime', label: 'Event Time', align: 'center' },
  { id: 'eventText', label: 'Event Description', align: 'center' },
  { id: 'eventStatus', label: 'Event Status', align: 'center' }
];

const collapseComponent = (props) => (
  <td colSpan={headCells.length}>
    <div className={props.className}>
      {props.children}
    </div>
  </td>
)
function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="table-header">
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}

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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },

  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tablePaper: {
    textAlign: 'left',
    boxShadow: 'none',
  },
  eventlabel: {
    width: 'max-content',
    borderBottom: '3px solid #DA291C',
    fontWeight: '500',
    fontSize: '15px',
    marginBottom: '5px',
  },
  productTitle: {
    borderBottom: '3px solid #DA291C',
    width: 'auto !important',
    fontWeight: '500',
    fontSize: '15px',
  },
}));



export default function Orders(props) {
  const classes = useStyles();
  let link_id;
  let handleId = DecryptLocalStorage('handleId');
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('created');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(10);
  let [searchText, setSearchText] = useState('');
  const [preSearchedValue, setPreSearchedValue] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  let Page = page + 1;
  const [loader, setLoader] = React.useState(false);
  //Seting LinkId for Pagination, Search and Sorting
  const [linkId, setLinkId] = React.useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [expand, setExpand] = React.useState(false);
  // const [eventsData, setEventsData] = useState([]);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const acsEndPoint = environment.acsEndPoint;
  let rolebaseControl = DecryptRBAC("RBAC")
  const [warningMessage, setWarningMessage] = React.useState("");
  const [showsAccessControlWaring, setShowsAccessControlWaring] = useState(false);
  const AccessControlWaringOpenModal = () => setShowsAccessControlWaring(true);
  const AccessControlWaringCloseModal = () => setShowsAccessControlWaring(false);
  let userType =  DecryptLocalStorage('userType');

  const searchBoxStyle = {
    width: '300px',
    marginLeft: '15px',
    borderRadius: '0px',
    height: '39px'
  }

  useEffect(() => {
  })

  const errorHandlerFunction = (error) => {
    console.log("error ==> ", error)
    setLoader(false);
  }

  useEffect(() => {
    if (rolebaseControl && rolebaseControl.Orders) {
      if (ValidateLocalStoragealue('bpLinkId')) {
        link_id = DecryptLocalStorage('bpLinkId')
        initialOrdersService();
      }
      else if (ValidateLocalStoragealue('linkId')) {
        link_id = DecryptLocalStorage('linkId');
        initialOrdersService();
      }
      else {
        props.history.push('/dashboard/partner');
      }
    }
    else {
      props.history.push('/dashboard/partner');
    }
  }, [link_id, handleId])

  const initialOrdersService = () => {
    setLoader(true);
    let param = queryString.parse(props.location.search);
    let param_linkid = (param && param.link_id !== '') ? param.link_id : null;
    link_id = (param_linkid && param_linkid != null) ? param_linkid : link_id;
    //Capturing link_id and Setting it to pass for search orders api, sort,rows per page and pagination
    console.log("link_id ==>", link_id)
    if (link_id == -1) {
      link_id = "";
    }
    else {
      setLinkId(link_id);
      EncryptLocalStorage('linkId', link_id)
    }
    services.getOrdersData(handleId, link_id, Page, rowsPerPage, orderBy, order).then(res => {
      serviceResponseManager(res);
      setIsSearchActive(false);
    },
      (error) => {
        errorHandlerFunction(error);
      })
  }

  let isEmpty = (str) => {
    return !str.trim().length;
  }

  // Common function to handle response from Service
  const serviceResponseManager = (res) => {
    if (res.orderList.length > 0) {
      setRows(res.orderList);
      setShowMsg(true);
    }
    else {
      setRows([]);
      setShowMsg(false);
    }
    setCount(res.page.totalRecords);
    setLoader(false);
  }

  //Search Orders Api
  let fetchOrdersSearchResult = (property) => {
    Page = 1;
    if (isEmpty(searchText) === true || searchText === null || searchText === '') {
      const isAsc = orderBy === property && order === 'desc';
      const sortOrder = isAsc ? 'asc' : 'desc';
      setLoader(true);
      services.getOrdersData(handleId, linkId, 0, rowsPerPage, orderBy, sortOrder).then(res => {
        serviceResponseManager(res);
        setPage(0);
        setIsSearchActive(false);
        setOrder(sortOrder);
        setOrderBy(res.page.sortBy);
        setPreSearchedValue('');
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
    else {
      setLoader(true);
      // Page = 0;
      services.getSearchOrders(handleId, linkId, searchText, 0, rowsPerPage, orderBy, order, userType).then(res => {
        serviceResponseManager(res);
        setPage(0);
        setIsSearchActive(true);
        setPreSearchedValue(searchText);
      },
        (error) => {
          errorHandlerFunction(error);
        })
    }
  }
  //Sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    const sortOrder = isAsc ? 'desc' : 'asc';
    if (preSearchedValue === null || preSearchedValue === '') {
      setLoader(true);
      services.getOrdersData(handleId, linkId, Page, rowsPerPage, property, sortOrder).then(res => {
        serviceResponseManager(res);
        setOrder(sortOrder);
        setOrderBy(property);
      });
    }
    //Search Result Sorting
    else {
      setLoader(true);
      services.getSearchOrders(handleId, linkId, preSearchedValue, Page, rowsPerPage, property, sortOrder, userType).then(res => {
        serviceResponseManager(res);
        setOrder(sortOrder);
        setOrderBy(property);
      })

    }
  };

  //pagination for Order List 
  const handleChangePage = (event, newPage) => {
    // let link_id = linkId;
    let currentPage;
    if (page > newPage) {
      currentPage = Page - 1;
    }
    else {
      currentPage = Page + 1;
    }
    if (isSearchActive && !isEmpty(preSearchedValue)) {
      setLoader(true);
      services.getSearchOrders(handleId, linkId, preSearchedValue, currentPage, rowsPerPage, orderBy, order, userType).then(res => {
        serviceResponseManager(res);
        setPage(newPage);
        setSearchText(preSearchedValue);
      },
        (error) => {
          errorHandlerFunction(error);
        })

    }
    else {
      setLoader(true);
      services.getOrdersData(handleId, linkId, currentPage, rowsPerPage, orderBy, order).then(res => {
        serviceResponseManager(res);
        setPage(newPage);
        setSearchText('');
        setPreSearchedValue('');
      },
        (error) => {
          errorHandlerFunction(error);
        })
    }
  }

  const handleChangeRowsPerPage = event => {
    let selectedRowsPerPage = parseInt(event.target.value)
    if (isEmpty(preSearchedValue) === true || preSearchedValue === null || preSearchedValue === '') {
      setLoader(true);
      services.getOrdersData(handleId, linkId, 0, selectedRowsPerPage, orderBy, order).then(res => {
        setLoader(false);
        setRows(res.orderList)
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
    else {
      setLoader(true);
      services.getSearchOrders(handleId, linkId, preSearchedValue, 0, selectedRowsPerPage, orderBy, order, userType).then(res => {
        setLoader(false);
        setRows(res.orderList)
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }

  };
  let handleQuoteLinkClick = (rowId) => {
    if (rolebaseControl && rolebaseControl.QuoteSummary) {
      if (link_id) {
        window.location.assign(acsEndPoint + '?solution=' + rowId + '&linkId=' + link_id)
      } else {
        window.location.assign(acsEndPoint + '?solution=' + rowId);
      }
    }
    else {
      let key = "View Quotes summery"
      setWarningMessage("You are not eligible for " + key + " functionality");
      AccessControlWaringOpenModal()
    }
  }

  // const handleToggleEvent = (subscriptionId) => {
  //   // if (eventExpand === false) {
  //   setLoader(true);
  //   if (subscriptionId) {
  //     console.log('subscription id==>', subscriptionId)
  //     const response = services.getOrdersEventList(subscriptionId, '', '', '');
  //     response.then(res => {
  //       console.log('res length====>', res.length)
  //       setEventsData(res)
  //       setLoader(false);
  //     },
  //       (error) => {
  //         errorHandlerFunction(error);
  //       }
  //     );
  //   } else {
  //     console.log('in else id==>', subscriptionId)
  //     setEventsData([]);
  //     setLoader(false);
  //   }
  // }

  const handleChange = panel => (event, newExpanded) => {
    setExpand(newExpanded ? panel : false);
  };

  const isSelected = name => selected.indexOf(name) !== -1;
  return (
    <div>
      {/* Loader Componant */}
      {loader ? <Loader /> : null}
      <WarinigDialog closeModal={AccessControlWaringCloseModal} show={showsAccessControlWaring} message={warningMessage} />
      {/* Search Block */}
      <div className="row" style={{ 'padding': '20px 0 7px' }}>
        <div className="" style={{ paddingRight: '0px' }}>
          <input style={searchBoxStyle} className="form-control" type="text" placeholder="SEARCH HERE" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
          <button className="btn btn-primary" onClick={fetchOrdersSearchResult}>
            <SearchIcon /> </button>
        </div>
      </div>

      {/* Table Block */}
      
      <Paper className={classes.paper} style={{ boxShadow: '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)' }}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
            style={{padding: "6px 10px 6px 16px"}}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            {showMsg ?
              <TableBody>
                {stableSort(rows, getSorting(order, orderBy))
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.solutionId);
                    // const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <React.Fragment>
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.orderId}
                          selected={isItemSelected}
                        >
                          <TableCell className="TableCell">{row.poNumber}</TableCell>
                          {/* <TableCell className="TableCell" onClick={(e) => { e.stopPropagation() }}>
                            <div onClick={() => { handleQuoteLinkClick(row.solutionId) }}>
                              <a style={{ color: "blue" }}>{row.solutionId}</a>
                            </div>
                          </TableCell> */}
                          <TableCell className="TableCell" onClick={(e) => { e.stopPropagation() }} style={{ width: '20%' }} >
                            <div onClick={() => { handleQuoteLinkClick(row.solutionId) }}>
                              <div><a style={{ color: "blue" }}>{row.solutionId}</a> </div>
                              <div><a style={{ color: "rgb(228, 147, 0)" }}>{row.quoteId} ({row.quoteType}) - {row.orderStatus}</a></div>
                            </div>
                          </TableCell>
                          <TableCell className="TableCell">{row.orderType}</TableCell>
                          <TableCell className="TableCell">{row.orderStatus}</TableCell>
                          <TableCell className="TableCell">{row.submittedDate}</TableCell>
                          <TableCell className="TableCell">{row.partnerName}</TableCell>
                          <TableCell className="TableCell">{row.accountName}</TableCell>
                          {/* <TableCell className="TableCell EndCustomerCell">{row.endCustomerName}</TableCell> */}
                          <TableCell >{(selectedRow !== row.orderId) ? <AddIcon onClick={() => {
                            setSelectedRow(row.orderId); setShowEventDetails(true);
                            // handleToggleEvent(row.subscriptionNumber);
                          }} /> : <RemoveIcon onClick={() => { setSelectedRow(''); setShowEventDetails(false) }} />}
                          </TableCell>
                        </TableRow>
                        <Collapse
                          in={selectedRow === row.orderId}
                          timeout="auto"
                          component={collapseComponent}
                          unmountOnExit
                          rowName={row.orderId}>
                          <div style={{ border: '1px solid lightgrey', padding: '10px 5px', background: '#f9f9fa' }}>
                            <Grid
                              container
                              direction="row"
                              justify="flex-start"
                              alignItems="flex-start" className="event-tab">

                              {row.events && row.events.length > 0 ?
                                <div className={classes.root}>
                                  <Grid container spacing={1}>
                                    <Grid container item xs={12} spacing={3}>
                                      <React.Fragment>
                                        <Grid item xs={6}>
                                          <Paper className={classes.paper}>
                                            {showEventDetails ?
                                              <TableContainer style={{ display: '-webkit-inline-box' }}>
                                                <Table aria-label="simple table" style={{ marginRight: '5px', padding: '15px 15px 15px 0px', border: '1px solid rgb(174, 174, 174)' }}>
                                                  <TableHead className="table-header">
                                                    <TableRow style={{
                                                      whiteSpace: 'nowrap',
                                                      cursor: 'pointer',
                                                      fontSize: '13px',
                                                      background: 'rgb(249, 249, 250)'
                                                    }}>
                                                      {
                                                        eventTableColumns.map(column => (
                                                          <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            style={{
                                                              minWidth: column.minWidth,
                                                              fontWeight: 'bold',
                                                              borderBottom: '1px solid rgb(0, 0, 0)',
                                                              cursor: 'pointer',
                                                              alignItems: 'center'
                                                            }}>
                                                            {column.label}
                                                          </TableCell>
                                                        ))
                                                      }
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {row.events && row.events.length > 0 ?
                                                      row.events.slice(0, 3).map(
                                                        (event, index) => (
                                                          <TableRow key={index} style={{
                                                            cursor: 'auto',
                                                            background: '#f1f1f3',
                                                            fontWeight: 'normal',
                                                            whiteSpace: 'normal',
                                                            borderBottom: '1px solid #ccc'
                                                          }}>
                                                            <TableCell>{event.eventTime}</TableCell>
                                                            <TableCell>{event.eventTxt}</TableCell>
                                                            <TableCell>{event.eventStatus}</TableCell>
                                                          </TableRow>
                                                        )
                                                      )
                                                      : <TableRow> <TableCell colSpan={7}> No Data Found </TableCell> </TableRow>}
                                                  </TableBody>
                                                </Table>
                                              </TableContainer> : ''}
                                          </Paper>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <Paper className={classes.paper}>
                                            {showEventDetails ?
                                              <TableContainer style={{ display: '-webkit-inline-box' }}>
                                                <Table aria-label="simple table" style={{ border: '1px solid rgb(174, 174, 174)' }}>
                                                  <TableHead className="table-header">
                                                    <TableRow style={{
                                                      whiteSpace: 'nowrap',
                                                      cursor: 'pointer',
                                                      fontSize: '13px',
                                                      background: 'rgb(249, 249, 250)'
                                                    }}>
                                                      {
                                                        eventTableColumns.map(column => (
                                                          <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            style={{
                                                              minWidth: column.minWidth,
                                                              fontWeight: 'bold',
                                                              borderBottom: '1px solid rgb(0, 0, 0)',
                                                              cursor: 'pointer',
                                                              alignItems: 'center'
                                                            }}>
                                                            {column.label}
                                                          </TableCell>
                                                        ))
                                                      }
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {row.events && row.events.length > 3 ?
                                                      row.events.slice(3, 6).map(
                                                        (event, index) => (
                                                          <TableRow key={index} style={{
                                                            cursor: 'auto',
                                                            background: '#f1f1f3',
                                                            fontWeight: 'normal',
                                                            whiteSpace: 'normal',
                                                            borderBottom: '1px solid #ccc'
                                                          }}>
                                                            <TableCell>{event.eventTime}</TableCell>
                                                            <TableCell>{event.eventTxt}</TableCell>
                                                            <TableCell>{event.eventStatus}</TableCell>
                                                          </TableRow>
                                                        )
                                                      )
                                                      : <TableRow> <TableCell colSpan={7}> No Data Found </TableCell> </TableRow>}
                                                  </TableBody>
                                                </Table>
                                              </TableContainer> : ''}
                                          </Paper>
                                        </Grid>
                                      </React.Fragment>
                                    </Grid>
                                  </Grid>
                                </div> : <Grid style={{ textAlign: "center" }} item xs={12}>No Events Found </Grid>}
                            </Grid>
                          </div>
                        </Collapse>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
              : <TableBody>
                <TableRow><TableCell align="center" colSpan={8}>No Data Found</TableCell>
                </TableRow></TableBody>}
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
    </div>
  );
}
