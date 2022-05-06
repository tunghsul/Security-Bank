/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import { Container, TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function Home(props) {
  const [open, setOpen] = useState(false);
  const [username, settUsername] = useState(false);
  const [money, setMoney] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(
        "/api/account",
        {},
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("AuthorizedToken"),
          },
        }
      )
      .then(() => {
        console.log("驗證成功");
        const decoded = jwt_decode(localStorage.getItem("AuthorizedToken"));
        settUsername(decoded.name);
      })
      .catch((err) => {
        navigate("/");
      });
    setOpen(true);
  }, []);

  return (
    <Container>
      <Box>
        <Typography variant="h2" component="div" gutterBottom>
          {open ? "Deposit" : "Withdraw"}
        </Typography>
        <Box>
        <Button onClick={(e)=>{
            setOpen(true);
        }}>Go deposit</Button>
        <Button onClick={(e)=>{
            setOpen(false);
        }}>Go withdraw</Button>
        </Box>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" onChange={(e) => {
            setMoney(e.target.value);
        }}/>
        {open ? (
          <Box>
            <Button
            onClick={(e) => {
                axios
                .post("/api/deposit", {
                    username: username,
                    amount: money,
                },
                {
                    headers: {
                      authorization: "Bearer " + localStorage.getItem("AuthorizedToken"),
                    },
                  })
                .then(() => {
                  console.log("success deposit");
                  setOpen(true);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}>Deposit</Button>
          </Box>
        ) : (
          <Box>
            <Button onClick={(e) => {
                axios
                .post("/api/withdraw", {
                    username: username,
                    amount: money,
                },
                {
                    headers: {
                      authorization: "Bearer " + localStorage.getItem("AuthorizedToken"),
                    },
                  })
                .then(() => {
                  console.log("success deposit");
                  setOpen(true);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}>Withdraw</Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;
