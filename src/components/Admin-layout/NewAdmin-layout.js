import React from "react";
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'


//COMPONENT
import AdminHeader from "./Admin-header";
import Sidebar from "./admin-sidebar";

//pages
import AssignRoles from "../../pages/Admin/assign-roles/assign-roles";
import AssignGroup from "../../pages/Admin/assign-group/assign-group";

function NewAdminLayout(props) {
      console.log("props ==> ", props)
      return (
            <div className="wrapper">
                  <AdminHeader history={props.history} />
                  <Sidebar history={props.history} />
                  <section className="section-container">
                        <div>
                        <Switch>
                              <Route path="/admin/role" render={(routerProp)=><AssignRoles {...routerProps} />} />
                              <Route path="/admin/group" render={()=><AssignGroup {...routerProps} />} />
                              <Route path="/" render={()=><Redirect to="/admin/group" />} />


                            
                        </Switch>
                        </div>
                  </section>
            </div>
      );
}

export default withRouter(AdminLayout);
