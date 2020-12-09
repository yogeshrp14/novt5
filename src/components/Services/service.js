/* eslint-disable */
import { environment } from "../../environment"

const AccountEndPoint = environment.accountDetailsApi;
const API_END_POINT = process.env.REACT_APP_API_ENDPOINT;
const LOGOUT_URL = process.env.REACT_APP_LOGOUT;
const SSO_REDIRECT_URL = process.env.REACT_APP_SSO;
const ACS_END_POINT = environment.acsEndPoint;
const assetsLocation = "/aes/static/";
const USAGE_QUERY = process.env.REACT_APP_USAGE_QUERY;
const USAGE_RATING = process.env.REACT_APP_USAGE_RATING;
const MEDIATION_SERVICE = process.env.REACT_APP_MEDIATION_SERVICE;
const USAGE_COLLECTION = process.env.REACT_APP_USAGE_COLLECTION;
const PARTNER_SFDC_DEAL_REGISTRATION_URL = process.env.REACT_APP_PARTNER_SFDC_DEAL_REGISTRATION_URL;
const INTERNAL_SFDC_DEAL_REGISTRATION_URL = process.env.REACT_APP_INTERNAL_SFDC_DEAL_REGISTRATION_URL;
console.log('API_END_POINT:' + API_END_POINT);
console.log('MEDIATION_SERVICE:' + MEDIATION_SERVICE);

const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.responseType = "arraybuffer";
    xhr.setRequestHeader("content-type", "application/json");
    xhr.onload = () => {
      resolve(xhr.response)
      console.log('Response===>', xhr.response);
      const filepath = data["filePath"];
      const filename = filepath.split("/");
      const reverseFile = filename.reverse();
      var arrayBuffer = xhr.response;
      var byteArray = new Uint8Array(arrayBuffer);
      console.log('ByteArray==>', byteArray);
      var blob = new Blob([byteArray]);
      console.log('Blob obj==>', blob);
      var link = document.createElement('a');
      if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
        console.log("Ie")
        window.navigator.msSaveBlob(blob, filename);
      }
      else {
        console.log("Browser Chrome or Firefox")
        link.href = window.URL.createObjectURL(blob);
        link.download = reverseFile[0];
        link.click();
      }
    }
    xhr.onerror = () => {
      reject("Reject", xhr.onerror)

    }
    xhr.send(JSON.stringify(data))
  });
  return promise;
}

const dashboardLogout = () => {
  const logoutUrl = SSO_REDIRECT_URL + LOGOUT_URL;
  window.location.replace(logoutUrl);
  localStorage.clear();
  sessionStorage.clear();
  let smsession = document.cookie.replace(/(?:(?:^|.*;\s*)SMSESSION\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if (smsession === 'No') {
    window.location.reload();
  }
}

export default {
  // ########## START ACCOUNT API ##########

  // Get Account Details API
  // getAccountData: () => fetch(AccountEndPoint + 'accountDetails').then(res => {
  //   if (res.type == "cors" && res.url.includes("login.jsp")) {
  //     console.log("logout URL ", res.status)
  //     dashboardLogout();
  //   }
  //   else {
  //     return res.json();
  //   }
  // }),
   getAccountData: () => fetch(assetsLocation + "assets/data/account.json").then(res => res.json()),


  // ########## START PARTNERS API ##########

  // Get Profile Search List 
  // getProfileSearchList: (searchText) => fetch(API_END_POINT + 'search/profile/' + searchText).then(res => {
  //   if (res.type == "cors" && res.url.includes("login.jsp")) {
  //     console.log("logout URL ", res.status)
  //     dashboardLogout();
  //   }
  //   else {
  //     return res.json();
  //   }
  // }),
  getProfileSearchList: () => fetch(assetsLocation + "assets/data/profile.json").then(res => res.json()),

  

  // Get Partner Search List 
  // getPartnerSearchList: (searchText) => fetch(API_END_POINT + 'company/linkId/' + searchText).then(res => {
  //   if (res.type == "cors" && res.url.includes("login.jsp")) {
  //     console.log("logout URL ", res.status)
  //     dashboardLogout();
  //   }
  //   else {
  //     return res.json();
  //   }
  // }),
  getPartnerSearchList: (searchText) => fetch(assetsLocation + "assets/data/partner.json").then(res => res.json()),

  // Get all Partners List after Click More button
  getAllPartnersList: (searchText) => fetch(API_END_POINT + 'company/linkId/' + searchText + '?showAllPartners=true').then(res => {
    if (res.type == "cors" && res.url.includes("login.jsp")) {
      console.log("logout URL ", res.status)
      dashboardLogout();
    }
    else {
      return res.json();
    }
  }),

  // ########## START QUOTES API ##########
  // Default Quotes List API
  // getQuotesList: (handleId, link_id, page, rowsPerPage, orderBy, order) => fetch(API_END_POINT + 'quotes/' + handleId + '?link_id=' + link_id + '&pageNumber=' + page + '&pageSize=' + rowsPerPage + '&sortBy=' + orderBy + '&sortdir=' + order).then(res => {
  //   if (res.type == "cors" && res.url.includes("login.jsp")) {
  //     console.log("logout URL ", res.status)
  //     dashboardLogout();
  //   }
  //   else {
  //     return res.json();
  //   }
  // }),
  getQuotesList: (handleId, link_id, Page, rowsPerPage, orderBy, order) => fetch(assetsLocation + "assets/data/quotesList.json").then(res=>res.json()),

  

  // Quotes Search List API
  getSearchQuotes: (handleId, link_id, searchText, page, rowsPerPage, orderBy, order, userType) => fetch(API_END_POINT + 'search/quotes/' + handleId + '?searchStr=' + searchText + '&link_id=' + link_id + '&userType='+ userType + '&pageNumber=' + page + '&pageSize=' + rowsPerPage + '&sortBy=' + orderBy + '&sortdir=' + order).then(res => {
    if (res.type == "cors" && res.url.includes("login.jsp")) {
      console.log("logout URL ", res.status)
      dashboardLogout();
    }
    else {
      return res.json();
    }
  }),

  // Delete Quotes API
  deleteQuotes: (requestOptions) => fetch(API_END_POINT + 'deactivateQuotes',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestOptions)
    }
  ),

  // ########## START SUBSCRIPTIONS API ##########

  // Default Subscription List API
  // getSubscriptionData: (handleId, link_id, searchTxt, isReseller, isDirectCustomer, page, rowsPerPage) =>
  //   fetch(API_END_POINT + 'subscriptions?handleId=' + handleId + (isDirectCustomer ? (isReseller ? '&isReseller=true' : '&isReseller=false') : (isReseller ? ('&gtm_partner2=' + link_id + '&isReseller=true') : ('&gtm_partner1=' + link_id + '&isReseller=false'))) + searchTxt + '&isDirectCustomer=' + isDirectCustomer + "&status=Active" + '&pageNumber=' + page + '&pageSize=' + rowsPerPage).then(res => {
  //     if (!res.ok) {
  //       throw new Error("HTTP error " + res.status);
  //     }
  //     return res.json();
  //   }),


   getSubscriptionData: (handleId, link_id, searchTxt, isReseller, isDirectCustomer, page, rowsPerPage) => fetch(assetsLocation + "assets/data/subscription.json").then(res => res.json()),

  getInvoices: (sapContractNumber, subscriptionName, page, rowsPerPage) => fetch(API_END_POINT + 'subscription/search/invoice/' + sapContractNumber + '/' + subscriptionName + '?pageNumber=' + page + '&pageSize='+ rowsPerPage).then(res => res.json()),

  // getInvoices: (invoiceAccount, subscriptionName, page, rowsPerPage) => fetch(assetsLocation + "assets/data/sapInvoiceList.json").then(res => res.json()),

  // Update Technical contact API
  updateTechnicalcontact: (requestOptions) => fetch(API_END_POINT + 'update/technicalcontact',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestOptions)
    }
  ),

  productsPoweredby: (requestOptions) => fetch(API_END_POINT + 'subscription/products/poweredby',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestOptions)
    }
  ),

  downloadInvoice: (entityId, invoiceNumber, invoiceId) => {
    let downloadURL = API_END_POINT + 'subscription/download/invoice/' + entityId + '/' + invoiceNumber + '/' + invoiceId;
    window.open(downloadURL, '_blank');
  },

  downloadSapInvoice: (owcc_document_id) => {
    let downloadURL = API_END_POINT + 'download/invoice/' + owcc_document_id;
    window.open(downloadURL, '_blank');
  },

  getSubscriptionActionUrl: (subscriptionId, bpLinkId, actionType) => {
    let url = '';
    let quoteType = '';
    if (actionType === 'Change') {
      quoteType = "C"
    } else if (actionType === 'Cancel') {
      quoteType = "D";
    } else if (actionType === 'Renew') {
      quoteType = "R"
    }

    url = ACS_END_POINT + '?subscriptionId=' + subscriptionId + '&quoteType=' + quoteType + '&linkId=' + bpLinkId;
    return url;
  },

  updateSystemId: (requestOptions) => fetch(API_END_POINT + 'update/subscription',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestOptions)
    }),

  // ########## START ORDERS API ##########

  // Default Orders List API
  // getOrdersData: (handleId, link_id, page, rowsPerPage, orderBy, order) => fetch(API_END_POINT + 'orders/' + handleId + '?link_id=' + link_id + '&pageNumber=' + page + '&pageSize=' + rowsPerPage + '&sortBy=' + orderBy + '&sortdir=' + order).then(res => {
  //   if (res.type == "cors" && res.url.includes("login.jsp")) {
  //     console.log("logout URL ", res.status)
  //     dashboardLogout();
  //   }
  //   else {
  //     return res.json();
  //   }
  // }),
  getOrdersData: (handleId, link_id, page, rowsPerPage, orderBy, order) => fetch(assetsLocation + "assets/data/orders.json").then(res => res.json()),

  // Orders Search List API
  getSearchOrders: (handleId, link_id, searchText, page, rowsPerPage, orderBy, order, userType) => fetch(API_END_POINT + 'search/orders/' + handleId + '?searchStr=' + searchText + '&link_id=' + link_id + '&userType='+ userType + '&pageNumber=' + page + '&pageSize=' + rowsPerPage + '&sortBy=' + orderBy + '&sortdir=' + order).then(res => {
    if (res.type == "cors" && res.url.includes("login.jsp")) {
      console.log("logout URL ", res.status)
      dashboardLogout();
    }
    else {
      return res.json();
    }
  }),

  // getOrdersEventList: (id, arn, eventType, noOfRecords) => fetch(EVENTSTORE_END_POINT + 'event/aggregate/' + id +(arn ? ('&arn=' + arn) : '') + (eventType ? ('&eventType=' + eventType) : '') + (noOfRecords ? ('&noOfRecords=' + noOfRecords) : '')).then(res => res.json()),
  getOrdersEventList: () => fetch(assetsLocation + "assets/data/ordersEventList.json").then(res => {
    if (res.type == "cors" && res.url.includes("login.jsp")) {
      console.log("logout URL ", res.status)
      dashboardLogout();
    }
    else {
      return res.json();
    }
  }),

  // ########## START LOGOUT API ##########

  getLogoutUrl: () => {
    return SSO_REDIRECT_URL + LOGOUT_URL;
  },

  // ########## START UPLOAD USAGES  API ##########

   getUploadUsages: (handleId,link_id, page, rowsPerPage, orderBy, order) => fetch(assetsLocation + 'assets/data/uploadUsageList.json').then(res => res.json()),

  // getUploadUsages: (page, rowsPerPage, orderBy, order) =>
  //   fetch(MEDIATION_SERVICE + "fileUploadHistory?page=" + page + "&size=" + rowsPerPage + "&sort=" + orderBy + "," + order).then(res => {
  //     if (res.type == "cors" && res.url.includes("login.jsp")) {
  //       console.log("logout URL ", res.status)
  //       dashboardLogout();
  //     }
  //     else {
  //       return res.json();
  //     }
  //   }),

  getSearchUploadUsages: (searchText, page, rowsPerPage, orderBy, order) =>
    fetch(MEDIATION_SERVICE + "fileUpload/History?textSearch=" + searchText + "&page=" + page + "&size=" + rowsPerPage + "&sort=" + orderBy + "," + order).then(res => {
      if (res.type == "cors" && res.url.includes("login.jsp")) {
        console.log("logout URL ", res.status)
        dashboardLogout();
      }
      else {
        return res.json();
      }
    }),
  //getSearchUploadUsages: (searchText, page, rowsPerPage, orderBy, order) => fetch(assetsLocation + 'assets/data/searchUsages.json').then(res => res.json()),

  downloadUsages: (selectedTemplate, contractNumber, usageDateType, date) => {
    let downloadUrl;
    downloadUrl = MEDIATION_SERVICE + 'ppu/' + selectedTemplate + '?contractnumber=' + contractNumber + '&' + usageDateType + '=' + date;

 return fetch(downloadUrl, {
      headers: {
        'Access-Control-Expose-Headers': 'ContractNumber'
      }
    }).then(res => {
      if (res.status == 200) {
        window.open(downloadUrl, '_blank');
      }
      else {
        console.log("Error Response", res.status)
        return res;
      }
    });
  },

  getSearchableContractList: (key) => fetch(USAGE_RATING + 'ppu/validate/contract?contractnumber=' + key).then(res => res.json()),
  // getSearchableContractList: (key) => fetch(assetsLocation + "assets/data/usageDownload.json").then(res => res.json()),

  uploads: (contentType, fileName) => {
    console.log('contentType:any,fileToUpload: any', contentType, fileName)
    // let headers = new Headers({ 'enctype': 'multipart/form-data' });
    const formData = new FormData();
    formData.append('file', fileName);
    if (contentType.startsWith('upload/usage')) {
      formData.append('isHistoric', contentType.endsWith('historic') ? 'true' : 'false');
      return fetch(USAGE_COLLECTION + contentType.replace('/historic', ''), {
        method: 'POST', body: formData
      }).then(res => res);
    }
    else {
      return fetch(USAGE_RATING + contentType, {
        method: 'POST', body: formData
      }).then(res => res);
    }
  },

  downloadUsageFile: (filepath) => {
    console.log('filepath in service', filepath);
    const formData = {};
    formData["filePath"] = filepath;
    console.log('Postdata===>', formData);
    return sendHttpRequest('POST', MEDIATION_SERVICE + "downloadFile", formData).then(res => {
      console.log("resp", res)
      return res;
    })
  },

  getSubscriptionUsagesDetails: (subcriptionNo, contractno, startDate, endDate, page, rowsPerPage) => {
    if (subcriptionNo && !contractno) {
      return fetch(MEDIATION_SERVICE + "usages/subscription?subscriptionNumber=" + subcriptionNo + "&usageStartDate=" + startDate + "&usageEndDate=" + endDate + "&page=" + page + "&size=" + rowsPerPage + "&sort=usageStartDate,desc").then(res => res.json())
    }
    else if (!subcriptionNo && contractno) {
      return fetch(MEDIATION_SERVICE + "usages/subscription?contractNumber=" + contractno + "&usageStartDate=" + startDate + "&usageEndDate=" + endDate + "&page=" + page + "&size=" + rowsPerPage + "&sort=usageStartDate,desc").then(res => res.json())
    }
    else if (subcriptionNo && contractno) {
      return fetch(MEDIATION_SERVICE + "usages/subscription?subscriptionNumber=" + subcriptionNo + "&contractNumber=" + contractno + "&usageStartDate=" + startDate + "&usageEndDate=" + endDate + "&page=" + page + "&size=" + rowsPerPage + "&sort=usageStartDate,desc").then(res => res.json())
    }
  },
  //getSubscriptionUsagesDetails: (subcriptionNo,contractno,startDate,endDate, page, rowsPerPage) => fetch(assetsLocation + 'assets/data/subscriptionUsagesList.json').then(res => res.json()),

  ppuUpload: (templateType, fileName, emailId, handleId) => {
    console.log('Email:', emailId);
    console.log('Handle:', handleId);
    const formData = new FormData();
    formData.append('file', fileName);
    if (templateType === 'perDayUsage') {
      return fetch(MEDIATION_SERVICE + 'ppu/upload/usage?email=' + emailId + '&userName=' + handleId, {
        method: 'POST', body: formData
      }).then(res => {
        return res.json();
      });
    }
    else if (templateType === 'perBillcycleUsage') {
      return fetch(MEDIATION_SERVICE + 'ppu/upload/billCycleUsage?email=' + emailId + '&userName=' + handleId, {
        method: 'POST', body: formData
      }).then(res => {
        return res.json();
      });
    }
  },

  downloadUsageDetails: (subcriptionNo, contractno, startDate, endDate, page, rowsPerPage) => {
    let downloadURL;
    if (subcriptionNo && !contractno) {
      downloadURL = MEDIATION_SERVICE + "usages/subscription/download?subscriptionNumber=" + subcriptionNo + "&usageStartDate=" + startDate + "&usageEndDate=" + endDate + "&page=" + page + "&size=" + rowsPerPage + "&sort=usageStartDate,desc";
    }
    else if (!subcriptionNo && contractno) {
      downloadURL = MEDIATION_SERVICE + "usages/subscription/download?contractNumber=" + contractno + "&usageStartDate=" + startDate + "&usageEndDate=" + endDate + "&page=" + page + "&size=" + rowsPerPage + "&sort=usageStartDate,desc";
    }
    else if (subcriptionNo && contractno) {
      downloadURL = MEDIATION_SERVICE + "usages/subscription/download?subscriptionNumber=" + subcriptionNo + "&contractNumber=" + contractno + "&usageStartDate=" + startDate + "&usageEndDate=" + endDate + "&page=" + page + "&size=" + rowsPerPage + "&sort=usageStartDate,desc";
    }
    window.open(downloadURL, '_blank');
  },

  downloadAllSubscriptions: (handleId, linkId, isReseller) => {
    let downloadUrl;
    downloadUrl = API_END_POINT + "subscriptions/download?handleId=" + handleId + (isReseller ? ('&gtm_partner2=' + linkId + '&isReseller=true') : ('&gtm_partner1=' + linkId + '&isReseller=false'));
    window.open(downloadUrl, '_blank');
  },

  validateContractsToDownload: (selectedTemplate, contractsList, usageDateType, date) => {
    let validateUrl;
    validateUrl = MEDIATION_SERVICE + 'ppu/' + selectedTemplate + '/validate?contractnumber=' + contractsList + '&' + usageDateType + '=' + date
    return fetch(validateUrl).then(res => res.json())
  },

  // validateContractsToDownload: (selectedTemplate, contractsList, usageDateType, date) => fetch(assetsLocation + 'assets/data/validatedContracts.json').then(res => res.json()),

  //getUploadFailureReason: (fileNumber) => fetch(assetsLocation + 'assets/data/getFailedReason.json').then(res => res.text()),
  getUploadFailureReason: (fileNumber) => fetch(MEDIATION_SERVICE + 'fileUploadreason?fileId=' + fileNumber).then(res => res.text()),

  validateSubscriptionsToDownload: (selectedTemplate, subscriptionsList, usageDateType, date) => {
    let validateUrl;
    validateUrl = MEDIATION_SERVICE + 'ppu/' + selectedTemplate + '/validateBySubscriptionNumber?subscriptionNumber=' + subscriptionsList + '&' + usageDateType + '=' + date
    return fetch(validateUrl).then(res => res.json())
  },
  // validateSubscriptionsToDownload: (selectedTemplate, subscriptionsList, usageDateType, date) => fetch(assetsLocation + 'assets/data/validatedContracts.json').then(res => res.json()),

  downloadSubscriptionUsages: (selectedTemplate, subscriptionsList, usageDateType, date) => {
    let downloadUrl;
    if (selectedTemplate === 'dailyusage') {
      downloadUrl = MEDIATION_SERVICE + 'ppu/dailyusageBySubscriptionNumber?subscriptionNumber=' + subscriptionsList + '&' + usageDateType + '=' + date;
    } else if (selectedTemplate === 'billcycleusage') {
      downloadUrl = MEDIATION_SERVICE + 'ppu/billcycleusageBySubscriptionNumber?subscriptionNumber=' + subscriptionsList + '&' + usageDateType + '=' + date;
    }
    return fetch(downloadUrl, {
      headers: {
        'Access-Control-Expose-Headers': 'SubscriptionNumber'
      }
    }).then(res => {
      if (res.status == 200) {
        window.open(downloadUrl, '_blank');
      }
      else {
        console.log("Error Response", res.status)
        return res;
      }
    });
  },

   // getContractNoList: (template, soldTo, billingdate) => fetch(assetsLocation + "assets/data/usageDownload.json").then(res => res.json())
   getContractNoList: (template, soldTo, billingdate) =>
   fetch(MEDIATION_SERVICE + 'ppu/' + template + '/contractsFromSoldTo?soldTo=' + soldTo + '&billingdate=' + billingdate).then(res => {
     if (res.type == "cors" && res.url.includes("login.jsp")) {
       console.log("logout URL ", res.status)
       dashboardLogout();
     }
     else {
       return res.json();
     }
   }),

   redirectAcoToRegister: (opportunityNo, contractNumber, userType) => {
    let dealRegistrationUrl;
    if(userType === 'associate'){
     dealRegistrationUrl = INTERNAL_SFDC_DEAL_REGISTRATION_URL + '?c__OppNumber=' + opportunityNo + '&c__ContractNumber=' +contractNumber;
    }else if(userType === 'partner'){
      dealRegistrationUrl = PARTNER_SFDC_DEAL_REGISTRATION_URL + '?c__OppNumber=' + opportunityNo + '&c__ContractNumber=' +contractNumber;
    }
    return dealRegistrationUrl;
  },
}
