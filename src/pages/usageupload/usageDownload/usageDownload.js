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
  // console.log("array ==> ", array, comparator)
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'contractNumber', numeric: false, disablePadding: true, label: 'Contract No.' },
  { id: 'subscriptionNumber', numeric: true, disablePadding: false, label: 'Subscription No.' },
  { id: 'totalNoPendingbillcycle', numeric: true, disablePadding: false, label: 'Cycles' },
  { id: 'shipTo', numeric: true, disablePadding: false, label: 'ShipTo No.' },
  { id: 'SoldToCountry', numeric: true, disablePadding: false, label: 'SoldTo Country' },
  // { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
];

function EnhancedTableHead(props) {
  // console.log("props ==> ", props)
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" style={{ width: "1%" }}>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
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
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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

export default function UsageDownloadDialog(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('totalNoPendingbillcycle');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(10);
  let { addToast } = useToasts();
  const [downloadshow, setDownloadShow] = useState(false);
  const handleDownloadShow = () => setDownloadShow(true);
  const [selectedtemplate, setSelectedTemplate] = useState('');
  const [option, setOption] = useState('');
  const [loader, setLoader] = React.useState(false);
  const [contractValidation, setContractValidation] = useState('');
  const [enterKeyError, setEnterKeyError] = useState('')
  const [subscriptionEnterError, setSubscrptionEnterError] = useState('');
  const [templateTypeValidation, setTemplateTypeValidation] = useState('');
  const [searchCriteriaValidation, setSearchCriteriaValidation] = useState('');
  const [numberValidateMsg, setNumberValidateMsg] = useState('');
  const [subscriptionNumberValidateMsg, setSubscriptionNumberValidateMsg] = useState('');
  const [maximumLimitError, setMaximumLimitError] = useState('');
  const [maxSubscriptionLimitError, setMaxSubscriptionLimitError] = useState('');
  const [validContractError, setValidContractError] = useState('');
  //Validation email
  const [validationSuccess, setValidationSuccess] = React.useState(false);
  const [subscriptionValidationSuccess, setSubscriptionValidationSuccess] = React.useState(false);
  const [validateResponse, setValidateResponse] = useState('');
  const [tags, setTags] = React.useState([]);
  const [subscriptionTags, setSubscriptionTags] = React.useState([]);
  const [contractLengthError, setContractLengthError] = useState('');
  const [duplicateContractError, setDuplicateContractError] = useState('')
  const [newTagList, setNewTagList] = useState();
  const [subscriptionTagList, setSubscriptionTagList] = useState();
  const [warningMessage, setWarningMessage] = useState('');
  const [contract, setContract] = useState('');
  const [subscriptionNumber, setSubscriptionNumber] = useState('');
  const [serverError, setServerError] = useState('');
  const [hoverMessage, setHoverMessage] = useState('');
  const [usageEndDate, setUsageEndDate] = useState();
  const [maxEndDate, setMaxEndDate] = useState();
  const [endDateValidation, setEndDateValidation] = useState('');
  const [checked, setChecked] = React.useState(false);
  const [advancedBillingCheck, setAdvancedBillingCheck] = React.useState(false);
  const [duplicateError, setDuplicateError] = useState('');
  const [subscriptionLengthError, setSubscriptionLengthError] = useState('');
  const [validSubscriptionError, setValidSubscriptionError] = useState('');
  const [subscriptionValidation, setSubscriptionValidation] = useState('');
  const [showContractField, setShowContractField] = useState(false);
  const [showSubscriptionField, setShowSubscriptionField] = useState(false);
  const [subscriptionValidateResponse, setSubscriptionValidateResponse] = useState([]);
  const [soldToSearch, setSoldToSearch] = useState(false);
  const [soldToSearchContractList, setSoldToSearchContractList] = useState(false);
  const [selected, setSelected] = React.useState([]);
  const [dense, setDense] = React.useState(false);
  const [warningMax100Contract, setWarningMax100Contract] = React.useState(false);
  const [inputSoldToNumber, setInputSoldToNumber] = useState('');
  const [soldToNumberValidation, setSoldToNumberValidation] = useState('');
  const [selectedCheckAll, setSelectedCheckAll] = useState(true);


  const inputBoxStyle = {
    width: '100%',
    borderRadius: '0px',
    minHeight: '27px'
  }

  //Calling usageUploadsAPI
  useEffect(() => {
    const date = new Date();
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + 90)
    setMaxEndDate(copy);
  }, [])

  const change = (event) => {
    console.log("event.target.value ==> ", event.target.value)
    setSelectedTemplate(event.target.value);
    if (event.target.value == "") {
      setSoldToSearch(false)
    }
    else if (event.target.value == "perDay") {
      setSoldToSearch(false)
      // setOption("");
    }

    if (event.target.value) {
      setTemplateTypeValidation('');
    }
  }

  const changeOption = (event) => {
    setOption(event.target.value);
    setTags([]);
    setSubscriptionTags([]);
    if (event.target.value == 'subscriptionNo') {
      setShowSubscriptionField(true);
      setShowContractField(false);
      setSearchCriteriaValidation('');
      setSoldToSearch(false)
      setSoldToSearchContractList(false);
    }
    else if (event.target.value == 'contractNo') {
      setShowSubscriptionField(false);
      setShowContractField(true);
      setSearchCriteriaValidation('');
      setSoldToSearch(false)
      setSoldToSearchContractList(false);
    }
    else if (event.target.value == 'soldToSearch') {
      setSoldToSearch(true)
      setShowSubscriptionField(false);
      setShowContractField(false);
    }
    else {
      setShowSubscriptionField(false);
      setShowContractField(false);
      setSoldToSearch(false)
      setSoldToSearchContractList(false);
    }
  }

  const searchsolToContract = () => {
    console.log("selectedtemplate ==> ", selectedtemplate)
    if (selectedtemplate != "" && inputSoldToNumber.length > 0) {
      setSoldToSearchContractList(true);
      setSoldToNumberValidation('')
      setLoader(true);
      let template = ""
      if (selectedtemplate == "perDay") { template = "dailyusage" }
      else if (selectedtemplate == "perBillCycle") { template = "billcycle" }
      else { }
      var endDate = moment(usageEndDate).format('YYYY-MM-DD');
      console.log("function Calling")
      services.getContractNoList(template, inputSoldToNumber, endDate).then(res => {
        setLoader(false);
        console.log("res ==> ", res)
        setRows(res)
      },
        (error) => {
          setLoader(false)
        })
    }
    else {
      if (selectedtemplate == "" && !inputSoldToNumber.length > 0) {
        setTemplateTypeValidation('Please select template type')
        setSoldToNumberValidation('Please enter SoldTo number')
      }
      else if (selectedtemplate != "" && !inputSoldToNumber.length > 0) {
        setTemplateTypeValidation('')
        setSoldToNumberValidation('Please enter SoldTo number')
      }
      else if (inputSoldToNumber.length > 0 && selectedtemplate == "") {
        setTemplateTypeValidation('Please select template type')
        setSoldToNumberValidation('')
      }
      else {
        console.log("Invalid")
      }

    }
  }

  const validateContractsList = () => {
    if (selectedtemplate) {
      setTemplateTypeValidation('')
    } else {
      setTemplateTypeValidation('Please select template type')
    }
    if (showContractField) {
      setSearchCriteriaValidation('')
      console.log('contract value========>', contract)
      console.log('tags.length', tags, '===>', tags.length)
      setDuplicateContractError('')
      if (contract === '') {
        setEnterKeyError('')
        setMaximumLimitError('')
      }
      if (!checked) {
        if (tags.length > 0 && contract === '' && selectedtemplate && contractValidation === '' && contractLengthError === '' && validContractError === '') {
          if (numberValidateMsg && !contract) {
            setNumberValidateMsg('');
          }
          console.log('if condition first')
          let contracts = [];
          tags.map((tag, index) => {
            contracts.push(tag.contractNumber);
          })
          let data = contracts.join(",");
          let templateType;
          let usageDateType;
          if (selectedtemplate === 'perDay') {
            templateType = 'dailyusage';
            usageDateType = 'usagetodate';
          } else if (selectedtemplate === 'perBillCycle') {
            templateType = 'billcycleusage';
            usageDateType = 'billingDate';
          }
          let present_date = new Date();
          var formattedDate = moment(present_date).format('YYYY-MM-DD');
          setLoader(true)
          services.validateContractsToDownload(templateType, data, usageDateType, formattedDate).then(res => {
            //console.log('res status===========>',res.status)
            if (res && res.length > 0) {
              setValidateResponse(res);
              setWarningMessage('')
              setServerError('')
              // if (contract) {
              //   setContract('');
              // }
              //if (res.length > 0) {
              let notValidContracts = res.filter(validData => validData.statusCode !== '200')
              console.log('not valid contracts,', notValidContracts.length)
              if (notValidContracts.length > 0) {
                setValidationSuccess(false);
              }
              else {
                setValidationSuccess(true);
              }

              console.log('notvalidcontract==========>', validationSuccess)
              setTags([]);
              let finalArray = [];
              res.filter(e => {
                if (tags.find(n => n.contractNumber === e.contractNumber)) {
                  var bgcolor = "gray"
                  if (e.statusCode == "200") { bgcolor = "#009000" }
                  else { bgcolor = "#e61616" }
                  var objectsValid = {
                    "contractNumber": e.contractNumber,
                    "statusCode": e.statusCode,
                    "reason": e.reason,
                    "background": bgcolor,
                    "color": "#fff"
                  }
                  finalArray.push(objectsValid)
                }
              });
              setTags(finalArray);
              console.log('invalid numbers======>', notValidContracts.length > 0)
              console.log('if condition', tags.length > 0 && validationSuccess === false)
              if (tags.length > 0 && notValidContracts.length > 0) {
                setHoverMessage('Please hover over the contracts to check the validation status with the reason.');
              }
              else {
                setHoverMessage('');
              }
              setNewTagList(res)
              setServerError('')
              setLoader(false);
              // }

            }
            else {
              setHoverMessage('')
              setWarningMessage('')
              setServerError('Internal server error occured, please try again')
              setLoader(false);
            }
          },
            (error) => {
              setLoader(false);
              setHoverMessage('')
              setWarningMessage('')
              setServerError('Internal server error occured, please try again')
            });
          setServerError('')
        }
        else if (tags.length === 0 && contract === '' && selectedtemplate === '') {
          setContractValidation('Please enter contract number')
          setTemplateTypeValidation('Please select template type.')
          setValidContractError('')
          setNumberValidateMsg('')
          setMaximumLimitError('')
          setEnterKeyError('')
        }
        else if (selectedtemplate === '' && contract === '' && tags.length > 0 && contractValidation === '') {
          setContractValidation('')
          setEnterKeyError('')
          setTemplateTypeValidation('Please select template type.')
        }
        else if (tags.length === 0 && contract === '' && selectedtemplate) {
          setContractValidation('Please enter contract number')
          setValidContractError('')
          setNumberValidateMsg('')
          setMaximumLimitError('')
          setContractLengthError('')
          setTemplateTypeValidation('')
          setEnterKeyError('')
        }
        else if ((tags.length === 0 || tags.length > 0) && tags.length < 10 && contract && selectedtemplate) {
          console.log('in else condition for pressing enter key')
          setEnterKeyError('Press "Enter" key to add contract number')
          setValidContractError('')
          setNumberValidateMsg('')
          setMaximumLimitError('')
          setContractLengthError('')
          setTemplateTypeValidation('')
          setContractValidation('')
        }
        else if ((tags.length === 0 || tags.length > 0) && tags.length < 10 && contract && selectedtemplate === '') {
          setEnterKeyError('Press "Enter" key to add contract number')
          setTemplateTypeValidation('Please select template type.')
          setValidContractError('')
          setNumberValidateMsg('')
          setMaximumLimitError('')
          setContractLengthError('')
          setContractValidation('')
        }
      }
      else {
        if (tags.length > 0 && contract === '' && selectedtemplate && usageEndDate && contractValidation === '' && contractLengthError === '' && validContractError === '') {
          if (numberValidateMsg && !contract) {
            setNumberValidateMsg('');
          }
          console.log('if condition first')
          let contracts = [];
          tags.map((tag, index) => {
            contracts.push(tag.contractNumber);
          })
          let data = contracts.join(",");
          let templateType;
          let usageDateType;
          if (selectedtemplate === 'perDay') {
            templateType = 'dailyusage';
            usageDateType = 'usagetodate';
          } else if (selectedtemplate === 'perBillCycle') {
            templateType = 'billcycleusage';
            usageDateType = 'billingDate';
          }
          //let present_date = new Date();
          var endDate = moment(usageEndDate).format('YYYY-MM-DD');
          setLoader(true)
          services.validateContractsToDownload(templateType, data, usageDateType, endDate).then(res => {
            //console.log('res status===========>',res.status)
            if (res && res.length > 0) {
              setValidateResponse(res);
              setWarningMessage('')
              setServerError('')
              // if (contract) {
              //   setContract('');
              // }
              //if (res.length > 0) {
              let notValidContracts = res.filter(validData => validData.statusCode !== '200')
              console.log('not valid contracts,', notValidContracts.length)
              if (notValidContracts.length > 0) {
                setValidationSuccess(false);
              }
              else {
                setValidationSuccess(true);
              }

              console.log('notvalidcontract==========>', validationSuccess)
              setTags([]);
              let finalArray = [];
              res.filter(e => {
                if (tags.find(n => n.contractNumber === e.contractNumber)) {
                  var bgcolor = "gray"
                  if (e.statusCode == "200") { bgcolor = "#009000" }
                  else { bgcolor = "#e61616" }
                  var objectsValid = {
                    "contractNumber": e.contractNumber,
                    "statusCode": e.statusCode,
                    "reason": e.reason,
                    "background": bgcolor,
                    "color": "#fff"
                  }
                  finalArray.push(objectsValid)
                }
              });
              setTags(finalArray);
              console.log('invalid numbers======>', notValidContracts.length > 0)
              console.log('if condition', tags.length > 0 && validationSuccess === false)
              if (tags.length > 0 && notValidContracts.length > 0) {
                setHoverMessage('Please hover over the contracts to check the validation status with the reason.');
              }
              else {
                setHoverMessage('');
              }
              setNewTagList(res)
              setServerError('')
              setLoader(false);
              // }

            }
            else {
              setHoverMessage('')
              setWarningMessage('')
              setServerError('Internal server error occured, please try again')
              setLoader(false);
            }
          },
            (error) => {
              setLoader(false);
              setHoverMessage('')
              setWarningMessage('')
              setServerError('Internal server error occured, please try again')
            });
          setServerError('')
        }
        else if (tags.length === 0 && contract === '' && selectedtemplate === '' && !usageEndDate) {
          setContractValidation('Please enter contract number')
          setTemplateTypeValidation('Please select template type.')
          setEndDateValidation('Please select end date')
          setValidContractError('')
          setNumberValidateMsg('')
          setMaximumLimitError('')
          setEnterKeyError('')
        }
        else if (selectedtemplate === '' && contract === '' && tags.length > 0 && contractValidation === '' && usageEndDate) {
          setContractValidation('')
          setEnterKeyError('')
          setTemplateTypeValidation('Please select template type.')
        }
        else if (tags.length === 0 && contract === '' && selectedtemplate && usageEndDate) {
          setContractValidation('Please enter contract number')
          setValidContractError('')
          setNumberValidateMsg('')
          setMaximumLimitError('')
          setContractLengthError('')
          setTemplateTypeValidation('')
          setEnterKeyError('')
        }
        else if ((tags.length === 0 || tags.length > 0) && tags.length < 10 && contract && selectedtemplate && usageEndDate) {
          console.log('in else condition for pressing enter key')
          setEnterKeyError('Press "Enter" key to add contract number')
          setValidContractError('')
          setNumberValidateMsg('')
          setMaximumLimitError('')
          setContractLengthError('')
          setTemplateTypeValidation('')
          setContractValidation('')
        }
        else if ((tags.length === 0 || tags.length > 0) && tags.length < 10 && contract && selectedtemplate === '' && usageEndDate) {
          setEnterKeyError('Press "Enter" key to add contract number')
          setTemplateTypeValidation('Please select template type.')
          setValidContractError('')
          setNumberValidateMsg('')
          setMaximumLimitError('')
          setContractLengthError('')
          setContractValidation('')
        }
        else if (!usageEndDate && contract === '' && tags.length > 0 && contractValidation === '' && selectedtemplate) {
          setEndDateValidation('Please select end date')
        }
        else if (!usageEndDate && contract && selectedtemplate) {
          setEndDateValidation('Please select end date')
          setEnterKeyError('Press "Enter" key to add contract number')
        }
        else if (!usageEndDate && selectedtemplate === '' && contract === '' && tags.length > 0 && contractValidation === '') {
          setEndDateValidation('Please select end date')
          setTemplateTypeValidation('Please select template type.')
        }
        else if (!usageEndDate && tags.length === 0 && contract === '' && selectedtemplate) {
          setEndDateValidation('Please select end date')
          setContractValidation('Please enter contract number')
        }
        else if ((tags.length === 0 || tags.length > 0) && tags.length < 10 && contract && selectedtemplate === '' && !usageEndDate) {
          setEndDateValidation('Please select end date')
          setTemplateTypeValidation('Please select template type.')
          setEnterKeyError('Press "Enter" key to add contract number')
        }
        else if (tags.length === 0 && contract === '' && selectedtemplate === '' && usageEndDate) {
          setTemplateTypeValidation('Please select template type.')
          setContractValidation('Please enter contract number')
        }
      }
    } else if (showSubscriptionField) {
      setSearchCriteriaValidation('')
      console.log('subscriptionNumber value========>', subscriptionNumber)
      console.log('subscriptionTags.length', subscriptionTags, '===>', subscriptionTags.length)
      setDuplicateError('')
      if (subscriptionNumber === '') {
        setSubscrptionEnterError('')
        setMaxSubscriptionLimitError('')
      }
      if (!checked) {
        if (subscriptionTags.length > 0 && subscriptionNumber === '' && selectedtemplate) {
          if (!subscriptionNumber && subscriptionNumberValidateMsg) {
            setSubscriptionNumberValidateMsg('')
          }
          console.log('if condition first')
          let subscriptions = [];
          subscriptionTags.map((tag, index) => {
            subscriptions.push(tag.subscriptionNumber);
          })
          let data = subscriptions.join(",");
          let templateType;
          let usageDateType;
          if (selectedtemplate === 'perDay') {
            templateType = 'dailyusage';
            usageDateType = 'usagetodate';
          } else if (selectedtemplate === 'perBillCycle') {
            templateType = 'billcycleusage';
            usageDateType = 'billingDate';
          }
          let present_date = new Date();
          var formattedDate = moment(present_date).format('YYYY-MM-DD');
          setLoader(true)
          services.validateSubscriptionsToDownload(templateType, data, usageDateType, formattedDate).then(res => {
            //console.log('res status===========>',res.status)
            if (res && res.length > 0) {
              setSubscriptionValidateResponse(res);
              setWarningMessage('')
              setServerError('')

              let notValidSubscriptions = res.filter(validData => validData.statusCode !== '200')
              console.log('not valid subscriptions,', notValidSubscriptions.length)
              if (notValidSubscriptions.length > 0) {
                setSubscriptionValidationSuccess(false);
              }
              else {
                setSubscriptionValidationSuccess(true);
              }

              console.log('notvalidsubscriptions==========>', subscriptionValidationSuccess);
              setSubscriptionTags([]);
              let finalArray = [];
              res.filter(e => {
                if (subscriptionTags.find(n => n.subscriptionNumber === e.subscriptionNumber)) {
                  var bgcolor = "gray"
                  if (e.statusCode == "200") { bgcolor = "#009000" }
                  else { bgcolor = "#e61616" }
                  var objectsValid = {
                    "subscriptionNumber": e.subscriptionNumber,
                    "statusCode": e.statusCode,
                    "reason": e.reason,
                    "background": bgcolor,
                    "color": "#fff"
                  }
                  finalArray.push(objectsValid)
                }
              });
              setSubscriptionTags(finalArray);
              console.log('invalid numbers======>', notValidSubscriptions.length > 0)
              console.log('if condition', subscriptionTags.length > 0 && subscriptionValidationSuccess === false)
              if (subscriptionTags.length > 0 && notValidSubscriptions.length > 0) {
                setHoverMessage('Please hover over the subscriptions to check the validation status with the reason.');
              }
              else {
                setHoverMessage('');
              }
              setSubscriptionTagList(res)
              setServerError('')
              setLoader(false);
            }
            else {
              setHoverMessage('')
              setWarningMessage('')
              setServerError('Internal server error occured, please try again')
              setLoader(false);
            }
          },
            (error) => {
              setLoader(false);
              setHoverMessage('')
              setWarningMessage('')
              setServerError('Internal server error occured, please try again')
            });
          setServerError('')
        }
        if (subscriptionTags.length === 0 && subscriptionNumber === '') {
          setSubscriptionValidation('Please enter subscription number')
        } else {
          setSubscriptionValidation('')
        }
        if ((subscriptionTags.length === 0 || subscriptionTags.length > 0) && subscriptionTags.length < 10 && subscriptionNumber) {
          console.log('in else condition for pressing enter key')
          setSubscrptionEnterError('Press "Enter" key to add subscription number')
        } else {
          setSubscrptionEnterError('')
        }
      }
      else {
        if (subscriptionTags.length > 0 && subscriptionNumber === '' && selectedtemplate && usageEndDate) {
          if (!subscriptionNumber && subscriptionNumberValidateMsg) {
            setSubscriptionNumberValidateMsg('')
          }
          console.log('if condition first')
          let subscriptions = [];
          subscriptionTags.map((tag, index) => {
            subscriptions.push(tag.subscriptionNumber);
          })
          let data = subscriptions.join(",");
          let templateType;
          let usageDateType;
          if (selectedtemplate === 'perDay') {
            templateType = 'dailyusage';
            usageDateType = 'usagetodate';
          } else if (selectedtemplate === 'perBillCycle') {
            templateType = 'billcycleusage';
            usageDateType = 'billingDate';
          }
          //let present_date = new Date();
          var endDate = moment(usageEndDate).format('YYYY-MM-DD');
          setLoader(true)
          services.validateSubscriptionsToDownload(templateType, data, usageDateType, endDate).then(res => {
            //console.log('res status===========>',res.status)
            if (res && res.length > 0) {
              setSubscriptionValidateResponse(res);
              setWarningMessage('')
              setServerError('')

              let notValidSubscriptions = res.filter(validData => validData.statusCode !== '200')
              console.log('not valid Subscriptions,', notValidSubscriptions.length)
              if (notValidSubscriptions.length > 0) {
                setSubscriptionValidationSuccess(false);
              }
              else {
                setSubscriptionValidationSuccess(true);
              }

              console.log('notValidSubscriptions==========>', subscriptionValidationSuccess)
              setSubscriptionTags([]);
              let finalArray = [];
              res.filter(e => {
                if (subscriptionTags.find(n => n.subscriptionNumber === e.subscriptionNumber)) {
                  var bgcolor = "gray"
                  if (e.statusCode == "200") { bgcolor = "#009000" }
                  else { bgcolor = "#e61616" }
                  var objectsValid = {
                    "subscriptionNumber": e.subscriptionNumber,
                    "statusCode": e.statusCode,
                    "reason": e.reason,
                    "background": bgcolor,
                    "color": "#fff"
                  }
                  finalArray.push(objectsValid)
                }
              });
              setSubscriptionTags(finalArray);
              console.log('invalid numbers======>', notValidSubscriptions.length > 0)
              console.log('if condition', subscriptionTags.length > 0 && subscriptionValidationSuccess === false)
              if (subscriptionTags.length > 0 && notValidSubscriptions.length > 0) {
                setHoverMessage('Please hover over the subscriptions to check the validation status with the reason.');
              }
              else {
                setHoverMessage('');
              }
              setSubscriptionTagList(res)
              setServerError('')
              setLoader(false);
              // }

            }
            else {
              setHoverMessage('')
              setWarningMessage('')
              setServerError('Internal server error occured, please try again')
              setLoader(false);
            }
          },
            (error) => {
              setLoader(false);
              setHoverMessage('')
              setWarningMessage('')
              setServerError('Internal server error occured, please try again')
            });
          setServerError('')
        }
        if (subscriptionTags.length === 0 && subscriptionNumber === '') {
          setSubscriptionValidation('Please enter subscription number')
        } else {
          setSubscriptionValidation('')
        }
        if ((subscriptionTags.length === 0 || subscriptionTags.length > 0) && subscriptionTags.length < 10 && subscriptionNumber) {
          setSubscrptionEnterError('Press "Enter" key to add subscription number')
        }
        else {
          setSubscrptionEnterError('')
        }
        if (!usageEndDate) {
          setEndDateValidation('Please select end date')
        }
        else {
          setEndDateValidation('')
        }
      }
    } else {
      setSearchCriteriaValidation('Please select download criteria.')
    }
  }

  const downloadUsages = () => {
    if (showContractField) {
      if (tags.length > 0 && selectedtemplate && validContractError === '' && numberValidateMsg === '' && contractValidation === '') {
        let templateType;
        let usageDateType;
        if (selectedtemplate === 'perDay') {
          templateType = 'dailyusage';
          usageDateType = 'usagetodate';
        } else if (selectedtemplate === 'perBillCycle') {
          templateType = 'billcycleusage';
          usageDateType = 'billingDate';
        }
        let contracts = [];
        tags.map((contract, index) => {
          contracts.push(contract.contractNumber);
        })
        let contractsData = contracts.join(",");
        var formattedDate;
        if (checked && usageEndDate) {
          formattedDate = moment(usageEndDate).format('YYYY-MM-DD');
        } else {
          let present_date = new Date();
          formattedDate = moment(present_date).format('YYYY-MM-DD');
        }
        (async () => {
          setLoader(true)
          console.log("templateType ==>", templateType)
          console.log("contractsData ==>", contractsData)
          console.log("usageDateType ==>", usageDateType)
          console.log("formattedDate ==>", formattedDate)
          let res = await services.downloadUsages(templateType, contractsData, usageDateType, formattedDate);
          if (res.status === 202 && templateType === 'dailyusage') {
            setLoader(false);
            addToast('There are no days pending to upload usages for the contract:' + res.headers.get('ContractNumber'), {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res.status === 202 && templateType === 'billcycleusage') {
            setLoader(false);
            addToast('There are no bill cycles pending to upload usages contract:' + res.headers.get('ContractNumber'), {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res.status === 204) {
            setLoader(false);
            addToast('Contract number:' + res.headers.get('ContractNumber') + ' does not exist in the system', {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res.status === 206 && templateType === 'billcycleusage') {
            setLoader(false);
            addToast('Some contract details are missing for the bill cycle schedule for contract:' + res.headers.get('ContractNumber'), {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res.status !== 200 && res.status !== 202 && res.status !== 204 && res.status !== 206) {
            setLoader(false);
            addToast('Internal server error occured while downloading the file', {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
        })();
        setTags([])
        setOption('')
        setSelectedTemplate('');
        setValidContractError('');
        setEnterKeyError('')
        setNumberValidateMsg('');
        setMaximumLimitError('')
        setNewTagList()
        setUsageEndDate();
        setContractValidation('');
        setValidationSuccess(false);
        setShowContractField(false);
        setAdvancedBillingCheck(false);
        setChecked(false);
        setLoader(false);
        setDownloadShow(false);
      }
    } else if (showSubscriptionField) {
      if (subscriptionTags.length > 0 && selectedtemplate) {
        let templateType;
        let usageDateType;
        if (selectedtemplate === 'perDay') {
          templateType = 'dailyusage';
          usageDateType = 'usagetodate';
        } else if (selectedtemplate === 'perBillCycle') {
          templateType = 'billcycleusage';
          usageDateType = 'billingDate';
        }
        let subscriptions = [];
        subscriptionTags.map((subscription, index) => {
          subscriptions.push(subscription.subscriptionNumber);
        })
        let subscriptionData = subscriptions.join(",");
        let newFormattedDate;
        if (checked && usageEndDate) {
          newFormattedDate = moment(usageEndDate).format('YYYY-MM-DD');
        } else {
          let present_date = new Date();
          newFormattedDate = moment(present_date).format('YYYY-MM-DD');
        }
        (async () => {
          setLoader(true)
          let res = await services.downloadSubscriptionUsages(templateType, subscriptionData, usageDateType, newFormattedDate);
          if (res.status === 202 && templateType === 'dailyusage') {
            setLoader(false);
            addToast('There are no days pending to upload usages for the contract:' + res.headers.get('SubscriptionNumber'), {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res.status === 202 && templateType === 'billcycleusage') {
            setLoader(false);
            addToast('There are no bill cycles pending to upload usages contract:' + res.headers.get('SubscriptionNumber'), {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res.status === 204) {
            setLoader(false);
            addToast('Subscription number:' + res.headers.get('SubscriptionNumber') + ' does not exist in the system', {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res.status === 206 && templateType === 'billcycleusage') {
            setLoader(false);
            addToast('Some contract details are missing for the bill cycle schedule for contract:' + res.headers.get('SubscriptionNumber'), {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res.status !== 200 && res.status !== 202 && res.status !== 204 && res.status !== 206) {
            setLoader(false);
            addToast('Internal server error occured while downloading the file', {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
        })();
        setTags([])
        setOption('');
        setSelectedTemplate('');
        setValidContractError('');
        setContractValidation('');
        setEnterKeyError('')
        setNumberValidateMsg('');
        setMaximumLimitError('')
        setNewTagList()
        setUsageEndDate();
        setSubscriptionValidationSuccess(false);
        setAdvancedBillingCheck(false);
        setShowSubscriptionField(false);
        setSubscriptionTags([]);
        setChecked(false);
        setLoader(false);
        setDownloadShow(false);
      }
    }
    else if (soldToSearch) {
      console.log("selectedtemplate ---> ", selectedtemplate)
      console.log("selected.length > 0 ---> ", selected.length > 0, selected)
      if (selected.length > 0 && selectedtemplate) {
        setLoader(true)
        let templateType;
        let usageDateType;
        if (selectedtemplate === 'perDay') {
          templateType = 'dailyusage';
          usageDateType = 'usagetodate';
        } else if (selectedtemplate === 'perBillCycle') {
          templateType = 'billcycleusage';
          usageDateType = 'billingDate';
        }

        let contracts = [];
        selected.map((contract, index) => {
          if (contract != undefined) return contracts.push(contract);
        })
        console.log("contracts ===> ", contracts)
        let contractsData = contracts.join(",");

        let formattedDates;
        if (checked && usageEndDate) {
          formattedDates = moment(usageEndDate).format('YYYY-MM-DD');
        } else {
          let present_date = new Date();
          formattedDates = moment(present_date).format('YYYY-MM-DD');
        }

        (async () => {
          setLoader(true)
          console.log("templateType ==>", templateType)
          console.log("contractsData ==>", contractsData)
          console.log("usageDateType ==>", usageDateType)
          console.log("formattedDate ==>", formattedDates)
          let res = await services.downloadUsages(templateType, contractsData, usageDateType, formattedDates);
          if (res && res.status === 202 && templateType === 'dailyusage') {
            setLoader(false);
            addToast('There are no days pending to upload usages for the contract:' + res.headers.get('ContractNumber'), {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res && res.status === 202 && templateType === 'billcycleusage') {
            setLoader(false);
            addToast('There are no bill cycles pending to upload usages contract:' + res.headers.get('ContractNumber'), {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res && res.status === 204) {
            setLoader(false);
            addToast('Contract number:' + res.headers.get('ContractNumber') + ' does not exist in the system', {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res && res.status === 206 && templateType === 'billcycleusage') {
            setLoader(false);
            addToast('Some contract details are missing for the bill cycle schedule for contract:' + res.headers.get('ContractNumber'), {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else if (res && res.status !== 200 && res.status !== 202 && res.status !== 204 && res.status !== 206) {
            setLoader(false);
            addToast('Internal server error occured while downloading the file', {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else {
            // setLoader(false);
            // afterSuccessResponse();
          }
        })();
        setTimeout(function () {
          setLoader(false);
          afterSuccessResponse();
        }, 3000);

      }
    }
  }

  const afterSuccessResponse = () => {
    console.log("Clear selected data")
    setTags([])
    setOption('')
    setSelectedTemplate('');
    setValidContractError('');
    setEnterKeyError('')
    setNumberValidateMsg('');
    setMaximumLimitError('')
    setNewTagList()
    setUsageEndDate();
    setContractValidation('');
    setValidationSuccess(false);
    setShowContractField(false);
    setAdvancedBillingCheck(false);
    setChecked(false);
    setLoader(false);
    setDownloadShow(false);
    setRows([]);
    setInputSoldToNumber('');
    setSoldToSearch(false);
    setSoldToSearchContractList(false);
    setSelected([]);
  }

  const handleDownloadCancel = () => {
    setDownloadShow(false);
    setContractValidation('');
    setDuplicateContractError('')
    setTemplateTypeValidation('');
    setEndDateValidation('');
    setSelectedTemplate('');
    setNumberValidateMsg('');
    setMaximumLimitError('')
    setValidContractError('');
    setContractLengthError('');
    setTags([])
    setNewTagList()
    setWarningMessage('')
    setServerError('')
    setContract('');
    setHoverMessage('')
    setEnterKeyError('')
    setUsageEndDate()
    setSubscriptionNumberValidateMsg('')
    setValidSubscriptionError('')
    setSubscriptionLengthError('')
    setSubscriptionValidation('')
    setDuplicateError('')
    setSubscrptionEnterError('')
    setMaxSubscriptionLimitError('')
    setSearchCriteriaValidation('')
    setValidationSuccess(false)
    setSubscriptionValidationSuccess(false)
    setShowContractField(false)
    setShowSubscriptionField(false)
    setAdvancedBillingCheck(false)
    setChecked(false)
    setInputSoldToNumber('')
    setRows([]);
    setOption('')
    setSoldToSearchContractList(false);
    setSoldToSearch(false);
    setSelected([]);

  }

  const numberOnlyValidate = (event) => {
    console.log('event length', event.target.value.length)
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && event.target.value.length < 14 && tags.length < 10) {
      setNumberValidateMsg('Please enter numeric value only');
      setValidContractError('');
      setContractValidation('');
      setContractLengthError('')
      setDuplicateContractError('')
      setMaximumLimitError('')
      setEnterKeyError('')
      event.preventDefault();
      return false;
    }
    else if (charCode > 31 && (charCode < 48 || charCode > 57) && event.target.value.length < 14 && tags.length >= 10) {
      setNumberValidateMsg('');
      setValidContractError('');
      setContractValidation('');
      setContractLengthError('')
      setDuplicateContractError('')
      setMaximumLimitError('')
      setEnterKeyError('')
      event.preventDefault();
      return false;
    }
    else if (charCode > 31 && (charCode < 48 || charCode > 57) && event.target.value.length === 14 && tags.length < 10) {
      setNumberValidateMsg('');
      setValidContractError('');
      setContractValidation('');
      setContractLengthError('')
      setDuplicateContractError('')
      setMaximumLimitError('Maximum limit have been reached')
      setEnterKeyError('')
      event.preventDefault();
      return false;
    }
    else if (event.target.value.length >= 14 && tags.length < 10) {
      setNumberValidateMsg('');
      setValidContractError('');
      setContractValidation('');
      setContractLengthError('')
      setDuplicateContractError('')
      setEnterKeyError('')
      setMaximumLimitError('Maximum limit have been reached')
      return true;
    }
    else {
      setNumberValidateMsg('');
      setValidContractError('');
      setContractValidation('');
      setContractLengthError('')
      setDuplicateContractError('')
      setEnterKeyError('')
      setMaximumLimitError('')
      return true;
    }
  }

  const numberOnlyValidateForSubscription = (event) => {
    console.log('event length', event.target.value.length)
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && event.target.value.length < 14 && subscriptionTags.length < 10) {
      setSubscriptionNumberValidateMsg('Please enter numeric value only');
      setValidSubscriptionError('');
      setSubscriptionValidation('');
      setSubscriptionLengthError('')
      setDuplicateError('')
      setMaxSubscriptionLimitError('')
      setSubscrptionEnterError('')
      event.preventDefault();
      return false;
    }
    else if (charCode > 31 && (charCode < 48 || charCode > 57) && event.target.value.length < 14 && subscriptionTags.length >= 10) {
      setSubscriptionNumberValidateMsg('');
      setValidSubscriptionError('');
      setSubscriptionValidation('');
      setSubscriptionLengthError('')
      setDuplicateError('')
      setMaxSubscriptionLimitError('')
      setSubscrptionEnterError('')
      event.preventDefault();
      return false;
    }
    else if (charCode > 31 && (charCode < 48 || charCode > 57) && event.target.value.length === 14 && subscriptionTags.length < 10) {
      setSubscriptionNumberValidateMsg('');
      setValidSubscriptionError('');
      setSubscriptionValidation('');
      setSubscriptionLengthError('')
      setDuplicateError('')
      setMaxSubscriptionLimitError('Maximum limit have been reached')
      setSubscrptionEnterError('')
      event.preventDefault();
      return false;
    }
    else if (event.target.value.length >= 14 && subscriptionTags.length < 10) {
      setSubscriptionNumberValidateMsg('');
      setValidSubscriptionError('');
      setSubscriptionValidation('');
      setSubscriptionLengthError('')
      setDuplicateError('')
      setSubscrptionEnterError('')
      setMaxSubscriptionLimitError('Maximum limit have been reached')
      return true;
    }
    else {
      setSubscriptionNumberValidateMsg('');
      setValidSubscriptionError('');
      setSubscriptionValidation('');
      setSubscriptionLengthError('')
      setDuplicateError('')
      setSubscrptionEnterError('')
      setMaxSubscriptionLimitError('')
      return true;
    }
  }

  const addTags = event => {
    setValidationSuccess(false)
    if (!validationSuccess && newTagList && newTagList.length > 0 && tags.length > 0) {
      setHoverMessage('')
      setWarningMessage('Please click on "Validate" to validate all the contracts');
    } else {
      setWarningMessage('')
      setHoverMessage('')
    }
    //setNewTagList()
    if (tags.length <= 9) {
      if (event.key === "Enter" && event.target.value !== "") {
        setContractValidation('')
        setEnterKeyError('')
        setMaximumLimitError('')
        // if (tags.includes(event.target.value)) {
        if (tags.some(contract => contract.contractNumber == event.target.value.trim())) {
          setDuplicateContractError('Duplicate contract number is not allowed')
        }
        else {
          setDuplicateContractError('')
          var numbers = /^[0-9]+$/;
          if (event.target.value.trim().match(numbers)) {
            setValidContractError('')
            let customObj = {
              "contractNumber": event.target.value.trim(),
              "statusCode": "",
              "reason": "",
              "background": "",
              "color": "#6b6b6b"
            }
            setTags([...tags, customObj]);
            event.target.value = "";
            setContract('');
            return true;
          }
          else {
            setValidContractError('Please input numeric characters only')
            setContractLengthError('')
            return false;
          }
        }
      }
      setContractLengthError('')
      event.preventDefault();
      return true;
    }
    else {
      setValidContractError('')
      setContractValidation('')
      setEnterKeyError('')
      setNumberValidateMsg('')
      setMaximumLimitError('')
      setDuplicateContractError('')
      setContractLengthError('Only 10 contracts are allowed to enter')
      event.preventDefault();
      return false;
    }
  };

  const addSubscriptionTags = event => {
    setSubscriptionValidationSuccess(false)
    if (!subscriptionValidationSuccess && subscriptionTagList && subscriptionTagList.length > 0 && subscriptionTags.length > 0) {
      setHoverMessage('')
      setWarningMessage('Please click on "Validate" to validate all the subscriptions');
    } else {
      setWarningMessage('')
      setHoverMessage('')
    }
    if (subscriptionTags.length <= 9) {
      if (event.key === "Enter" && event.target.value !== "") {
        if (subscriptionTags.some(subscription => subscription.subscriptionNumber == event.target.value.trim())) {
          setDuplicateError('Duplicate contract number is not allowed')
        }
        else {
          setDuplicateError('')
          var numbers = /^[0-9]+$/;
          if (event.target.value.trim().match(numbers)) {
            setValidSubscriptionError('')
            let customObj = {
              "subscriptionNumber": event.target.value.trim(),
              "statusCode": "",
              "reason": "",
              "background": "",
              "color": "#6b6b6b"
            }
            setSubscriptionTags([...subscriptionTags, customObj]);
            event.target.value = "";
            setSubscriptionNumber('');
            return true;
          }
          else {
            setValidSubscriptionError('Please input numeric characters only')
            setSubscriptionLengthError('')
            return false;
          }
        }
      }
      setSubscriptionLengthError('')
      event.preventDefault();
      return true;
    }
    else {
      setValidSubscriptionError('')
      setSubscriptionValidation('')
      setSubscrptionEnterError('')
      setSubscriptionNumberValidateMsg('')
      setMaxSubscriptionLimitError('')
      setDuplicateError('')
      setSubscriptionLengthError('Only 10 subscriptions are allowed to enter')
      event.preventDefault();
      return false;
    }
  }


  const removeLengthError = event => {
    if (!contract) {
      setContractLengthError('')
    }
  }

  const removeSubscriptionLengthError = event => {
    if (!subscriptionNumber) {
      setSubscriptionLengthError('')
    }
  }


  const removeTags = index => {
    setValidationSuccess(false)
    setTags([...tags.filter(tag => tags.indexOf(tag) !== index)]);
    setContractLengthError('')
    if (!validationSuccess && newTagList && newTagList.length > 0 && tags.length >= 2) {
      setWarningMessage('Please click on "Validate" to validate all the contracts');
      setHoverMessage('')
    } else {
      setNewTagList()
      setWarningMessage('')
      setHoverMessage('')
    }
    //setNewTagList()
  };

  const removeSubscriptionTags = index => {
    setSubscriptionValidationSuccess(false)
    setSubscriptionTags([...subscriptionTags.filter(tag => subscriptionTags.indexOf(tag) !== index)]);
    setSubscriptionLengthError('')
    if (!subscriptionValidationSuccess && subscriptionTagList && subscriptionTagList.length > 0 && subscriptionTags.length >= 2) {
      setWarningMessage('Please click on "Validate" to validate all the subscriptions');
      setHoverMessage('')
    } else {
      setSubscriptionTagList()
      setWarningMessage('')
      setHoverMessage('')
    }
  }


  const usageDateChange = (value) => {
    console.log("value ==> ", value)
    setUsageEndDate(value);
    if (value) {
      // setUsageEndDate(value);
      setEndDateValidation('');
      setWarningMessage('Please click on "Validate" to validate all the contracts')
    } else {
      console.log("value Null ==> ", value)
      setEndDateValidation('Please select end date');
      // setUsageEndDate();
      setWarningMessage('')
    }
    console.log("usageEndDate ==> ", usageEndDate)
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setWarningMessage('Please click on "Validate" to validate all the contracts');
    setHoverMessage('')
    if (event.target.checked === true) {
      setAdvancedBillingCheck(true);
    } else {
      setAdvancedBillingCheck(false);
      setUsageEndDate();
    }
  };


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const handleSelectAllClick = (event) => {
  //   console.log("event.target.checked ===> ", event.target.checked)
  //   if (event.target.checked) {
  //     // const newSelecteds = rows.map((n) =>  n.contractNumber);
  //     let CheckAllCount = 0;
  //     const newSelecteds = rows.map((n) => {
  //       // console.log("CheckAllCount ==>", CheckAllCount)

  //       if (n.totalNoPendingbillcycle != null && n.totalNoPendingbillcycle != "0" ) return n.contractNumber
  //     })
  //     console.log("newSelecteds ==> ", newSelecteds)

  //     let finalArray = [];
  //     rows.forEach(element => {
  //       if (element.totalNoPendingbillcycle != null && element.totalNoPendingbillcycle != "0") {
  //         CheckAllCount = CheckAllCount + 1
  //         finalArray.push(element.contractNumber)
  //       }
  //     });


  //     // console.log("finalArray ==> ", finalArray)
  //     setSelected(finalArray);
  //     // console.log("selected  ==> ", selected)

  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleSelectAllClick = (event) => {
    console.log("selectedCheckAll ==> ", selectedCheckAll)
    if (event.target.checked) {

      // const newSelecteds = rows.map((n) => {
      //   if (n.totalNoPendingbillcycle != null && n.totalNoPendingbillcycle != "0") return n.contractNumber
      // });
      if (selectedCheckAll) {
        setSelectedCheckAll(!event.target.checked)
        let CheckAllCount = 0;
        let finalArray = [];
        stableSort(rows, getComparator(order, orderBy)).forEach(element => {
          if (element.totalNoPendingbillcycle != null && element.totalNoPendingbillcycle != "0" && CheckAllCount < 100) {
            CheckAllCount = CheckAllCount + 1
            finalArray.push(element.contractNumber)
          }
        });

        setSelected(finalArray);
        return;
      }
      else {
        setSelectedCheckAll(event.target.checked)
        setSelected([]);
        setWarningMax100Contract(false)
      }
    }
    setSelected([]);
  };


  const handleClick = (event, name, totalNoPendingbillcycle) => {
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

    if (totalNoPendingbillcycle == null || totalNoPendingbillcycle == "0") {
      // newSelected = newSelected.concat(selected.slice(1));
      // newSelected = newSelected.concat(selected.slice(0, -1));
      newSelected.splice(selectedIndex, 1);
    }

    if (newSelected.length > 100) {
      newSelected.splice(selectedIndex, 1);
      setWarningMax100Contract(true)
    }
    else if (newSelected.length == 0) {
      setSelectedCheckAll(true)
      setWarningMax100Contract(false)
    }
    else {
      setWarningMax100Contract(false)
    }

    console.log("newSelected ==> ", newSelected)
    setSelected(newSelected);
    console.log("selected --> ", selected)
  };


  const isSelected = (name) => {
    // console.log("name ==> ", name)
    return selected.indexOf(name) !== -1
  };

  const numberOnlyValidateForSoldToNumbers = (event) => {
    console.log('event length', event.target.value.length)
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      setSoldToNumberValidation('Please enter numeric value only');
      event.preventDefault();
      return false;
    }
    else {
      setSoldToNumberValidation('');
      return true;
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };



  return (
    <div>
      {loader ? <Loader /> : null}
      <div className="d-flex align-items-center mt-3 mb-3">
        <button onClick={() => props.history.push('/dashboard/usageupload')} className="ml-auto btn btn-primary btn-sm back-button" type="button" ><span><ArrowBackIcon />  Back To Dashboard</span></button>
      </div>
      <Card className={classes.root}>
        <div className="row ml-1"><p className="uploadDownloadTitle">Download</p></div>
        <CardContent>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3 mt-2">
              <FormControl required className={classes.formControl} error={templateTypeValidation} >
                <InputLabel id="demo-simple-select-required-label">Template</InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  value={selectedtemplate}
                  onChange={change}
                  className={classes.selectEmpty}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"perDay"}>Daily Usage</MenuItem>
                  <MenuItem value={"perBillCycle"}>Bill Cycle Usage</MenuItem>
                </Select>
                {templateTypeValidation ? <FormHelperText>⚠️ {templateTypeValidation}</FormHelperText> : ''}
              </FormControl>
              {/* {templateTypeValidation ? <p className="alert alert-danger"><ErrorIcon /> {templateTypeValidation}</p> : ''} */}
            </div>

            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3 mt-2">
              <FormControl required className={classes.formControl} error={searchCriteriaValidation} >
                <InputLabel id="demo-simple-select-required-label">Search By..</InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  value={option}
                  onChange={changeOption}
                  className={classes.selectEmpty}
                // endAdornment={<i style={{position: "absolute", right: "-15px", top: "12px"}} className="fa fa-info-circle contactIconStyle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Note: You can select either contract number or subscription number to download the template."></i>}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"contractNo"}>Contract Number</MenuItem>
                  <MenuItem value={"subscriptionNo"}>Subscription Number</MenuItem>
                  {selectedtemplate == "perBillCycle" ? <MenuItem value={"soldToSearch"}>Sold To Customer</MenuItem> : null}
                </Select>
                {searchCriteriaValidation ? <FormHelperText>⚠️ {searchCriteriaValidation}</FormHelperText> : ''}
              </FormControl>
            </div>
            <div className="col-auto mt-2">
              <div className="" style={{ marginTop: "30px" }}>
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  style={{ padding: 0 }}
                />
                <h5 style={{ display: "inline", fontSize: "14px" }} className="mt-2 form-label">Advance Billing <i className="fa fa-info-circle contactIconStyle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Note: If Advance billing is required for all the contracts entered please provide the billcycle end date."></i></h5>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3">
            {/* ///// */}
              <FormControl required className={classes.formControl} >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container >
                    <KeyboardDatePicker
                      style={{ width: "100%" }}
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="Billcycle End Date"
                      label="Billcycle End Date"
                      minDate={new Date()}
                      maxDate={maxEndDate}
                      value={usageEndDate}
                      onChange={(value) => usageDateChange(value)}
                      disabled={!advancedBillingCheck}
                      autoOk={true}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
                {endDateValidation ? <FormHelperText style={{ color: "red" }}> ⚠️ {endDateValidation}</FormHelperText> : ''}
              </FormControl>
            </div>
          </div>

          <div className="row mt-2 mb-3">
            {soldToSearch ?
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3 mt-2">
                <FormControl required className={classes.formControl} error={soldToNumberValidation} >
                  <TextField required id="filled-basic" error={soldToNumberValidation} onKeyPress={event => numberOnlyValidateForSoldToNumbers(event)} label="SoldTo Number" value={inputSoldToNumber} onChange={(event) => setInputSoldToNumber(event.target.value)} />
                  {soldToNumberValidation ? <FormHelperText>⚠️ {soldToNumberValidation}</FormHelperText> : ''}
                </FormControl>
              </div> : null}

            {soldToSearch ?
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-2 pl-2" style={{ paddingTop: "30px", paddingRight: "0" }}>
                <Button variant="secondary" onClick={searchsolToContract} style={{ padding: "5px 30px 5px 30px" }} > Search </Button>
              </div> : null}
            {!soldToSearch ? <>
              {showContractField ?
                <div className="col-8 mt-2">
                  <FormControl required className={classes.formControl} >
                    <h5 className="mt-2 form-label">Contract Number<span className="required"></span></h5>
                    <div className="input-tag">
                      <ul className="input-tag__tags">
                        {tags.map((tag, index) => (
                          <Tooltip classes={{ tooltip: classes.customTooltip }} title={tag.reason}>
                            <li key={index} style={{ border: "1px solid gray", cursor: "pointer", color: tag.color, background: tag.background }}>
                              <span>{tag.contractNumber}</span>
                              <i className="material-icons" style={{ cursor: "pointer" }} onClick={() => removeTags(index)} >close</i>
                            </li>
                          </Tooltip>
                        ))}
                        <li className="input-tag__tags__input">
                          <input
                            type="text"
                            value={contract}
                            onChange={event => setContract(event.target.value)}
                            onKeyPress={event => numberOnlyValidate(event)}
                            onKeyUp={event => addTags(event)}
                            onBlur={event => removeLengthError(event)}
                            placeholder="Press enter to add contract number"
                            style={inputBoxStyle}
                            maxLength="14"
                          />
                        </li>
                      </ul>
                    </div>
                    {numberValidateMsg ? <FormHelperText style={{ color: "red" }}>⚠️  {numberValidateMsg}</FormHelperText> : ''}
                    {validContractError ? <FormHelperText style={{ color: "red" }}>⚠️  {validContractError}</FormHelperText> : ''}
                    {contractLengthError ? <FormHelperText style={{ color: "red" }}>⚠️  {contractLengthError}</FormHelperText> : ''}
                    {contractValidation ? <FormHelperText style={{ color: "red" }}>⚠️  {contractValidation}</FormHelperText> : ''}
                    {duplicateContractError ? <FormHelperText style={{ color: "red" }}>⚠️  {duplicateContractError}</FormHelperText> : ''}
                    {enterKeyError ? <FormHelperText style={{ color: "red" }}>⚠️ {enterKeyError}</FormHelperText> : ''}
                    {maximumLimitError ? <FormHelperText style={{ color: "red" }}>⚠️ {maximumLimitError}</FormHelperText> : ''}
                    {hoverMessage ? <FormHelperText style={{ color: "red" }}>⚠️ {hoverMessage}</FormHelperText> : ''}
                    {warningMessage ? <FormHelperText style={{ color: "red" }}>⚠️  {warningMessage}</FormHelperText> : ''}
                  </FormControl>
                </div> : ''}


              {showSubscriptionField ?
                <div className="col-8 mt-2">
                  <FormControl required className={classes.formControl} >

                    <h5 className="mt-2 form-label">Subscription Number<span className="required"></span></h5>
                    <div className="input-tag">
                      <ul className="input-tag__tags">
                        {subscriptionTags.map((tag, index) => (
                          <Tooltip classes={{ tooltip: classes.customTooltip }} title={tag.reason}>
                            <li key={index} style={{ border: "1px solid gray", cursor: "pointer", color: tag.color, background: tag.background }}>
                              <span>{tag.subscriptionNumber}</span>
                              <i className="material-icons" style={{ cursor: "pointer" }} onClick={() => removeSubscriptionTags(index)} >close</i>
                            </li>
                          </Tooltip>
                        ))}
                        <li className="input-tag__tags__input">
                          <input
                            type="text"
                            value={subscriptionNumber}
                            onChange={event => setSubscriptionNumber(event.target.value)}
                            onKeyPress={event => numberOnlyValidateForSubscription(event)}
                            onKeyUp={event => addSubscriptionTags(event)}
                            onBlur={event => removeSubscriptionLengthError(event)}
                            placeholder="Press enter to add subscription number"
                            style={inputBoxStyle}
                            maxLength="14"
                          />
                        </li>
                      </ul>
                    </div>
                    {subscriptionNumberValidateMsg ? <FormHelperText style={{ color: "red" }}>⚠️  {subscriptionNumberValidateMsg}</FormHelperText> : ''}
                    {validSubscriptionError ? <FormHelperText style={{ color: "red" }}>⚠️  {validSubscriptionError}</FormHelperText> : ''}
                    {subscriptionLengthError ? <FormHelperText style={{ color: "red" }}>⚠️  {subscriptionLengthError}</FormHelperText> : ''}
                    {subscriptionValidation ? <FormHelperText style={{ color: "red" }}>⚠️  {subscriptionValidation}</FormHelperText> : ''}
                    {duplicateError ? <FormHelperText style={{ color: "red" }}>⚠️  {duplicateError}</FormHelperText> : ''}
                    {subscriptionEnterError ? <FormHelperText style={{ color: "red" }}>⚠️ {subscriptionEnterError}</FormHelperText> : ''}
                    {maxSubscriptionLimitError ? <FormHelperText style={{ color: "red" }}>⚠️ {maxSubscriptionLimitError}</FormHelperText> : ''}
                    {warningMessage ? <FormHelperText >⚠️  {warningMessage}</FormHelperText> : ''}
                  </FormControl>
                </div> : ''}
            </> : null}

            {serverError ? <p className="alert alert-danger" style={{ margin: "8px 15px" }}><ErrorIcon /> {serverError}</p> : ''}
          </div>
          <div className="row justify-content-between">
            <div className="" style={{ padding: "31px 0 0 16px" }}>
              {soldToSearch && soldToSearchContractList ?
                <h5 className="form-label">Contract List<span className="required"></span></h5> : null}
            </div>
            <div className="mt-3 pr-3 mb-2">
              {!soldToSearch ?
                <Button variant="secondary" onClick={validateContractsList} style={{ padding: "5px 30px 5px 30px" }}> Validate </Button>
                : null}
              <Button variant="secondary" onClick={handleDownloadCancel} style={{ padding: "5px 30px 5px 30px" }}> Cancel </Button>
              {showContractField ?
                // <Button variant="primary" onClick={downloadUsages} style={{ padding: "5px 30px 5px 30px" }}> Download</Button>
                <Button variant="primary" onClick={downloadUsages} disabled={!validationSuccess || warningMessage} style={{ padding: "7px 30px 7px 30px" }}> Download</Button>
                : ''
              }
              {showSubscriptionField ?
                <Button variant="primary" onClick={downloadUsages} disabled={warningMessage || !subscriptionValidationSuccess} style={{ padding: "7px 30px 7px 30px" }}> Download</Button>
                : ''
              }
              {soldToSearch ?
                <Button variant="primary" onClick={downloadUsages} disabled={!selected.length > 0 || selected.length > 100} style={{ padding: "7px 30px 7px 30px" }}> Download</Button>
                : ''
              }
              {!showContractField && !showSubscriptionField && !soldToSearch ?
                <Button variant="primary" onClick={downloadUsages} disabled={true} style={{ padding: "7px 30px 7px 30px" }}> Download</Button>
                : ''}
            </div>
          </div>
          {soldToSearch ?
            <>
              {soldToSearchContractList ?
                <div className="row pt-0 pr-3 pl-3">
                  <div className={classes.root} style={{ marginBottom: "0" }}>
                    <Paper className={classes.tableStyle}>
                      {(!selectedCheckAll && rows.length > 100) ?
                        <Toolbar
                          className={{
                            [classes.warning]: selected.length > 0,
                          }}
                        >
                          {!selectedCheckAll ? (
                            <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                              ⚠️ Note: Select All Option Select only first 100 contracts
                            </Typography>
                          ) : null}
                        </Toolbar>
                        : null}
                      {(selected.length > 100 || warningMax100Contract) ?
                        <Toolbar
                          className={{
                            [classes.highlight]: selected.length > 0,
                          }}
                        >
                          {selected.length > 0 ? (
                            <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                              {selected.length} selected - You can Select Maximum 100 Contracts
                            </Typography>
                          ) : null}
                        </Toolbar>
                        : null}
                      <TableContainer className={classes.container}>
                        <Table stickyHeader size="small"
                          className={classes.table}
                          aria-labelledby="tableTitle"
                          // size={dense ? 'small' : 'medium'}
                          aria-label="enhanced table"
                        >
                          <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                          />
                          {rows.length > 0 ?
                            <TableBody>
                              {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                  const isItemSelected = isSelected(row.contractNumber);
                                  const labelId = `enhanced-table-checkbox-${index}`;

                                  return (
                                    <>
                                      {row.contractNumber != null ?
                                        <TableRow
                                          hover
                                          onClick={(event) => handleClick(event, row.contractNumber, row.totalNoPendingbillcycle)}
                                          role="checkbox"
                                          aria-checked={isItemSelected}
                                          tabIndex={-1}
                                          key={row.contractNumber}
                                          selected={isItemSelected}
                                          style={isItemSelected && (row.totalNoPendingbillcycle != null && row.totalNoPendingbillcycle != "0") ? { background: "#f4f4f4" } : { background: "white" }}
                                        >
                                          <TableCell padding="checkbox" style={{ width: "1%" }}>
                                            <Checkbox
                                              checked={(row.totalNoPendingbillcycle != null && row.totalNoPendingbillcycle != "0") ? isItemSelected : false}
                                              disabled={(row.totalNoPendingbillcycle != null && row.totalNoPendingbillcycle != "0") ? true : false}
                                              style={(row.totalNoPendingbillcycle != null && row.totalNoPendingbillcycle != "0") ? { color: "gray" } : { color: "#bfbfbf" }}

                                              inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                          </TableCell>
                                          <TableCell style={(row.totalNoPendingbillcycle != null && row.totalNoPendingbillcycle != "0") ? {} : { color: "#bfbfbf" }}> {row.contractNumber} </TableCell>
                                          <TableCell style={(row.totalNoPendingbillcycle != null && row.totalNoPendingbillcycle != "0") ? {} : { color: "#bfbfbf" }}>{row.subscriptionNumber}</TableCell>
                                          <TableCell style={(row.totalNoPendingbillcycle != null && row.totalNoPendingbillcycle != "0") ? {} : { color: "#bfbfbf" }}>{(row.totalNoPendingbillcycle != null && row.totalNoPendingbillcycle != "0") ? row.totalNoPendingbillcycle : "0"}</TableCell>
                                          <TableCell style={(row.totalNoPendingbillcycle != null && row.totalNoPendingbillcycle != "0") ? {} : { color: "#bfbfbf" }}>{row.shipTo}</TableCell>
                                          <TableCell style={(row.totalNoPendingbillcycle != null && row.totalNoPendingbillcycle != "0") ? {} : { color: "#bfbfbf" }}>{row.addintionalInfo && row.addintionalInfo.SOLD_TO_COUNTRY ? row.addintionalInfo.SOLD_TO_COUNTRY : ""}</TableCell>
                                        </TableRow> :
                                        <TableRow>
                                          <TableCell align="center" colSpan={7}>{row.reason}</TableCell>
                                        </TableRow>
                                      }
                                    </>
                                  );
                                })}
                              {/* {emptyRows > 0 && (
                              <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                <TableCell colSpan={6} />
                              </TableRow>
                            )} */}
                            </TableBody>
                            : <TableBody>
                              <TableRow><TableCell align="center" colSpan={7}>No Data Found</TableCell>
                              </TableRow></TableBody>}
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        style={{ borderTop: "1px solid lightgrey" }}
                      />
                    </Paper>
                  </div>
                </div>
                : null}
            </> : null}
        </CardContent>
      </Card>
    </div>
  );
}
