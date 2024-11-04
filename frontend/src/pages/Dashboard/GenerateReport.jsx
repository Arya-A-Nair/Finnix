import {
  Box,
  Divider,
  TextField,
  Typography,
  InputAdornment,
  Button,
  Grid,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import PieChartDia from '../../components/Report/PieChartDia';
import CustomChart from '../../components/Report/CustomChart';

import axios from '../../config/axios';
import requests from '../../config/requests';
import AuthContext from '../../context/AuthContext';
import Transactions from '../../components/Report/Transactions';
import Networks from '../../components/Report/Networks';
import MuleBridges from '../../components/Report/MuleBridges';
import Groups from '../../components/Report/Groups';
import SinkHoles from '../../components/Report/SinkHoles';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FraudAccounts from '../../components/Report/FraudAccounts';
import EdgeAnalysis from './EdgeAnalysis';
import { enqueueSnackbar } from 'notistack';
import { BiDownload } from 'react-icons/bi';

function GenerateReport() {
  const [fraud, setFraud] = useState('');
  const [generateReport, setGenerateReport] = useState(false);
  const { getApiHeadersWithToken, user } = React.useContext(AuthContext);
  const [fraudAccounts, setFraudAccounts] = useState(null);

  const [data, setData] = useState(''); //backend data
  const [reportData, setReportData] = useState(); // Report map
  const [chartData, setchartData] = useState([
    { name: 'Safe', value: 50 },
    { name: 'Mule', value: 22 },
    { name: 'Suspected', value: 28 },
  ]); // recharts piechart data
  const [option, setOption] = useState(); //user button click
  const [print, setPrint] = useState(false); //print report
  function handleDownload() {
    setPrint(true);
    setTimeout(() => {
      window.print();
    }, 200);
    window.addEventListener('afterprint', () => {
      setPrint(false);
    });
    return () => {
      window.removeEventListener('beforeprint', () => {
        setPrint(true);
      });
      window.removeEventListener('afterprint', () => {
        setPrint(false);
      });
    };
  }

  function handleClick(iconName) {
    setOption(iconName);
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          requests.getFraudAccounts,
          getApiHeadersWithToken()
        );
        setFraudAccounts(response.data.data);
      };
      fetchData();
    } catch (error) {
      enqueueSnackbar('Failed to fetch fraud accounts', { variant: 'error' });
    }
  }, [getApiHeadersWithToken]);

  useEffect(() => {
    async function handleSubmit() {
      try {
        const response = await axios.post(
          requests.getReportWithBaseAmount,
          { baseAmount: 1000 },
          getApiHeadersWithToken()
        );

        if (response.status === 200) {
          const tempData = response?.data?.data;
          setData(tempData);
          setchartData([
            { name: 'Safe', value: tempData.totalAccounts - tempData.muleLen },
            { name: 'Mule', value: tempData.muleLen },
          ]);
          setGenerateReport(true);
        } else {
          console.error('Failed to fetch report data:', response);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    }
    handleSubmit();
  }, [getApiHeadersWithToken]);

  return (
    <Box
      sx={{
        display: 'flex',
        // height: '90%',
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {option && (
        <Box sx={{ width: '100%', paddingLeft: '2rem' }}>
          <Button
            variant="contained"
            onClick={() => setOption('')}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Box>
      )}

      {generateReport && !option && (
        <Box
          sx={{
            bgcolor: 'background.default',
            width: '95%',
            borderRadius: '1.5rem',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          {/* <Typography
            variant="h5"
            fontWeight="700"
            color="primary"
            gutterBottom
          >
            Generated Analysis Report
          </Typography>

          <Divider /> */}

          <Grid container spacing={2} alignItems="flex-start">
            {data.muleLen > 0 && (
              <Grid item xs={12} sm={12} md={12} lg={5} mt={2}>
                <PieChartDia
                  chartData={chartData}
                  total={data.totalAccounts}
                  totalTitle="Total Accounts"
                />
              </Grid>
            )}
            <Grid item xs={12} sm={12} md={12} lg={7}>
              <CustomChart
                transactions={data?.fradulentTransaction?.length}
                edges={23}
                networks={data.fraudulentNetwork.length}
                bridges={data.muleLen}
                groups={data.fraudulentNetwork.length}
                holes={15}
                fAccounts={fraudAccounts?.length}
                handleClick={handleClick}
              />
            </Grid>
          </Grid>
          {/* <Grid xs="12" mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  marginBottom: '1.5rem',
                  px: '3rem',
                  my: '1rem',
                }}
                onClick={handleDownload}
                startIcon={<BiDownload />}
              >
                Download Report
              </Button>
            </Grid> */}
          {/* </Grid> */}
        </Box>
      )}

      {!generateReport && !option && (
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={50} />
        </Box>
      )}

      {/* selectie render based on the value of option */}
      {(option === 'Transactions' || print) && <Transactions data={data} />}
      {(option === 'Networks' || print) && <Networks data={data} />}
      {(option === 'Mule Bridges' || print) && <MuleBridges data={data} />}
      {(option === 'Groups' || print) && <Groups data={data} />}
      {(option === 'Sink Holes' || print) && (
        <SinkHoles data={data} isPrinting={print} />
      )}
      {(option === 'Fraud Accounts' || print) && (
        <FraudAccounts data={data} fraudAccounts={fraudAccounts} />
      )}
      {(option === 'Edge Analysis' || print) && <EdgeAnalysis />}
    </Box>
  );
}

export default GenerateReport;
