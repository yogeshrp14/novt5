/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { CustomInput, Row, Col, Card, CardBody, Table, FormGroup } from 'reactstrap';
import Select from 'react-select';
import services from '../../../components/Services/service';
import adminService from '../../../components/Services/adminService';
import { DecryptLocalStorage } from '../../../components/shared/local-storage/local-storage';
import Loader from '../../../components/shared/spinner/spinner';
import '../assign-roles/assign-roles.scss';

function AssignRoles(props) {
  const [allUsers, setUsers] = useState([{ label: 'reddy121', value: 'reddy121' }]);
  const [customRoles, setCustomRoles] = useState([]);
  const [handleId, setHandleId] = useState('');
  const [userRolesList, setUserRolesList] = useState([]);
  let UserHandleId = DecryptLocalStorage('handleId');
  const [loader, setLoader] = React.useState(false);
  const [requiredFieldsMessage, setRequiredFieldsMessage] = useState(false);

  useEffect(() => {
  
    initialServiceCalling();
  
  }, [])

  const errorHandlerFunction = (error) => {
    console.log("error ==> ", error)
    setLoader(false);
  }

  const initialServiceCalling = () => {
    setLoader(true);
    // adminService.getAllRbacRoles(UserHandleId).then(res => {
    //   setLoader(false);
    //   let role = res.roles.map(element => Object.assign(element, { isChecked: JSON.parse(element.hasAccess) }))
    //   setCustomRoles(role)
    //   setLoader(false);
    // });

    adminService.getRbacAssignedRolesList().then(res => {

      setUserRolesList(res)
      setLoader(false);
  
   

    }
    ,
      (error) => {
        errorHandlerFunction(error);
      });
  }

  const handleOnChange = (value) => {
    if (value !== null) {
      setHandleId(value.value)
      setLoader(true);
      adminService.getAllRbacRoles(value.value).then(res => {
        setLoader(false);
        let role = res.roles.map(element => Object.assign(element, { isChecked: JSON.parse(element.hasAccess) }))
        setCustomRoles(role)
        console.log(customRoles)
        setLoader(false);
      },
        (error) => {
          errorHandlerFunction(error);
        }
      );

    }
  }

  const onchangeCheckbox = (index) => {
    let roles = [...customRoles];
    for (var i in roles) {
      if (i == index) {
        roles[i].isChecked = !roles[i].isChecked
      }
    }
    console.log("check box changes")
    setCustomRoles(roles)
  }
  

  const onSubmit = e => {
    var selectedRoles = []
    customRoles.forEach(role => {
      // if (role.isChecked == true) {
      let status = role.isChecked == false ? "INACTIVE" : "ACTIVE";
      console.log("status ==> ", status, role.hasAccess)
      let roles = {
        "hasAccess": status,
        "resourceName": role.resourceName,
        "roleName": role.roleName
      }
      selectedRoles.push(roles)
      console.log("selectedroles",selectedRoles)
      // }
    })
    if ((handleId !== "" || handleId !== null) && selectedRoles.length > 0) {
      setRequiredFieldsMessage(false)
      console.log("valid")
      let finalRequest = {
        "handleId": UserHandleId,
        "roles": selectedRoles
      }
      console.log("finalRequest ==> ", finalRequest)
      setLoader(true);
      adminService.assignRbacRoles(finalRequest).then(res => {
        initialServiceCalling();
        setLoader(false);
      },
      (error) => {
        errorHandlerFunction(error);
      });
    }
    else {
      console.log("Invalid")
      setRequiredFieldsMessage(true)

    }
    e.preventDefault();

  }

  return (
    <>
      {loader ? <Loader /> : null}
      <div className="content-wrapper">
        <div className="content-heading">Assign Roles
          <div className="ml-auto">
            {/* <button className="btn btn-primary" onClick={() => this.props.history.push('/permission')}>Back</button> */}
          </div>
        </div>
        {/* START row */}
        <div className="row">
          <div className="col-md-12">
            {/* START card */}
            <form onSubmit={onSubmit} name="formRegister" action="">
              <Card className="card-default">
                <CardBody>
                  <Row>
                    <div className="col-md-3">
                      <FormGroup >
                        <label className="required">Select User</label>
                        <Select onChange={handleOnChange.bind(this)}
                          // defaultValue={allUsers[0]}
                          isClearable
                          isSearchable
                          name="handleId"
                          options={allUsers}
                        />
                      </FormGroup>
                    </div>
                    <div className="col-md-9">
                      {customRoles.length > 0 ? <label className="required">Select Roles</label> : null}
                      {customRoles.map((role, index) => (
                        <CustomInput type="checkbox" id={role.resourceName} checked={role.isChecked}
                          onChange={() => onchangeCheckbox(index)} label={role.resourceName} />
                      ))}
                    </div>
                    <div className="col-md-12" style={{ marginTop: "5px" }}>
                      <div className="d-flex align-items-center">
                        {requiredFieldsMessage ? <div className="requiredWarning">
                          <p> <span>*</span> Please fill all mandatory Fields</p>
                        </div> : null}
                        <div className="ml-auto">
                          <button type="submit" className="btn btn-primary">Assign Role</button>
                        </div>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </form>
            {/* END card */}
          </div>
        </div>
        {/* END row */}


        <Row>
          <Col xl="12">
            {/* START card */}
            <Card className="card-default">
              <CardBody>
                {/* START table-responsive */}
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th style={{ maxWidth: "40px" }}>#</th>
                      <th>Handle Id</th>
                      {/* <th>Assignee Handle Id</th>
                    <th>Assignee Roles</th> */}
                      <th style={{ maxWidth: "80%" }}>Roles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRolesList.map((role, index) => (
                      <tr key={index}>
                        <td style={{ maxWidth: "30px" }}>{index + 1}</td>
                        <td>{role.handleId}</td>
                        <td style={{ maxWidth: "80%" }}>
                          <div className="arrangeRoles">{role.roles.map((roles, index) => (
                            <>
                              {roles.hasAccess == "false" ? <span style={{ backgroundColor: "#DA291C", color: "white", marginRight: "5px", border: "2px solid #d6d6d6", padding: "5px" }}>
                                {roles.resourceName}
                              </span>
                                : null}
                           
                              {roles.hasAccess == "true" ? <span style={{ backgroundColor: "#06a906", color: "white", marginRight: "5px", border: "2px solid #d6d6d6", padding: "5px" }}>
                                {roles.resourceName}
                              </span>
                                : null}
                            </>
                          ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* END table-responsive */}
              </CardBody>
            </Card>
            {/* END card */}
          </Col>
        </Row>

      </div>
    </>
  )
}
export default AssignRoles