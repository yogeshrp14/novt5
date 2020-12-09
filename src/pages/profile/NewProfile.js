import React,{useEffect, useState}from 'react'
import Loader from '../../components/shared/spinner/spinner'
import services from '../../components/Services/service'
import {EncryptLocalStorage,DecryptLocalStorage,ValidateLocalStoragealue} from '../../components/shared/local-storage/local-storage'
import { Card } from '@material-ui/core';
import {useHistory} from 'react-router-dom'

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { CardBody } from 'react-simple-card';
// import Card from 'react-simple-card'


function NewProfile(props) {
let [searchText,setSearchText]=useState('')
const [loader, setLoader] = useState(false);
const [noRecords,setNoRecords]=useState(false)
const handleId=DecryptLocalStorage('handleId')
let [searchResult,setSearchResult]=useState([])


let history=useHistory()

useEffect(()=>{
      fetchSearchResult()
      getSearchResultHtml(searchResult)
},[])


let fetchSearchResult=()=>{
    services.getProfileSearchList().then((res)=>{
          setSearchResult(res)
          setLoader(false)
          console.log("result=>",res)
          if (res.length>0) {
                setNoRecords(false)
          } else {
                setNoRecords(true)
          }
    },(error)=>{
          setNoRecords(true)
          errorHandlerFunction(error)
    })
      
}
let getSearchResultHtml =  (results) => {
      return results.filter(show =>
        `${show.linkId} ${show.soldToId} ${show.companyName}`
          .toUpperCase()
          .includes(searchText.toUpperCase())
      ).map((result, index) => <div key={index} className="results" onClick={() => handleOkClick(result.linkId)}>
        <label>
          {result.linkId}({result.soldToId}) - {result.companyName}</label></div>)
    }
  
    const handleOkClick = (profile) => {
      EncryptLocalStorage('linkId', profile);
      EncryptLocalStorage('bpLinkId', profile);
      history.push(`/dashboard/viewquotes`, { profile })
      console.log("Link Id Updated with :", profile)
    }

const errorHandlerFunction=(error)=>{
console.log("error=>",error)
setLoader(false)
}

let handleBackButton=()=>{
      history.pushState('/dashboard/viewquotes')
}


  return (
    <div>
    This is NewProfile
    {/* {Loader ? <Loader /> :null} */}

    {/* Profile Search Block */}
      <div className='profile-heaing'>
            <h2>Profile Search</h2>
      </div>
      <Card className='profile-wrapper'>
      <div className='table-section-search-profile'>
                  <div className="table-search">
  <input className='form-control'  type="text" disabled={!searchResult.length >0} placeholder='Enter here to search profile' value={searchText}  onChange={(event)=>{setSearchText(event.target.value)}}  />
                  </div>
      </div>
      {/* Profile Serach  Result */}
      {getSearchResultHtml(searchText).length!==0 ? (
            <div>
                   <Card>
                         <CardBody>
                               {getSearchResultHtml(searchText)}
                         </CardBody>
                   </Card>
            </div>
      ):''}
      {
            (noRecords || getSearchResultHtml(searchText).length ==0) ? (
                  <div>
                        <Card>
                              <CardBody style={{textAlign:'center'}}>
                                    <span>No Items found</span>
                              </CardBody>
                        </Card>
                  </div>
            ):''
            
      }
      </Card>
      <div className='profile-back-button bordered rounded'>
            <span onClick={handleOkClick}> <ArrowBackIcon /> Back To DashBoard</span>
      </div>


    </div>

    

  )
  }
export default NewProfile