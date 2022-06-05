import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bg from "./images/atm-bg.jpg";
import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Account(props) {
  const [username, settUsername] = useState(false);
  const [depositMoney, setDepositMoney] = useState(0);
  const [withdrawMoney, setWithdrawMoney] = useState(0);
  const [balance, setBalance] = useState(0);
  const [value, setValue] = useState(0);
  const [openErr, setOpenErr] = useState(false);
  const [openErrMsg, setOpenErrMsg] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openSuccessMsg, setOpenSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/account", {
        headers: {
          authorization: "Bearer " + localStorage.getItem("AuthorizedToken"),
        },
      })
      .then((res) => {
        console.log("驗證成功");
        // const decoded = jwt_decode(localStorage.getItem("AuthorizedToken"));
        // settUsername(decoded.name);
        const name = res.data.user;
        settUsername(name);
        const balance = res.data.balance;
        setBalance(balance);
      })
      .catch((err) => {
        navigate("/");
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container
      sx={{
        background: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "@media (min-width: 1200px)": {
          maxWidth: "100%",
        },
      }}
    >
      <Box>
        <Typography sx={{ color: "white" }} variant="h3">
          {username}'s Balance
        </Typography>
        <Typography sx={{ color: "white", paddingTop: "20px" }} variant="h4">
          ${balance}
        </Typography>
      </Box>
      <Box
        sx={{
          border: "1px solid white",
          height: "300px",
          marginRight: "150px",
          marginLeft: "150px",
        }}
      />
      <Box
        sx={{
          width: "30%",
          background: "rgba(0,0,0,0.6)",
          padding: "10px",
          borderRadius: "5px",
          color: "white",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              color: "white",
              "& .MuiTab-root.Mui-selected": {
                color: "white",
              },
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.5)",
              },
            }}
          >
            <Tab label="Deposit" {...a11yProps(0)} />
            <Tab label="Withdraw" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <FormControl
            fullWidth
            sx={{ m: 1, background: "white" }}
            variant="filled"
          >
            <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
            <FilledInput
              id="filled-adornment-amount"
              onChange={(e) => {
                setDepositMoney(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl>
          <Box>
            <Button
              onClick={(e) => {
                // divRef.current.innerHTML = depositMoney;
                axios
                  .post(
                    "/api/deposit",
                    {
                      username: username,
                      amount: depositMoney,
                    },
                    {
                      headers: {
                        authorization:
                          "Bearer " + localStorage.getItem("AuthorizedToken"),
                      },
                    }
                  )
                  .then(() => {
                    console.log("success deposit");

                    axios
                      .get("/api/account", {
                        headers: {
                          authorization:
                            "Bearer " + localStorage.getItem("AuthorizedToken"),
                        },
                      })
                      .then((res) => {
                        const balance = res.data.balance;
                        setBalance(balance);
                        setOpenSuccessMsg("Successfully deposit the money");
                        setOpenSuccess(true);
                      })
                      .catch((err) => {
                        console.log(err);
                        setOpenErrMsg("Failed loading the balance");
                        setOpenErr(true);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                    const data = err.response.data;
                    const status = err.response.status;
                    if (status === 400) {
                      setOpenErrMsg("Failed deposit: invalid input");
                    } else {
                      setOpenErrMsg("Failed deposit: " + data);
                    }
                    setOpenErr(true);
                  });
              }}
              sx={{
                color: "white",
              }}
            >
              Submit
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <FormControl
            fullWidth
            sx={{ m: 1, background: "white" }}
            variant="filled"
          >
            <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
            <FilledInput
              id="filled-adornment-amount"
              onChange={(e) => {
                setWithdrawMoney(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl>
          <Box>
            <Button
              onClick={(e) => {
                // divRef.current.innerHTML = withdrawMoney;
                axios
                  .post(
                    "/api/withdraw",
                    {
                      username: username,
                      amount: withdrawMoney,
                    },
                    {
                      headers: {
                        authorization:
                          "Bearer " + localStorage.getItem("AuthorizedToken"),
                      },
                    }
                  )
                  .then(() => {
                    console.log("success withdraw");

                    axios
                      .get("/api/account", {
                        headers: {
                          authorization:
                            "Bearer " + localStorage.getItem("AuthorizedToken"),
                        },
                      })
                      .then((res) => {
                        const balance = res.data.balance;
                        setBalance(balance);
                        setOpenSuccessMsg("Successfully withdraw the money");
                        setOpenSuccess(true);
                      })
                      .catch((err) => {
                        console.log(err);
                        setOpenErrMsg("Failed loading the balance");
                        setOpenErr(true);
                      });
                  })
                  .catch((err) => {
                    const data = err.response.data;
                    const status = err.response.status;
                    if (status === 400) {
                      setOpenErrMsg("Failed withdraw: Invalid Input");
                    } else {
                      setOpenErrMsg("Failed withdraw: " + data);
                    }
                    setOpenErr(true);
                  });
              }}
              sx={{
                color: "white",
              }}
            >
              Submit
            </Button>
          </Box>
        </TabPanel>
      </Box>
      {/* <div id="xss" ref={divRef} style={{ display: "none" }}></div> */}
      <Snackbar
        open={openErr}
        autoHideDuration={6000}
        onClose={() => {
          setOpenErr(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {openErrMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={() => {
          setOpenSuccess(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {openSuccessMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Account;
