import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import services from '../../components/Services/service';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import "./GetSubscription.scss"
import Loader from '../../components/shared/spinner/spinner';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import "react-datepicker/dist/react-datepicker.css";
import Icon from '@material-ui/core/Icon';
import { Button, Modal } from 'react-bootstrap';
import TablePagination from '@material-ui/core/TablePagination';

export default function GetSubscriptionInvoice(props) {
  const [data] = useState(props.data);
  const [reseller] = useState(props.isReseller);
  const [isDirectCustomer] = useState(props.isDirect);
  const classes = useStyles();
  const [loader, setLoader] = React.useState(false);
  const [expand, setExpand] = React.useState(false);
  const [invoiceData, setInvoiceData] = React.useState([]);
  const [showMsg, setShowMsg] = useState(false)
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  let Page = page + 1;
  // const [rows, setRows] = useState([]);
  // const [order, setOrder] = React.useState('desc');
  // const [orderBy, setOrderBy] = React.useState('invoiceDate');

  const invoiceTableColumns = [
    { id: 'invoiceNumber', label: 'Invoice Number #', align: 'center', minWidth: 170 },
    { id: 'invoiceDate', label: 'Invoice Date', align: 'center', minWidth: 170 },
    { id: 'dueDate', label: 'Due Date', align: 'center', minWidth: 170 }
  ];

  const sapInvoiceTableColumns = [
    { id: 'invoiceNumber', label: 'Invoice Number #', align: 'center', minWidth: 170 },
    { id: 'amount', label: 'Amount', align: 'center', minWidth: 170 },
    { id: 'currency', label: 'Currency', align: 'center', minWidth: 170 },
    { id: 'status', label: 'Status', align: 'center', minWidth: 170 },
    { id: 'invoiceDate', label: 'Invoice Date', align: 'center', minWidth: 170 },
    { id: 'dueDate', label: 'Due Date', align: 'center', minWidth: 170 },
    { id: 'download', label: 'Download Invoice', align: 'center', minWidth: 170 }
  ];

  const errorHandlerFunction = (error) => {
    console.log("error ==> ", error)
    setLoader(false);
  }

  const handleToggleOne = (sapContractNumber, subscriptionName, isExpanded) => {
    if (expand === false) {
      setLoader(true);
      let response = [];
      response = services.getInvoices(sapContractNumber, subscriptionName, Page, rowsPerPage);
      response.then(res => {
        setLoader(false);
        if (res.items.length > 0) {
          setInvoiceData(res.items);
          setCount(res.total_count);
          setShowMsg(true);
        } else{
          setInvoiceData([]);
          setShowMsg(false);
        }
      },
        (error) => {
          errorHandlerFunction(error);
          setLoader(false);
        });
    }
  }

  const invoiceDownload = (entity_id, invoice_number, invoice_id) => {
    setLoader(true);
    services.downloadInvoice(entity_id, invoice_number, invoice_id);
    setLoader(false);
  }

  const sapInvoiceDownload = (owcc_document_id) => {
    console.log('OWCC Doument Id',owcc_document_id);
    if (owcc_document_id) {
      services.downloadSapInvoice(owcc_document_id);
    }
  }

  const handleChange = panel => (event, newExpanded) => {
    setExpand(newExpanded ? panel : false);
  };

  const handleChangePage = (event, newPage) => {
    let currentPage;
    if (page > newPage) {
      currentPage = Page - 1;
    } else {
      currentPage = Page + 1;
    }
      setLoader(true);
      services.getInvoices(data.sapContractNumber, data.subscriptionName, currentPage, rowsPerPage).then(res => {
        if (res.items.length > 0) {
          setInvoiceData(res.items);
          setShowMsg(true);
        }
        else {
          setInvoiceData([]);
          setShowMsg(false);
        }
        setPage(newPage);
        setCount(res.total_count);
        setLoader(false);  
      },
        (error) => {
          setLoader(false);
        })
  }

  const handleChangeRowsPerPage = event => {
    let selectedRowsPerPage = parseInt(event.target.value)
    let pagenumber = 0;
      setLoader(true);
      services.getInvoices(data.sapContractNumber, data.subscriptionName, pagenumber, selectedRowsPerPage).then(res => {
        setLoader(false);
        if (res.items.length > 0) {
          setInvoiceData(res.items);
          setShowMsg(true);
        }
        else {
          setInvoiceData([]);
          setShowMsg(false);
        }
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
        setCount(res.total_count);
      },
        (error) => {
          setLoader(false);
        });
  }


  return (
    <div>
      {/* Loader Componant */}
      {loader ? <Loader /> : null}
      {/* #######  Invoice Table Start ########    */}
      {isDirectCustomer || (!isDirectCustomer && !reseller) ?
        (data.sapContractNumber === null || data.sapContractNumber === '') ?
          (
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start" className="invoice-tab">
              <Grid item xs={12}>
                <Paper className={classes.tablePaper}>
                  <ExpansionPanel expanded={expand} onChange={handleChange(true)} onClick={() => handleToggleOne(data.invoiceOwnerAccount, data.subscriptionName, expand)} >
                    <ExpansionPanelSummary
                      expandIcon={expand ? <Remove /> : <Add />}
                      aria-controls="panel1a-content"
                      id="panel1a-header">
                      <Box fontWeight="fontWeightBold" m={1} className={classes.productTitle}>Invoice Detail</Box>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      {showMsg ? <TableContainer>
                        <Table className={classes.table} aria-label="simple table" style={{ border: '1px solid #848282' }}>
                          <TableHead className="table-header">
                            <TableRow>
                              {invoiceTableColumns.map(column => (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth, fontWeight: 'bold', borderBottom: '1px solid #000000' }}
                                >
                                  {column.label}
                                </TableCell>
                              ))
                              }
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              invoiceData.slice(0, 5).map(
                                invoice => (
                                  <TableRow key={invoice.invoice_number}>
                                    <TableCell style={{ color: '#00f', cursor: 'pointer', background: '#f1f1f3', borderBottom: '1px solid #ccc' }} onClick={() => invoiceDownload(invoice.entity_id, invoice.invoice_number, invoice.invoice_id)}>{invoice.invoice_number}</TableCell>
                                    <TableCell style={{background: '#f1f1f3', borderBottom: '1px solid #ccc'}}>{invoice.invoice_date}</TableCell>
                                    <TableCell style={{background: '#f1f1f3', borderBottom: '1px solid #ccc'}}>{invoice.due_date}</TableCell>
                                  </TableRow>
                                )
                              )
                            }
                          </TableBody>
                        </Table>
                      </TableContainer> : <TableCell colSpan={7}> No invoices are available </TableCell>
                      }
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Paper>
              </Grid>
            </Grid>
          )
          :
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start" className="invoice-tab">
            <Grid item xs={12}>
              <Paper className={classes.tablePaper}>
                <ExpansionPanel expanded={expand} onChange={handleChange(true)} onClick={() => handleToggleOne(data.sapContractNumber, data.subscriptionName, expand)} >
                  <ExpansionPanelSummary
                    expandIcon={expand ? <Remove /> : <Add />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Box fontWeight="fontWeightBold" m={1} className={classes.productTitle}>Invoice Detail</Box>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    {showMsg ? <TableContainer>
                      <Table className={classes.table} aria-label="simple table" style={{ border: '1px solid #848282' }}>
                        <TableHead className="table-header">
                          <TableRow>
                            {sapInvoiceTableColumns.map(column => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth, fontWeight: 'bold', borderBottom: '1px solid #000000' }}
                              >
                                {column.label}
                              </TableCell>
                            ))
                            }
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            invoiceData.map(
                              invoice => (
                                <TableRow key={invoice.invoice_number}>
                                  <TableCell style={{ background: '#f1f1f3', borderBottom: '1px solid #ccc' }}>
                                    {invoice.owcc_document_id === null || invoice.status === 'Cancelled' ? 
                                    <span className="disableDownloadIcon" style={{cursor: 'not-allowed'}}>{invoice.invoice_number}</span>
                                     : 
                                     <span style={{color: '#00f', cursor: 'pointer'}}  onClick={() => sapInvoiceDownload(invoice.owcc_document_id)}>{invoice.invoice_number}</span>
                                     }</TableCell>
                                  <TableCell style={{background: '#f1f1f3', borderBottom: '1px solid #ccc'}}>{invoice.amount}</TableCell>
                                  <TableCell style={{background: '#f1f1f3', borderBottom: '1px solid #ccc'}}>{invoice.invoice_currency}</TableCell>
                                  <TableCell style={{background: '#f1f1f3', borderBottom: '1px solid #ccc'}}>{invoice.status}</TableCell>
                                  <TableCell style={{background: '#f1f1f3', borderBottom: '1px solid #ccc'}}>{invoice.invoice_date}</TableCell>
                                  <TableCell style={{background: '#f1f1f3', borderBottom: '1px solid #ccc'}}>{invoice.due_date}</TableCell>
                                  <TableCell className="TableCell InputCell" title="Download Invoice" style={{ background: '#f1f1f3', borderBottom: '1px solid #ccc' }}>
                                   {invoice.owcc_document_id === null || invoice.status === 'Cancelled' ? 
                                   <Icon className="disableDownloadIcon"  style={{cursor: 'not-allowed'}}>get_app</Icon>
                                   : <Icon className="iconDownload" style={{cursor: 'pointer'}} onClick={() => sapInvoiceDownload(invoice.owcc_document_id)}>get_app</Icon>
                              }</TableCell>
                                </TableRow>
                              )
                            )
                          }
                        </TableBody>
                      </Table>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        component="div"
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                    </TableContainer> : <TableCell colSpan={7}> No invoices are available </TableCell>
                    }
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Paper>
            </Grid>
          </Grid>
        : null
      }

      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton style={{ background: '#da291c', color: 'white' }}>
          <Modal.Title style={{ 'fontSize': '16px' }}>Invoice Download</Modal.Title>
        </Modal.Header>
        <Modal.Body>Unable to download relevant invoice due to document Id is not available.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
}


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