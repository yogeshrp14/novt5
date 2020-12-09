/* eslint-disable */
import React, { useState, useEffect } from 'react';
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


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const contentTypeData = [
  { id: "upload/usage", name: "Usages" },
  { id: "ame/upload/subscription", name: "Subscription" },
  { id: "ame/upload/usagerunrequest", name: "Usage Run Request" },
  { id: "upload/usage/historic", name: "Historic Usages" }
];

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



export default function UsageUploads(props) {
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

  //Closing Upload popup
  const handleClose = () => {
    setShow(false);
    setValidEmailError('');
    setUploadTemplateTypeValidation('');
    setFileUploadValidMsg('')
    setSystemIdUploadValidation('');
    setAmeShow(false);
    setPpuShow(false);
    setSystemId('');
    setSelectedSystemType('');
    setContentType('upload/usage');
    setPpuTemplateType('');
    setEmailId('');
    setFileName('');
    setEmailTags([]);
    setDuplicateEmailError('');
    setEnterEmailVaidation('');
    setMaxEmailsValidation('');
    ref.current.value = ""
  }

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

  //Calling usageUploadsAPI
  useEffect(() => {
    const date = new Date();
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + 90)
    setMaxEndDate(copy);
  }, [])


  const systemIdChange = (event) => {
    setSelectedSystemType(event.target.value)
    setSystemId(event.target.value);
    if (event.target.value === 'AME') {
      setAmeShow(true);
      setPpuShow(false);
      setSystemIdUploadValidation('')
    }
    else if (event.target.value === 'PPU') {
      setAmeShow(false);
      setPpuShow(true);
      setSystemIdUploadValidation('')
    }
    else {
      setAmeShow(false);
      setPpuShow(false);
      setSystemIdUploadValidation('Please select system type.');
    }
  }

  const contentTypeChange = (event) => {
    setContentType(event.target.value);
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

  const uploadSubmit = () => {
    if (filename && systemId === '') {
      setFileUploadValidMsg('');
      setSystemIdUploadValidation('Please select template type.')
    }
    else if (systemId && filename === '') {
      setSystemIdUploadValidation('');
      setFileUploadValidMsg('Please select a file to upload')
    }
    else if (filename && systemId) {
      if (systemId === 'AME') {
        services.uploads(contentType, filename).then(res => {
          setShow(false);
          setSystemId('')
          setFileName('');
          ref.current.value = ""
          setContentType('upload/usage');
          setAmeShow(false);
          if (res.status !== 200) {
            addToast('Error in File Uploading!!', {
              appearance: 'error',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
          }
          else {
            addToast('File Uploaded Successfully!!', {
              appearance: 'success',
              position: 'top-right',
              autoDismiss: true,
              autoDismissTimeout: 10000
            })
            setLoader(true);
            services.getUploadUsages(page, rowsPerPage, orderBy, order).then(res => {
              res.content === null ? setShowMsg(false) :
                setShowMsg(true)
              setAmeShow(false);
              setLoader(false)
              setRows(res.content)
              setCount(res.totalElements)
            },
              (error) => {
                setLoader(false)
              })
          }
        });
      }
      else if (systemId === 'PPU') {
        if (emailTags.length === 0) {
          setValidEmailError('Please enter email');
          setEnterEmailVaidation('');
        }
        if ((emailTags.length > 0 && emailTags.length <= 4 && emailId) || (emailTags.length === 0 && emailId)) {
          setValidEmailError('')
          setEnterEmailVaidation('Please press "Enter" to add email');
        }
        if (ppuTemplateType) setUploadTemplateTypeValidation('');
        else setUploadTemplateTypeValidation('Please Select');
        if (filename) setFileUploadValidMsg('');
        else setFileUploadValidMsg('Please Attach File');
        if (emailTags.length > 0 && emailId === '' && ppuTemplateType && filename && handleId) {
          setLoader(true)
          let emailsList = [];
          emailTags.map((email, index) => {
            emailsList.push(email.emailId);
          })
          let emailsData = emailsList.join(";");
          console.log('EMails seperated list', emailsData)
          services.ppuUpload(ppuTemplateType, filename, emailsData, handleId).then(res => {
            setShow(false);
            setPpuShow(false);
            setLoader(false);
            setSystemId('')
            setFileName('');
            ref.current.value = ""
            setEmailId('');
            setPpuTemplateType('');
            setEmailTags([]);
            setEnterEmailVaidation('');
            setMaxEmailsValidation('');
            setSelectedSystemType('')
            if (res.status === "PROCESSING") {
              addToast('File Number:' + res.fileNumber + ',' + res.message, {
                appearance: 'success',
                position: 'top-right',
                autoDismiss: true,
                autoDismissTimeout: 10000
              })
            }
            else if (res.status === "FAILURE") {
              addToast('File Number:' + res.fileNumber + ',' + res.message, {
                appearance: 'error',
                position: 'top-right',
                autoDismiss: true,
                autoDismissTimeout: 10000
              })
            }
            else if (res.status === "FAIL") {
              addToast('Upload get failed.', {
                appearance: 'error',
                position: 'top-right',
                autoDismiss: true,
                autoDismissTimeout: 10000
              })
            }
            else if (res.status === 504) {
              addToast('File upload is in progress, please wait till it gets completed.', {
                appearance: 'info',
                position: 'top-right',
                autoDismiss: true,
                autoDismissTimeout: 10000
              })
            }
            else {
              addToast('Internal server error occured due to which upload get failed, please try again.', {
                appearance: 'error',
                position: 'top-right',
                autoDismiss: true,
                autoDismissTimeout: 10000
              })
            }
            setLoader(false);
            setShow(false);
            setLoader(true);
            services.getUploadUsages(page, rowsPerPage, orderBy, order).then(res => {

              res.content === null ? setShowMsg(false) :
                setShowMsg(true)
              setLoader(false)
              setRows(res.content)
              setCount(res.totalElements)
            },
              (error) => {
                setLoader(false)
                addToast('Server Error', {
                  appearance: 'error',
                  position: 'top-right',
                  autoDismiss: true,
                  autoDismissTimeout: 10000
                })
              })
          },
            (error) => {
              setLoader(false)
              addToast('Server Error', {
                appearance: 'error',
                position: 'top-right',
                autoDismiss: true,
                autoDismissTimeout: 10000
              })

            });
        }
      }
    }
    else if (filename === '' && systemId === '') {
      setSystemIdUploadValidation('Please select template type.')
      setFileUploadValidMsg('Please select a file to upload')
    }

  }

  const onChangeHandler = (event) => {
    setFileName(event.target.files[0]);
    setFileUploadValidMsg('')
  }

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

  const removeEmailLengthValidation = event => {
    if (!emailId) {
      setMaxEmailsValidation('')
    }
  }

  const removeEmailTags = index => {
    setEmailTags([...emailTags.filter(tag => emailTags.indexOf(tag) !== index)]);
  };

  return (
    <div>
      {loader ? <Loader /> : null}
      {/* Modal box for delete */}
      <div className="d-flex align-items-center mt-3 mb-3">
        <button onClick={() => props.history.push('/dashboard/usageupload')} className="ml-auto btn btn-primary btn-sm back-button" type="button" ><span><ArrowBackIcon />  Back To Dashboard</span></button>
      </div>
      <Card className={classes.root}>
        {/* <CardHeader
          title="Upload"
        // subheader="September 14, 2016"
        /> */}
        <div className="row ml-1"><p className="uploadDownloadTitle">Upload</p></div>
        <CardContent className="pl-0">
          {fileUploaderrMesg ?
            <Alert variant="danger">
              <Alert.Heading>Error in File Uploading !!</Alert.Heading>
            </Alert> : ''}
          {fileUploadMesg ?
            <Alert variant="success">
              <Alert.Heading>File Uploaded Successfully !!</Alert.Heading>
            </Alert> : ''}

          {/* {systemIdUploadValidMsg ?
            <Alert variant="danger">
              <Alert.Heading><ErrorIcon />{systemIdUploadValidMsg}</Alert.Heading>
            </Alert> : ''} */}


          <div className="row ml-1">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mt-2">
              <FormControl required className={classes.formControl} error={systemIdUploadValidMsg} >
                <InputLabel id="demo-simple-select-required-label">System Typeee</InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  value={selectedSystemType}
                  onChange={systemIdChange}
                  className={classes.selectEmpty}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"PPU"}>PPU</MenuItem>
                </Select>
                {systemIdUploadValidMsg ? <FormHelperText>⚠️ {systemIdUploadValidMsg}</FormHelperText> : ''}
              </FormControl>
              {/* {templateTypeValidation ? <p className="alert alert-danger"><ErrorIcon /> {templateTypeValidation}</p> : ''} */}
            </div>


            {/* <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mt-2">
              <h5 className="form-label">System Type<span className="required"></span></h5>
              <select name="systemId" style={searchBoxStyle} className="form-control w-100" value={selectedSystemType} onChange={(e) => systemIdChange(e)}>
                <option value="">Select</option>
                <option value="AME">AME</option>
                <option value="PPU">PPU</option>
              </select>
            </div> */}

            {/* <div className="mt-3">
              <h5 className="form-label">System Type</h5>
            </div>
            <div className="col-2 mt-3">
              <select name="systemId" style={searchBoxStyle} className="form-control w-100" onChange={(e) => systemIdChange(e)}>
                <option value="">Select</option>
                <option value="PPU">PPU</option>
              </select>
            </div> */}
            {/* <div className="col-6 mt-3" style={{ display: ameShow ? "block" : "none" }}> */}
            {ameShow ?
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mt-2" >
                {/* <h5 className="form-label">Template<span className="required"></span></h5> */}
                <select name="city" style={searchBoxStyle} className="form-control w-100" onChange={(e) => contentTypeChange(e)}>
                  {contentTypeData.map((e, key) => {
                    return <option key={key} value={e.id}>{e.name}</option>;
                  })}
                </select>
              </div>
              : null}

            {ppuShow ?
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mt-2" style={{ display: ppuShow ? "block" : "none" }}>
                <FormControl required className={classes.formControl} error={uploadTemplateTypeValidation} >
                  <InputLabel id="demo-simple-select-required-label">Template</InputLabel>
                  <Select
                    labelId="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={ppuTemplateType}
                    onChange={templateChange}
                    className={classes.selectEmpty}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"perDayUsage"}>Per Day</MenuItem>
                    <MenuItem value={"perBillcycleUsage"}>Per Bill Cycle</MenuItem>
                  </Select>
                  {uploadTemplateTypeValidation ? <FormHelperText>⚠️ {uploadTemplateTypeValidation}</FormHelperText> : ''}
                </FormControl>

                {/* <h5 className="form-label">Template<span className="required"></span></h5>
                <select name="city" style={searchBoxStyle} className="form-control w-100" onChange={(e) => templateChange(e)}>
                  <option value="">Select</option>
                  <option value="perDayUsage">Per Day</option>
                  <option value="perBillcycleUsage">Per Bill Cycle</option>
                </select>
                {uploadTemplateTypeValidation ? <p className="alert alert-danger"><ErrorIcon />{uploadTemplateTypeValidation}</p> : ''} */}
              </div>
              : null}
          </div>
          {/* {systemIdUploadValidMsg ? <div className="row alert alert-danger" style={{ marginLeft: "100px", width: "fit-content" }}><ErrorIcon />{systemIdUploadValidMsg}</div> : ''} */}
          {ppuShow ?
            <div className="">
              <div className="row mt-0 ml-1 mb-4">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 mt-2">
                  <FormControl required className={classes.formControl} >

                    {/* <h5 className="form-label">Email ID<span className="required"></span></h5> */}
                    <h5 style={{ display: "inline", fontSize: "14px" }} className="mt-2 form-label">Email ID <i className="fa fa-info-circle contactIconStyle" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Notification will be sent to you using this email once upload is successful."></i></h5>

                    {/* <div className="col-4">
                  <input type="email" name="email" style={searchBoxStyle}
                    className="form-control" placeholder="Email"
                    onChange={(e) => { setEmailId(event.target.value) }}
                    onBlur={(e) => { handleChangeEmail(e) }}
                    autoComplete="off" />
                  {validEmailError ? <p style={{ color: "red" }}>{validEmailError}</p> : ''}
                </div> */}
                    <div className="input-tag">
                      <ul className="input-tag__tags">
                        {emailTags.map((tag, index) => (
                          // <Tooltip classes={{ tooltip: classes.customTooltip }} title={tag.reason}>
                          <li key={index} style={{ border: "1px solid gray", cursor: "pointer", color: tag.color, background: tag.background }}>
                            <span>{tag.emailId}</span>
                            <i className="material-icons" style={{ cursor: "pointer" }} onClick={() => removeEmailTags(index)} >close</i>
                          </li>
                          // </Tooltip>
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
              {/* {validEmailError ? <p className="alert alert-danger" style={{ margin: "15px" }}><ErrorIcon />{validEmailError}</p> : ''}
              {duplicateEmailError ? <p className="alert alert-danger" style={{ margin: "15px" }}><ErrorIcon />{duplicateEmailError}</p> : ''}
              {enterEmailVaidation ? <p className="alert alert-danger" style={{ margin: "15px" }}><ErrorIcon />{enterEmailVaidation}</p> : ''}
              {maxEmailsValidation ? <p className="alert alert-danger" style={{ margin: "15px" }}><ErrorIcon />{maxEmailsValidation}</p> : ''} */}
              {/* <div className="alert alert-info">
                <InfoIcon />  Notification will be sent to you using this email once upload is successful.
            </div> */}
            </div>

            : null}

          <div className="ml-1">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mt-2 ml-2">
              <div className="form-group mt-3">
                <span >File Name : </span>
                <input type="file" style={{ paddingLeft: '10px' }} id="exampleFormControlFile1"
                  ref={ref} onChange={onChangeHandler} />
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
        </CardContent>
        <CardActions style={{ width: '100%', justifyContent: 'flex-end' }}>
          <div className="row justify-content-end ">
            <div className="mt-2 pr-3">
              <Button variant="secondary" onClick={handleClose} style={{ padding: "5px 30px 5px 30px" }}> Close </Button>
              <Button variant="primary" onClick={uploadSubmit}> Submit</Button>
            </div>
          </div>
        </CardActions>
      </Card>
    </div>
  );
}
