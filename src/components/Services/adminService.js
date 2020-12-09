/* eslint-disable */
import { environment } from "../../environment"

const API_END_POINT = process.env.REACT_APP_API_ENDPOINT;
const assetsLocation = "/aes/static/";

console.log('API_END_POINT:' + API_END_POINT);

export default {

  // get Assign Role default Values
  addRolesToUsers: () => fetch(assetsLocation + "assets/data/assignRole.json").then(res => res.json()),

  // Get RBAC API
  // getAllRbacRoles: (handleId) => fetch(API_END_POINT + 'roles/' + handleId).then(res => res.json()),
   getAllRbacRoles: (key) => fetch(assetsLocation + "assets/data/rbacsystem.json").then(res => res.json()),


  // Get ASSIGN RBAC ROLES API
  // assignRbacRoles: (requestOptions) => fetch(API_END_POINT + 'update/roleaccess',
  //   {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(requestOptions)
  //   }),
   assignRbacRoles: (requestOptions) => fetch(assetsLocation + "assets/data/assignRbacRoles.json").then(res => res.json()),

  createAssignRole: (requestOptions) => fetch(API_END_POINT + 'create/role',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestOptions)
    }),

  // Get RBAC ASSIGNED ROLES LIST API
  // getRbacAssignedRolesList: (requestOptions) => fetch(API_END_POINT + 'roles').then(res => res.json()),
   getRbacAssignedRolesList: (requestOptions) => fetch(assetsLocation + "assets/data/getRbacAssignedRolesList.json").then(res => res.json()),


  // Get ASSIGN RBAC ROLES API
  getRbacGroupList: (handleId) => fetch(API_END_POINT + 'roles/' + handleId).then(res => res.json()),

  // Get RBAC ASSIGNED Group LIST API
  // getRbacAssignedRolesGroupList: (requestOptions) => fetch(API_END_POINT + "roles").then(res => res.json()),
  getRbacAssignedRolesGroupList: (requestOptions) => fetch(assetsLocation+"assets/data/getRbacAssignedGroupList.json").then(res => res.json()),




}