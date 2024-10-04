import React, { useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import axios from '../../config/axios';
import { v4 as uuidv4 } from 'uuid';

import { Typography, Grid, Box, Divider } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DataGrid } from '@mui/x-data-grid';
import UploadBtn from '../Dashboard/Upload/UploadBtn';
import { useSnackbar } from 'notistack';
import requests from '../../config/requests';
import { useNavigate } from 'react-router-dom';

const columns = [
  { field: 'accountNumber', headerName: 'Account Number', flex: 1.5 },
  {
    field: 'amount',
    headerName: 'Probable Amount Contribution',
    flex: 1,
  },
];

function SinkHoles({ isPrinting }) {
  const { user, token, getApiHeadersWithToken, userRole } =
    React.useContext(AuthContext);
  const [accounts, setAccounts] = React.useState([]);
  const [account, setAccount] = React.useState('');
  const [sinks, setSinks] = React.useState([]);

  const [files, setFiles] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  React.useEffect(() => {
    try {
      setFiles([]);
      const fetchFiles = async () => {
        const { data, status } = await axios.get(
          requests.getFiles,
          getApiHeadersWithToken()
        );
        if (status === 200) {
          setFiles(data.files);
        }
      };
      fetchFiles();
    } catch (error) {
      enqueueSnackbar('Unable to get files list', { variant: 'error' });
    }
  }, [enqueueSnackbar, setFiles, getApiHeadersWithToken]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.post(
        '/api/getBalanceSheetAnalysis',
        {
          accountId: account,
        },
        getApiHeadersWithToken()
      );

      setSinks(data.data.sinksOfAssets);
    };
    if (account) getData();
  }, [account, getApiHeadersWithToken]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(
        '/api/getAllAccounts',
        getApiHeadersWithToken()
      );
      setAccounts(data.data);
    };

    getData();
  }, []);

  const handleChange = (event) => {
    setAccount(event.target.value);
  };

  const handleClick = (event) => {
    console.log(event);
    navigate(`/dashboard/track-people?accountno=${event.row.accountNumber}`);
  };

  return (
    <>
      <Box
        sx={
          isPrinting
            ? {
                bgcolor: '#F2F7FF',
                width: '100%',
                borderRadius: '1.5rem',
                padding: '1rem',
                textAlign: 'center',
                display: 'none',
              }
            : {
                bgcolor: '#F2F7FF',
                width: '100%',
                borderRadius: '1.5rem',
                padding: '1rem',
                textAlign: 'center',
              }
        }
      >
        <UploadBtn
          setFiles={setFiles}
          files={files}
          balanceStatus={true}
          selectedAccount={account}
        />
      </Box>
      <Box
        sx={{
          bgcolor: '#F2F7FF',
          width: '100%',
          borderRadius: '1.5rem',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="700" color="primary">
          Sink Hole Analysis
        </Typography>
        <Divider sx={{ my: '0.5rem' }}></Divider>
        <FormControl sx={{ width: '50%' }}>
          <InputLabel id="demo-simple-select-label">Account</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={account}
            label="Account"
            onChange={handleChange}
          >
            {accounts.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid
        container
        spacing={1}
        sx={{
          width: '100%',
          justifyContent: 'space-around',
          my: '1rem',
        }}
      >
        {sinks.map((item) => (
          <Grid
            item
            xs={5}
            sx={{
              bgcolor: '#F2F7FF',
              borderRadius: '1.5rem',
              textAlign: 'center',
              padding: '1rem',
			  marginTop: '1rem',
            }}
          >
            <Typography
              variant="h6"
              fontWeight="700"
              color="primary"
              gutterBottom
            >
              Asset Name: {item.assetData.name}
            </Typography>

            <Divider />

            <DataGrid
              rows={item.sinks.map((item) => ({ ...item, id: uuidv4() }))}
              columns={columns}
              onRowClick={handleClick}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              sx={{ height: '50%', marginTop: '1rem' }}
            />

            <Typography
              variant="h6"
              fontWeight="700"
              color="primary"
              sx={{ marginTop: '1rem' }}
            >
              Total Value via Sinks: ₹
              {item.sinks.reduce((accumulator, object) => {
                return accumulator + object.amount;
              }, 0)}
            </Typography>

            <Typography
              variant="h6"
              fontWeight="700"
              color="primary"
              gutterBottom
            >
              Total Asset Value: ₹{item.assetData.amount}
            </Typography>

            <Typography
              variant="h6"
              fontWeight="700"
              color={
                item.sinks.length == 0
                  ? 'orange'
                  : item.assetData.amount <
                    item.sinks.reduce((accumulator, object) => {
                      return accumulator + object.amount;
                    }, 0)
                  ? 'green'
                  : 'red'
              }
            >
              {item.sinks.length == 0
                ? 'No Sinks'
                : item.assetData.amount <
                  item.sinks.reduce((accumulator, object) => {
                    return accumulator + object.amount;
                  }, 0)
                ? 'Possible Money Launder'
                : 'Value Produced by Sinks is less than Value of Asset'}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default SinkHoles;
