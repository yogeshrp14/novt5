import React from "react";
import {
  Route,
  Switch,
  withRouter,
  Redirect
} from "react-router-dom";
import PageWithLayout from './page-with-layout';

// styles
import "../../pages/dashboard/dashboard.scss";

// components
import AdminHeader from "./Admin-header";
import Footer from "../Footer/footer";


import Sidebar from "./admin-sidebar"
import '../../assets/admin-style/app.scss'
// pages
import AssignRoles from "../../pages/Admin/assign-roles/assign-roles";
import AssignGroup from "../../pages/Admin/assign-group/assign-group";

function AdminLayout(props) {
  console.log("props ==> ", props)
  return (
    <div className="wrapper">
      <AdminHeader history={props.history} />
      <Sidebar history={props.history} />

      {/* <main className="main"> */}
        <section className="section-container">
          <div>
            <div />
            <Switch>
              <Route path="/admin/role" render={(routerProps) => <AssignRoles {...routerProps} />} />
              <Route path="/admin/group" render={(routerProps) => <AssignGroup {...routerProps} />} />
              <Route path="/*" render={() => <Redirect to="/admin/group" />} />

            </Switch>
          </div>
        </section>
      {/* </main> */}
      {/* <Footer history={props.history} /> */}
  </div>
  );
}

export default withRouter(AdminLayout);
