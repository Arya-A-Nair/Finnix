import React, { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import requests from '../../config/requests';
import axios from '../../config/axios';
import AuthContext from '../../context/AuthContext';
import { enqueueSnackbar } from 'notistack';
import CashFlowGraph from '../../components/CashFlow/CashFlowGraph/CashFlowGraph';
import { useLocation, useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Typography, Divider, Grid } from '@mui/material';

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

function EdgeAnalysis() {
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState(
    useLocation().search.split('=')[1]
  );
  const [usersList, setUsersList] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [text, setText] = useState("Please Select A Transaction")
  const [edges, setEdges] = useState([]);
  const [dataGridEdges, setDataGridEdges] = useState([]);
  const { getApiHeadersWithToken } = React.useContext(AuthContext);

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

  useEffect(() => {
    const set = new Set();
    const Nodes = [];
    var idx = 0,
      j = 1;

    for (let i = 0; i < edges.length; i++) {
      set.add(edges[i].source);
      set.add(edges[i].target);
    }

    for (const item of set) {
      Nodes.push({
        id: item,
        data: { label: item },
        position: { x: idx * 100, y: idx * 75 },
      });

      idx++;
    }

    setNodes(Nodes);
  }, [edges]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!transactionId) return;

      try {
        const { data, status } = await axios.get(
          `${requests.getFlowByTransaction}?transactionId=${transactionId}`,
          getApiHeadersWithToken()
        );
        if (status === 200) {
          const arr = data?.data.map((item) => ({
            id: item._id,
            source: item.senderAccount,
            target: item.receiverAccount,
            label: '₹ ' + item.amount,
            animated: true,
            style: { stroke: 'red' },
          }));

          setEdges(arr);
          setDataGridEdges(data?.data);
          setText(null);
        }
      } catch (error) {
        enqueueSnackbar('Unable to get transactions', { variant: 'error' });
        setText("No transaction found!")
      }
    };
    fetchFiles();

  }, [getApiHeadersWithToken, transactionId]);

  useEffect(() => { console.log(text) }, [text]);


  const handleCellClick = (params) => {
    const { row, field } = params;
    if (field === 'senderAccount') {
      navigate(`/dashboard/track-people?accountno=${row.senderAccount}`);
    } else if (field === 'receiverAccount') {
      navigate(`/dashboard/track-people?accountno=${row.receiverAccount}`);
    } else {
      const fetchFiles = async () => {
        const { data, status } = await axios.get(
          `${requests.getFlowByTransaction}?transactionId=${row._id}`,
          getApiHeadersWithToken()
        );
        if (status === 200) {
          try {
            const fetchFiles = async () => {
              if (!transactionId) return;

              const { data, status } = await axios.get(
                `${requests.getFlowByTransaction}?transactionId=${transactionId}`,
                getApiHeadersWithToken()
              );
              if (status === 200) {
                const arr = data?.data.map((item) => ({
                  id: item._id,
                  source: item.senderAccount,
                  target: item.receiverAccount,
                  label: '₹ ' + item.amount,
                  animated: true,
                  style: { stroke: 'red' },
                }));

                setEdges(arr);
                setDataGridEdges(data?.data);
                setText(null);
              }
            };
            fetchFiles();
          } catch (error) {
            enqueueSnackbar('Unable to get transactions', { variant: 'error' });
            setText("No transaction found!")
          }
        }
      };
      fetchFiles();
    }
    // setMessage(`Movie "${params.row.title}" clicked`);
    console.log(params.row);
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
          bgcolor: '#F2F7FF',
          width: '100%',
          borderRadius: '0.5rem',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="700" color="primary">
          Analysis Report
        </Typography>
        <Divider sx={{ my: '0.5rem' }}></Divider>
        <FormControl sx={{ width: '50%' }}>
          {/* <InputLabel id="demo-simple-select-label">Transaction ID</InputLabel> */}

          <TextField
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={transactionId}
            label="Transaction ID"
            onChange={(event) => {
              setTransactionId(event.target.value);
            }}
          >
            {/* {usersList?.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item._id}
              </MenuItem>
            ))} */}
          </TextField>
        </FormControl>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
      >
        {transactionId && !text ? (
          <CashFlowGraph
            style={{
              height: '100%',
              width: '95%',
            }}
            defaultEdges={edges}
            defaultNodes={nodes}
          // nodeClick={() => console.log()}
          />
        ) : (
          <Box
            sx={{
              width: '95%',
              borderRadius: '0.5rem',
              padding: '1rem',
              textAlign: 'center',
              height: '40vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" fontWeight={600} color={text === "No transaction found!" ? "error" : "primary"}>
              {text}
            </Typography>
          </Box>
        )}
      </Grid>

      <Box
        sx={{
          height: '28vh',
          width: '95%',
          flexDirection: 'column',
          marginTop: '1rem',
        }}
      >
        <DataGrid
          rows={dataGridEdges || []}
          loading={!dataGridEdges}
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableRowSelectionOnClick
          onCellClick={handleCellClick}
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
    </Box>
  );
}

export default EdgeAnalysis;
