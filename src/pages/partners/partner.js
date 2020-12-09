/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Card, CardBody } from 'react-simple-card';
import { useHistory } from 'react-router-dom';
import services from '../../components/Services/service';
import Loader from '../../components/shared/spinner/spinner';
import '../partners/partner.scss';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { EncryptLocalStorage, ValidateLocalStoragealue } from '../../components/shared/local-storage/local-storage';
import { DecryptRBAC } from '../../components/shared/rbac-system/rbac-control';
import WarinigDialog from '../../components/shared/rbac-system/warning-dialog';
import { withStyles } from '@material-ui/core/styles';


const GreenRadio = withStyles({
  root: {
    color: "#DA291C",
    '&$checked': {
      color: "#DA291C",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);


function Partner(props) {
  let [searchText, setSearchText] = useState('')
  let [searchResult, setSearchResult] = useState([]);
  let [partner, setPartner] = useState('');
  const [showMore, setShowMore] = useState(true);
  const [loader, setLoader] = React.useState(false);
  const [noRecords, setNoRecords] = React.useState(false);
  const [warningMessage, setWarningMessage] = React.useState("");
  let rolebaseControl = DecryptRBAC("RBAC")
  const [showsAccessControlWaring, setShowsAccessControlWaring] = useState(false);
  const AccessControlWaringOpenModal = () => setShowsAccessControlWaring(true);
  const AccessControlWaringCloseModal = () => setShowsAccessControlWaring(false);
  const [isOtherSearch, setIsOtherSearch] = React.useState(true);





  useEffect(() => {
    if (ValidateLocalStoragealue('bpLinkId')) {
      props.history.push('/dashboard/viewquotes')
    }
    // else if(rolebaseControl.PartnerSearch){
    //   console.log(rolebaseControl.PartnerSearch)
    // }
  }, [])

  const errorHandlerFunction = (error) => {
    console.log("error ==> ", error)
    setLoader(false);
  }

  const history = useHistory();

  let fetchSearchResult = () => {
    // if (rolebaseControl && rolebaseControl.PartnerSearch) {
      setLoader(true);
      services.getPartnerSearchList(searchText).then(res => {
        setSearchResult(res)
        setLoader(false);
        if (res.length > 0) {
          setNoRecords(false);
        }
        else setNoRecords(true);
        setShowMore(true);
      },
        (error) => {
          errorHandlerFunction(error);
        })
    // }
    // else {
    //   setWarningMessage("You are not eligible for Partner Search functionality");
    //   AccessControlWaringOpenModal()

    // }
  }

  let fetchSearchMoreResult = () => {
    setLoader(true);
    services.getAllPartnersList(searchText).then(res => {
      setSearchResult([...searchResult, ...res]);
      setShowMore(false);
      setLoader(false);
    },
      (error) => {
        errorHandlerFunction(error);
      });
  }

  let handleOnChangeRadio = (event) => {
    setPartner(event.target.value);
  }

  let getSearchResultHtml = (results) => {
    return results.map((result, index) => <div key={index} className="results">
      <label>
        <input name="partner" onChange={handleOnChangeRadio} value={result.linkId} type="radio" />
        {result.linkId}({result.soldToId})- {result.companyName}</label></div>)
  }

  let handleOkClick = () => {
    EncryptLocalStorage('linkId', partner ? partner : -1);
    history.push(`/dashboard/viewquotes`, { partner })
  }

  let handleCancelClick = () => {
    setSearchResult([]);
    setSearchText('');
    setShowMore(true);
  }

  let handleOnSearchTypeRadio = (event) => {
    if(event.target.value == "direct_search") {
      setIsOtherSearch(false)
    }
    else {
      setIsOtherSearch(true)
    }
  }

  let goToDirectPartnerResult = () => {
      EncryptLocalStorage('linkId', partner ? partner : -1);
      history.push(`/dashboard/viewquotes`, { partner })
  }

  return (
    <div>
      {/* warinig Block */}
      <WarinigDialog closeModal={AccessControlWaringCloseModal} show={showsAccessControlWaring} message={warningMessage} />
      {/* Loader Block */}
      {loader ? <Loader /> : null}

      {/* Partner Search Block */}
      <div className="partner-heaing">
        <h2>Partner SSearch</h2>
      </div>

      <Card className="partner-wrapper" style={{maxWidth: "410px", padding: "15px 15px 15px 20px", border: "1px solid #ccc"}}>
        <FormControl component="fieldset">
          <RadioGroup row aria-label="position" name="position" defaultValue="partner_search">
            <FormControlLabel
              value="partner_search"
              control={<Radio  />}
              label="Partner Search"
              labelPlacement="End"
              onChange={handleOnSearchTypeRadio}
            />
            <FormControlLabel
              value="direct_search"
              control={<Radio />}
              label="Direct"
              labelPlacement="End"
              onChange={handleOnSearchTypeRadio}
            />
          </RadioGroup>
        </FormControl>
        {!isOtherSearch ?
        <div style={{padding: "0 0 10px 20px", display: "inline"}}>
          <button className="btn btn-primary" id="search" disabled={isOtherSearch == true} onClick={goToDirectPartnerResult}>Ok</button>
        </div> : null }
      </Card>

      
      {isOtherSearch ?
      <Card className="partner-wrapper">
        <div>
          <div className="table-section-search">
            <div className="table-search">
              <input className="form-control" type="text" placeholder="Search Partner" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
              <button className="btn btn-primary" id="search" onClick={fetchSearchResult}>Search</button>
            </div>
          </div>

          {/* Partner Search Result */}
          {searchResult.length > 0 ? (
            <div>
              <Card>
                <CardBody className="searchResults">
                  {getSearchResultHtml(searchResult)}
                  {showMore ? <div className="moreButton">
                    <button className="btn btn-primary" onClick={fetchSearchMoreResult}>More</button>
                  </div> : ''}
                </CardBody>
              </Card>
            </div>
          ) : ''}

          {noRecords ? (
            <div>
              <Card>
                <CardBody className="searchResults" style={{textAlign: "center"}}>
                    <span>No Partner Found</span>
                </CardBody>
              </Card>
            </div>
          ) : ''}

          {searchResult.length ? (
            <div>
              <div className="partner-actio-btn">
                <button className="btn btn-secondary" onClick={handleCancelClick}>Cancel</button>
                <button className="btn btn-primary" style={{ 'width': '100px', 'padding': '9px' }} onClick={handleOkClick}>Ok</button>
              </div>
            </div>
          ) : ''}
        </div>
      </Card> : null }
    </div>
  )
}
export default Partner
