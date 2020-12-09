import React from 'react';
import "./redirecting-page.scss";
import logo from '../../../assets/images/process.gif';


function RedirectingPage() {
    return (
        <div className="redirecting-block">
            <div className="loadingImage">
                <img className="" src={logo} alt="Logo" />
                <p className="redircting-text">Redirecting ...</p>
            </div>

        </div>
    )
}
export default RedirectingPage;