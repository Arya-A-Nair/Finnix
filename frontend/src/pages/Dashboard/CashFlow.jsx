import React from 'react';
import CashFlowGraph from '../../components/CashFlow/CashFlowGraph/CashFlowGraph';
import axios from '../../config/axios';
import requests from '../../config/requests';
import AuthContext from '../../context/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { useNodesState, useEdgesState } from 'reactflow';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CashFlow() {
  const { getApiHeadersWithToken } = React.useContext(AuthContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rows, setRows] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [selectedNode, setSelectedNode] = React.useState('');
  const [frontendData, setFrontendData] = useState(null);
  const [details, setDetails] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedNode) return;
    const fetchData = async () => {
      setIsLoading(true);
      const { data } = await axios.get(
        `${requests.getAccountDetails}?accountNumber=${selectedNode}`,
        getApiHeadersWithToken()
      );
      setDetails(data.details);
      setFrontendData({
        'Account Holder': data.details.account.name,
        'Account Number': data.details.account.accountNumber,
        'Total Deposits': data.details.totalDeposits,
        'Total Withdrawals': data.details.totalWithdrawls,
        'Total Transactions': data.details.totalTransactions,
        'Amount Deposited': data.details.totalAmountDeposited,
        'Amount Withdrawn': data.details.totalAmountWithDrawn,
      });
      setIsLoading(false);
    };
    fetchData();
  }, [selectedNode, getApiHeadersWithToken]);

  const handleClick = (event, node) => {
    setSelectedNode(String(node.id));
  };

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
        data: {
          label: (
            <>
              <Typography>{item}</Typography>
              <Typography variant="caption">
                <Typography display="inline" fontWeight="400">
                  Name:
                </Typography>
                {
                  responseData.find(
                    (r) =>
                      r.senderAccount === item
                  )?.senderName || responseData.find((r) => r.receiverAccount === item)
                    ?.receiverName
                }
              </Typography>
            </>
          ),
        },
        position: { x: idx * 100, y: (idx % 5) * 100 },
      });

      idx++;
    }

    setNodes(Nodes);
  }, [edges, setNodes]);

  const handleChange = (obj, exists) => {
    if (!exists) setEdges([...edges, obj]);
    else {
      const arr = edges.filter((item) => item.id !== obj.id);
      setEdges(arr);
    }
  };
  const handleCellClick = (params) => {
    const { field, row } = params;
    if (field === 'source') {
      navigate(`/dashboard/track-people?accountno=${row.source}`);
    } else if (field === 'target') {
      navigate(`/dashboard/track-people?accountno=${row.target}`);
    } else if (field === 'id' || field === 'label') {
      navigate(`/dashboard/edge-analysis?transactionId=${row.id}`);
    }
  }
  const columns = [
    {
      field: 'id',
      headerName: 'Transaction ID',
      flex: 1,
    },
    {
      field: 'source',
      headerName: 'Sender',
      flex: 1,
    },
    {
      field: 'target',
      headerName: 'Receiver',
      flex: 1,
    },
    {
      field: 'label',
      headerName: 'Amount',
      flex: 1,
    },
    {
      field: 'select',
      headerName: 'Select / Remove',
      renderCell: (rowData) => {
        const searchId = rowData.row.id;
        const exists = edges.some((obj) => obj.id === searchId);
        return (
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleChange(rowData.row, exists)}
          >
            {exists ? 'Remove' : 'Add'}
          </Button>
        );
      },
      flex: 0.75,
    },
  ];

  React.useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          requests.getTransactions,
          getApiHeadersWithToken()
        );
        const arr = response.data.data.data;
        var Edges = arr.map((item, id) => ({
          id: item._id,
          source: item.senderAccount,
          target: item.receiverAccount,
          label: '₹ ' + item.amount,
          animated: true,
          style: { stroke: 'red' },
        }));

        setEdges(Edges);
        setRows(Edges);

        setResponseData(response.data.data.data);
      };
      fetchData();
    } catch (error) {
      enqueueSnackbar('Unable to get transactions list', { variant: 'error' });
    }
  }, [getApiHeadersWithToken, setEdges]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <CashFlowGraph
          style={{
            height: '100%',
            width: '100%',
          }}
          defaultEdges={edges}
          defaultNodes={nodes}
          nodeClick={handleClick}
        />
        <Box
          sx={{
            padding: '1rem',
            bgcolor: '#F2F7FF',
            transition: 'all 0.3s',
            width: '500px',
            minHeight: '40vh',
            height: 'auto',
            borderRadius: '0.5rem',
          }}
          style={{
            transform: selectedNode ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => { setSelectedNode(null); setFrontendData({}); }} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700} color="primary">
              User Details
            </Typography>
          </Box>
          <Divider />
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                marginTop: '2rem',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {Object.keys(frontendData).map((key) => {
                return <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    my: 0.5,
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {key}:
                  </Typography>
                  <Typography variant="body1">{frontendData[key]}</Typography>
                </Box>
              })}
              {selectedNode && (
                <Button
                  sx={{
                    marginTop: '0.2rem auto',
                    width: '100%',
                  }}
                  variant="contained"
                  onClick={() => {
                    navigate(
                      `/dashboard/track-people?accountno=${selectedNode}`
                    );
                  }}
                >
                  View More Details
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>

      <Grid container padding={1} sx={{ height: '45vh' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          sx={{ width: '100%', height: '45vh' }}
          onCellClick={handleCellClick}
          disableRowSelectionOnClick
        />
      </Grid>
    </>
  );
}

export default CashFlow;
