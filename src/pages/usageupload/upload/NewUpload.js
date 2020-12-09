import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';


import services from '../../../components/Services/service';
//import { environment } from '../../environment';
import { useToasts } from 'react-toast-notifications';
import Loader from '../../../components/shared/spinner/spinner';
import { Button, Alert } from 'react-bootstrap';
import '../../usageupload/usageupload.scss';
import './uplaod.scss';
import { ValidateLocalStoragealue, DecryptLocalStorage } from '../../../components/shared/local-storage/local-storage';
import ErrorIcon from '@material-ui/icons/Error';
//import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';
import InfoIcon from '@material-ui/icons/Info';
//    import Modals from '../../components/Dialogues/usageDownload';
import "react-datepicker/dist/react-datepicker.css";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CardHeader from '@material-ui/core/CardHeader';
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
import ChipInput from 'material-ui-chip-input';

const useStyles = makeStyles(theme => ({
      root: {
            width: '100%',
            boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px"
      },
      formControl: {
            margin: theme.spacing(1),
            minWidth: "100%",
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
const searchBoxStyle = {
      width: '300px',
      borderRadius: '0px',
      height: '39px'
}

const inputBoxStyle = {
      width: '100%',
      borderRadius: '0px',
      minHeight: '27px'
}

const contentTypeData = [
      { id: "upload/usage", name: "Usages" },
      { id: "ame/upload/subscription", name: "Subscription" },
      { id: "ame/upload/usagerunrequest", name: "Usage Run Request" },
      { id: "upload/usage/historic", name: "Historic Usages" }
];

export default function NewUsageUploads(props) {

      const classes = useStyles();
      let handleId = DecryptLocalStorage('handleId');
      const [order, setOrder] = React.useState('desc');
      const [orderBy, setOrderBy] = React.useState('submission_time');
      const [page, setPage] = useState(0);
      const [dense] = React.useState(true);
      const [rowsPerPage, setRowsPerPage] = React.useState(5);
      const [rows, setRows] = useState([]);
      const [count, setCount] = useState(10);
      let { addToast } = useToasts();
      const [showMsg, setShowMsg] = useState(false);
      const [show, setShow] = useState(false);
      const [option, setOption] = useState('');
      const [ameShow, setAmeShow] = useState(false);
      const [ppuShow, setPpuShow] = useState(false);
      const [contentType, setContentType] = useState('upload/usage');
      const [ppuTemplateType, setPpuTemplateType] = useState('');
      const [uploadTemplateTypeValidation, setUploadTemplateTypeValidation] = useState('');
      const [fileUploadValidMsg, setFileUploadValidMsg] = useState('')
      const [systemIdUploadValidMsg, setSystemIdUploadValidation] = useState('');
      const [emailId, setEmailId] = useState('');
      const [systemId, setSystemId] = useState('');
      const [filename, setFileName] = useState('');
      const [fileUploadMesg] = useState(false);
      const [fileUploaderrMesg] = useState(false);
      const [loader, setLoader] = React.useState(false);
      const [validEmailError, setValidEmailError] = useState('');
      const [enterEmailVaidation, setEnterEmailVaidation] = useState('');
      const [maxEmailsValidation, setMaxEmailsValidation] = useState('');
      const [emailTags, setEmailTags] = React.useState([]);
      const [maxEndDate, setMaxEndDate] = useState();
      const [duplicateEmailError, setDuplicateEmailError] = useState('');
      const [selectedSystemType, setSelectedSystemType] = useState('');
      const ref = React.useRef();
      const systemIdChange = (event) => {
            setSelectedSystemType(event.target.value)
            setSystemId(event.target.value)
            if (event.target.value === 'AME') {
                  setAmeShow(true);
                  setPpuShow(false);
                  setSystemIdUploadValidation('')
            } else if (event.target.value === 'PPU') {
                  setAmeShow(false);
                  setPpuShow(true);
                  setSystemIdUploadValidation('')
            } else {
                  setAmeShow(false);
                  setPpuShow(false);
                  setSystemIdUploadValidation('Please select system type.');
            }
      }
      const contentTypeChange = (event) => {
            setContentType(event.target.value)
      }
      const templateChange = (event) => {
            console.log("Template  --> ", event.target.value)
            setPpuTemplateType(event.target.value)
            if (event.target.value) {
                  setPpuTemplateType(event.target.value)
                  setUploadTemplateTypeValidation('')
            }
            else {
                  setUploadTemplateTypeValidation('Please select template')
            }
      }
      const onChangeHandler = (event) => {
            setFileName(event.target.files[0]);
            setFileUploadValidMsg('')
      }
      const removeEmailLengthValidation = event => {
            if (!emailId) {
                  setMaxEmailsValidation('')
            }
      }

      const removeEmailTags = index => {
            setEmailTags([...emailTags.filter(tag => emailTags.indexOf(tag) !== index)]);
      };

      const addEmailTags = event => {
            if (emailTags.length <= 4) {
              setMaxEmailsValidation('');
              if (event.key === "Enter" && event.target.value !== "") {
                setEnterEmailVaidation('')
                if (emailTags.some(emails => emails.emailId == event.target.value.trim())) {
                  setDuplicateEmailError('Duplicate email Id is not allowed')
                }
                else {
                  setDuplicateEmailError('')
                  const pattern = /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,}(\s*,?\s*)*)+$/g;
                  const result = pattern.test(event.target.value);
                  if (result) {
                    setValidEmailError('')
                    let customObj = {
                      "emailId": event.target.value.trim(),
                      "background": "",
                      "color": "#6b6b6b"
                    }
                    setEmailTags([...emailTags, customObj]);
                    event.target.value = "";
                    setEmailId('');
                    return true;
                  }
                  else {
                    setValidEmailError('Please enter valid email')
                    setEnterEmailVaidation('');
                    return false;
                  }
                }
              }
            } else {
              setMaxEmailsValidation('Maximum 5 emails are allowed to enter');
            }
          };

      return (
            <div>
                  {loader ? <Loader /> : null}
                  <div className="d-flex align-items-center mt-3 mb-3"  >
                        <button className="ml-auto btn btn-primary btn-sm back-button" type="button"
                              onClick={() => props.history.push('/dashboard/usageupload')} ><ArrowBackIcon /> Back To Dashboard</button>
                  </div>
                  <Card className={classes.root}>
                        <div className="row ml-1"><p className="uploadDownloadTitle">Upload</p></div>
                        <CardContent className="pl-0">
                              {fileUploaderrMesg ? <Alert varient='danger'>
                                    <Alert.Heading>Error in File Uploading!!</Alert.Heading>
                              </Alert> : ''}
                              {fileUploadMesg ?
                                    <Alert variant="success">
                                          <Alert.Heading>File Uploaded Successfully !!</Alert.Heading>
                                    </Alert> : ''}
                              <div className="row ml-1">
                                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mt-2">
                                          <FormControl required className={classes.formControl} error={systemIdUploadValidMsg}>
                                                <InputLabel id="demo-simple-select-required-label">System Typeee</InputLabel>
                                                <Select
                                                      labelId="demo-simple-select-required-label"
                                                      id="demo-simple-select-required"
                                                      className={classes.selectEmpty}
                                                      value={selectedSystemType}
                                                      onChange={systemIdChange}>
                                                      <MenuItem value="none"><em>None</em></MenuItem>
                                                      <MenuItem value={"PPU"}><em>PPU</em></MenuItem>
                                                </Select>
                                                {systemIdUploadValidMsg ? <FormHelperText>⚠️ {systemIdUploadValidMsg}</FormHelperText> : ''}
                                          </FormControl>

                                    </div>
                                    {ameShow ?
                                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mt-2">
                                                <select name="city" style={searchBoxStyle} className="form-control w-100" onChange={(event) => { contentTypeChange(event) }}>
                                                      {contentTypeData.map((e, key) => {
                                                            return <option key={key} value={e.id}>{e.name}</option>
                                                      })}
                                                </select>
                                          </div> : null}
                                    {ppuShow ?
                                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mt-2" style={{ display: ppuShow ? 'block' : 'none' }}>
                                                <FormControl required className={classes.formControl}>
                                                      <InputLabel id="demo-simple-select-required-label">Template</InputLabel>
                                                      <Select
                                                            labelId="demo-simple-select-required-label"
                                                            id="demo-simple-select-required"
                                                            className={classes.selectEmpty}
                                                            value={ppuTemplateType}
                                                            onChange={templateChange}>

                                                            <menuItem value=""><em>None</em></menuItem>
                                                            <menuItem value={"perDayUsage"}>Per Day</menuItem>
                                                            <menuItem value={"perBillcycleUsage"}>Per Bill Cycle</menuItem>

                                                      </Select>
                                                      {uploadTemplateTypeValidation ? <FormHelperText>⚠️ {uploadTemplateTypeValidation}</FormHelperText> : ''}
                                                </FormControl>
                                                {ppuShow ? <div className="">
                                                      <div className="row mt-0 ml-1 mb-4">
                                                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 mt-2">
                                                                  <FormControl required className={classes.formControl} >
                                                                        <h5 style={{ display: "inline", fontSize: "14px" }} className="mt-2 form-label">Email ID <i className="fa fa-info-circle contactIconStyle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Notification will be sent to you using this email once upload is successful."></i></h5>
                                                                        <div className="input-tag">
                                                                              <ul className="input-tag__tags">
                                                                                    {emailTags.map((tag, index) => (

                                                                                          <li key={index} style={{ border: "1px solid gray", cursor: "pointer", color: tag.color, background: tag.background }}>
                                                                                                <span>{tag.emailId}</span>
                                                                                                <i className="material-icons" style={{ cursor: "pointer" }} onClick={() => removeEmailTags(index)} >close</i>
                                                                                          </li>

                                                                                    ))}
                                                                                    <li className="input-tag__tags__input">
                                                                                          <input
                                                                                                type="text"
                                                                                                value={emailId}
                                                                                                onChange={event => setEmailId(event.target.value)}
                                                                                                onKeyUp={event => addEmailTags(event)}
                                                                                                onBlur={event => removeEmailLengthValidation(event)}
                                                                                                placeholder="Press enter to add email"
                                                                                                style={inputBoxStyle}
                                                                                                autoComplete="off"
                                                                                          />
                                                                                    </li>
                                                                              </ul>
                                                                        </div>
                                                                        {validEmailError ? <FormHelperText style={{ color: "red" }}>⚠️ {validEmailError}</FormHelperText> : ''}
                                                                        {duplicateEmailError ? <FormHelperText style={{ color: "red" }}>⚠️ {duplicateEmailError}</FormHelperText> : ''}
                                                                        {enterEmailVaidation ? <FormHelperText style={{ color: "red" }}>⚠️ {enterEmailVaidation}</FormHelperText> : ''}
                                                                        {maxEmailsValidation ? <FormHelperText style={{ color: "red" }}>⚠️ {maxEmailsValidation}</FormHelperText> : ''}

                                                                  </FormControl>
                                                            </div>
                                                      </div>

                                                </div> : null}

                                          </div>
                                          : null}
                                    <div className="ml-1">
                                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mt-2 ml-2">
                                                <div className="form-group mt-3">
                                                      <span >File Name : </span>
                                                      <input type='file' style={{ paddingLeft: "10px" }} id="exampleFormControlFile1"
                                                            ref={ref} onChange={onChangeHandler}
                                                      />
                                                </div>
                                          </div>
                                    </div>
                                    {fileUploadValidMsg ? <p className="alert alert-danger" style={{ marginLeft: "15px" }}><ErrorIcon />{fileUploadValidMsg}</p> : ''}
                                    {ameShow ?
                                          <div className="row ml-1">
                                                <div>For usage import results, please setup the appropriate Email Notifications.
          </div>
                                          </div>
                                          : ''}



                              </div>
                        </CardContent>
                        <CardActions style={{ width: '100%', justifyContent: 'flex-end' }}>
                              <div className="row justify-content-end ">
                                    <div className="mt-2 pr-3">
                                          <Button variant='secondary' style={{ padding: " 5px 30px 5px 30px" }}>Submit</Button>
                                          <Button variant='primary'>Close</Button>
                                    </div>
                              </div>

                        </CardActions>
                  </Card>

            </div>
      )
}