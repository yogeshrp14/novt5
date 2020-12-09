import React from "react";
import {
  Route,
  Switch,
  withRouter,
  Redirect
} from "react-router-dom";

// styles
import "../../pages/dashboard/dashboard.scss";

// components
import Header from "../Header/header";
import Footer from "../Footer/footer";

// pages
import Dashboard from "../../pages/dashboard/dashboard";
import ViewQuotes from "../../pages/viewquotes/viewquote";
import Partner from "../../pages/partners/partner";
import Orders from "../../pages/orders/order";
import Subscriptions from "../../pages/subscriptions/subscription";
import Account from '../../pages/accounts/account.js';
import Help from '../../pages/help/help';
import Uploads from '../../pages/usageupload/usageupload';
import Profile from '../../pages/profile/profile';
import NewProfile from '../../pages/profile/NewProfile';
import UsageDownloadDialog from '../../pages/usageupload/usageDownload/usageDownload';
import UsageUploads from '../../pages/usageupload/upload/upload';
import NewUsageUploads from '../../pages/usageupload/upload/NewUpload'
import NewPartner from '../../pages/NewPartner/NewPartner'
import Newviewquotes from '../../pages/viewquotes/Newviewquotes'
import NewUsageUpload from '../../pages/usageupload/NewUsageUpload'

import NewUsageDownload from '../../pages/usageupload/usageDownload/NewUsageDownload'
import PractiseSubscription from '../../pages/subscriptions/PractiseSubscription'
import AccountDetails from '../../pages/account-details/Account-Details'

function Layout(props) {
  return (
    <div >
      <>
        <Header history={props.history} />
        <main className="main">
          <section className="innerDashboard">
            <Dashboard history={props.history} />
            <div>
              <div />
              <Switch>
                <Route path="/dashboard/partner" render={(routerProps) => <Partner {...routerProps} />} />
                {/* <Route path="/dashboard/partner" render={(routerProps) => <NewPartner {...routerProps} />} /> */}

                <Route path="/dashboard/profile" render={(routerProps) => <Profile {...routerProps} />} />
                {/* <Route path="/dashboard/profile" render={(routerProps) => <NewProfile {...routerProps} />} /> */}

                <Route path="/dashboard/viewquotes" render={(routerProps) => <ViewQuotes {...routerProps} />} />
                {/* <Route path="/dashboard/viewquotes" render={(routerProps) => <Newviewquotes {...routerProps} />} /> */}

                <Route path="/dashboard/orders" render={(routerProps) => <Orders {...routerProps} />} />

                <Route path="/dashboard/subscriptions" render={(routerProps) => <Subscriptions {...routerProps} />} />
                <Route path="/dashboard/subscriptionspractise" render={(routerProps) => <PractiseSubscription {...routerProps} />} />
               
                <Route path="/dashboard/account" render={(routerProps) => <Account {...routerProps} />} />

                <Route path="/dashboard/help" render={(routerProps) => <Help {...routerProps} />} />

                  <Route path="/dashboard/usageupload" render={(routerProps) => <Uploads {...routerProps}/>}/>
                {/* <Route path="/dashboard/usageupload" render={(routerProps) => <NewUsageUpload {...routerProps}/>}/> */}
                {/* <Route path="/dashboard/usagedownload" render={(routerProps) => <NewUsageDownload {...routerProps}/>}/> */}
                <Route path="/dashboard/usagedownload" render={(routerProps) => <UsageDownloadDialog {...routerProps}/>}/>
                {/* <Route path="/dashboard/upload" render={(routerProps) => <UsageUploads {...routerProps}/>}/> */}
                <Route path="/dashboard/upload" render={(routerProps) => <NewUsageUploads {...routerProps}/>}/>
                <Route path="/dashboard/accountdetails" render={(routerProps)=><AccountDetails {...routerProps} />} />
                <Route path="/*" render={() => <Redirect to="/dashboard/viewquotes" />} />
              </Switch>
            </div>
          </section>
        </main>
        <Footer history={props.history} />
      </>
    </div>
  );
}

export default withRouter(Layout);
