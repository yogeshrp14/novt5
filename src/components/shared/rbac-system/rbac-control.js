import CryptoJS from "crypto-js";
import adminService from '../../Services/adminService';
let sessionStorageValidator = process.env.REACT_APP_LOCALSTORAGE_VALIDATOR_KEY;

var defaultRbacControl = [
    { resourceName: "PartnerSearch", hasAccess: true },
    { resourceName: "Orders", hasAccess: true },
    { resourceName: "OrdersEventStore", hasAccess: true },
    { resourceName: "ViewQuotes", hasAccess: true },
    { resourceName: "CreateQuote", hasAccess: true },
    { resourceName: "DeleteQuote", hasAccess: true },
    { resourceName: "Subscription", hasAccess: true },
    { resourceName: "SubscriptionPartner", hasAccess: true },
    { resourceName: "SubscriptionReseller", hasAccess: true },
    { resourceName: "SubscriptionUsages", hasAccess: true },
    { resourceName: "Upload", hasAccess: true },
    { resourceName: "QuoteSummary", hasAccess: true }
];

export function RbacControl(handleId) {
    if (handleId != null) {
        adminService.getAllRbacRoles(handleId).then(res => {
            EncryptRBAC("RBAC", res.roles);
        },
        (error) => {
          EncryptRBAC("RBAC", []);
        });
    }
}

export function EncryptRBAC(key, value) {
    let rbacEncrypt = CryptoJS.AES.encrypt(JSON.stringify(value), sessionStorageValidator).toString();
    sessionStorage.setItem(key, rbacEncrypt)
    // DecryptRBAC("RBAC")
}

export function DecryptRBAC(key) {
    if (sessionStorage.getItem(key) && sessionStorage.getItem(key) !== null && sessionStorage.getItem(key) !== '' && sessionStorage.getItem(key) !== 'null') {
        let sessionStorageData = sessionStorage.getItem(key)
        let bytes = CryptoJS.AES.decrypt(sessionStorageData, sessionStorageValidator);
        let decriptedData = bytes.toString(CryptoJS.enc.Utf8);
        let rbacDataList = JSON.parse(decriptedData)
        defaultRbacControl.map(sensor => {
            rbacDataList.map(f => {
                if (f.resourceName == sensor.resourceName) {
                    sensor.hasAccess = JSON.parse(f.hasAccess)
                }
            })
            return sensor;
        })

        var modifyedRoles = {};
        defaultRbacControl.filter(value => {
            modifyedRoles[value.resourceName] = value.hasAccess
        })
        // console.log("modifyedRoles ==> ", modifyedRoles)

        return modifyedRoles
    }
    else return null
}