import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
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
    field: 'senderAccount',
    headerName: 'Sender Acc No',
    flex: 1,
  },
  {
    field: 'receiverAccount',
    headerName: 'Receiver Acc No',
    flex: 1,
  },
  {
    field: 'amount',
    headerName: 'Amount (INR)',
    flex: 1,
  },
];

function Transactions({ data }) {
  const navigate = useNavigate();

  const handleCellClick = ({ field, formattedValue }, val) => {
    if (field === 'senderAccount' || field === 'receiverAccount') {
      navigate(`/dashboard/track-people?accountno=${formattedValue}`);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data?.fradulentTransaction?.map((t, i) => ({ id: i + 1, ...t })) || []
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelData, 'fraudulent_transactions.xlsx');
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
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
          Possibly Fraudulent Transactions
        </Typography>
        <DataGrid
          rows={
            data?.fradulentTransaction?.map((t, i) => ({ id: i + 1, ...t })) ||
            []
          }
          loading={!data?.fradulentTransaction}
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
        <Button variant="contained" onClick={exportToExcel} sx={{ mt: '1rem' }}>
          Download Fraudulent Transactions
        </Button>
      </Box>
    </Box>
  );
}

export default Transactions;
