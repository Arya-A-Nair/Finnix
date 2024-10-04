import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Grid, Button } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import axios from "../../config/axios";
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function Report() {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    firstName: '',
    lastName: '',
    bank: '',
    branch: '',
    accNumber: '',
    aadharNumber: '',
    typeFraud: '',
    description: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setValue((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post('/api/submitReport', {
        firstName: value.firstName,
        lastName: value.lastName,
        bankName: value.bank,
        bankBranch: value.branch,
        accountNumber: value.accNumber,
        aadharNumber: value.aadharNumber,
        typeOfFraud: value.typeFraud,
        descriptionOfFraud: value.description,
      });
      if (response.status === 200) {

        enqueueSnackbar("Report Submitted Successfully", { variant: "success" });
        setValue({
          firstName: '',
          lastName: '',
          bank: '',
          branch: '',
          accNumber: '',
          aadharNumber: '',
          typeFraud: '',
          description: '',
        });
        navigate("/");
      }

    } catch (error) {
      console.log(error);
      enqueueSnackbar("Unable to submit report" + error.message, { variant: "error" });
    }
  }

  return (
    <>
      <Box sx={{ pb: 2, px: 2 }} component="form" onSubmit={handleSubmit}>
        <Box display="flex" alignItems="center" flexDirection="column" mb={4}>
          <Typography
            variant="h3"
            color="primary"
            textAlign="center"
            fontWeight={'700'}
          >
            Report Fraud
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: '70%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  name="firstName"
                  id="outlined-required"
                  label="First Name"
                  fullWidth
                  value={value.firstName}
                  onChange={handleChange}
                //   defaultValue="Hello World"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="lastName"
                  required
                  id="outlined-required"
                  label="Last Name"
                  fullWidth
                  value={value.lastName}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="bank"
                  required
                  id="outlined-required"
                  label="Bank Name"
                  fullWidth
                  value={value.bank}
                  onChange={handleChange}
                //   defaultValue="Hello World"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="branch"
                  required
                  id="outlined-required"
                  label="Bank Branch"
                  fullWidth
                  value={value.branch}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="accNumber"
                  required
                  id="outlined-required"
                  label="Account Number"
                  fullWidth
                  value={value.accNumber}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="aadharNumber"
                  required
                  id="outlined-required"
                  label="Aadhar Card Number"
                  fullWidth
                  value={value.aadharNumber}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Type of Fraud
                  </InputLabel>
                  <Select
                    name="typeFraud"
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={value.typeFraud}
                    label="Type of Fraud"
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Debit/Credit Card Fraud'}>
                      Debit/Credit Card Fraud
                    </MenuItem>
                    <MenuItem value={'Email Spoofing'}>
                      Email Spoofing{' '}
                    </MenuItem>
                    <MenuItem value={'Website Fraud'}>Website Fraud</MenuItem>
                    <MenuItem value={'Loan Fraud'}>Loan Fraud </MenuItem>
                    <MenuItem value={'Other'}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  id="outlined-multiline-flexible"
                  label="Description of Fraud"
                  multiline
                  maxRows={4}
                  fullWidth
                  required
                  value={value.description}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button variant="contained" type='submit'>
              Submit Complaint
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
