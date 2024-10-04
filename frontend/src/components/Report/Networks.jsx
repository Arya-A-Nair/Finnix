import React, { useState, useEffect } from 'react';
import CashFlowGraph from '../../components/CashFlow/CashFlowGraph/CashFlowGraph';
import { Typography, Paper, Divider, Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useGridStatePersistence } from '@mui/x-data-grid/internals';
import { v4 as uuidv4 } from 'uuid';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const columns = [
  {
    field: 'senderAccount',
    headerName: 'Sender Account No',
    flex: 1,
  },
  {
    field: 'receiverAccount',
    headerName: 'Receiver Account No',
    flex: 1,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 0.5,
  },
];

function Networks({ data }) {
  const navigate = useNavigate();
  const handleCellClick = ({ field, formattedValue }) => {
    if (field === 'senderAccount' || field === 'receiverAccount') {
      navigate(`/dashboard/track-people?accountno=${formattedValue}`);
    }
  };
  const [edges, setEdges] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const arr = data.fraudulentNetwork.map((item) => ({
      id: item._id,
      source: item.senderAccount,
      target: item.receiverAccount,
      label: '₹ ' + item.amount,
      animated: true,
      style: { stroke: 'red' },
    }));

    setRows(data.fraudulentNetwork.map((item) => ({ ...item, id: uuidv4() })));
    setEdges(arr);
  }, []);

  useEffect(() => {
    const set = new Set();
    const Nodes = [];
    var idx = 0;

    for (let i = 0; i < edges.length; i++) {
      set.add(edges[i].source);
      set.add(edges[i].target);
    }

    for (const item of set) {
      Nodes.push({
        id: item,
        data: { label: item },
        position: { x: idx * 100, y: idx % 2 ? -50 : 50 },
      });

      idx++;
    }

    setNodes(Nodes);
  }, [edges]);

  //   const handleClick = (event, node) => {
  //     console.log(node);
  //     // setSelectedNode(String(node.id));
  //   };

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
    saveAs(excelData, 'fraudulent_network_data.xlsx');
  };

  return (
    <Paper
      sx={{
        width: '95%',
        padding: '1rem',
        marginBottom: '2rem',
      }}
      elevation={0}
    >
      <Typography
        variant="h5"
        fontWeight="700"
        color="primary"
        sx={{ textAlign: 'center' }}
        gutterBottom
      >
        Fraudulent Network
      </Typography>

      <Divider />

      <Box
        sx={{
          padding: '1rem',
          bgcolor: 'white',
          marginTop: '1rem',
          borderRadius: '1rem',
        }}
      >
        <CashFlowGraph
          style={{
            height: '50vh',
            width: '100%',
            marginTop: '2rem',
          }}
          defaultEdges={edges}
          defaultNodes={nodes}
          // nodeClick={handleClick}
        />
      </Box>

      <Divider />

      <DataGrid
        rows={rows}
        columns={columns}
        onCellClick={handleCellClick}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
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
          Download Fraudulent Network Data
        </Button>
      </Box>
    </Paper>
  );
}

export default Networks;
