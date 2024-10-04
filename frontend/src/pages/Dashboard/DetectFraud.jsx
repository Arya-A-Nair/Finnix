import React, { useState } from "react";
import {
  Divider,
  InputAdornment,
  Typography,
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const textFieldSx = {
  m: 2,
  minWidth: "30%",
  "@media (max-width: 700px)": { minWidth: "90%" },
};

function DetectFraud() {
  const [results, setResults] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const jsonData = JSON.stringify(input);
      const response = await axios.post(
        "https://frauddetection-xnph.onrender.com/",
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.prediction);
      setResults(response.data.prediction);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const [input, setInput] = useState({
    amount: "",
    oldBalanceOrig: "",
    newBalanceOrig: "",
    oldBalanceDest: "",
    newBalanceDest: "",
    step: "",
    type: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "90%",
        width: "100%",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          bgcolor: "#F2F7FF",
          width: "95%",
          borderRadius: "1.5rem",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="700" color="primary">
          Analyze Fraudulent Data using AI
        </Typography>
        <Divider sx={{ my: "0.5rem" }}></Divider>
        <TextField
          label="Transfer Amount"
          id="outlined-start-adornment"
          name="amount"
          value={input.amount}
          onChange={handleInputChange}
          sx={textFieldSx}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />
        <TextField
          label="Old Balance Origin"
          id="outlined-start-adornment"
          name="oldBalanceOrig"
          value={input.oldBalanceOrig}
          onChange={handleInputChange}
          sx={textFieldSx}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />
        <TextField
          label="New Balance Origin"
          id="outlined-start-adornment"
          name="newBalanceOrig"
          value={input.newBalanceOrig}
          onChange={handleInputChange}
          sx={textFieldSx}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />
        <TextField
          label="Old Balance Destination"
          id="outlined-start-adornment"
          name="oldBalanceDest"
          value={input.oldBalanceDest}
          onChange={handleInputChange}
          sx={textFieldSx}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />
        <TextField
          label="New Balance Destination"
          id="outlined-start-adornment"
          name="newBalanceDest"
          value={input.newBalanceDest}
          onChange={handleInputChange}
          sx={textFieldSx}
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />
        <TextField
          label="Time in hours"
          id="outlined-start-adornment"
          name="step"
          value={input.step}
          onChange={handleInputChange}
          sx={textFieldSx}
        />
        <Typography variant="h6" color="primary" my={1}>
          Payment Type
        </Typography>
        <ToggleButtonGroup
          value={input.type}
          onChange={handleInputChange}
          aria-label="text formatting"
          exclusive
          color="primary"
        >
          <ToggleButton value="DEBIT" aria-label="Debit" name="type">
            Debit
          </ToggleButton>
          <ToggleButton value="CASH_IN" aria-label="Cash In" name="type">
            Cash In
          </ToggleButton>
          <ToggleButton value="CASH_OUT" aria-label="Cash Out" name="type">
            Cash Out
          </ToggleButton>
          <ToggleButton
            value="TRANSFER"
            aria-label="Payment Transfer"
            name="type"
          >
            Payment Transfer
          </ToggleButton>
        </ToggleButtonGroup>
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            marginBottom: "1.5rem",
            px: "3rem",
            my: "1rem",
          }}
          onClick={handleSubmit}
        >
          AI Analyze
        </Button>
        <Box
          sx={{
            bgcolor: "#FFF",
            width: "100%",
            borderRadius: "1.5rem",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="700" color="primary">
            Calculated Results
          </Typography>
          <Divider sx={{ my: "0.5rem" }}></Divider>
          {/* show loading if results is undefiend */}
          {results === undefined && isLoading === false ? (
            <Typography variant="h6" color="primary">
              None
            </Typography>
          ) : isLoading === true ? (
            <>
              <CircularProgress />
            </>
          ) : (
            <>
              <Typography variant="h6" color="primary" mt={2} mb={1}>
                The Transaction is most likely {results === "1" ? null : "not "}
                a fraud
              </Typography>
              <Typography variant="h6" color="primary" mt={2} mb={1}>
                Would you like to raise an report to the law authorities?
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Raise Report
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default DetectFraud;
