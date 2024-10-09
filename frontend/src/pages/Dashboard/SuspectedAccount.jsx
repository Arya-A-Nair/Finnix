import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import requests from '../../config/requests';
import axios from '../../config/axios';
import AuthContext from '../../context/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { ImBin } from 'react-icons/im';

function SuspectedAccounts() {
  const [usersList, setUsersList] = useState(null);
  const { getApiHeadersWithToken } = React.useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    try {
      const fetchFiles = () => {
        let data = JSON.parse(
          localStorage.getItem('suspects') == null
            ? '[]'
            : localStorage.getItem('suspects')
        );

        for (let i = 0; i < data.length; i++) {
          data[i].id = i;
        }
        setUsersList(data);
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

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.4,
    },
    {
      field: 'accountNumber',
      headerName: 'Account No',
      flex: 1,
    },
    {
      field: 'accountHolder',
      headerName: 'Account Holder',
      flex: 1,
    },
    {
      field: 'totalDeposits',
      headerName: 'Deposits',
      flex: 1,
    },
    {
      field: 'totalWithdrawals',
      headerName: 'WithDrawals',
      flex: 1,
    },
    {
      field: 'score',
      headerName: 'Score',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Button
            variant="contained"
            color="error"
            startIcon={<ImBin size="16px" />}
            onClick={() => {
              localStorage.setItem(
                'suspects',
                JSON.stringify(
                  usersList.filter(
                    (user) => user.accountNumber !== row.accountNumber
                  )
                )
              );
              window.location.reload();
            }}
          >
            {' '}
            Delete
          </Button>
        );
      },
    },
  ];
  const handleCellClick = (params, event) => {
    if (params.field === 'actions') return;
    navigate(`/dashboard/track-people?accountno=${params.row.accountNumber}`);
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
          disableColumnFilter
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

export default SuspectedAccounts;
