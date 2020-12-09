/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Input, CustomInput, Row, Col, Card, CardBody, Table, FormGroup, Button, CardTitle, CardHeader, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import services from '../../../components/Services/service';
import adminService from '../../../components/Services/adminService';
import { DecryptLocalStorage } from '../../../components/shared/local-storage/local-storage';
import Loader from '../../../components/shared/spinner/spinner';
import '../assign-group/assign-group.scss';
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const useStyles = makeStyles({
  root: {
    // transform: rotate(['15deg'])
    transform: "rotate(270deg)",
    marginLeft: "2px",
    paddingTop: "1px"
  },
});

function AssignGroup(props) {
  const classes = useStyles();
  const [allUsers, setUsers] = useState([{ label: 'reddy121', value: 'reddy121' }]);
  const [customRoles, setCustomRoles] = useState([]);
  const [handleId, setHandleId] = useState('');
  const [userRolesList, setUserRolesList] = useState([]);
  const [userRolesListNew, setUserRolesListNew] = useState([]);
  let UserHandleId = DecryptLocalStorage('handleId');
  const [loader, setLoader] = React.useState(false);
  const [requiredFieldsMessage, setRequiredFieldsMessage] = useState(false);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isAddNewRoleActive, setAddNewRoleActive] = useState(false);
  const toggle = () => setPopoverOpen(!popoverOpen);
  const [inputUserName, setInputName] = useState("");

  useEffect(() => {
    initialServiceCalling();

  }, [])
  // }, [])

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

    adminService.getRbacAssignedRolesGroupList().then(res => {
      // setUserRolesList(res)
      let role = res;
      role.map(element => {
        element.roleGroups.map(roleg => {
          let roleGroupCheckedList = []
          let unique = []
          roleg.role.map(roles => {
            Object.assign(roles, { isChecked: JSON.parse(roles.hasAccess) })
            if (unique.includes(roles.subrole)) {
              Object.assign(roles, { hasSubRole: false })
            }
            else {
              unique.push(roles.subrole);
              Object.assign(roles, { hasSubRole: true })
            }
            if (roles.hasAccess == "true") {
              roleGroupCheckedList.push(roles)
            }
          })
          // For check all asses has access or not
          if (roleGroupCheckedList.length > 0) {
            Object.assign(roleg, { isChecked: true })
          }
          else {
            Object.assign(roleg, { isChecked: false })
          }
        })
      })
      setUserRolesListNew(role)
      setLoader(false);
    },
      (error) => {
        errorHandlerFunction(error);
      });

    adminService.addRolesToUsers().then(res => {
      let role = res.roleGroups;
      role.map(roleg => {
        let unique = []
        roleg.role.map(roles => {
          Object.assign(roles, { isChecked: JSON.parse(roles.hasAccess) })
          if (unique.includes(roles.subrole)) {
            Object.assign(roles, { hasSubRole: false })
          }
          else {
            unique.push(roles.subrole);
            Object.assign(roles, { hasSubRole: true })
          }
        })
        Object.assign(roleg, { isChecked: false })
      })
      console.log(role)
      setUserRolesList(role);
    })
  }

  const addRemoveCheckBoxAssignRole = (idx, groupName) => {
    // console.log(idx, handle, groupName)
    let rolesList = [...userRolesList];
    for (var group of rolesList) {
      if (group.name == groupName) {
        group.isChecked = !group.isChecked
        group.role.forEach((roles, index) => {
          if (group.isChecked == true) roles.isChecked = true
          else roles.isChecked = false
        });
      }
    }
    setUserRolesList(rolesList)
  }

  const onEditCheckboxForAddNew = (idx, groupName) => {
    console.log("userRolesList", userRolesList)
    let rolesList = [...userRolesList];
    console.log("rolesList", rolesList)

    for (var group of rolesList) {
      let roleGroupCheckedList = []
      if (group.name == groupName) {
        group.role.forEach((roles, index) =>                  {
          if (index == idx) {
            roles.isChecked = !roles.isChecked
          }
          if (roles.isChecked == true) {
            roleGroupCheckedList.push(roles.resourceName)
          }
          else {
            roleGroupCheckedList = roleGroupCheckedList.filter(item => item !== roles.resourceName)
          }
        });
        if (roleGroupCheckedList.length > 0) {
          group.isChecked = true
        }
        else { group.isChecked = false }
      }
    }
    setUserRolesList(rolesList)
  }



  const handleOnChange = (value) => {
    if (value !== null) {
      setHandleId(value.value)
      setLoader(true);
      adminService.getRbacGroupList(value.value).then(res => {
        setLoader(false);
        let role = res.roles.map(element => Object.assign(element, { isChecked: JSON.parse(element.hasAccess) }))
        setCustomRoles(role)
        setLoader(false);
      },
        (error) => {
          errorHandlerFunction(error);
        }
      );

    }
  }

  const onchangeCheckbox = (index) => {
    let roles = [...userRolesListNew];
    for (var i in roles) {
      if (i == index) {
        roles[i].isChecked = !roles[i].isChecked
      }
    }
    setCustomRoles(roles)
  }

  const editRolesERow = (idx, value) => {
    let roles = [...userRolesListNew];
    userRolesListNew.map((element, index) => {
      if (index == idx) {
        Object.assign(element, { isEdit: value })

      }
    })
    setUserRolesListNew(roles)
  }

  const onEditCheckbox = (idx, handle, groupName) => {
    let rolesList = [...userRolesListNew];
    for (var users of rolesList) {
      if (users.handleId == handle) {
        for (var group of users.roleGroups) {
          let roleGroupCheckedList = []
          if (group.name == groupName) {
            group.role.forEach((roles, index) => {
              if (index == idx) {
                roles.isChecked = !roles.isChecked
              }
              if (roles.isChecked == true) {
                roleGroupCheckedList.push(roles.resourceName)
              }
              else {
                roleGroupCheckedList = roleGroupCheckedList.filter(item => item !== roles.resourceName)
              }
            });
            if (roleGroupCheckedList.length > 0) {
              group.isChecked = true
            }
            else { group.isChecked = false }
          }

        }
      }
    }
    setUserRolesListNew(rolesList)
  }

  const addRemoveCheckAll = (idx, handle, groupName) => {
    // console.log(idx, handle, groupName)
    let rolesList = [...userRolesListNew];
    for (var users of rolesList) {
      if (users.handleId == handle) {
        for (var group of users.roleGroups) {
          if (group.name == groupName) {
            group.isChecked = !group.isChecked
            group.role.forEach((roles, index) => {
              if (group.isChecked == true) roles.isChecked = true
              else roles.isChecked = false
            });
          }
        }
      }
    }
    setUserRolesListNew(rolesList)
  }

  const updateAssignedRole = (e, request) => {
    let RequestData = request;
    delete RequestData.isEdit;
    RequestData.roleGroups.map(rolegroup => {
      delete rolegroup.isChecked;
      rolegroup.role.map((roles, index) => {
        let status = roles.isChecked == false ? "INACTIVE" : "ACTIVE";
        roles.hasAccess = status;
        delete roles.hasSubRole;
        delete roles.isChecked;
      })
    })
    console.log("request ==> ", RequestData)
    if (RequestData.handleId !== "" || RequestData.handleId !== null) {
      setLoader(true);
      adminService.assignRbacRoles(RequestData).then(res => {
        initialServiceCalling();
        setLoader(false);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
    e.preventDefault();
  }

  const assignRoleSubmit = (e, userName, RoleList) => {
    if (userName != null || userName != "") {
      let selectedRoles = RoleList;
      selectedRoles.map(rolegroup => {
        delete rolegroup.isChecked;
        rolegroup.role.map((roles, index) => {
          let status = roles.isChecked == false ? "INACTIVE" : "ACTIVE";
          roles.hasAccess = status;
          delete roles.hasSubRole;
          delete roles.isChecked;
        })
      })

      let RequestData = {
        "handleId": userName,
        "roleGroups": selectedRoles
      };
      console.log("request ==> ", RequestData)
      setLoader(true);
      adminService.createAssignRole(RequestData).then(res => {
        initialServiceCalling();
        setLoader(false);
      },
        (error) => {
          errorHandlerFunction(error);
        });
    }
    else {
      console.log("Please Enter valid Handle Id")
    }
    e.preventDefault();
  }

  const setAssignRolesToUser = () => {
    setAddNewRoleActive(true);
    console.log("res ==>", userRolesList)

  }

  const onSubmit = e => {
    var selectedRoles = []
    customRoles.forEach(role => {
      // if (role.isChecked == true) {
      let status = role.isChecked == false ? "INACTIVE" : "ACTIVE";
      let roles = {
        "hasAccess": status,
        "resourceName": role.resourceName,
        "roleName": role.roleName
      }
      selectedRoles.push(roles)
      // }
    })
    if ((handleId !== "" || handleId !== null) && selectedRoles.length > 0) {
      setRequiredFieldsMessage(false)
      let finalRequest = {
        "handleId": UserHandleId,
        "roles": selectedRoles
      }
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

  const handleChangeUserName = (value) => {
    if (value.match("^[0-9a-zA-Z_.-]*$") != null) {
      setInputName(value);
    }
  }

  return (
    <>
      {loader ? <Loader /> : null}
      <div className="content-wrapper">
        <div className="content-heading">Assign Role Group
          <div className="ml-auto">
            <button className="btn btn-primary" onClick={() => setAddNewRoleActive(true)} style={{padding: "3px 18px"}}>Assign Role</button>
          </div>
        </div>
        {/* START row */}
        {isAddNewRoleActive ?
          <div className="row">
            <div className="col-md-12">
              {/* <form name="formRegister" action=""> */}
                <Card className="card-default">
                  <CardBody>
                    <Row>
                      <div className="col-md-3">
                        <FormGroup >
                          <label className="required">Add User</label>
                          <Input placeholder="Handle Id" type="text" required value={inputUserName} onChange={(event) => handleChangeUserName(event.target.value)} />
                        </FormGroup>
                      </div>
                      <div className="arrangeRoles">{userRolesList.map((group, indexGroup) => (
                        <div className="roleGroup">
                          <div className="card">
                            <div className="container">
                              <h4><b>
                                <Checkbox
                                  checked={group.isChecked}
                                  onChange={() => addRemoveCheckBoxAssignRole(indexGroup, group.name)}
                                  inputProps={{ 'aria-label': 'primary checkbox' }}
                                  name={group.name}
                                />
                                {group.name} <SubdirectoryArrowLeftIcon color="disabled" className={classes.root} /></b></h4>
                              <div className="cardbody">
                                {group.role.map((roles, idx) => (
                                  <>
                                    {roles.hasSubRole && roles.hasSubRole == true ?
                                      <p className="sub-role-style">{roles.subrole} <span className="sub-role-smalltext">(Sub Role)</span></p>
                                      : ""}
                                    {/* <form> */}
                                    <FormControlLabel
                                      control={<Checkbox
                                        checked={roles.isChecked}
                                        onChange={() => onEditCheckboxForAddNew(idx, group.name)}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        name={roles.resourceName}
                                      />}
                                      label={roles.resourceName}
                                    />
                                    {/* </form> */}
                                    {/* } */}

                                  </>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>

                      {/* <div className="col-md-9">
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
                          <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                      </div>
                    </div> */}
                    </Row>
                    <div style={{ textAlign: "right" }}>
                      {isAddNewRoleActive ?
                        <div style={{ textAlign: "right" }}>
                          <Button onClick={() => setAddNewRoleActive(false)} style={{padding: "3px 18px"}}>Cancel</Button>
                          <Button onClick={(e) => assignRoleSubmit(e, inputUserName, userRolesList)} style={{padding: "3px 18px"}}>Save</Button>
                        </div> : ""}

                    </div>
                  </CardBody>
                </Card>
              {/* </form> */}
            </div>
          </div> : null}
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
                      {/* <th style={{ maxWidth: "40px" }}>#</th> */}
                      <th>Handle Id</th>
                      <th style={{ maxWidth: "80%" }}>Assign Roles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRolesListNew.map((userRole, index1) => (
                      <tr key={index1}>
                        <td>{userRole.handleId}</td>
                        <td style={{ maxWidth: "80%" }}>
                          <div style={{ textAlign: "right" }}>
                            {userRole.isEdit ?
                              <div style={{ textAlign: "right" }}>
                                <Button onClick={() => editRolesERow(index1, false)} style={{padding: "3px 18px"}}>Cancel</Button>
                                <Button onClick={(e) => updateAssignedRole(e, userRole)}style={{padding: "3px 18px"}}>Save</Button>
                              </div> : <Button onClick={() => editRolesERow(index1, true)} style={{padding: "3px 18px"}}>Edit</Button>}

                          </div>
                          <div className="arrangeRoles">{userRole.roleGroups.map((group, indexGroup) => (

                            <div className="roleGroup">
                              <div className="card">
                                <div className="container">
                                  <h4><b>
                                    {userRole.isEdit ?
                                      <Checkbox
                                        checked={group.isChecked}
                                        onChange={() => addRemoveCheckAll(indexGroup, userRole.handleId, group.name)}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        name={group.name}
                                      /> : ""}
                                    {/* <p className="test">(Group Name)</p> */}
                                    {group.name} <SubdirectoryArrowLeftIcon color="disabled" className={classes.root} /></b></h4>
                                  <div className="cardbody">
                                    {group.role.map((roles, idx) => (
                                      <>
                                        {roles.hasSubRole && roles.hasSubRole == true ?
                                          <p className="sub-role-style">{roles.subrole} <span className="sub-role-smalltext">(Sub Role)</span></p> : ""}

                                        {!userRole.isEdit ?
                                          <p className={roles.hasAccess == "true" ? 'role-active' : 'role-inactive'}>
                                            {roles.resourceName}
                                          </p>
                                          :
                                          <form>
                                            <FormControlLabel
                                              control={<Checkbox
                                                checked={roles.isChecked}
                                                onChange={() => onEditCheckbox(idx, userRole.handleId, group.name)}
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                                name={roles.resourceName}
                                              />}
                                              label={roles.resourceName}
                                            />
                                          </form>
                                        }

                                      </>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
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
export default AssignGroup