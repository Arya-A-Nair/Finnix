import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import requests from '../../config/requests';
import AuthContext from '../../context/AuthContext';
import { DataGrid } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 1,
  },
  {
    field: 'accountNumber',
    headerName: 'Account Number',
    flex: 1,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
  },
  {
    field: 'openingTime',
    headerName: 'Account Opening Time',
    flex: 1,
  },
];

function FraudAccounts({ data, fraudAccounts }) {
  const navigate = useNavigate();

  const handleRowClick = ({ row }, val) => {
    navigate(`/dashboard/track-people?accountno=${row.accountNumber}`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(fraudAccounts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelData, 'fraud_accounts_data.xlsx');
  };

  return (
    <Box
      sx={{
        bgcolor: '#F2F7FF',
        width: '95%',
        borderRadius: '1.5rem',
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          flexDirection: 'column',
          mt: '0.5rem',
        }}
      >
        <Typography variant="h6" fontWeight="700" color="primary">
          Fraud Accounts
        </Typography>
        <DataGrid
          rows={fraudAccounts || []}
          loading={!data?.fradulentTransaction}
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          disableDensitySelector
          onRowClick={handleRowClick}
          sx={{
            px: '1rem',
            bgcolor: '#F2F7FF',
            '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
              {
                outline: 'none',
              },
          }}
        />
      </Box>
      <Button variant="contained" onClick={exportToExcel} sx={{ mt: '1rem' }}>
        Download Fraud Accounts Data
      </Button>
    </Box>
  );
}

export default FraudAccounts;
