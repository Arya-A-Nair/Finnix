import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  Button,
  Alert,
  ClickAwayListener,
  Tooltip,
  TextField,
  FormControl,
} from '@mui/material';
import axios from '../../config/axios';
import AuthContext from '../../context/AuthContext';
import { DataGrid } from '@mui/x-data-grid';
import CashFlowGraph from '../../components/CashFlow/CashFlowGraph/CashFlowGraph';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import requests from '../../config/requests';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsFillFlagFill } from 'react-icons/bs';
import { BiHistory, BiInfoCircle } from 'react-icons/bi';
import { enqueueSnackbar } from 'notistack';

const columns = [
  { field: '_id', headerName: 'Transaction ID', flex: 1 },
  {
    field: 'senderAccount',
    headerName: 'Sender',
    flex: 1,
  },
  {
    field: 'receiverAccount',
    headerName: 'Receiver',
    flex: 1,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 1,
  },
];

function TrackPeople() {
  const navigate = useNavigate();
  const [account, setAccount] = React.useState(
    useLocation().search.split('=')[1]
  );
  const [accounts, setAccounts] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const { getApiHeadersWithToken } = React.useContext(AuthContext);
  const [frontendData, setFrontendData] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isSuspect, setIsSuspect] = useState(false);
  const [text, setText] = useState('Please input account number');
  useEffect(() => {
    const localStorageSuspects = JSON.parse(localStorage.getItem('suspects'));
    if (localStorageSuspects && frontendData) {
      const isAccountInSuspects = localStorageSuspects.some(
        (oneAccount) =>
          oneAccount.accountNumber === frontendData['Account Number']
      );
      setIsSuspect(isAccountInSuspects);
    }
  }, [frontendData, isSuspect]);

  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(
        '/api/getAllAccounts',
        getApiHeadersWithToken()
      );
      setAccounts(data.data.data);
    };

    getData();
  }, [getApiHeadersWithToken]);

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

  useEffect(() => {
    const getTransactions = async () => {
      if (!account) return;
      try {
        setTransactions([]);
        setSelectedNode(null);
        const data = await axios.get(
          '/api/trackSender?accountNumber=' + account,
          getApiHeadersWithToken()
        );
        setTransactions(data.data.data);
        const arr = data.data.data;
        const arr2 = arr.map((item) => ({
          id: item._id,
          source: item.senderAccount,
          target: item.receiverAccount,
          label: '₹ ' + item.amount,
          animated: true,
          style: { stroke: 'red' },
        }));
        setEdges(arr2);
        setText(null);
      } catch (error) {
        enqueueSnackbar(
          'Error Fetching Transactions. Please check account number ',
          {
            variant: 'error',
          }
        );
        setText('No account found!');
      }
    };
    getTransactions();
  }, [account, getApiHeadersWithToken]);

  const query = new URLSearchParams(useLocation().search);
  useEffect(() => {
    const accountno = query.get('accountno');
    if (accountno) {
      setSelectedNode(accountno);
    }

    if (
      accounts &&
      accounts.indexOf(accountno) !== -1 &&
      accountno !== account
    ) {
      setAccount(accountno, query);
    }
  }, [useLocation().search, query, accounts, account]);

  const getBranch = async (accountNumber) => {
    const response = await axios.get(
      `${requests.getBranch}?accountNumber=${accountNumber}`
    );
    return response.data.data;
  };

  useEffect(() => {
    if (!selectedNode) return;
    const fetchData = async () => {
      setFrontendData(null);
      setIsLoading(true);
      const { data } = await axios.get(
        `${requests.getAccountDetails}?accountNumber=${selectedNode}`,
        getApiHeadersWithToken()
      );
      setFrontendData({
        'CVSS Score': data.details.score.toFixed(2),
        isFlagged: data.details?.frauds.length
          ? data.details?.frauds[0]['Type of Fraud']
          : 'None Reported',
        'Account Holder': data.details.account.name,
        'Account Number': data.details.account.accountNumber,
        'Bank Name': data.details?.frauds.length
          ? data.details?.frauds[0]['Bank Name']
          : await getBranch(data.details.account.accountNumber),
        'Total Deposits': data.details.totalDeposits,
        'Total Withdrawals': data.details.totalWithdrawls,
        'Total Transactions': data.details.totalTransactions,
        'Total Amount Deposit': data.details.totalAmountDeposited,
        'Total Amount Withdrawn': data.details.totalAmountWithDrawn,
      });
      setIsLoading(false);
    };
    fetchData();
  }, [selectedNode, getApiHeadersWithToken]);

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
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleChange = (event) => {
    setAccount(event.target.value);
  };

  const handleClick = (event, node) => {
    console.log('hello', node);

    setSelectedNode(String(node.id));
  };
  const handleTableCellClick = (params) => {
    console.log(params);
    const { field, formattedValue, row } = params;
    if (field === 'senderAccount' || field === 'receiverAccount') {
      setAccount(formattedValue);
    } else {
      navigate(`/dashboard/edge-analysis?transactionId=${row._id}`);
    }
  };
  function addSuspect(account) {
    if (localStorage.getItem('suspects') === null) {
      localStorage.setItem('suspects', JSON.stringify([account]));
    } else {
      let currentSuspects = JSON.parse(localStorage.getItem('suspects'));
      currentSuspects.push(account);
      localStorage.setItem('suspects', JSON.stringify(currentSuspects));
    }
  }

  function removeSuspect(accountNo) {
    let currentSuspects = JSON.parse(localStorage.getItem('suspects'));
    let indexOfAccount;
    currentSuspects.find((oneAccount, element) => {
      if (oneAccount.accountNumber === accountNo) {
        indexOfAccount = element;
        return true;
      }
    });
    currentSuspects.splice(indexOfAccount, 1);
    localStorage.setItem('suspects', JSON.stringify(currentSuspects));
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.default',
          width: '100%',
          borderRadius: '1.5rem',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        {/* <Typography variant="h5" fontWeight="700" color="primary">
          Analysis Report
        </Typography>
        <Divider sx={{ my: '0.5rem' }}></Divider> */}
        <FormControl sx={{ width: '50%' }}>
          {/* <InputLabel id="demo-simple-select-label">Account</InputLabel> */}

          <TextField
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={account}
            label="Account"
            onChange={handleChange}
          >
            {/* {accounts.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))} */}
          </TextField>
        </FormControl>
      </Box>
      <Box sx={{ width: '100%', marginTop: '0.5rem' }}>
        <Box>
          <Grid container spacing={3}>
            <Grid
              item
              xs={7}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
              }}
            >
              {account && !text ? (
                <CashFlowGraph
                  style={{
                    height: 'calc(100vh - 17.5rem)',
                    width: '100%',
                  }}
                  defaultEdges={edges}
                  defaultNodes={nodes}
                  nodeClick={handleClick}
                />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color={text === 'No account found!' ? 'error' : 'primary'}
                  >
                    {text}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={5}>
              <Paper sx={{ height: 'calc(100vh - 230px)', padding: '1rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {selectedNode && (
                    <IconButton
                      onClick={() => setSelectedNode('')}
                      sx={{ mr: 1 }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  <Typography variant="h5" fontWeight={600} color="primary">
                    {!selectedNode ? 'Transactions' : 'Account Details'}
                  </Typography>
                </Box>
                <Divider />
                {!selectedNode ? (
                  <DataGrid
                    rows={transactions}
                    columns={columns}
                    sx={{ marginTop: 2 }}
                    autoHeight
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    pageSizeOptions={[5]}
                    onCellClick={handleTableCellClick}
                    disableRowSelectionOnClick
                  />
                ) : (
                  <Box my={1}>
                    {isLoading ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <>
                        {Object.keys(frontendData).map((key) =>
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
                                  sx={{
                                    width: '100%',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      width: '370px',
                                    }}
                                  >
                                    <Typography>
                                      Vulnerability Score: {frontendData[key]}
                                    </Typography>
                                    <ClickAwayListener
                                      onClickAway={handleTooltipClose}
                                    >
                                      <Tooltip
                                        PopperProps={{
                                          disablePortal: true,
                                        }}
                                        onClose={handleTooltipClose}
                                        open={open}
                                        disableFocusListener
                                        disableHoverListener
                                        disableTouchListener
                                        title="The likelyhook of an account to be fraudulent. The higher the score the more chances of it being fraudulent."
                                      >
                                        <Button onClick={handleTooltipOpen}>
                                          <BiInfoCircle />
                                        </Button>
                                      </Tooltip>
                                    </ClickAwayListener>
                                  </Box>
                                </Alert>
                              ) : (
                                <>
                                  <Typography variant="body1" fontWeight={600}>
                                    {key}:
                                  </Typography>
                                  <Typography variant="body1">
                                    {frontendData[key]}
                                  </Typography>
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
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mt: 1,
                            gap: 2,
                          }}
                        >
                          <Link
                            to={`/dashboard/view-history?accountno=${frontendData['Account Number']}`}
                          >
                            <Button
                              variant="contained"
                              startIcon={<BiHistory />}
                            >
                              View History
                            </Button>
                          </Link>
                          {console.log(isSuspect)}
                          {isSuspect ? (
                            <Button
                              variant="contained"
                              startIcon={<BsFillFlagFill />}
                              color="error"
                              onClick={() => {
                                removeSuspect(frontendData['Account Number']);
                                setIsSuspect(false);
                              }}
                            >
                              Remove from Suspects
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              startIcon={<BsFillFlagFill />}
                              color="error"
                              onClick={() => {
                                addSuspect({
                                  accountNumber: frontendData['Account Number'],
                                  accountHolder: frontendData['Account Holder'],
                                  totalDeposits: frontendData['Total Deposits'],
                                  totalWithdrawals:
                                    frontendData['Total Withdrawals'],
                                  score: frontendData['CVSS Score'],
                                });
                                setIsSuspect(true);
                              }}
                            >
                              Add to Suspects
                            </Button>
                          )}
                        </Box>
                      </>
                    )}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default TrackPeople;
