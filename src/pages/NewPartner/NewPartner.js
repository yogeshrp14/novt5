import React, { useState, useEffect } from "react";
import services from "../../components/Services/service";
import Loader from "../../components/shared/spinner/spinner";
import FormControl from "@material-ui/core/FormControl";
import {
  EncryptLocalStorage,
  ValidateLocalStoragealue,
} from "../../components/shared/local-storage/local-storage";
import { DecryptRBAC } from "../../components/shared/rbac-system/rbac-control";
import WarinigDialog from "../../components/shared/rbac-system/warning-dialog";
import { useHistory } from "react-router";
import "../NewPartner/NewPartner.scss";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
// import Card from "react-bootstrap/Card";
import { Card, CardBody } from "react-simple-card";
import logo from "./logo.png";
import FormLabel from "react-bootstrap/FormLabel";

import FormControlLabel from "@material-ui/core/FormControlLabel";

function NewPartner(props) {
  const [loader, setLoader] = useState(false);

  let [searchText, setsearchText] = useState("");
  let [searchResult, setSearchResult] = useState([]);
  let [partner, setPartner] = useState("");
  let [noRecords, setNoRecords] = useState(false);
  const [showMore, setShowMore] = useState(true);
  let rolebaseControl = DecryptRBAC("RBAC");
  const [showsAccessControlWaring, setShowsAccessControlWaring] = useState(
    false
  );
  const AccessControlWaringOpenModal = () => setShowsAccessControlWaring(true);
  const AccessControlWaringCloseModal = () =>
    setShowsAccessControlWaring(false);
  const [isOtherSearch, setIsOtherSearch] = useState(true);
  //   const [warningMessage, setWarningMessage] = React.useState("");
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    if (ValidateLocalStoragealue("bpLinkId")) {
      props.history.push("/dashboard/viewquotes");
    }
  }, []);

  const errorHandlerFunction = (error) => {
    console.log("Error==>" + error);
    setLoader(false);
  };
  const history = useHistory();

  let fetchSearchResult = () => {
    setLoader(true);
    services.getPartnerSearchList(searchText).then(
      (res) => {
        setSearchResult(res);
        setLoader(false);
        if (res.length > 0) {
          setNoRecords(false);
        } else {
          setNoRecords(true);
          setShowMore(true);
        }
      },
      (error) => {
        errorHandlerFunction(error);
      }
    );
  };

  let fetchSearchMoreResult = () => {
    setLoader(true);
    services.getAllPartnersList(searchText).then(
      (res) => {
        setSearchResult([...searchResult, ...res]);
        setShowMore(false);
        setLoader(false);
      },
      (error) => {
        errorHandlerFunction(error);
      }
    );
  };

  let handleOnChangeRadio = (event) => {
    setPartner(event.target.value);
  };

  let getSearchResultHtml = (results) => {
    return results.map((result, index) => (
      <div key={index} className="results">
        <label>
          <input
            type="radio"
            name="partner"
            onChange={handleOnChangeRadio}
            value={result.linkId}
          />
          {result.linkId}
          {result.soldToId}
          {result.companyName}
        </label>
      </div>
    ));
  };

  let handleOkClick = () => {
    EncryptLocalStorage("linkId", partner ? partner : -1);
    history.push(`/dashboard/viewquotes ${partner}`);
  };

  let handleCancelClick = () => {
    setSearchResult([]);
    setsearchText("");
    setShowMore(true);
  };

  let handleOnSearchTypeRadio = (event) => {
    if (event.target.value == "direct_search") {
      setIsOtherSearch(false);
    } else {
      setIsOtherSearch(true);
    }
  };

  let goToDirectPartnerResult = () => {
    EncryptLocalStorage("linkId", partner ? partner : -1);
    history.push(`/dashboard/viewquotes ${partner}`);
  };

  return (
    <>
      <div className="thisissuccess">
        <button className="btn btn-success">This is success </button>
      </div>

      <button className="btn btn-primary">This is primary </button>

      <div>
        {/* warinig Block */}
        <WarinigDialog
          closeModal={AccessControlWaringCloseModal}
          show={showsAccessControlWaring}
          message={warningMessage}
        />
        {/* Loader Block */}
        {loader ? <Loader /> : null}

        {/* Partner SearchBox */}
        {
          <div>
            {/* <p className="thisispartnersearch">Partner Search</p> */}
            <img src={logo} className="thisisimage" />;
          </div>
        }

        {/* This is for two radio buttons */}
        {/* Why not in centwr while using div
        Tried form also */}
        <Card style={{ alignItems: "center" }}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="position"
              name="position"
              defaultValue="partner_search"
            >
              <FormControlLabel
                value="partner_search"
                control={<Radio />}
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
          {!isOtherSearch ? (
            <div>
              <button
                className="btn btn-primary"
                id="search"
                disabled={isOtherSearch == true}
                onClick={goToDirectPartnerResult}
              >
                Ok
              </button>
            </div>
          ) : null}
        </Card>
        {/* <div>
            <div className="row" >
              <input className="col col-lg-8" form-control />
              <button  className="btn btn-primary">Search</button>
            </div>
          </div> */}
        {/* <div className="container">
               <div className="row">
                      <input className="col col-lg-8 form-control" />
                      <button className='btn btn-primary'>Search</button>
        
               </div>
               
        </div> */}
        {/* {isOtherSearch ? (
          <div>
            <div className="row" style={{}}>
              <input className="col col-lg-8" form-control />
              <button className="btn btn-primary">Search</button>
            </div>
          </div>
               {searchResult.length > 0 ? (
                     <div>
                                 <Card>
                                       <CardBody className="searchResults">
                                            {getSearchResultHtml}
                                       </CardBody>
                                 </Card>
                     </div>
               ):''}


        ) : null} */}
        {isOtherSearch ? (
          <Card className="partner-wrapper">
            <div>
              <div className="table-section-search">
                <div className="table-search">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="      Search Partner"
                    value={searchText}
                    onChange={(event) => setsearchText(event.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    id="search"
                    onClick={fetchSearchResult}
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Partner Search Result */}
              {searchResult.length > 0 ? (
                <div>
                  <Card>
                    <CardBody className="searchResults">
                      {getSearchResultHtml(searchResult)}
                      {showMore ? (
                        <div className="moreButton">
                          <button
                            className="btn btn-primary"
                            onClick={fetchSearchMoreResult}
                          >
                            More
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </CardBody>
                  </Card>
                </div>
              ) : (
                ""
              )}

              {noRecords ? (
                <div>
                  <Card>
                    <CardBody
                      className="searchResults"
                      style={{ textAlign: "center" }}
                    >
                      <span>No Partner Found</span>
                    </CardBody>
                  </Card>
                </div>
              ) : (
                ""
              )}

              {searchResult.length ? (
                <div>
                  <div className="partner-actio-btn">
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ width: "100px", padding: "9px" }}
                      onClick={handleOkClick}
                    >
                      Ok
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </Card>
        ) : null}
      </div>
    </>
  );
}
export default NewPartner;
