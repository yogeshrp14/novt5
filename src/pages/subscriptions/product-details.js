/* eslint-disable */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import "./GetSubscription.scss"
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  root: {
    width: '100%',
    flexGrow: 1
  },
  paper: {
    textAlign: 'left',
    boxShadow: 'none',
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

export default function ProductDetails(props) {
  const [data] = useState(props.data);
  const [reseller] = useState(props.isReseller);
  const classes = useStyles();
  const columns = [
    //{ id: 'itemNumber', label: 'Item number', align: 'center', minWidth: 170 },
    { id: 'materialCode', label: 'Material Code', align: 'center', minWidth: 170 },
    { id: 'productRatePlanName', label: 'Product Rate Plan Name', align: 'center', minWidth: 170 },
    { id: 'qty', label: 'Quantity', align: 'center', minWidth: 170 },
    { id: 'startDate', label: 'Start Date', align: 'center', minWidth: 170 },
    { id: 'endDate', label: 'End Date', align: 'center', minWidth: 170 },
    { id: 'price', label: 'Net Price (CURRENCY CODE)', align: 'center', minWidth: 170 }
  ];

  return (
    <div>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        className="product-tab"
      >
        <Grid item xs={12} >
          <Paper className={classes.tablePaper} style={{ background: '#f9f9fa' }}>
            <Box className="itemLabel" fontWeight="fontWeightBold" m={1}>Product Detail</Box>
          </Paper>
        </Grid>
        <Grid item xs={12} style={{ width: 'inherit' }}>
          <Paper className={classes.tablePaper}>
            <TableContainer stickyHeader style={{ maxHeight: '440px' }}>
              <Table stickyHeader className={classes.table} aria-label="simple table" style={{
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
                          {reseller && column.id == "price" ? null :
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                // minWidth: '169px', 
                                padding: '0 20px 0 40px',
                                fontWeight: 'bold',
                                borderBottom: '1px solid #000',
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
                  {
                    data.products.map(product => (
                      <TableRow key={product.itemNumber}>
                        <TableCell className={classes.detailsTableCell}>{product.materialCode}</TableCell>
                        <TableCell className={classes.detailsTableCell}>{product.productRatePlanName}</TableCell>
                        <TableCell className={classes.detailsTableCell}>{product.quantity}</TableCell>
                        <TableCell className={classes.detailsTableCell}>{product.startDate}</TableCell>
                        <TableCell className={classes.detailsTableCell}>{product.endDate}</TableCell>
                        {reseller ? null :
                          <TableCell className={classes.detailsTableCell}>{product.netPrice} {product.currency}</TableCell>
                        }
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
