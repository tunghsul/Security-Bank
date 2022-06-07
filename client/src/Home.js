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
import aes from "crypto-js/aes";

function Home() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openErr, setOpenErr] = useState(false);
  const [openErrMsg, setOpenErrMsg] = useState("");
  const [userErr, setUserErr] = useState(false);
  const [userSyntaxErrMsg, setUserSyntaxErrMsg] = useState("");
  const [pwdErr, setPwdErr] = useState(false);
  const [pwdSyntaxErrMsg, setPwdSyntaxErrMsg] = useState("");
  const [balance, setBalance] = useState(0);
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
    if (username === "" || password === "") {
      if (username === "") {
        setUserErr(true);
      } else {
        setUserErr(false);
      }

      if (password === "") {
        setPwdErr(true);
      } else {
        setPwdErr(false);
      }
      return true;
    }

    return false;
  };

  const checkInputValidation = () => {
    if (pwdErr === true || userErr === true) {
      if (userErr) {
        setUserSyntaxErrMsg("Only '_, -, ., 0-9, a-z' are allowed.");
      }
      if (pwdErr) {
        setPwdSyntaxErrMsg("Only '_, -, ., 0-9, a-z' are allowed.");
      }
      return true;
    }

    if (username.length > 127 || username.length < 8) {
      setUserSyntaxErrMsg("Length should between 8 and 127");
      setUserErr(true);
      return true;
    }

    if (password.length > 127 || password.length < 8) {
      setPwdSyntaxErrMsg("Length should between 8 and 127");
      setPwdErr(true);
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
            placeholder="Enter User Name"
            error={userErr}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (/[^_\-\\.0-9a-z]/.test(e.target.value)) {
                setUserErr(true);
              } else {
                setUserErr(false);
              }
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
          {userErr && !open && (
            <Typography sx={{ color: "red", fontSize: "10px" }}>
              {userSyntaxErrMsg}
            </Typography>
          )}
          <TextField
            variant="standard"
            value={password}
            placeholder="Enter Password"
            type="password"
            error={pwdErr}
            inputProps={{
              maxLength: 127,
            }}
            onChange={(e) => {
              setPassword(e.target.value);
              if (/[^_\-\\.0-9a-z]/.test(e.target.value)) {
                setPwdErr(true);
              } else {
                setPwdErr(false);
              }
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
              // "& .MuiInput-root:after": {
              //   borderBottom: "2px solid #ce8d0e",
              // },
            }}
          />
          {pwdErr && !open && (
            <Typography sx={{ color: "red", fontSize: "10px" }} open={pwdErr}>
              {pwdSyntaxErrMsg}
            </Typography>
          )}
          {!open && (
            <TextField
              variant="standard"
              placeholder="Enter initial balance"
              type="number"
              inputProps={{
                maxLength: 127,
              }}
              onChange={(e) => {
                setBalance(e.target.value);
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
          )}
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
                        password: aes.encrypt(password, "mswe266p").toString(),
                      })
                      .then((res) => {
                        console.log("success login");
                        const token = res.data.accessToken;
                        localStorage.setItem("AuthorizedToken", token);

                        navigate("/account");
                      })
                      .catch((err) => {
                        console.log(err);
                        setOpenErrMsg("Failed Login!");
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
                    if (checkTextNull() || checkInputValidation()) {
                      return;
                    }

                    axios
                      .post("/api/register", {
                        username: username,
                        password: aes.encrypt(password, "mswe266p").toString(),
                        balance: balance,
                      })
                      .then(() => {
                        console.log("success register");
                        setOpen(true);
                        document.location.reload();
                      })
                      .catch((err) => {
                        console.log(err);
                        const data = err.response.data;
                        if (balance < 0) {
                          setOpenErrMsg(
                            "Failed register: Initial balance cannot be negative number"
                          );
                        } else {
                          setOpenErrMsg("Failed register: " + data);
                        }
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
    </Container>
  );
}

export default Home;
