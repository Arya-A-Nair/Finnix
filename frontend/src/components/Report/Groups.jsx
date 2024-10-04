import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Paper, Typography, Divider, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CashFlowGraph from '../../components/CashFlow/CashFlowGraph/CashFlowGraph';

function Groups({ data }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const arr = [];
    const arr2 = [];
    const arr3 = [];

    for (let i in data.fraudulentGroups) {
      // console.log(data.fraudulentGroups[i]);
      const Nodes = [];
      const Edges = [];
      let idx = 0;

      for (const item of data.fraudulentGroups[i].accountNumbers) {
        Nodes.push({
          id: item,
          data: { label: item },
          position: { x: idx * 100, y: idx % 2 ? -50 : 50 },
        });

        idx++;
      }

      for (const item of data.fraudulentGroups[i].transaction) {
        Edges.push({
          id: item.id,
          source: item.senderAccount,
          target: item.receiverAccount,
          label: '₹ ' + item.amount,
          animated: true,
          style: { stroke: 'red' },
        });
      }
      arr.push(Nodes);
      arr2.push(Edges);
      arr3.push(data.fraudulentGroups[i].totalAmount);
    }
    setDetails(arr3);
    setNodes(arr);
    setEdges(arr2);
  }, [data]);

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
        Groups
      </Typography>

      <Divider />

      {nodes.map((item, id) => (
        <Box
          sx={{
            padding: '1rem',
            bgcolor: 'white',
            marginTop: '1rem',
            borderRadius: '1rem',
          }}
        >
          <Typography
            variant="h6"
            fontWeight="700"
            color="primary"
            sx={{ textAlign: 'center' }}
            gutterBottom
          >
            Group {id + 1}
          </Typography>
          <Divider />
          <CashFlowGraph
            style={{
              height: '50vh',
              width: '100%',
              marginTop: '2rem',
            }}
            defaultEdges={edges[id]}
            defaultNodes={item}
          />
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Typography fontWeight={600}>Total Amount:&nbsp;</Typography>
            <Typography fontWeight={500}>{details[id]}</Typography>
          </Box>
        </Box>
      ))}
    </Paper>
  );
}

export default Groups;
