import React, { useEffect, useState } from 'react';
import '../accounts/account.scss';
import services from '../../components/Services/service';
import Loader from '../../components/shared/spinner/spinner';

function Account() {
  const [loader, setLoader] = React.useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  const errorHandlerFunction = (error) => {
    console.log("error ==> ", error)
    setLoader(false);
  }

  useEffect(() => {
    setLoader(true);
    services.getAccountData().then(res => {
      setLoader(false);
      setFirstName(res.firstName);
      setLastName(res.lastName);
      setUserName(res.userName);
      setPhone(res.phoneNumber);
      setCompanyName(res.companyName);
    },
      (error) => {
        errorHandlerFunction(error);
      });
  }, [])

  return (
    <div className="accountSection">
      {/* Loader Block */}
      {loader ? <Loader /> : null}
      <h2 className="headerName">My Account</h2><br />
      <h3 className="subHeader">Account Holder Information</h3><br />
      <div className="form">
        <label className="label">First Name:</label>
        <input type="text" value={firstName} onChange={() => { }} readOnly /><br /><br />
        <label className="label">Last Name:</label>
        <input type="text" value={lastName} onChange={() => { }} readOnly /><br /><br />
        <label className="label">Username:</label>
        <input type="text" value={userName} onChange={() => { }} readOnly /><br /> <br />
        <label className="label">Phone:</label>
        <input type="text" value={phoneNumber} onChange={() => { }} readOnly /><br /><br />
        <label className="label">Company Name:</label>
        <input type="text" value={companyName} onChange={() => { }} readOnly /><br /><br />
        <div className="updateButton">
          <button className="btn btn-primary" disabled>Update</button>
        </div>
      </div>
    </div>


  )
}
export default Account;
