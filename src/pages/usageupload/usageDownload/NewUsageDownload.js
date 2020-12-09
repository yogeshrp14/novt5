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
import services from '../../../components/Services/service';
import { useToasts } from 'react-toast-notifications';
import Loader from '../../../components/shared/spinner/spinner';
import { Button } from 'react-bootstrap';
import '../../usageupload/usageupload.scss';
import './usageDownload.scss';
import * as moment from 'moment';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from '@material-ui/core/Checkbox';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from "@material-ui/core/Grid";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { red } from '@material-ui/core/colors';
import { property } from 'lodash';

const useStyles = makeStyles((theme) => ({
      root: {
            width: '100%',
            // minHeight: 300,
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px"
      },
      formControl: {
            margin: theme.spacing(1),
            minWidth: "100%",
      },
      container: {
            maxHeight: 383
      },
      paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
      },
      tableStyle: {
            width: '100%',
            // marginBottom: theme.spacing(2),
      },
      table: {
            // minWidth: 750,
      },
      inactiveSortIcon: {
            opacity: 0.3,
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
      highlight: {
            color: "#f50057",
            backgroundColor: "rgb(255, 226, 236)",
            height: 50,
            maxHeight: 50,
            minHeight: 45
      },
      warning: {
            color: "#f50057",
            backgroundColor: "rgb(255, 244, 229)",
            height: 50,
            maxHeight: 50,
            minHeight: 45
      }
}));


const headCells = [
      { id: 'contractNumber', numeric: false, disablePadding: true, label: 'Contract No.' },
      { id: 'subscriptionNumber', numeric: true, disablePadding: false, label: 'Subscription No.' },
      { id: 'totalNoPendingbillcycle', numeric: true, disablePadding: false, label: 'Cycles' },
      { id: 'shipTo', numeric: true, disablePadding: false, label: 'ShipTo No.' },
      { id: 'SoldToCountry', numeric: true, disablePadding: false, label: 'SoldTo Country' },
      // { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
];

const descendingComparator = (a, b, orderBy) => {
      if (b[orderBy] < a[orderBy]) {
            return -1
      }
      if (a[orderBy] > b[orderBy]) {
            return 1
      }
      return 0
}
function getComparator(order,orderBy){
 return order==='desc' ?
 (a,b)=>descendingComparator(a,b,orderBy)
 : (a,b)=>-descendingComparator(a,b,orderBy)
}
function stableSort(array, comparator) {
      // console.log("array ==> ", array, comparator)
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    }
    
function EnhancedTableHead(props) {
      const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort}=props;
      const createSortHandler=(property)=>(event)=>{
            onRequestSort(event,property)
      }
      return (
            <TableHead>
                  <TableRow>
                        <TableCell  padding="checkbox" style={{ width: "1%" }}>

                        </TableCell>
                  </TableRow>
            </TableHead>
      )
}
 
    
export default function NewUsageDownload() {


      return (
            <div>
                  This is New Usage NewUsageDownload

            </div>
      )
}