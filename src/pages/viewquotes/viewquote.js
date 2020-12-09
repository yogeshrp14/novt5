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
import Checkbox from '@material-ui/core/Checkbox';
import SearchIcon from '@material-ui/icons/Search';
import services from '../../components/Services/service';
import { environment } from '../../environment';
import { useToasts } from 'react-toast-notifications';
import { Button, Modal } from 'react-bootstrap';
import Loader from '../../components/shared/spinner/spinner';
import '../viewquotes/viewquotes.scss';
import { ValidateLocalStoragealue, DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
import { DecryptRBAC } from '../../components/shared/rbac-system/rbac-control';
import WarinigDialog from '../../components/shared/rbac-system/warning-dialog';

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
  { id: 'quoteName', numeric: false, disablePadding: true, label: 'Quote Name' },
  { id: 'solutionId', numeric: true, disablePadding: false, label: 'Solution ID' },
  { id: 'quoteStatus', numeric: true, disablePadding: false, label: 'Quote Status' },
  { id: 'expiryDate', numeric: true, disablePadding: false, label: 'Expiry Date' },
  { id: 'partnerName', numeric: true, disablePadding: false, label: 'Partner Name' },
  { id: 'endCustomerName', numeric: true, disablePadding: false, label: 'End Customer Name' }
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="table-header">
      <TableRow>
        <TableCell padding="checkbox">
          Select
        </TableCell>
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
}));

export default function ViewQuotes(props) {
  const classes = useStyles();
  let link_id;
  let handleId = DecryptLocalStorage('handleId');
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('created');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = useState(0);
  const [dense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(10);
  const [deleteButtonDisable, disableDeleteButton] = useState(true);
  const [loader, setLoader] = React.useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  let [searchText, setSearchText] = useState('')
  const [preSearchedValue, setPreSearchedValue] = useState('');
  let { addToast } = useToasts();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let Page = page + 1;
  //Seting LinkId for Pagination, Search and Sorting
  const [linkId, setLinkId] = React.useState('');
  const acsEndPoint = environment.acsEndPoint;

  const [warningMessage, setWarningMessage] = React.useState("");
  let rolebaseControl = DecryptRBAC("RBAC")
  const [showsAccessControlWaring, setShowsAccessControlWaring] = useState(false);
  const AccessControlWaringOpenModal = () => setShowsAccessControlWaring(true);
  const AccessControlWaringCloseModal = () => setShowsAccessControlWaring(false);
  let userType = DecryptLocalStorage('userType');

  let createNewQuote = () => {
    if (rolebaseControl.CreateQuote) {
      if (link_id) {
        console.log("With Partner Search")
        window.location.assign(acsEndPoint + '?solution=new&linkId=' + link_id);
      }
      else {
        console.log("With OutPartner Search")
        window.location.assign(acsEndPoint + '?solution=new')
      }
    }
    else {
      setWarningMessage("You are not eligible for Create Quote functionality");
      AccessControlWaringOpenModal()
    }
  }

  let deleteQuoteAccess = () => {
    if (rolebaseControl && rolebaseControl.DeleteQuote) {
      console.log("deleteButtonDisable=>",deleteButtonDisable)
      if(!deleteButtonDisable){
        handleShow();
        
      }
      else{
        alert("Warning")
      }
      
    }
    else {
      
      setWarningMessage("You are not eligible for Delete Quote functionality");
      AccessControlWaringOpenModal()
    }
  }
  // let deleteQuoteAccess = () => {
  //   if ( (rolebaseControl && rolebaseControl.DeleteQuote) && (link_id)) {
  //           handleShow()
  //   }
  //   else {
  //     setWarningMessage("You are not eligible for Delete Quote functionality as you are doing it illegally ")
  //     AccessControlWaringOpenModal()
  //   }
  // }

  let handleQuoteLinkClick = (rowId) => {
    if (rolebaseControl && rolebaseControl.QuoteSummary) {
      if (link_id) {
        window.location.assign(acsEndPoint + '?solution=' + rowId + '&linkId=' + link_id)
      }
      else {
        window.location.assign(acsEndPoint + '?solution=' + rowId);
      }
    }
    else {
      let key = "View Quotes summery"
      setWarningMessage("You are not eligible for " + key + " functionality");
      AccessControlWaringOpenModal()
    }
  }

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
    console.log("DecryptLocalStorage('linkId') -->", DecryptLocalStorage('linkId'))
    if (ValidateLocalStoragealue('bpLinkId')) {
      link_id = DecryptLocalStorage('bpLinkId')
      initialQuotesService();
    }
    else if (ValidateLocalStoragealue('linkId')) {
      link_id = DecryptLocalStorage('linkId');
      console.log("link_id -->", link_id)
      if (link_id == -1) {
        link_id = "";
        initialQuotesService();
      }
      else {
        initialQuotesService();
      }
    }
    else {
      props.history.push('/dashboard/partner');
    }
  }, [link_id, handleId])

  const initialQuotesService = () => {
    setLoader(true);
    setLinkId(link_id)
    services.getQuotesList(handleId, link_id, Page, rowsPerPage, orderBy, order).then(res => {
      serviceResponseManager(res);
      setIsSearchActive(false);
    },
      (error) => {
        errorHandlerFunction(error);
      })
  }

  //Search Quotes Api
  let fetchQuoteSearchResult = () => {
    Page = 1;
    if (isEmpty(searchText) === true || searchText === null || searchText === '') {
      setLoader(true);
      services.getQuotesList(handleId, linkId, Page, rowsPerPage, orderBy, order).then(res => {
        serviceResponseManager(res);
        setPage(0);
        setIsSearchActive(false);
        setPreSearchedValue('');
      },
        (error) => {
          errorHandlerFunction(error);
        })
    }
    else {
      setLoader(true);
      services.getSearchQuotes(handleId, linkId, searchText, Page, rowsPerPage, orderBy, order, userType).then(res => {
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

  // Common function to handle response from Service
  const serviceResponseManager = (res) => {
    if (res.quoteList && res.quoteList.length > 0) {
      setRows(res.quoteList);
      setShowMsg(true);
    }
    else {
      setRows([]);
      setShowMsg(false);
    }
    // setCount(res.page.totalRecords);
    // setCount(res.page.totalRecords);
    setLoader(false);
  }

  //Sorting
  const handleRequestSort = (event, property) => {
    let link_id = linkId;
    const isAsc = orderBy === property && order === 'asc';
    const sortOrder = isAsc ? 'desc' : 'asc';
    console.log(property)
    console.log(orderBy)
    console.log(order)
    if (preSearchedValue === null || preSearchedValue === '') {
      setLoader(true);
      services.getQuotesList(handleId, link_id, Page, rowsPerPage, property, sortOrder).then(res => {
        serviceResponseManager(res);
        setOrder(sortOrder);
        setOrderBy(property);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }

    //Search Result Sorting
    else {
      setLoader(true);
      services.getSearchQuotes(handleId, link_id, preSearchedValue, Page, rowsPerPage, property, sortOrder, userType).then(res => {
        serviceResponseManager(res);
        setOrder(sortOrder);
        setOrderBy(property);
      },
        (error) => {
          errorHandlerFunction(error);
        })

    }
  };


  //Selecting CheckBox

  const handleClick = (event, name) => {
    setSelected([])
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );

    }
    if (newSelected.length) {
      disableDeleteButton(false);

    } else {
      disableDeleteButton(true);
    }
    setSelected(newSelected);

  };

  //Deleting Quotes
  const handleOnDelete = () => {
    setLoader(true);
    let selectedQuotesList = [];
    let finalQuotesList = [];
    selectedQuotesList = rows.filter(quote => {
      return selected.includes(quote.solutionId);
    })
    selectedQuotesList.map(quotes => finalQuotesList.filter(filterQuotes => filterQuotes.solutionId === quotes.solutionId).length > 0 ? null : finalQuotesList.push(quotes));

    var requestOptions = {
      handleId: handleId,
      quotes: finalQuotesList
    }

    if (finalQuotesList.length > 0) {
      let link_id = linkId;
      services.deleteQuotes(requestOptions).then((response) => {
        setLoader(false);
        if (response.status === 200) {
          setSelected([]);
          handleClose();
          setLoader(true);
          services.getQuotesList(handleId, link_id, Page, rowsPerPage, orderBy, order).then(res => {
            rows.splice(rowsPerPage * page, rowsPerPage, ...res.quoteList)
            setRows(rows)
            setCount(res.page.totalRecords)
            disableDeleteButton(true)
            setShow(false)
            setLoader(false);

          },
            (error) => {
              errorHandlerFunction(error);
            })
          addToast('Quotes under ' + selected + ' are Deleted', {
            appearance: 'success',
            position: 'bottom-right'
          })
        }
        else {
          handleClose();
          setLoader(true);
          services.getQuotesList(handleId, link_id, Page, rowsPerPage, orderBy, order).then(res => {
            setRows(res.quoteList)
            setCount(res.page.totalRecords)
            disableDeleteButton(true)
            setLoader(false);
          },
            (error) => {
              errorHandlerFunction(error);
            })
        }
      },
        (error) => {
          errorHandlerFunction(error);
        })
    }
  }

  //pagination for Quote List 
  const handleChangePage = (event, newPage) => {
    setSelected([])
    let link_id = linkId;
    let currentPage;
    if (page > newPage) {
      currentPage = Page - 1;
    }
    else {
      currentPage = Page + 1;
    }
    if (isSearchActive && !isEmpty(preSearchedValue)) {
      setLoader(true);
      services.getSearchQuotes(handleId, link_id, preSearchedValue, currentPage, rowsPerPage, orderBy, order, userType).then(res => {
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
      services.getQuotesList(handleId, link_id, currentPage, rowsPerPage, orderBy, order).then(res => {
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

  let isEmpty = (str) => {
    return !str.trim().length;
  }

  const handleChangeRowsPerPage = event => {
    let selectedRowsPerPage = parseInt(event.target.value);
    let link_id = linkId;
    Page = 1;
    if (isEmpty(preSearchedValue) === true || preSearchedValue === null || preSearchedValue === '') {
      setLoader(true);
      services.getQuotesList(handleId, link_id, page, selectedRowsPerPage, orderBy, order).then(res => {
        setRows(res.quoteList)
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
        setLoader(false);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
    else {
      setLoader(true);
      services.getSearchQuotes(handleId, link_id, preSearchedValue, Page, selectedRowsPerPage, orderBy, order, userType).then(res => {
        setLoader(false);
        setRows(res.quoteList)
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  return (
    <div>
      {/* warinig Block */}
      <WarinigDialog closeModal={AccessControlWaringCloseModal} show={showsAccessControlWaring} message={warningMessage} />

      {loader ? <Loader /> : null}
      <div className="row" style={{ 'padding': '20px 0 7px' }}>

        <div className="" style={{ paddingRight: '0px' }}>
          <input style={searchBoxStyle} className="form-control" type="text" placeholder="SEARCH HERE" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
          <button className="btn btn-primary" onClick={fetchQuoteSearchResult}>
            <SearchIcon /> </button>
        </div>

        <div className="" style={{ marginLeft: 'auto', marginRight: '15px' }}>
          {/* {rolebaseControl && rolebaseControl.CreateQuote ? */}
          <button className="btn btn-primary" disabled={deleteButtonDisable} onClick={deleteQuoteAccess}>Delete</button>
          {/* : null} */}
          {/* {rolebaseControl && rolebaseControl.CreateQuote ? */}
          <button className="btn btn-primary" style={{ marginLeft: '5px' }}  onClick={createNewQuote}  >Create New Quote</button>
          {/* : null} */}
        </div>
      </div>
      <Paper className={classes.paper} style={{ boxShadow: '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)' }}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
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
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={event => handleClick(event, row.solutionId)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell className="TableCell" style={{ width: '5%' }} padding="checkbox">
                          <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                        </TableCell>
                        <TableCell className="TableCell" style={{ width: '21%' }}
                          onClick={(e) => { e.stopPropagation() }} component="th" id={labelId} scope="row" padding="none">
                          {row.quoteName}
                        </TableCell>
                        <TableCell className="TableCell" onClick={(e) => { e.stopPropagation() }} style={{ width: '20%' }} >
                          <div onClick={() => { handleQuoteLinkClick(row.solutionId) }}>
                            <div><a style={{ color: "blue" }}>{row.solutionId}</a> </div>
                            <div><a style={{ color: "rgb(228, 147, 0)" }}>{row.quoteId} ({row.quoteType}) - {row.status}</a></div>
                          </div>
                        </TableCell>
                        <TableCell className="TableCell" style={{ width: '10%' }} onClick={(e) => { e.stopPropagation() }}>{row.quoteStatus}</TableCell>
                        <TableCell className="TableCell" style={{ width: '1%' }} onClick={(e) => { e.stopPropagation() }}>{row.expiryDate}</TableCell>
                        <TableCell className="TableCell" style={{ width: '25%' }} onClick={(e) => { e.stopPropagation() }} >{row.partnerName}</TableCell>
                        <TableCell className="TableCell EndCell" style={{ width: '25%' }} onClick={(e) => { e.stopPropagation() }} >{row.endCustomerName}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
              : <TableBody>
                <TableRow><TableCell align="center" colSpan={7}>No Data Found</TableCell>
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
      {/* Modal box for delete */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton style={{ background: '#da291c', color: 'white' }}>
          <Modal.Title style={{ 'font-size': '16px' }}>Delete Quotes</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Quotes ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
                </Button>
          <button className="btn btn-primary" onClick={() => { handleOnDelete() }}>
            Delete
                </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}



