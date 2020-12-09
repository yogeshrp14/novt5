/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter } from 'react-simple-card';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import services from '../../components/Services/service';
import Loader from '../../components/shared/spinner/spinner';
import '../profile/profile.scss'
import { DecryptLocalStorage, EncryptLocalStorage, ValidateLocalStoragealue } from '../../components/shared/local-storage/local-storage';

function Profile(props) {
  let [searchText, setSearchText] = useState('')
  let [searchResult, setSearchResult] = useState([]);
  // let [profile, setProfile] = useState('');
  // const [showMore, setShowMore] = useState(true);
  const [loader, setLoader] = React.useState(false);
  const [noRecords, setNoRecords] = React.useState(false);
  const handleId = DecryptLocalStorage('handleId');

  useEffect(() => {
    /*if (ValidateLocalStoragealue('bpLinkId')) {
      props.history.push('/dashboard/viewquotes')
    }
    else {*/
    fetchSearchResult();
   
    //}
  }, [])

  const errorHandlerFunction = (error) => {
    console.log("error ==> ", error)
    setLoader(false);
  }

  const history = useHistory();

  let fetchSearchResult = () => {
    setLoader(true);
    services.getProfileSearchList(handleId).then(res => {
      setSearchResult(res)
      setLoader(false);
      console.log("res  ==> ", res)
      if (res.length > 0) {
        setNoRecords(false);
      }
      else setNoRecords(true);

    },
      (error) => {
        setNoRecords(true);
        errorHandlerFunction(error);
      })
  }

  let getSearchResultHtml =  (results) => {
    return results.filter(show =>
      `${show.linkId} ${show.soldToId} ${show.companyName}`
        .toUpperCase()
        .includes(searchText.toUpperCase())
    ).map((result, index) => <div key={index} className="results" onClick={() => handleOkClick(result.linkId)}>
      <label>
        {result.linkId}({result.soldToId}) - {result.companyName}</label></div>)
  }

  const handleOkClick = (profile) => {
    EncryptLocalStorage('linkId', profile);
    EncryptLocalStorage('bpLinkId', profile);
    history.push(`/dashboard/viewquotes`, { profile })
    console.log("Link Id Updated with :", profile)
  }

  let handleBackButton = () => {
    history.push(`/dashboard/viewquotes`)
  }

  return (
    <div>
      {/* Loader Block */}
      {loader ? <Loader /> : null}

      {/* Profile Search Block */}
      <div className="profile-heaing">
        <h2>Profile Search</h2>
      </div>
      <Card className="profile-wrapper">
        <div>
          <div className="table-section-search-profile">
            <div className="table-search">
              <input className="form-control" type="text" disabled={!searchResult.length > 0} placeholder="Enter to Search Profile" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
            </div>
          </div>

          {/* Profile Search Result */}
          {getSearchResultHtml(searchResult).length !== 0 ? (
            <div>
              <Card>
                <CardBody className="searchResults">
                  {getSearchResultHtml(searchResult)}
                </CardBody>
              </Card>
            </div>
          ) : ''}

          {(noRecords || getSearchResultHtml(searchResult).length == 0) ? (
            <div>
              <Card>
                <CardBody className="searchResults" style={{ textAlign: "center" }}>
                  <span>No Profile Found</span>
                </CardBody>
              </Card>
            </div>
          ) : ''}
        </div>
      </Card>
      <div className="profile-back-button">
        <span onClick={handleBackButton}><ArrowBackIcon />  Back To Dashboard</span>
      </div>
    </div>
  )
}
export default Profile