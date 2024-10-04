import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Paper, Typography, Divider, Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const columns = [
  {
    field: 'accountNumber',
    headerName: 'Account Number',
    flex: 1,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 0.5,
  },
];

function MuleBridges({ data }) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const handleCellClick = ({ field, formattedValue }) => {
    if (field === 'accountNumber') {
      navigate(`/dashboard/track-people?accountno=${formattedValue}`);
    }
  };

  useEffect(() => {
    setRows(data.muleBridges.map((item) => ({ ...item, id: uuidv4() })));
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelData, 'mule_bridges_data.xlsx');
  };

  return (
    <Paper
      sx={{ width: '95%', padding: '1rem', marginBottom: '2rem' }}
      elevation={0}
    >
      <Typography
        variant="h5"
        fontWeight="700"
        color="primary"
        sx={{ textAlign: 'center' }}
        gutterBottom
      >
        Mule Bridges
      </Typography>
      <Divider />
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        onCellClick={handleCellClick}
        sx={{ height: 'auto', marginTop: '1rem' }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button variant="contained" onClick={exportToExcel} sx={{ mt: '1rem' }}>
          Download Mule Bridges Data
        </Button>
      </Box>
    </Paper>
  );
}

export default MuleBridges;
