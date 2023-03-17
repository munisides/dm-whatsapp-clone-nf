import { useState } from "react";
import styled from "styled-components";
import Head from "next/head";
// import { signInWithPopup } from "firebase/auth";
// import {
//   auth,
//   provider,
//   getAuth,
//   createUserWithEmailAndPassword,
// } from "../firebase";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  Checkbox,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Image from "next/image";
import addToUsers from "@/utils/addToUsers";
import createChats from "@/utils/createChats";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, isError] = useState(false);
  const [errorCodeMessage, isErrorCodeMessage] = useState("");
  const router = useRouter();

  const [checked, setChecked] = useState(false);

  const whatsappLogo =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2042px-WhatsApp.svg.png";

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (passwordOne.length < 6 || passwordTwo.length < 6) {
      isError(true);
      return;
    }
    if (passwordOne === passwordTwo) {
      createUserWithEmailAndPassword(auth, email, passwordOne)
        .then((userCredential) => {
          const user = userCredential.user;
          if (user) {
            const photoURL = "https://api.dicebear.com/4.4/bottts/svg";
            addToUsers(user, photoURL);
            createChats(user, user);
          }
          router.push("/Main");
        })
        .catch((error) => {
          isError(true);
          const errorMessage = error.message;
          console.log("error: ", errorMessage);
          if (errorMessage === "Firebase: Error (auth/invalid-email).") {
            isErrorCodeMessage("Invalid Email");
          } else if (errorMessage === "auth/invalid-password") {
            isErrorCodeMessage("Invalid Password");
          }
        });
    }
  };

  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 280,
    margin: "20px auto",
  };

  return (
    <Container>
      <Head>
        <title>Sign Up</title>
      </Head>
      {/* <Paper style={paperStyle}> */}
      <LoginContainer>
        {/* <Logo src={whatsappLogo} /> */}
        <Image
          src={whatsappLogo}
          alt="whatsapp clone logo"
          width={100}
          height={100}
        />

        <Grid
          align="center"
          alignContent="center"
          sx={{ p: "20px", width: "60%", my: "20px", mx: "20px" }}
        >
          <TextField
            label="Username"
            placeholder="Username"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(event) => setUsername(event.target.value)}
            name="username"
            id="signUpUsername"
            value={username}
            helperText={error ? "Invalid username" : ""}
          />
          <TextField
            label="Email"
            placeholder="Enter an Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(event) => setEmail(event.target.value)}
            name="email"
            id="signUpEmail"
            value={email}
            helperText={error ? "Invalid Email" : ""}
          />
          <TextField
            label="Password"
            placeholder="Enter password"
            type={checked ? "text" : "password"}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={passwordOne}
            onChange={(event) => setPasswordOne(event.target.value)}
            id="signUpPassword"
          />
          <TextField
            label="Password"
            placeholder="Enter password"
            type={checked ? "text" : "password"}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={passwordTwo}
            onChange={(event) => setPasswordTwo(event.target.value)}
            id="signUpPassword2"
          />
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <Checkbox
              checked={checked}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
            <Typography>Show Password</Typography>
          </Stack>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            sx={{ mb: 2, ml: 0 }}
            fullWidth
            onClick={handleSubmit}
          >
            SIGN UP
          </Button>
          <Typography>
            {"Already have an account? "} <Link href="/Login">Log In</Link>
          </Typography>
        </Grid>
      </LoginContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  align-content: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-self: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 20px;
  width: 20px;
  margin-bottom: 20px;
`;
