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
import { CheckBox } from '@material-ui/icons';


const useStyles = makeStyles({
      root: {
            // transform: rotate(['15deg'])
            transform: "rotate(270deg)",
            marginLeft: "2px",
            paddingTop: "1px"
      },
});

export default function NewAssignGroup() {
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

      useEffect({
            initialServiceCalling()
      })

      const errorHandlerFunction = (error) => {
            console.log("error ==> ", error)
            setLoader(false);
      }
      const initialServiceCalling = () => {
            setLoader(true);
            adminService.getRbacAssignedRolesGroupList().then(res => {
                  let role = res
                  res.map(element => {
                        element.roleGroups.map(roleg => {
                              let roleGroupCheckedList = []
                              let unique = []
                              roleg.role.map(roles => {
                                    Object.assign(roles, { isChecked: JSON.parse(roles.hasAccess) })
                                    if (unique.includes(roles.subrole)) {
                                          Object.assign(roles, { hasSubRole: false })
                                    } else {
                                          unique.push(roles.subrole);
                                          Object.assign(roles, { hasSubRole: true })
                                    }
                                    if (roles.hasAccess == "true") {
                                          roleGroupCheckedList.push(roles)
                                    }
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
                        })
                  adminService.addRolesToUsers().then(res => {
                        let role = res.roleGroups
                        role.map(roleg => {
                              let unique = []
                              roleg.role.map(roles => {
                                    Object.assign(roles, { isChecked: JSON.parse(roles.hasAccess) })
                                    if (unique.includes(roles.subrole)) {
                                          Object.assign(roles, { hasAccess: true })
                                    } else {
                                          unique.push(roles.subrole)
                                          Object.assign(roles, { hasAccess: false })
                                    }
                              },
                                    setUserRolesList(role))
                        })
                  })
            })

      }
      const handleChangeUserName = (value) => {
            if (value.match("^[0-9a-zA-Z_.-]*$") != null) {
                  setInputName(value)
            }

      }
      const addRemoveCheckBoxAssignRole = (idx, groupName) => {
            let rolesList = [...userRolesList]
            for (var group of rolesList) {
                  if (group.name = groupName) {
                        group.isChecked = !group.isChecked
                        group.role.forEach((roles => {
                              if (group.isChecked == true) roles.isChecked = true
                              else roles.isChecked = false
                        }))

                  }
            }
            setUserRolesList(rolesList)
      }
      const onEditCheckboxForAddNew = () => {
            let rolesList = [...userRolesList];
            for (var group of rolesList) {
                  let roleGroupCheckedList = []
                  if (group.name == groupName) {
                        group.role.forEach((roles, index) => {
                              if (index == idx) {
                                    roles.isChecked == !roles.isChecked
                              }
                              if (roles.isChecked == true) {
                                    roleGroupCheckedList.push(roles.resourceName)
                              }
                              else {
                                    roleGroupCheckedList = roleGroupCheckedList.filter(item => item !== roles.resourceName)
                              }
                              if (roleGroupCheckedList.length > 0) {
                                    group.isChecked = true
                              }
                              else { group.isChecked = false }
                        })
                  }
                  setUserRolesList(rolesList)
            }
      }
      let assignRoleSubmit=()=>{
            
      }
      return (
            <div>
                  {loader ? <Loader /> : null}
                  <div className="content-wrapper">
                        <div className="content-heading">
                              <div className="ml-auto">
                                    <button className="btn btn-primary" style={{ "3px 18px"}} onClick={() => setAddNewRoleActive(true)}>Assign Role</button>
                              </div>
                        </div>
                        {isAddNewRoleActive ? <div>
                              <div className="row">
                                    <div className="col-md-12">
                                          <Card className="ard-default">
                                                <CardBody>
                                                      <Row>
                                                            <div className="col-md-3">
                                                                  <FormGroup>
                                                                        <labe className="required"> Add User</labe>
                                                                        <Input placeholder="Handle Id" type="text" required value={inputUserName} onChange={() => handleChangeUserName(event.target.value)}></Input>
                                                                  </FormGroup>
                                                            </div>
                                                            <div className="arrangeRoles">
                                                                  {userRolesList.map((group, indexGroup) => (
                                                                        <div className="roleGroup">
                                                                              <div className="card">
                                                                                    <div className="container">
                                                                                          <h4>
                                                                                                <b>
                                                                                                      <CheckBox
                                                                                                            checked={group.isChecked}
                                                                                                            onChange={() => addRemoveCheckBoxAssignRole(indexGroup, group.name)}
                                                                                                            name={group.name}
                                                                                                      />
                                                                                                      {group.name}<SubdirectoryArrowLeftIcon color="disabled" className={classes.root} />

                                                                                                </b>
                                                                                          </h4>
                                                                                          <div className="cardbody">
                                                                                                {
                                                                                                      group.role.map((roles, idx) => (
                                                                                                            <>
                                                                                                                  {roles.hasAccess && roles.hasAccess=true ? <p className="sub-role-style">{roles.subrole}<span className="sub-role-smalltext">(Sub Role)</span></p> :""}
                                                                                                            </>))
                                                                                                }
                                                                                                <FormControlLabel
                                                                                                      control={<Checkbox
                                                                                                            checked={roles.isChecked}
                                                                                                            onChange={() => onEditCheckboxForAddNew(idx, group.name)}
                                                                                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                                                                                            name={roles.resourceName}
                                                                                                      />}
                                                                                                      label={roles.resourceName}
                                                                                                />
                                                                                          </div>
                                                                                    </div>
                                                                              </div>
                                                                        </div>
                                                                  ))}
                                                            </div>

                                                      </Row>
                                                      <div style={{ textAlign: "right" }}>
                                                            {isAddNewRoleActive ?
                                                                  <div style={{ textAlign: "right" }}>
                                                                        <Button onClick={() => setAddNewRoleActive(false)} style={{ padding: "3px 18px" }}>Cancel</Button>
                                                                        <Button onClick={(e) => assignRoleSubmit(e, inputUserName, userRolesList)} style={{ padding: "3px 18px" }}>Save</Button>
                                                                  </div> : ""}
                                                      </div>
                                                </CardBody>
                                          </Card>
                                    </div>
                              </div>
                        </div> : null}
                  </div>

            </div>
      )



}