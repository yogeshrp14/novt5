import React, { useState, useEffect } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Loader from '../../components/shared/spinner/spinner'



function desc(a,b,orderBy) {
      if (b[orderBy] < a[orderBy]) {
            return -1
      }
      if (b[orderBy] > a[orderBy]) {
            return 1
      }
      return 0
}

function getSorting(order, orderBy) {
      return order=='desc' ? (a,b)=>desc(a,b,orderBy):(a,b)=>(a,b,orderBy)
}

// Not Understood
// function stableSort(array = [], cmp) {
//       const stabilizedThis = array.map((el, index) => [el, index]);
//       stabilizedThis.sort((a, b) => {
//         const order = cmp(a[0], b[0]);
//         if (order !== 0) return order;
//         return a[1] - b[1];
//       });
//       return stabilizedThis.map(el => el[0]);
//     }

const headCells=[
      { id: 'file_id', numeric: false, disablePadding: false, label: 'File Number' },
      { id: 'total_records', numeric: true, disablePadding: false, label: 'Total' },
      { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
      { id: 'submission_time', numeric: true, disablePadding: false, label: 'Submission Time (UTC)' },
      { id: 'completion_time', numeric: true, disablePadding: false, label: 'Completion Time (UTC)' },
      { id: 'system_type', numeric: true, disablePadding: false, label: 'System Type' },
      { id: 'content_type', numeric: true, disablePadding: false, label: 'Content Type' },
      { id: 'input_file_stored_at', numeric: true, disablePadding: false, label: 'Input File' },
      { id: 'output_file_stored_at', numeric: true, disablePadding: false, label: 'Processed File' },
]

const useStyles=makeStyles({
      root: {
            width: '100%',
          },
      //     paper: {
      //       width: '100%',
      //       marginBottom: theme.spacing(2),
      //     },
        
          table: {
            minWidth: 750
          },
          visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
          },
          customTooltip: {
            backgroundColor: '#6e6767',
            minHeight: '30px',
            fontSize: '12px'
          }
})
      


export default function Uploads(props) {


      const searchBoxStyle = {
            width: '300px',
            borderRadius: '0px',
            height: '39px'
          }
        

  return (
    <div>
    This is NewUpload
    </div>
  );
}
