import React, { useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  NodeToolbar,
} from 'reactflow';

import AuthContext from '../../../context/AuthContext';
import axios from '../../../config/axios';
import requests from '../../../config/requests';
import 'reactflow/dist/style.css';
import ReverseNode from '../../CustomNodes/ReverseNode';
// import { MdOutlineZoomOutMap, MdOutlineZoomInMap } from '@mui/icons-material';
import {
  Grid,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Button,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import {
//   templateDataEdges,
//   templateDataNodes,
// } from '../../../templeteData/CashFlowGraphData';
import { useNavigate } from 'react-router-dom';
import MdOutlineZoomOutMap from '@mui/icons-material/ZoomOutMap';

export default function CashFlowGraph({
  defaultEdges,
  defaultNodes,
  style,
  nodeClick,
}) {
  const nodeTypes = useMemo(() => ({ cNode1: ReverseNode }), []);
  const { getApiHeadersWithToken } = React.useContext(AuthContext);
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [frontendData, setFrontendData] = useState('');
  const [selectedNode, setSelectedNode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const handleZoom = () => {
    document.getElementById("mainflow").requestFullscreen();
  }
  useEffect(() => {
    const fetchNodes = async () => {
      const tempNodes = await axios.post(requests.getNodes, {
        nodes: defaultNodes.map(nod => ({
          id: nod.id,
          position: nod.position,

        })),
        edges: defaultEdges
      })
      const data = tempNodes.data.data.map(node => ({
        ...node,
        data: {
          label: (
            <>
              <Typography>{node.id}</Typography>
              {/* <Typography variant="caption">
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
              </Typography> */}
            </>
          ),
        }
      }));
      setNodes(data);
    }
    fetchNodes()
  }, [defaultNodes, defaultEdges, setNodes])
  const handleClick = (event, node) => {
    setSelectedNode(String(node.id));
    if (nodeClick) nodeClick(event, node);
  };
  useEffect(() => {
    if (!selectedNode) return;
    setIsLoading(true);
    const fetchData = async () => {
      const { data } = await axios.get(
        `${requests.getAccountDetails}?accountNumber=${selectedNode}`,
        getApiHeadersWithToken()
      );
      setIsLoading(false);
      setFrontendData({
        'Account Holder': data.details.account.name,
        'Account Number': data.details.account.accountNumber,
        'Total Deposits': data.details.totalDeposits,
        'Total Withdrawals': data.details.totalWithdrawls,
        'Total Transactions': data.details.totalTransactions,
        'Amount Deposited': data.details.totalAmountDeposited,
        'Amount Withdrawn': data.details.totalAmountWithDrawn,
      });
    };
    fetchData();
  }, [selectedNode, getApiHeadersWithToken]);

  return (
    <div style={style}>
      <IconButton onClick={handleZoom}>
        <MdOutlineZoomOutMap />
      </IconButton>
      {/* <MdOutlineZoomInMap /> */}
      <Grid container spacing={2}>
        <Grid
          item
          xs={!nodeClick && selectedNode ? 8 : 12}
          sx={{ height: '40vh', bgcolor: "#fff" }}
          id="mainflow"

        >
          <ReactFlow
            nodes={nodes}
            edges={defaultEdges}
            onNodeClick={handleClick}
            fitView
            showFitView
            nodeTypes={nodeTypes}
          >
            <Controls />

            <NodeToolbar />
          </ReactFlow>
        </Grid>

        {!nodeClick && selectedNode && (
          <Grid item xs={4}>
            <Paper sx={{ height: '100%' }}>
              <Box sx={{ padding: '1rem' }}>
                <Grid container spacing={2}>
                  {/* <Grid item xs={2}>
                            
                                    </Grid> */}
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="700"
                      color="primary"
                      sx={{ textAlign: 'center' }}
                    >
                      User Details
                    </Typography>
                  </Grid>
                </Grid>

                {isLoading && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      my: 0.5,
                      width: '100%',
                      height: '35vh',
                      alignContent: 'center',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                {!isLoading &&
                  Object.keys(frontendData).map((key) => (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        my: 0.5,
                      }}
                      key={key}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        {key}:
                      </Typography>
                      <Typography variant="body1">
                        {frontendData[key]}
                      </Typography>
                    </Box>
                  ))}
                {!isLoading && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(
                          `/dashboard/track-people?accountno=${selectedNode}`
                        );
                      }}
                    >
                      View More Details
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
