import React from 'react';
import './spinner.scss'; // Tell webpack that Button.js uses these styles

function ShowDetail() {
    return (
        <div className="loader-overlay">
            <div className="loadingMessage">&nbsp;</div>
        </div>
  );
}

export default ShowDetail;
