import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Input,
  Button,
  Snackbar,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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

  const checkTextNull = () => {
    if (username === ""){ // || password === "") {
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
      // return true;
    }

    return false;
  };

  return (
    <Container>
      <Box className="App">
        <Typography variant="h2" component="div" gutterBottom>
          {open ? "Login Bank Account" : "Register Bank Account"}
        </Typography>

        <Box>
          <Input
            name="username"
            placeholder="Enter User Name"
            error={userErr}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            name="password"
            placeholder="Enter Password"
            error={pwdErr}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Box>
        <Box>
          {open ? (
            <Box>
              <Button
                className="my-2"
                variant="primary"
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
                      localStorage.setItem('AuthorizedToken', token);
                      
                      navigate("/account");
                      // window.history.pushState("/Account.js");
                      // document.location.reload();
                    })
                    .catch((err) => {
                      console.log(err);
                      setOpenErr(true);
                    });
                  console.log(username, password);
                }}
              >
                Login
              </Button>
              <Button
                onClick={(e) => {
                  setOpen(false);
                }}
              >
                Register
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                className="my-2"
                variant="primary"
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
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={openErr}
        autoHideDuration={6000}
        message="Failed login/register"
      />
    </Container>
  );
}

export default Home;
