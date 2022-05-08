import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Snackbar,
  Box,
  Typography,
  TextField,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import bg from "./images/bank-bg.jpeg";

function Home() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openErr, setOpenErr] = useState(false);
  const [userErr, setUserErr] = useState(false);
  const [pwdErr, setPwdErr] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    setUsername("");
    setPassword("");
    setUserErr(false);
  }, [open]);

  const checkTextNull = () => {
    if (username === "") {
      // || password === "") {
      if (username === "") {
        setUserErr(true);
      } else {
        setUserErr(false);
      }

      // if (password === "") {
      //   setPwdErr(true);
      // } else {
      //   setPwdErr(false);
      // }
      return true;
    }

    return false;
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
      <Box
        sx={{
          backgroundColor: "rgba(0,0,0,0.7)",
          borderRadius: "5px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
          width: "380px",
        }}
      >
        <Typography
          sx={{
            color: "white",
          }}
          variant="h3"
          component="div"
          gutterBottom
        >
          {open ? "Security Bank" : "Register Account"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid white",
            borderRadius: "10px",
            width: "70%",
            padding: "20px",
            paddingTop: "35px",
          }}
        >
          <TextField
            variant="standard"
            name="username"
            placeholder="Enter User Name"
            error={userErr}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            sx={{
              paddingBottom: "10px",
              marginBottom: "10px",
              "& .MuiInput-input": {
                color: "white",
              },
              "& .MuiInput-root:before": {
                borderBottom: "1px solid rgba(255, 255, 255, 0.8)",
              },
              "& .MuiInput-root:after": {
                borderBottom: "2px solid #ce8d0e",
              },
              "& .MuiInput-root:hover": {
                backgroundColor: "rgba(206, 141, 14, 0.26)",
              },
              "& .MuiInput-root:hover:not(.Mui-disabled):before": {
                borderBottom: "1.5px solid rgba(255, 255, 255, 0.8)",
              },
            }}
          />
          <TextField
            variant="standard"
            name="password"
            value={password}
            placeholder="Enter Password"
            type="password"
            error={pwdErr}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            sx={{
              paddingBottom: "10px",
              marginBottom: "10px",
              "& .MuiInput-input": {
                color: "white",
              },
              "& .MuiInput-root:before": {
                borderBottom: "1px solid rgba(255, 255, 255, 0.8)",
              },
              "& .MuiInput-root:hover": {
                backgroundColor: "rgba(206, 141, 14, 0.26)",
              },
              "& .MuiInput-root:hover:not(.Mui-disabled):before": {
                borderBottom: "1.5px solid rgba(255, 255, 255, 0.8)",
              },
              "& .MuiInput-root:after": {
                borderBottom: "2px solid #ce8d0e",
              },
            }}
          />
          <Box
            sx={{
              padding: "10px",
            }}
          >
            {open ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    if (checkTextNull()) {
                      return;
                    }

                    axios
                      .post("/api/login", {
                        username: username,
                        password: password,
                      })
                      .then((res) => {
                        console.log("success login");
                        const token = res.data.accessToken;
                        localStorage.setItem("AuthorizedToken", token);

                        navigate("/account");
                      })
                      .catch((err) => {
                        console.log(err);
                        setOpenErr(true);
                      });
                    console.log(username, password);
                  }}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    ":hover": {
                      border: "1px solid #ce8d0e",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="text"
                  sx={{
                    color: "white",
                    fontSize: "10px",
                    ":hover": {
                      background: "rgba(0,0,0,0)",
                      color: "#ce8d0e",
                    },
                  }}
                  onClick={(e) => {
                    setOpen(false);
                  }}
                >
                  Sign up
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    if (checkTextNull()) {
                      return;
                    }
                    axios
                      .post("/api/register", {
                        username: username,
                        password: password,
                      })
                      .then(() => {
                        console.log("success register");
                        setOpen(true);
                        document.location.reload();
                      })
                      .catch((err) => {
                        console.log(err);
                        setOpenErr(true);
                      });
                    console.log(username, password);
                    // document.location.reload();
                  }}
                  sx={{
                    color: "white",
                    border: "1px solid white",
                    ":hover": {
                      border: "1px solid #ce8d0e",
                    },
                  }}
                >
                  Register
                </Button>

                <Button
                  variant="text"
                  onClick={(e) => {
                    setOpen(true);
                  }}
                  sx={{
                    color: "white",
                    fontSize: "10px",
                    ":hover": {
                      background: "rgba(0,0,0,0)",
                      color: "#ce8d0e",
                    },
                  }}
                >
                  Back
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Snackbar
        severity="error"
        open={openErr}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          Failed login/register
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Home;
