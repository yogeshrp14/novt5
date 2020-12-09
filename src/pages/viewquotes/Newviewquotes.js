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


export default function Newviewquotes(props) {
  const classes = useStyles();
  let rolebaseControl = DecryptRBAC("RBAC")
  let link_id;
  const acsEndPoint = environment.acsEndPoint;
  const [warningMessage, setWarningMessage] = React.useState("");
  const [showsAccessControlWaring, setShowsAccessControlWaring] = useState(false);
  const AccessControlWaringOpenModal = () => setShowsAccessControlWaring(true);
  const AccessControlWaringCloseModal = () => setShowsAccessControlWaring(false);
  const [loader, setLoader] = React.useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let handleId = DecryptLocalStorage('handleId');
  const [page, setPage] = useState(0);
  const [linkId, setLinkId] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  let Page = page + 1;
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('created')
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [rows, setRows] = useState([]);
  const [showMsg, setShowMsg] = useState(false);
  const [count, setCount] = useState(10);
  let [searchText, setSearchText] = useState('')
  const [preSearchedValue, setPreSearchedValue] = useState('');
  let userType = DecryptLocalStorage('userType');
  const [selected, setSelected] = useState([])
  const [deleteButtonDisable, disableDeleteButton] = useState(true);
  let { addToast } = useToasts();
  const [dense] = useState(true);


  const handleClick=()=>{
    
  }
  //Sorting
  const handleRequestSort = (event, property) => {
    let link_id = linkId;
    const isAsc = orderBy === property && order === 'asc';
    const sortOrder = isAsc ? 'desc' : 'asc';
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

    const errorHandlerFunction = (error) => {
      console.log("error ==> ", error)
      setLoader(false);
    }
    const isSelected = name => selected.indexOf(name) !== -1
    return (
      <div>
        This is new view quotes

        <WarinigDialog closeModal={AccessControlWaringCloseModal} show={showsAccessControlWaring} message={warningMessage} />
        <Paper className={classes.paper} style={{ boxShadow: '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)' }}>
          <TableContainer>
            <Table className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
              size={dense ? 'small' : 'medium'}>

              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length} />
              {showMsg ? <TableBody>
                {stableSort(rows, getSorting(order, orderBy)).map((row, index) => {
                  const isItemSelected = isSelected(row.solutionId);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (<TableRow
                    selected={isItemSelected}
                    key={index}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    hover
                    tabIndex={-1}
                    onClick={(event)=>handleClick(event,row.solutionId)}
                  >
                    <TableCell className="TableCell" style={{ width: '5%' }} padding={"checkbox"}></TableCell>
                    <TableCell className="TableCell" style={{ width: '21%' }}></TableCell>
                    <TableCell className="TableCell" style={{ width: '5%' }}></TableCell>
                    <TableCell className="TableCell" style={{ width: '10%' }}></TableCell>
                    <TableCell className="TableCell" style={{ width: '1%' }}></TableCell>
                    <TableCell className="TableCell" style={{ width: '25%' }}></TableCell>
                    <TableCell className="TableCell" style={{ width: '25%' }}></TableCell>
                  </TableRow>)
                })}
              </TableBody>
                : <TableBody>
                  <TableRow>
                    <TableCell align='center' colSpan={7}>No Dataa Found</TableCell>
                  </TableRow>
                </TableBody>}
            </Table>
          </TableContainer>

        </Paper>


      </div>


    )
  }
}