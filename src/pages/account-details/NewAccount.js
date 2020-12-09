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
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import Checkbox from '@material-ui/core/Checkbox';
import { DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
import GetAppIcon from '@material-ui/icons/GetApp';
import { result } from 'lodash';


const headCells = [
  { id: 'username', numeric: false, disablePadding: true, activate: true, label: 'User Name' },
  { id: 'userid', numeric: true, disablePadding: false, activate: true, label: 'User ID' },
  { id: 'useraddress', numeric: false, disablePadding: false, activate: true, label: 'User Address' },
  { id: 'useremail', numeric: true, disablePadding: false, activate: true, label: 'User Email' },
  { id: 'usernumber', numeric: true, disablePadding: false, activate: true, label: 'User Number' },
  { id: 'usergender', numeric: false, disablePadding: false, activate: false, label: 'User Gender' },
  { id: 'userage', numeric: true, disablePadding: false, activate: true, label: 'Age' },

];


// let Page = page + 1;

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableHead(tableProps) {
  const { classes, order, orderBy, onRequestSort } = tableProps;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  console.log("headCells ==> ", headCells)
  return (
    <TableHead className="table-header">
      <TableRow>
        {headCells.map((headCell) => (
          <>
            {headCell.activate ?
              <TableCell
                key={headCell.id}
                // align={headCell.numeric ? 'right' : 'left'}
                // padding={headCell.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === headCell.id ? order : false}

              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}

                >
                  {headCell.label}
                  {/* {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null} */}
                </TableSortLabel>
              </TableCell> : null}
          </>
        ))}
      </TableRow>
    </TableHead>
  );
}



const NewAccount = (props) => {
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('useremail');
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

  const [isExportButtonShow, setIsExportButtonShow] = React.useState(true);
  const [isExportButtonShowToPartner, setIsExportButtonShowToPartner] = React.useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSystemIdEditable, setIsSystemIdEditable] = useState(false);
  const [resetIpoSystemId, setResetIpoSystemId] = useState({ "ipoSystemId": "", "systemIdAvailable": "" });
  const [visibleWarningMessage, setVisibleWarningMessage] = useState('');
  const [isrenewalFlag, setRenewalFlag] = React.useState(false);
  const [searchText, setSearchText] = useState('');
  const [preSearchedValue, setPreSearchedValue] = useState('');
  const [search, setSearch] = useState(null)

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
  const [selected, setSelected] = React.useState([]);

 


  useEffect(() => {
    let bpLinkId = DecryptLocalStorage('bpLinkId')
    if (bpLinkId !== null) {
      setIsExportButtonShowToPartner(true);
    }
    else {
      setIsExportButtonShowToPartner(false);
    }
  }, [])

//Sorting
const handleRequestSort = (event, property) => {
  const isAsc = orderBy === property && order === 'asc';
  setOrder(isAsc ? 'desc' : 'asc');
  console.log(property)
  setOrderBy(property);
};
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    setPage(0)
  }


  let isEmpty = (str) => {
    return !str.trim().length;
  }

  const fetchSubscriptionSearchResult = () => {
    let finalArray = [{ subscriptionList: [] }]
    if (searchText !== '') {
      rows[0].subscriptionList.filter(show =>
        `${show.username} ${show.userid} ${show.usernumber} ${show.useremail}`.toUpperCase().includes(searchText.toUpperCase())
      ).map((result, index) => { finalArray[0].subscriptionList.push(result) })
      console.log(finalArray)
      setRows(finalArray)
    }
  }
      //  const fetchSubscriptionSearchResult=()=>{
      //   let finalArray = []
      //  rows.map(row=>{
      //        return (row.subscriptionList.map(data=>{
      //           if (searchText !== ''){
      //            (function(data){ return (
      //                  data.filter(show=> `${show.username} ${show.userid} ${show.usernumber} ${show.useremail}`.toUpperCase().includes(searchText.toUpperCase()))
      //                  .map((result, index) => { finalArray.push(result) }))

      //            })() 
      //           }
      //        }))
      //  })
      //  console.log(finalArray)
      //  }

  const handleColumnVisibility = (event, id) => {
    console.log("handle column visibility activated")
    console.log(event, id)

    // headCells.map(menu=> menu.id === id ? menu.activate=event.target.checked:null )
    headCells.map(menu => menu.id == id ? menu.activate = event.target.checked && console.log(event.target.checked) && console.log('hi') : null)

    console.log("below")
    if (id == "username") setUsernameActivate(event.target.checked)
    if (id == "userid") {
      setUserIdActivate(!useridactivate)
      console.log('deactivated')
    }
    if (id == "useraddress") setUseraddressActivate(event.target.checked)
    if (id == "useremail") setUseremailActivate(event.target.checked)
    if (id == "usernumber") setUserNumberActivate(event.target.checked)
    if (id == "usergender") setUserGenderActivate(event.target.checked)
    if (id == "userage") setUserAgeActivate(event.target.checked)
    forceUpdate();
  }
  const visibilityControl=(event,id)=>{
        console.log("event.target.value => ", event, event.target.value ,id)
        console.log("above")
        headCells.map(menu=>menu.id === id ? (menu.activate =!menu.activate ) :null)
        console.log("headerCells visibilityControl ==>", headCells)
        console.log("below")
       if (id == headCells[0].id){
        setUsernameActivate(!usernameactivate)
       }
       if (id == headCells[1].id){
        setUserIdActivate(!useridactivate)
       }
       if (id == headCells[2].id){
        setUseraddressActivate(!useraddressactivate)
       }
       if (id == headCells[3].id){
        setUseremailActivate(!useremailactivate)
        console.log('User Email')
        
       
       }
       if (id == headCells[4].id){
        setUserNumberActivate(!usernumberactivate)
       }
       if (id == headCells[5].id){
        setUserGenderActivate(!usergenderactivate)
       }
       if (id == headCells[6].id){
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




  return (
    
      <div>
        this is AccountSubscription
                  <ThemeProvider theme={theme}>
          <div style={{ paddingBottom: '15px' }}>
            <Grid container direction="row" justify="flex-start" alignItems="flex-start">
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
                      <GetAppIcon />Export  </span>
                                                     
                  </Paper>
                </Grid>
                : ''}
            </Grid>
          </div>


          {/* Column Change Here */}
          <div className="col-md-auto" style={{ padding: "12px 0px 0px 15px" }}>
            <Tooltip title="View Columns">
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenColumnFilter}
              >
                <ViewColumnIcon style={{ fontSize: 30 }} />
              </IconButton>

            </Tooltip>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={openColumnFilter}
              onClose={handleCloseColumnFilter}
              PaperProps={{
                style: {
                },
              }}
            >
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend" style={{ alignContent: "center" }} style={{ textAlign: "center" }}>View Columns</FormLabel>
                <FormGroup>

              {headCells.map((option) => (
                    <FormControlLabel style={{ padding: "5px", paddingLeft: "6px" }} control={<Checkbox disabled={option.id == "username"} checked={option.activate} name={option.id} onChange={(event) => {visibilityControl(event, option.id)}}

                      />} label={option.id} />
      
                    ))
                  }
                </FormGroup>
              </FormControl>
            </Menu>
          </div>


          {/* Change from here */}
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

                          {usernameactivate ? <TableCell >{data.username}</TableCell> : null}
                          {useridactivate ? <TableCell >{data.userid}</TableCell> : null}
                          {useraddressactivate ? <TableCell >{data.useraddress}</TableCell> : null}
                          {useremailactivate ? <TableCell >{data.useremail}</TableCell> : null}
                          {usernumberactivate ? <TableCell >{data.usernumber}</TableCell> : null}
                          {usergenderactivate ? <TableCell >{data.usergender}</TableCell> : null}
                          {userageactivate ? <TableCell >{data.userage}</TableCell> : null}

                        </TableRow>
                    
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

 
  )
}

export default NewAccount

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
