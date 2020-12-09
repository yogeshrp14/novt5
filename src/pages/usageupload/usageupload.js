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
import RefreshIcon from '@material-ui/icons/Refresh';
import services from '../../components/Services/service';
import Loader from '../../components/shared/spinner/spinner';
import Icon from '@material-ui/core/Icon';
import '../usageupload/usageupload.scss';
import * as moment from 'moment';
import { ValidateLocalStoragealue, DecryptLocalStorage } from '../../components/shared/local-storage/local-storage';
import Tooltip from '@material-ui/core/Tooltip';
import "react-datepicker/dist/react-datepicker.css";

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
  { id: 'file_id', numeric: false, disablePadding: false, label: 'File Number' },
  { id: 'total_records', numeric: true, disablePadding: false, label: 'Total' },
  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'submission_time', numeric: true, disablePadding: false, label: 'Submission Time (UTC)' },
  { id: 'completion_time', numeric: true, disablePadding: false, label: 'Completion Time (UTC)' },
  { id: 'system_type', numeric: true, disablePadding: false, label: 'System Type' },
  { id: 'content_type', numeric: true, disablePadding: false, label: 'Content Type' },
  { id: 'input_file_stored_at', numeric: true, disablePadding: false, label: 'Input File' },
  { id: 'output_file_stored_at', numeric: true, disablePadding: false, label: 'Processed File' },
];


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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
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
  customTooltip: {
    // I used the rgba color for the standard "secondary" color
    backgroundColor: '#6e6767',
    minHeight: '30px',
    fontSize: '12px'
  }
}));



export default function Uploads(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('submission_time');
  const [page, setPage] = useState(0);
  const [dense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(10);
  let [searchText, setSearchText] = useState('')
  const [preSearchedValue, setPreSearchedValue] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [loader, setLoader] = React.useState(false);
  const [isCompletionHovering, setIsCompletionHovering] = useState(false);
  const [isStatusHovering, setIsStatusHovering] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  //Validation email
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSubmissionHovering, setIsSubmissionHovering] = useState(false);



  const searchBoxStyle = {
    width: '300px',
    borderRadius: '0px',
    height: '39px'
  }


  //Calling usageUploadsAPI
  useEffect(() => {
    if ((ValidateLocalStoragealue('bpLinkId') || ValidateLocalStoragealue('linkId')) && DecryptLocalStorage('isShowUsageUpload') == "true") {
      console.log("classes", classes)
      console.log("order", order)
      console.log("orderBy", orderBy)

      initialQuotesService();

    }
    else {
      props.history.push('/dashboard/partner');
      //  console.log(orderBy)
    }
  }, [])

  const initialQuotesService = () => {
    setLoader(true);
    services.getUploadUsages(page, rowsPerPage, orderBy, order).then(res => {
      res.content === null ? setShowMsg(false) :
        console.log("This is res", res)
      setShowMsg(true)
      setLoader(false)
      setRows(res.content)
      setCount(res.totalElements)
      setIsSearchActive(false);
    },
      (error) => {
        setLoader(false)
      })
  }

  let isEmpty = (str) => {
    return !str.trim().length;
  }

  // Common function to handle response from Service
  const serviceResponseManager = (res) => {
    if (res.content.length > 0) {
      setRows(res.content);
      setShowMsg(true);
    }
    else {
      setRows([]);
      setShowMsg(false);
    }
    setCount(res.totalElements);
    setLoader(false);
  }

  //Search usage upload Api
  let fetchUploadUsagesSearchResult = (property) => {
    if (isEmpty(searchText) === true || searchText === null || searchText === '') {
      setLoader(true);
      services.getUploadUsages(page, rowsPerPage, orderBy, order).then(res => {
        serviceResponseManager(res);
        setPage(0);
        setIsSearchActive(false);
        setPreSearchedValue('');
      },
        (error) => {
          setLoader(false);
        });
    }
    else {
      setLoader(true);
      let page = 0;
      services.getSearchUploadUsages(searchText, page, rowsPerPage, orderBy, order).then(res => {
        serviceResponseManager(res);
        setPage(0);
        setIsSearchActive(true);
        setPreSearchedValue(searchText);
      },
        (error) => {
          setLoader(false);
        })
    }
  }

  //Sorting
  const handleRequestSort = (event, property) => {
    console.log("sorting requested")
    const isAsc = orderBy === property && order === 'asc';
    const sortOrder = isAsc ? 'desc' : 'asc';
    if (preSearchedValue === null || preSearchedValue === '') {
      services.getUploadUsages(page, rowsPerPage, property, sortOrder).then(res => {
        serviceResponseManager(res);
        setOrder(sortOrder);
        setOrderBy(property);
      });
    }
    //Search Result Sorting
    else {
      setLoader(true);
      services.getSearchUploadUsages(preSearchedValue, page, rowsPerPage, property, sortOrder).then(res => {
        serviceResponseManager(res);
        setOrder(sortOrder);
        setOrderBy(property);
        setLoader(false);
      },
        (error) => {
          setLoader(false);
        })
    }
  };


  //pagination for Uploads List 
  const handleChangePage = (event, newPage) => {
    let currentPage;
    if (page > newPage) {
      currentPage = page - 1;
    } else {
      currentPage = page + 1;
    }
    if (isSearchActive && !isEmpty(preSearchedValue)) {
      setLoader(true);
      services.getSearchUploadUsages(preSearchedValue, currentPage, rowsPerPage, orderBy, order).then(res => {
        serviceResponseManager(res);
        setPage(newPage);
        setSearchText(preSearchedValue);
      },
        (error) => {
          setLoader(false);
        })
    }
    else {
      setLoader(true);
      services.getUploadUsages(currentPage, rowsPerPage, orderBy, order).then(res => {
        serviceResponseManager(res);
        setPage(newPage);
        setSearchText('');
        setPreSearchedValue('')
      },
        (error) => {
          setLoader(false);
        })
    }
  }

  const handleChangeRowsPerPage = event => {
    let selectedRowsPerPage = parseInt(event.target.value)
    let pagenumber = 0;
    console.log('new page number==>', pagenumber);
    if (isEmpty(preSearchedValue) === true || preSearchedValue === null || preSearchedValue === '') {
      setLoader(true);
      services.getUploadUsages(pagenumber, selectedRowsPerPage, orderBy, order).then(res => {
        setLoader(false);
        setRows(res.content)
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      },
        (error) => {
          setLoader(false);
        });
    }
    else {
      setLoader(true);
      services.getSearchUploadUsages(preSearchedValue, pagenumber, selectedRowsPerPage, orderBy, order).then(res => {
        setLoader(false);
        setRows(res.content)
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
      },
        (error) => {
          setLoader(false);
        });
    }

  };


  const inputFileDownload = (filepath) => {
    services.downloadUsageFile(filepath)
  }

  const outputFileDownload = (filepath) => {
    services.downloadUsageFile(filepath)
  }

  const handleMouseHover = (event) => {
    setIsSubmissionHovering(true);
  }
  const handleMouseLeave = (event) => {
    setIsSubmissionHovering(false);
  }

  const handleCompletionMouseHover = (event) => {
    setIsCompletionHovering(true);
  }
  const handleCompletionMouseLeave = (event) => {
    setIsCompletionHovering(false);
  }

  const handleRejectMouseLeave = (fileNumber) => {
    console.log('hover removed')
    setIsStatusHovering(false)
    console.log('file number', fileNumber)
    setRejectReason('');
  }

  const handleRejectMouseHover = (fileNumber) => {
    console.log('hover done')
    setIsStatusHovering(true)
    console.log('file number', fileNumber)
    if (fileNumber) {
      services.getUploadFailureReason(fileNumber).then(response => {
        //JSON.stringify(response);
        console.log('response reason===>', response)
        setRejectReason(response)
      })
    }
  }

  const refreshUploadUsages = (event) => {
    setLoader(true);
    services.getUploadUsages(0, 5, 'submission_time', 'desc').then(res => {
      serviceResponseManager(res);
      setSearchText('');
      setPreSearchedValue('');
      setPage(0);
      setRowsPerPage(5);
      setOrder('desc');
      setOrderBy('submission_time');
    },
      (error) => {
        setLoader(false)
      })
  }

  // const changeUrl = (url) => {
  //   if (url == "download") {
  //     props.history.push('/dashboard/usagedownload');
  //   }
  //   else {
  //     props.history.push('/dashboard/upload');

  //   }

  // }


  return (
    <div>
      {loader ? <Loader /> : null}
      <div className="row" style={{ 'padding': '20px 0 7px' }}>
        <div className="" style={{ 'marginLeft': '15px' }}>
          <input style={searchBoxStyle} className="form-control" type="text" placeholder="SEARCH HERE" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
          <button className="btn btn-primary" onClick={fetchUploadUsagesSearchResult}>
            <SearchIcon /> </button>
        </div>

        <div className="" style={{ 'marginLeft': '15px' }}>
          <button className="btn btn-primary" title="Refresh" onClick={refreshUploadUsages}>
            <RefreshIcon /></button>
        </div>
        {/* <div className="" style={{ 'marginLeft': 'auto', 'marginRight': '10px' }}>
          <button className="btn btn-primary" onClick={openModal}><Icon>cloud_download</Icon> New Download</button>
          <Modals closeModal={closeModal} show={shows} />
        </div> */}

        <div className="" style={{ 'marginLeft': 'auto', 'marginRight': '10px' }}>
          <button className="btn btn-primary" onClick={() => changeUrl("download")} style={{padding: "3px 30px 7px 30px"}}><Icon>cloud_download</Icon> Download</button>
      
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => changeUrl("upload")} style={{ 'marginRight': '16px', padding: "3px 30px 7px 30px" }} ><Icon>cloud_upload</Icon> Upload</button>
        </div>
      </div>
      <Paper className={classes.paper} style={{ boxShadow: '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)' }}>
        <TableContainer>
          {/* <Table style={{ display: 'grid' }}
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          > */}
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
            style={{ padding: "6px 10px 6px 16px" }}
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            {showMsg ?
              <TableBody>
                {stableSort(rows, getSorting(order, orderBy))
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={index}
                      >
                        <TableCell className="TableCell">{row.fileId}</TableCell>
                        <TableCell className="TableCell RecordsCell">
                          <div >
                            <span className="mr-3" title="Process Records"><Icon style={{ color: "#35b835" }}>check</Icon>{row.processRecords}</span>
                            {row.status === 'PROCESSING' || row.status === 'REJECT' ? <span title="Pending Records"><Icon style={{ color: "#DA291C" }}>close</Icon>{row.pendingRecords}</span> : ''}
                          </div>
                        </TableCell>
                        <TableCell className="TableCell" >
                          {row.status === 'COMPLETED' ?
                            <span title="COMPLETED"><Icon style={{ color: "#35b835", padding: '1px' }}>check_circle_outline</Icon></span> : ''}
                          {row.status === 'PROCESSING' ?
                            <span title="PROCESSING"><Icon style={{ color: "#DA291C", padding: '1px' }}>sync</Icon></span> : ''}
                          {row.status === 'REJECT' || row.status === 'FAILED' ?
                            <Tooltip classes={{ tooltip: classes.customTooltip }} title={rejectReason}>
                              <span onMouseEnter={() => handleRejectMouseHover(row.fileId)} onMouseLeave={() => handleRejectMouseLeave(row.fileId)}><Icon style={{ color: "#DA291C", padding: '1px' }}>highlight_off</Icon></span>
                            </Tooltip> :
                            ''}
                        </TableCell>
                        {/* {row.submissionTime} */}
                        <TableCell className="TableCell SubmissionCell" onMouseEnter={handleMouseHover} onMouseLeave={handleMouseLeave}>
                          {row.submissionTimeFormatted ?
                            <div className="row">
                              {isSubmissionHovering ?
                                <span>{row.submissionTimeFormatted}</span>
                                : <span>{moment(row.submissionTimeFormatted).format('DD-MMM-YYYY')} </span>
                              }
                            </div>
                            : <div className="row">
                              {isSubmissionHovering ?
                                <div className="row">{moment(row.submissionTime).format('DD-MMM-YYYY HH:MM:SS')}</div>
                                :
                                <div className="row">{moment(row.submissionTime).format('DD-MMM-YYYY')}</div>
                              }
                            </div>
                          }
                        </TableCell>
                        <TableCell className="TableCell CompletionCell" onMouseEnter={handleCompletionMouseHover} onMouseLeave={handleCompletionMouseLeave}>
                          {row.completionTimeFormatted ?
                            <div className="row">
                              {isCompletionHovering ?
                                <div className="row">{row.completionTimeFormatted}</div>
                                :
                                <div className="row">{moment(row.completionTimeFormatted).format('DD-MMM-YYYY')}</div>
                              }
                            </div>
                            :
                            <div className="row">
                              {isCompletionHovering ?
                                <div className="row">{moment(row.completionTime).format('DD-MMM-YYYY HH:MM:SS')}</div>
                                :
                                <div className="row">{moment(row.completionTime).format('DD-MMM-YYYY')}</div>
                              }
                            </div>}
                        </TableCell>
                        <TableCell className="TableCell" ><div style={{ textAlign: 'center' }}>{row.systemType}</div></TableCell>
                        <TableCell className="TableCell" ><div style={{ textAlign: 'left' }}>{row.contentType}</div></TableCell>
                        {row.inputFileStoredAt !== null && row.inputFileStoredAt !== '' && row.inputFileStoredAt !== 'null' ?
                          <TableCell className="TableCell InputCell" title="Download Input File" style={{ color: '#00f', cursor: 'pointer' }}
                            onClick={() => inputFileDownload(row.inputFileStoredAt)}>
                            <Icon className="iconDownload" >get_app</Icon></TableCell>
                          :

                          <TableCell className="TableCell InputCell" title="No File path available" style={{ cursor: 'no-drop' }} >
                            <Icon className="disableDownloadIcon">get_app</Icon> </TableCell>
                        }

                        {row.outputFileStoredAt !== null && row.outputFileStoredAt !== '' && row.outputFileStoredAt !== 'null' ?
                          <TableCell className="TableCell" title="Download Output File" style={{ color: '#00f', cursor: 'pointer' }} onClick={() => outputFileDownload(row.outputFileStoredAt)}><Icon style={{ color: "#DA291C" }}>get_app</Icon></TableCell>
                          :
                          <TableCell className="TableCell" title="No File path available" style={{ cursor: 'no-drop' }} ><Icon style={{ color: "grey" }}>get_app</Icon></TableCell>
                        }

                      </TableRow>
                    );
                  })}
              </TableBody>
              : <TableBody>
                <TableRow><TableCell align="center" colSpan={12}>No Data Found</TableCell>
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
