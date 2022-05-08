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
  const [value, setValue] = React.useState(0);
  const divRef = useRef(null);
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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

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
                divRef.current.innerHTML = depositMoney;
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
                      });
                  })
                  .catch((err) => {
                    console.log(err);
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
                divRef.current.innerHTML = withdrawMoney;
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
                      });
                  })
                  .catch((err) => {
                    console.log(err);
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
      <div id="xss" ref={divRef}></div>
    </Container>
  );
}

export default Account;
