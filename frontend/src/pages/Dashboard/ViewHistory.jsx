import React, { useEffect, useState } from 'react';
import { Box, Button, Alert, Typography } from '@mui/material';
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

function ViewHistory() {
  const [usersList, setUsersList] = useState(null);
  const { getApiHeadersWithToken } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [frontendData, setFrontendData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCellClick = ({ field, formattedValue }) => {
    if (field === 'senderAccount' || field === 'receiverAccount') {
      navigate(`/dashboard/track-people?accountno=${formattedValue}`);
    }
  };

  useEffect(() => {
    try {
      const fetchTransactions = async () => {
        const { data, status } = await axios.get(
          requests.getTransactions,
          getApiHeadersWithToken()
        );

        if (status === 200) {
          const urlSearchParams = new URLSearchParams(window.location.search);
          const accountNumber = urlSearchParams.get('accountno');
          if (accountNumber) {
            const filteredTransactions = data?.data.data.filter(
              (transaction) => {
                return (
                  transaction.senderAccount === accountNumber ||
                  transaction.receiverAccount === accountNumber
                );
              }
            );
            setUsersList(filteredTransactions);
          } else {
            setUsersList(data?.data.data);
          }
        }
      };

      fetchTransactions();
    } catch (error) {
      enqueueSnackbar('Unable to get transactions', { variant: 'error' });
    }
  }, [getApiHeadersWithToken]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const accountNumber = urlSearchParams.get('accountno');
    const fetchData = async () => {
      setFrontendData(null);
      setIsLoading(true);
      const { data } = await axios.get(
        `${requests.getAccountDetails}?accountNumber=${accountNumber}`,
        getApiHeadersWithToken()
      );
      setFrontendData({
        'Account Holder': data.details.account.name,
        'Account Number': data.details.account.accountNumber,
        'Bank Name': data.details?.frauds.length
          ? data.details?.frauds[0]['Bank Name']
          : '-',
        'Total Deposits': data.details.totalDeposits,
        'Total Withdrawals': data.details.totalWithdrawls,
        'Total Transactions': data.details.totalTransactions,
        'Total Amount Deposit': data.details.totalAmountDeposited,
        'Total Amount Withdrawn': data.details.totalAmountWithDrawn,
        'CVSS Score': data.details.score.toFixed(2),
        isFlagged: data.details?.frauds.length
          ? data.details?.frauds[0]['Type of Fraud']
          : 'None Reported',
      });
      setIsLoading(false);
    };
    fetchData();
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

  const getColorCode = (value) => {
    console.log(value);
    if (value >= 0 && value <= 5) {
      return 'success';
    } else if (value > 5 && value <= 7) {
      return 'warning';
    } else if (value > 7 && value <= 10) {
      return 'error';
    }
    return 'info';
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
      {frontendData &&
        Object.keys(frontendData).map((key) =>
          key !== 'isFlagged' ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                my: 1,
              }}
              key={key}
            >
              {key === 'CVSS Score' ? (
                <Alert
                  severity={getColorCode(frontendData[key])}
                  sx={{ width: '100%' }}
                >
                  CVSS Score: {frontendData[key]}
                </Alert>
              ) : (
                <>
                  <Typography variant="body1" fontWeight={600}>
                    {key}:
                  </Typography>
                  <Typography variant="body1">{frontendData[key]}</Typography>
                </>
              )}
            </Box>
          ) : (
            <Alert severity="error" sx={{ mt: 1 }} key={key}>
              Committed crime — {frontendData[key]}
            </Alert>
          )
        )}
      <Box
        sx={{
          height: '50%',
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

export default ViewHistory;
