import React from 'react';
import "./access-denied.scss";
function AccessDenied() {
    return (
        <div className="access-denied-block">
            <div className="mat-card">
                <h1 className="heading-one"> Access Denied! </h1>
                <h4 className="heading-two"> Your request to this page has been denied. </h4>
                <h5 className="heading-two" > Redirecting in 5 seconds...</h5>
            </div>
        </div>
    )
}
export default AccessDenied;