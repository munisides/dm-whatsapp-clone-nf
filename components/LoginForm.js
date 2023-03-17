import React from "react";
import Head from "next/head";
import styled from "styled-components";
import { Grid, TextField, Button, Typography, Link } from "@mui/material";
import firebase from '../firebase'
import { useRouter } from 'next/router'

const LoginForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (passwordOne === passwordTwo) {
      firebase.auth().signInWithEmailAndPassword(email, passwordOne)
        .then((userCredential) => {
          const user = userCredential.user;
          router.push("/");
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          console.log("error: ", errorMessage);
        });
    }
  };
  
  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <Grid
        align="center"
        alignContent="center"
        sx={{ p: "20px", width: "60%", my: "20px", mx: "20px" }}
      >
        <TextField
          label="Username"
          placeholder="Enter username"
          variant="outlined"
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          placeholder="Enter password"
          type="password"
          variant="outlined"
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          sx={{ mb: 2, ml: 0 }}
          fullWidth
          onClick={handleSubmit}
        >
          Sign in
        </Button>
        <Typography>
          {"Don't have an Account?"} <Link href="/Register">Sign Up</Link>
        </Typography>
      </Grid>
    </Container>
  );
};

export default LoginForm;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
