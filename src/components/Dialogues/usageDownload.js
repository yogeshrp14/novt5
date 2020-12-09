import React, { useRef, useState, useEffect } from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import services from '../../components/Services/service';
import { Button, Modal } from 'react-bootstrap';
import * as _ from "lodash";
import './dialogStyle.scss'
import * as moment from 'moment';
import Loader from '../../components/shared/spinner/spinner';
import { useToasts } from 'react-toast-notifications';
import { makeStyles } from '@material-ui/core/styles';

const searchBoxStyle = {
  width: '300px',
  borderRadius: '0px'
}

const useStyles = makeStyles(theme => ({
  tagSizeSmall: {
    size: 'small',
  },
}));

function Modals(props) {
  const classes = useStyles();
  const { show, closeModal } = props;
  const [contaractNo, setcontaractNo] = useState([]);
  const [selectedContaractNo, setselectedContaractNo] = useState([]);
  // console.log("contaractNo ==> ", contaractNo)
  const valueRef = useRef("");
  const [selectedtemplate, setSelectedTemplate] = useState('');
  const [loader, setLoader] = React.useState(false);
  let { addToast } = useToasts();


  useEffect(() => {
    console.log("useEffect ==> ", selectedContaractNo);

  });

  const change = (event) => {
    setSelectedTemplate(event.target.value);
    // if (event.target.value) {
    //   setTemplateTypeValidation('');
    // }
  }

  const sendValue = () => {
    let key = valueRef.current.value;
    (async () => {
      setcontaractNo([])
      await services.getSearchableContractList(key).then(res => {
        console.log("res ==> ", res)
        setcontaractNo(res)
      },
        (error) => {
          console.log(error)
        })
    })();
  };

  const onSelectTag = (e, value) => {
    setselectedContaractNo(value)
    setcontaractNo([])

    console.log("selectedContaractNo ==> ", selectedContaractNo);

  };

  const downloadUsages = () => {
    if (selectedContaractNo.length > 0 && selectedtemplate) {
      let templateType;
      let usageDateType;
      if (selectedtemplate === 'perDay') {
        templateType = 'dailyusage';
        usageDateType = 'usagetodate';
      } else if (selectedtemplate === 'perBillCycle') {
        templateType = 'billcycleusage';
        usageDateType = 'billingDate';
      }
      let contracts = selectedContaractNo
      // selectedContaractNo.map((contract, index) => {
      //   contracts.push(contract.contractNumber);
      // })
      let contractsData = contracts.join(",");
      let present_date = new Date();
      var formattedDate = moment(present_date).format('YYYY-MM-DD');
      (async () => {
        setLoader(true)
        console.log("templateType, contractsData, usageDateType, formattedDate ==> ", templateType, contractsData, usageDateType, formattedDate)
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
      // setTags([])
      setSelectedTemplate('');
      setLoader(false);
    }
  }

  return (
    <>
      {loader ? <Loader /> : null}
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton style={{ background: '#da291c', color: 'white' }}>
          <Modal.Title style={{ 'fontSize': '16px' }}>Download</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <label>System ID</label>
              <input style={searchBoxStyle} className="form-control" type="text" placeholder="System ID" value="PPU" readOnly />
            </div>
            <div className="col-6">
              <label>Templateee</label>
              <select name="templates" style={searchBoxStyle} className="form-control w-100" onChange={(e) => change(e)} required>
                <option value="">--Select--</option>
                <option value="perDay">Per Day Usage</option>
                <option value="perBillCycle">Per Bill Cycle Usage </option>
              </select>
            </div>
            <div className="col-12" style={{ paddingTop: "15px" }}>
              <label>Contract Number</label>
              <Autocomplete
                className={classes.tagSizeSmall}
                id="combo-box-demo"
                multiple
                options={contaractNo}
                getOptionLabel={(option) => option}
                style={{ width: "100%" }}
                onChange={onSelectTag}
                filterSelectedOptions={true}
                noOptionsText="No Contract Number found"
                renderInput={params => (
                  <TextField
                    {...params}
                    name="multiple"
                    variant="outlined"
                    fullWidth
                    placeholder="Press enter to add contract number"
                    inputRef={valueRef}
                    onChange={sendValue}
                  />
                )}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}> Cancel </Button>
          <Button variant="primary"
            onClick={downloadUsages} disabled={!(selectedContaractNo.length > 0 && selectedtemplate)}
          > Download</Button>
        </Modal.Footer>
      </Modal>
      {/* </div> */}
    </>
  );
}

export default Modals;