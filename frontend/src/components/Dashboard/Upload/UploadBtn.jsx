import { Typography, Button, Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import axios from '../../../config/axios';
import requests from '../../../config/requests';
import AuthContext from '../../../context/AuthContext';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import Switch from '@mui/material/Switch';

function UploadBtn({ setFiles, files, balanceStatus, selectedAccount }) {
  const { userRole, getApiHeadersWithToken } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [date, setDate] = useState('date');
  const [amount, setAmount] = useState('amount');
  const [senderAccount, setSenderAccount] = useState('senderAccount');
  const [receiverAccount, setReceiverAccount] = useState('receiverAccount');
  const [senderName, setSenderName] = useState('senderName');
  const [receiverName, setRecieverName] = useState('receiverName');
  const [useExternalApi, setUseExternalApi] = useState(false);
  const [isCSV, setIsCSV] = useState(false);

  const [fields, setFields] = useState({
    date: 'date',
    amount: 'amount',
    senderAccount: 'senderAccount',
    receiverAccount: 'receiverAccount',
    senderName: 'senderName',
    receiverName: 'receiverName',
  });

  useEffect(() => {
    setFields({
      date: date,
      amount: amount,
      senderAccount: senderAccount,
      senderName: senderName,
      receiverAccount: receiverAccount,
      receiverName: receiverName,
    });
  }, [date, amount, senderAccount, senderName, receiverName, receiverAccount]);

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  const handleFileChange = ({ target }) => {
    setSelectedFile(target.files);
    console.log(target.files);
    // console.log(target.files[0].type);
    if (target.files[0].type === 'text/csv') {
      setIsCSV(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const files in selectedFile) {
      data.append('file', selectedFile[files]);
    }

    try {
      let response;
      if (balanceStatus) {
        if (!selectedAccount)
          return enqueueSnackbar('Please select an account', {
            variant: 'error',
          });
        data.append('accountNumber', selectedAccount);
        response = await axios.post(
          requests.uploadBalanceSheetFile,
          data,
          getApiHeadersWithToken()
        );
        enqueueSnackbar('File uploaded successfully');
        window.location.reload();
      } else {
        data.append('columnNames', JSON.stringify(fields));
        data.append('useExternalApi', JSON.stringify(useExternalApi));
        response = await axios.post(
          requests.uploadFile,
          data,
          getApiHeadersWithToken()
        );
        enqueueSnackbar('File uploaded successfully');
        navigate('/dashboard/formatted-data');
      }
      if (response.data.data !== null && response.data.status === 200) {
        enqueueSnackbar(response.data.message, {
          variant: 'success',
          disableWindowBlurListener: true,
        });
        navigate('/dashboard/formatted-data');
        setFiles([...files, response.data.file]);
        setSelectedFile(null);
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Unable to upload file', { variant: 'error' });
    }
  };

  const generateFileNames = (files) => {
    let fileNames = '';
    if (files.length === 1) return files[0].name;
    for (const file in files) {
      if (files[file]?.name && files[file]?.name !== 'item')
        fileNames += files[file].name + ', ';
    }
    return fileNames.slice(0, -2);
  };

  const handleChange = (event, type) => {
    // const tempField = fields;
    // tempField[type] = event.target.value;
    setFields((prev) => {
      prev[type] = event.target.value;
      return prev;
    });
    console.log(fields);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          borderRadius: '3.125rem',
          border: '1.5px solid #B7202E',
          margin: '0 auto',
          padding: '1.5rem 4rem',
          textAlign: 'center',
        }}
      >
        <label
          htmlFor="fileInput"
          style={{
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <FaCloudUploadAlt size={200} color="#B7202E" />
          <Typography
            children="Kindly Scan or Upload Data Here"
            color="primary"
          />
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .pdf, image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          name="file"
        />

        {selectedFile && (
          <Typography
            variant="subtitle1"
            component="p"
            style={{ marginTop: '10px' }}
          >
            Selected Files: {generateFileNames(selectedFile)}
          </Typography>
        )}

        {selectedFile && !balanceStatus && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '80%',
                gap: '0.5rem',
              }}
            >
              <Typography
                variant="h6"
                component="p"
                style={{ marginBottom: 2 }}
              >
                Fields Replacement
              </Typography>
              <Grid
                container
                gap={2}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Grid item xs={5}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Sender Account Number"
                    value={senderAccount}
                    onChange={(event) => setSenderAccount(event.target.value)}
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Receiver Account Number"
                    value={receiverAccount}
                    onChange={(event) => setReceiverAccount(event.target.value)}
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Amount"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Sender Name"
                    value={senderName}
                    onChange={(event) => setSenderName(event.target.value)}
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Receiver Name"
                    value={receiverName}
                    onChange={(event) => setRecieverName(event.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {selectedFile && (
          <>
            {!isCSV && !balanceStatus && (
              <Typography
                variant="subtitle1"
                component="p"
                style={{ marginTop: '15px', fontWeight: 'bold' }}
              >
                Use External API
                <Switch
                  defaultChecked
                  onChange={() => setUseExternalApi(!useExternalApi)}
                />
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginTop: '10px' }}
            >
              Save Data
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

export default UploadBtn;
