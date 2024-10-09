import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import requests from '../../config/requests';
import axios from '../../config/axios';
import AuthContext from '../../context/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.4,
  },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
    renderCell: (params) => {
      return new Date(params.value).toLocaleDateString();
    },
  },
  {
    field: 'senderAccount',
    headerName: 'Sender Acc No',
    flex: 1,
  },
  {
    field: 'senderName',
    headerName: 'Sender Name',
    flex: 1,
  },
  {
    field: 'receiverAccount',
    headerName: 'Receiver Acc No',
    flex: 1,
  },
  {
    field: 'receiverName',
    headerName: 'Receiver Name',
    flex: 1,
  },
  {
    field: 'amount',
    headerName: 'Amount (INR)',
    flex: 1,
  },
];

function FormatedData() {
  const [usersList, setUsersList] = useState(null);
  const navigate = useNavigate();
  const { getApiHeadersWithToken } = React.useContext(AuthContext);
  const handleCellClick = ({ field, formattedValue, row }) => {
    console.log(row);
    if (field === 'receiverAccount') {
      navigate(`/dashboard/track-people?accountno=${row.receiverAccount}`);
    } else if (field === 'senderAccount') {
      navigate(`/dashboard/track-people?accountno=${row.senderAccount}`);
    } else {
      navigate(`/dashboard/edge-analysis?transactionId=${row._id}`);
    }
  };

  React.useEffect(() => {
    try {
      const fetchFiles = async () => {
        const { data, status } = await axios.get(
          requests.getTransactions,
          getApiHeadersWithToken()
        );
        if (status === 200) {
          setUsersList(data?.data.data);
        }
      };
      fetchFiles();
    } catch (error) {
      enqueueSnackbar('Unable to get files list', { variant: 'error' });
    }
  }, [getApiHeadersWithToken]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(usersList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'data.xlsx');
  };

  return (
    <Box
      style={{
        display: 'flex',
        height: '90%',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          height: '90%',
          width: '95%',
          flexDirection: 'column',
          mt: '0.5rem',
        }}
      >
        <DataGrid
          rows={usersList || []}
          loading={!usersList}
          columns={columns}
          disableColumnSelector
          disableRowSelectionOnClick
          disableDensitySelector
          onCellClick={handleCellClick}
          sx={{
            px: '1rem',
            bgcolor: 'background.default',
            '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
              {
                outline: 'none',
              },
          }}
        />
      </Box>
      <Button variant="contained" onClick={exportToExcel} sx={{ mt: '1rem' }}>
        Download Data
      </Button>
    </Box>
  );
}

export default FormatedData;
