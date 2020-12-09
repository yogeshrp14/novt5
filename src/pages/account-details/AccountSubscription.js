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
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Loader from '../../components/shared/spinner/spinner';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import Menu from '@material-ui/core/Menu';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import { DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Collapse, InputLabel } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider, KeyboardDatePicker,
} from '@material-ui/pickers';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import DatePicker from 'react-datepicker'
import Moment from 'moment';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'username', numeric: false, disablePadding: true, activate: true, label: 'User Name' },
  { id: 'userid', numeric: true, disablePadding: false, activate: true, label: 'User ID' },
  { id: 'useraddress', numeric: false, disablePadding: false, activate: true, label: 'User Address' },
  { id: 'useremail', numeric: true, disablePadding: false, activate: true, label: 'User Email' },
  { id: 'usernumber', numeric: true, disablePadding: false, activate: true, label: 'User Number' },
  { id: 'usergender', numeric: false, disablePadding: false, activate: false, label: 'User Gender' },
  { id: 'userage', numeric: true, disablePadding: false, activate: true, label: 'Age' },

];

const columns = [
  { id: 'customerName', numeric: false, disablePadding: true, activate: true, label: 'Customer Name' },
  { id: 'invoiceOwnerName', numeric: false, disablePadding: true, activate: true, label: 'Invoive Owner Name' },
  { id: 'sapContractNumber', numeric: false, disablePadding: true, activate: true, label: ' Sap Contract Number' },
]


function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  console.log("headCells ==> ", headCells)
  return (
    <TableHead className="table-header">
      <TableRow>

        {headCells.map((headCell) => (

          <>{headCell.activate ?
            <TableCell
              key={headCell.id}
              align="center"

              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>

            </TableCell> : null}
          </>

        ))}
      </TableRow>
    </TableHead>
  );
}


EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function AccountSubscription(props) {

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('usernumber');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState(props.data);
  const [count, setCount] = useState(rows[0].subscriptionList.length);
  const [reseller] = useState(props.isReseller);
  const [handleId] = useState(props.handleId);
  const [linkId] = useState(props.linkId);
  const [isAssociate] = useState(props.isAssociate);
  const [isDirectCustomer] = useState(props.isDirectCustomer);
  const [selectedRow, setSelectedRow] = useState('');
  const [loader, setLoader] = React.useState(false);
  const [isExportButtonShow, setIsExportButtonShow] = React.useState(true);
  const [isExportButtonShowToPartner, setIsExportButtonShowToPartner] = React.useState(true);
  const [searchText, setSearchText] = useState('');

  //Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openColumnFilter = Boolean(anchorEl);
  const forceUpdate = React.useReducer(bool => !bool)[1];
  const [usernameactivate, setUsernameActivate] = useState(true)
  const [useridactivate, setUserIdActivate] = useState(true)
  const [useraddressactivate, setUseraddressActivate] = useState(true)
  const [useremailactivate, setUseremailActivate] = useState(true)
  const [usernumberactivate, setUserNumberActivate] = useState(true)
  const [usergenderactivate, setUserGenderActivate] = useState(false)
  const [userageactivate, setUserAgeActivate] = useState(true)

  //Collpse
  const [open, setOpen] = useState(false)
  const [selectexpand, setSelectExpand] = useState('')


  //datepicker
  const [startDate, setStartDate] = useState(new Date('2020-12-12T14:14:54'));
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    let bpLinkId = DecryptLocalStorage('bpLinkId')
    if (bpLinkId !== null) {
      setIsExportButtonShowToPartner(true);
    }
    else {
      setIsExportButtonShowToPartner(false);
    }
    console.log("rows.count is =>", rows[0].subscriptionList.length)
  }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    console.log(" rows per page,page ", rowsPerPage, page)
  };


  const isSelected = (name) => selected.indexOf(name) !== -1;

  const fetchSubscriptionSearchResult = () => {
    let finalArray = [{ subscriptionList: [] }]
    if (searchText !== '') {
      rows[0].subscriptionList.filter(show =>
        `${show.username} ${show.userid} ${show.usernumber} ${show.useremail}`.toUpperCase().includes(searchText.toUpperCase())
      ).map((result, index) => { finalArray[0].subscriptionList.push(result) })
      console.log(finalArray)
      setRows(finalArray)
    }
    else {
      return rows[0].subscriptionList
    }
  }
  const visibilityControl = (event, id) => {
    console.log("event.target.value => ", event, event.target.value, id)
    console.log("above")
    headCells.map(menu => menu.id === id ? (menu.activate = !menu.activate) : null)
    // console.log("headerCells visibilityControl ==>", headCells)
    console.log("below")
    if (id == headCells[0].id) {
      setUsernameActivate(!usernameactivate)
    }
    if (id == headCells[1].id) {
      setUserIdActivate(!useridactivate)
    }
    if (id == headCells[2].id) {
      setUseraddressActivate(!useraddressactivate)
    }
    if (id == headCells[3].id) {
      setUseremailActivate(!useremailactivate)
      console.log('User Email')
    }
    if (id == headCells[4].id) {
      setUserNumberActivate(!usernumberactivate)
    }
    if (id == headCells[5].id) {
      setUserGenderActivate(!usergenderactivate)
    }
    if (id == headCells[6].id) {
      setUserAgeActivate(!userageactivate)

    }
    forceUpdate();
  }

  const errorHandlerFunction = (error) => {
    console.log("error ==> ", error)
    setLoader(false);
  }

  const exportAllSubscriptions = event => {

  }
  const handleOpenColumnFilter = (event) => {
    setAnchorEl(event.currentTarget)
  }


  const handleCloseColumnFilter = () => {
    setAnchorEl(null);
  };
  //collapse
  const handleExpand = (event, username) => {
    setSelectExpand(username)
    console.log('expand opened')
    setOpen(!open)

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
  //dates
  const handleStartDateChange = (value) => {
    console.log("This is value of date passed=>", value)
    setStartDate(value)
    console.log("This is start date", startDate)
  }
  const handleEndDateChange = (value) => {
    console.log("Value of end date passed is", value)
    setEndDate(value)
  }


  const fetchDataAccordingDates = () => {

    console.log("This is Start Date", startDate,Number(startDate))
    console.log("This is End Date", endDate,Number(endDate))
    

    let finalArray = [{ subscriptionList: [] }]   


    rows[0].subscriptionList.map(row=>{
       
     var b=Moment(row.userbirthdate)
     console.log(b)

      // if (row.userbirthdate > startDate){
      // console.log('hello')
      // }
       


      // if ((row.userbirthdate > startDate) && (row.userbirthdate < endDate)){
      //    finalArray[0].subscriptionList.push(row) 
      //    setRows(finalArray)
      //    console.log("tHIS IS FINALARRAY",finalArray)
      //    console.log("tHIS IS ROWS",rows)

      // }
    })
   
}

  return (
    <div className={classes.root} >
      {/* this is AccountSubscription */}
      <ThemeProvider theme={theme}>
        <div className="mb-1" style={{ position: "static" }} >

          <div className="container-fluid">

            <div className="row">

              <div className="col-4 " style={{ display: "inline-block" }}>
                <div>
                  <Grid item xs={2} >
                    <Paper className={classes.paper}>
                      <input style={searchBoxStyle} className="form-control" type="text" placeholder="SEARCH HERE" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
                    </Paper>
                  </Grid>
                  <Grid item xs={2} style={{ marginLeft: "224px", marginTop: "-39px" }} >
                    <Paper className={classes.paper}>
                      <button className="btn btn-primary" style={searchButton} onClick={fetchSubscriptionSearchResult}>
                        <SearchIcon />
                      </button>
                    </Paper>
                  </Grid>
                </div>
              </div>


              <div className="col-7" >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date picker inline"
                      value={startDate}
                      onChange={(value) => handleStartDateChange(value)}
                      autoOk={true}
                    />
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date picker inline"
                      minDate={startDate}
                      value={endDate}
                      onChange={(value) => handleEndDateChange(value)}
                      autoOk={true}
                    />



                  </Grid>
                </MuiPickersUtilsProvider>
                <button className="btn btn-primary" onClick={fetchDataAccordingDates} >Search</button>

              </div>

              <div className="col-1" >

                <Tooltip title="View Columns" >
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleOpenColumnFilter}

                  >
                    <ViewColumnIcon style={{ marginRight: "100px", height: "39px" }} />
                  </IconButton>

                </Tooltip>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={openColumnFilter}
                  onClose={handleCloseColumnFilter}
                >
                  <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend" style={{ alignContent: "center" }} style={{ textAlign: "center" }}>View Columns</FormLabel>
                    <FormGroup>

                      {headCells.map((option) => (
                        <FormControlLabel style={{ padding: "5px", paddingLeft: "6px" }} control={<Checkbox disabled={option.id == "username"} checked={option.activate} name={option.id} onChange={(event) => { visibilityControl(event, option.id) }}

                        />} label={option.id} />

                      ))
                      }
                    </FormGroup>
                  </FormControl>
                </Menu>
              </div>
            </div>

          </div>

        </div>

        <Paper className={classes.root} style={{ boxShadow: '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)' }}>
          <TableContainer>
            <Table
              stickyHeader aria-label="sticky table"
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={count}
              />
              <TableBody>
                {loader ? <TableCell align="center" colSpan={6}><Loader /> </TableCell> :
                  stableSort(rows[0].subscriptionList, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(
                      (data, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                          <TableRow key={data.subscriptionName}>

                            {usernameactivate ? <TableCell style={{ alignContent: 'center' }}  >{data.username}</TableCell> : null}
                            {useridactivate ? <TableCell style={{ aalignContent: 'center' }} >{data.userid}</TableCell> : null}
                            {useraddressactivate ? <TableCell style={{ alignContent: 'center' }} >{data.useraddress}</TableCell> : null}
                            {useremailactivate ? <TableCell style={{ alignContent: 'center' }} >{data.useremail}</TableCell> : null}
                            {usernumberactivate ? <TableCell style={{ aalignContent: 'center' }} >{data.usernumber}</TableCell> : null}
                            {usergenderactivate ? <TableCell style={{ alignContent: 'center' }} >{data.usergender}</TableCell> : null}
                            {userageactivate ? <TableCell style={{ aalignContent: 'center' }} >{data.userage}</TableCell> : null}

                            <TableCell>
                              <IconButton size="small" onClick={(event) => { handleExpand(event, data.username) }} >
                                {((data.username == selectexpand) && open) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon onClick={() => { setSelectExpand('') }} />}

                              </IconButton>
                            </TableCell>
                          </TableRow>
                          {<Collapse in={(data.username == selectexpand) && open} timeout="auto" unmountOnExit component={collapseComponent} style={{ borderBottom: '20px' }} >
                            <TableContainer >
                              <Table>
                                <TableHead >
                                  <TableRow >
                                    {columns.map(column => (
                                      <TableCell align={column.align}
                                        style={{
                                          minWidth: '180',
                                          columnWidth: "auto",
                                          fontWeight: 'bold',
                                          borderBottom: '2px solid gray',
                                          cursor: 'pointer',
                                          gridAutoFlow: 'column',
                                          alignItems: 'right',
                                          height: '50px !important',
                                          fontSize: '13px',
                                          color: '#000'
                                        }}>{column.label}</TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody >
                                  <TableCell>{data.customerName}</TableCell>
                                  <TableCell>{data.invoiceOwnerName}</TableCell>
                                  <TableCell>{data.sapContractNumber}</TableCell>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Collapse>}
                        </React.Fragment>
                      )
                    )
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </ThemeProvider>
    </div >
  )
}

export default AccountSubscription
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
    flexGrow: 1,

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
  width: 'auto',
  borderRadius: '0px',
  height: '39px',

}

const searchButton = {
  height: '39px',
  padding: '7px 26px 6px'
}

const exportButton = {
  float: 'right'
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
// import TableSortLabel from '@material-ui/core/TableSortLabel';
// import Paper from '@material-ui/core/Paper';
// import SearchIcon from '@material-ui/icons/Search';
// import Grid from '@material-ui/core/Grid';
// import {ThemeProvider } from '@material-ui/core/styles';
// import Loader from '../../components/shared/spinner/spinner';

// import { DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
// import GetAppIcon from '@material-ui/icons/GetApp';


// export default function GetSubscriptions(props) {
//       const classes = useStyles();
//       const [order, setOrder] = useState('desc');
//       const [orderBy, setOrderBy] = useState('usernumber');
//       const [page, setPage] = useState(0);
//       const [rowsPerPage, setRowsPerPage] = useState(5);
//       const [rows, setRows] = useState(props.data);
//       const [count, setCount] = useState(props.pageCount);
//       const [reseller] = useState(props.isReseller);
//       const [handleId] = useState(props.handleId);
//       const [linkId] = useState(props.linkId);
//       const [isAssociate] = useState(props.isAssociate);
//       const [isDirectCustomer] = useState(props.isDirectCustomer);

//       const [loader, setLoader] = React.useState(false);

//       const [isExportButtonShow, setIsExportButtonShow] = React.useState(true);
//       const [isExportButtonShowToPartner, setIsExportButtonShowToPartner] = React.useState(true);
//       const [isSearchActive, setIsSearchActive] = useState(false);

//       const [resetIpoSystemId, setResetIpoSystemId] = useState({ "ipoSystemId": "", "systemIdAvailable": "" });


//       const headCells = [
//         { id: 'subscriptionName', numeric: false, disablePadding: true, label: 'Subscription Name/Contract No' },
//         { id: 'endCustomerName', numeric: false, disablePadding: false, label: 'End Customer Name' },
//         { id: 'partnerName', numeric: false, disablePadding: false, label: 'Partner Name' },
//         { id: 'domain', numeric: false, disablePadding: false, label: 'Domain' },
//         { id: 'poNumber', numeric: true, disablePadding: false, label: 'PO Number' },
//         { id: 'activatedOn', numeric: true, disablePadding: false, label: 'Start Date' },
//         { id: 'expirationDate', numeric: true, disablePadding: false, label: 'End Date' },
//         { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
//         { id: 'rowStatus', numeric: false, disablePadding: false, label: '' }
//       ];




//       const [searchText, setSearchText] = useState('');
//       const [preSearchedValue, setPreSearchedValue] = useState('');

//       EnhancedTableHead.propTypes = {
//         classes: PropTypes.object.isRequired,
//         onRequestSort: PropTypes.func.isRequired,
//         order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//         orderBy: PropTypes.string.isRequired,
//         rowCount: PropTypes.number.isRequired,
//       };

//       useEffect(() => {
//         let bpLinkId = DecryptLocalStorage('bpLinkId')

//         if (bpLinkId !== null) {
//           setIsExportButtonShowToPartner(true);
//         }
//         else {
//           setIsExportButtonShowToPartner(false);
//         }
//       }, [])

//       let Page = page + 1;

//       function EnhancedTableHead(tableProps) {
//         // const { classes, order, orderBy, onRequestSort } = tableProps;
//         const createSortHandler = property => event => {
//           onRequestSort(event, property);
//         };


//         return (
//           <TableHead className="table-header">
//             <TableRow>
//               {headCells.map(headCell => (
//                 <TableCell
//                   key={headCell.id}
//                   align='center'
//                   padding={headCell.disablePadding ? 'none' : 'default'}
//                   sortDirection={orderBy === headCell.id ? order : false}
//                 >
//                   <TableSortLabel
//                     active={orderBy === headCell.id}
//                     direction={orderBy === headCell.id ? order : 'asc'}
//                     onClick={createSortHandler(headCell.id)}
//                   >
//                     {headCell.label}
//                     {orderBy === headCell.id ? (
//                       <span className={classes.visuallyHidden}>
//                         {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                       </span>
//                     ) : null}
//                   </TableSortLabel>
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//         );
//       }


//       //Check min & max length
//       const checkLength = (obj) => {
//         return ((obj !== null) && (obj.length >= 10 && obj.length < 32) && obj !== resetIpoSystemId.ipoSystemId);
//       }

//       //Sorting
//       const handleRequestSort = (event, property) => {
//         const isAsc = orderBy === property && order === 'asc';
//         const sortOrder = isAsc ? 'desc' : 'asc';
//         if (preSearchedValue === null || preSearchedValue === '') {
//           let finalsearchText = '&sortBy=' + property + '&sortDir=' + sortOrder;
//           setLoader(true);
//           const res = services.getSubscriptionData(handleId, linkId, finalsearchText, reseller, isDirectCustomer, page, rowsPerPage);
//           res.then(response => {
//             setRows([response]);
//             if (response.page !== null) setCount(response.page.totalRecords);
//             setOrder(sortOrder);
//             setOrderBy(property);
//             setLoader(false);
//             setIsExportButtonShow(true);
//           },
//             (error) => {
//               errorHandlerFunction(error);
//             });
//         } //Search Result Sorting
//         else {
//           let finalsearchText = '&sortBy=' + property + '&sortDir=' + sortOrder + '&subscriptionName=' + preSearchedValue + '&customerName=' + preSearchedValue + '&activationDate=' + preSearchedValue + '&expirationDate=' + preSearchedValue + '&status=' + preSearchedValue + '&poNumber=' + preSearchedValue + '&sapContractNumber=' + preSearchedValue + '&isSearchRequest=true';
//           setLoader(true);
//           // let isDirectCustomerForSearch = false;
//           const res = services.getSubscriptionData(handleId, linkId, finalsearchText, reseller, isDirectCustomer, page, rowsPerPage);
//           res.then(response => {
//             setRows([response]);
//             if (response.page !== null) setCount(response.page.totalRecords);
//             setOrder(sortOrder);
//             setOrderBy(property);
//             setLoader(false);
//             setIsExportButtonShow(false);
//           },
//             (error) => {
//               errorHandlerFunction(error);
//             });
//         }
//       };

//       const handleChangePage = (event, newPage) => {
//         let prevNextPage;
//         if (page > newPage) {
//           prevNextPage = Page - 1;
//         }
//         else prevNextPage = Page + 1;
//         if (isSearchActive && !isEmpty(preSearchedValue)) {
//           setLoader(true);
//           let searchSubscriptionLinkId = ((isAssociate || isDirectCustomer) ? '' : linkId);
//           let searchValue = '&subscriptionName=' + preSearchedValue + '&customerName=' + preSearchedValue + '&activationDate=' + preSearchedValue + '&expirationDate=' + preSearchedValue + '&status=' + preSearchedValue + '&poNumber=' + preSearchedValue + '&domain=' + preSearchedValue + '&sapContractNumber=' + preSearchedValue + '&isSearchRequest=true'
//           // let isDirectCustomerForSearch = false;
//           const res = services.getSubscriptionData(handleId, searchSubscriptionLinkId, searchValue, reseller, isDirectCustomer, prevNextPage, rowsPerPage);
//           res.then(response => {
//             rows.splice(rowsPerPage * page - rowsPerPage, rowsPerPage, response);
//             setRows([response]);
//             if (response.page !== null) setCount(response.page.totalRecords);
//             setLoader(false);
//             setIsExportButtonShow(false);
//             setSearchText(preSearchedValue);
//           },
//             (error) => {
//               errorHandlerFunction(error);
//             }
//           );
//           setPage(newPage)
//         }
//         else {
//           setIsSearchActive(false)
//           setLoader(true);
//           const res = services.getSubscriptionData(handleId, linkId, '', reseller, isDirectCustomer, prevNextPage, rowsPerPage);
//           res.then(response => {
//             rows.splice(rowsPerPage * page - rowsPerPage, rowsPerPage, response);
//             setRows([response]);
//             if (response.page !== null) setCount(response.page.totalRecords);
//             setLoader(false);
//             setIsExportButtonShow(true);
//             setSearchText('');
//             setPreSearchedValue('');
//           },
//             (error) => {
//               errorHandlerFunction(error);
//             }
//           );
//           setPage(newPage)
//         }
//       }

//       const handleChangeRowsPerPage = event => {

//         let selectedRowsPerPage = parseInt(event.target.value);
//         if (isEmpty(preSearchedValue) === true || preSearchedValue === null || preSearchedValue === '') {
//           setLoader(true);
//           const res = services.getSubscriptionData(handleId, linkId, '', reseller, isDirectCustomer, 0, selectedRowsPerPage);
//           res.then(response => {
//             setRows([response]);
//             setRowsPerPage(parseInt(event.target.value));
//             if (response.page !== null) setCount(response.page.totalRecords);
//             setPage(0);
//             setLoader(false);
//             setIsExportButtonShow(true);
//           },
//             (error) => {
//               errorHandlerFunction(error);
//             });
//         }
//         else {
//           setLoader(true);
//           let searchSubscriptionLinkId = ((isAssociate || isDirectCustomer) ? '' : linkId);
//           let searchValue = '&subscriptionName=' + preSearchedValue + '&customerName=' + preSearchedValue + '&activationDate=' + preSearchedValue + '&expirationDate=' + preSearchedValue + '&status=' + preSearchedValue + '&poNumber=' + preSearchedValue + '&domain=' + preSearchedValue + '&sapContractNumber=' + preSearchedValue + '&isSearchRequest=true'
//           // let isDirectCustomerForSearch = false;
//           const res = services.getSubscriptionData(handleId, searchSubscriptionLinkId, searchValue, reseller, isDirectCustomer, 0, selectedRowsPerPage);
//           res.then(response => {
//             setRows([response]);
//             setRowsPerPage(parseInt(event.target.value));

//             setPage(0);
//             setLoader(false);

//           },
//             (error) => {
//               errorHandlerFunction(error);
//             });
//         }
//       };

//       let isEmpty = (str) => {
//         return !str.trim().length;
//       }


//       const errorHandlerFunction = (error) => {
//         console.log("error ==> ", error)
//         setLoader(false);
//       }









//       return (
//         <div>
//           {/* <div className="App">
//             <Auth />
//           </div> */}
//           <ThemeProvider theme={theme}>
//             <div style={{ paddingBottom: '15px' }}>
//               <Grid
//                 container
//                 direction="row"
//                 justify="flex-start"
//                 alignItems="flex-start"
//               >
//                 <Grid item xs={2}>
//                   <Paper className={classes.paper}>
//                     <input style={searchBoxStyle} className="form-control" type="text" placeholder="SEARCH HERE" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
//                   </Paper>
//                 </Grid>
//                 <Grid item xs={2}>
//                   <Paper className={classes.paper}>
//                     <button className="btn btn-primary" style={searchButton} onClick={fetchSubscriptionSearchResult}>
//                       <SearchIcon />
//                     </button>
//                   </Paper>
//                 </Grid>
//                 {isExportButtonShowToPartner && isExportButtonShow ?
//                   <Grid item xs={8}>
//                     <Paper className={classes.paper}>
//                       <span className="btn btn-primary" title="Export" disabled={(rows && rows[0] && rows[0].subscriptionList && rows[0].subscriptionList.length > 0) ? "" : "disabled"} style={exportButton} onClick={exportAllSubscriptions}>
//                         <GetAppIcon />Export
//                     </span>
//                     </Paper>
//                   </Grid>
//                   : ''}
//               </Grid>
//             </div>


//             <Paper className={classes.root} style={{ boxShadow: '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)' }}>
//               <TableContainer className={classes.container}>
//                 <Table stickyHeader aria-label="sticky table">
//                   <EnhancedTableHead
//                     classes={classes}
//                     order={order}
//                     orderBy={orderBy}
//                     onRequestSort={handleRequestSort}
//                     rowCount={rows.length}
//                   />
//                   <TableBody>
//                     {loader ? <TableCell align="center" colSpan={6}><Loader /> </TableCell> :
//                       (rows.map(row => (row.subscriptionList) ? row.subscriptionList.map((data, rowIndex) => (
//                         <React.Fragment key={rowIndex}>
//                           <TableRow key={data.subscriptionName}>
//                             <TableCell align="left">
//                               <div className="subrow_1">{data.subscriptionName}(S)</div>
//                               {(data.sapContractNumber != null) ? <div className="subrow_2" style={{ color: "rgb(228, 147, 0)" }}>{data.sapContractNumber}(C)</div> : ""}
//                             </TableCell>
//                             <TableCell >{data.customerName}</TableCell>
//                             <TableCell >{data.partnerName}</TableCell>
//                             <TableCell >{data.domain}</TableCell>
//                             <TableCell >{data.poNumber}</TableCell>
//                             <TableCell >{data.startDate}</TableCell>
//                             <TableCell >{data.expiryDate}</TableCell>
//                             <TableCell >{data.status}</TableCell>

//                           </TableRow>

//                         </React.Fragment>
//                       )) : <TableCell align="center" colSpan={7}>No Data Found</TableCell>))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//                 component="div"
//                 count={count}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onChangePage={handleChangePage}
//                 onChangeRowsPerPage={handleChangeRowsPerPage}
//               />
//             </Paper>
//           </ThemeProvider>
//         </div>
//       );
//     }
