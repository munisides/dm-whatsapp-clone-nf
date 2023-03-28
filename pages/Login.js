import React, { useState, useEffect } from "react";
import Head from "next/head";
import styled from "styled-components";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  Chip,
  Checkbox,
  Stack,
} from "@mui/material";
import Image from "next/image";
import { auth, provider, db } from "../firebase";
// import { useCollection } from "react-firebase-hooks/firestore";
// import {
//   collection,
//   addDoc,
//   doc,
//   setDoc,
//   Timestamp,
//   query,
//   where,
// } from "firebase/firestore";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import addToUsers from "@/utils/addToUsers";
import createChats from "@/utils/createChats";
import { useSnackbar } from "notistack";

const Login = () => {
  // const [user] = useAuthState(auth);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, isError] = useState(false);
  const [checked, setChecked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const whatsappLogo =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2042px-WhatsApp.svg.png";

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  // const addToUsers = async (user, imgUrl) => {
  //   const document = doc(db, `users/${user.uid}`);
  //   await setDoc(
  //     document,
  //     {
  //       email: user.email,
  //       lastSeen: Timestamp.now(),
  //       photoURL: imgUrl,
  //     },
  //     { merge: true }
  //   );
  // };

  // const chatAlreadyExists = (receiverEmail) => {
  //   !!chatsSnapshot?.docs.find(
  //     (chat) =>
  //       chat.data().users.find((user) => user === receiverEmail) !== undefined
  //   );
  // };

  // const createChats = async (user) => {
  //   const docRef = doc(db, `users/${user.uid}`);
  //   const colRef = collection(docRef, "chats");
  //   await addDoc(
  //     colRef,
  //     {
  //       chatters: [user.email, user.email],
  //     },
  //     { merge: true }
  //   );
  // };

  const handleSignInPassword = (event) => {
    event.preventDefault();
    if (password < 6) {
      isError(true);
      return;
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          // const photoURL = "https://api.dicebear.com/4.4/bottts/svg";
          // if (user) {
          //   addToUsers(user, photoURL);
          //   createChats(user);
          //   const document = doc(db, `users/${user.uid}`);
          //   setDoc(
          //     document,
          //     {
          //       email: user.email,
          //       lastSeen: Timestamp.now(),
          //       photoURL: "https://api.dicebear.com/4.4/bottts/svg",
          //     },
          //     { merge: true }
          //   );
          // }
          router.push("/Main");
        })
        .catch((error) => {
          isError(true);
          const errorMessage = error.message;
          console.log("error: ", errorMessage);
          enqueueSnackbar(errorMessage.substring(22, errorMessage.length-2), {
            variant: "error",
            autoHideDuration: 5000,
          });
        });
    }
  };

  const handleSignInGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // if (user) {
        //   addToUsers(user, user.photoURL);
        //   createChats(user);
          // const document = doc(db, `users/${user.uid}`);
          // await setDoc(
          //   document,
          //   {
          //     email: user.email,
          //     lastSeen: Timestamp.now(),
          //     photoURL: user.photoURL,
          //   },
          //   { merge: true }
          // );

          // initiate chats collection
          //   await const chatsCol = collection(db, "chats");
          //   addDoc(chatsCol, {
          //     users: [],
          //   },
          //   { merge: true });
          // }
        // }
        router.push("/Main");
      })
      .catch((error) => {
        isError(true);
        const errorMessage = error.message;
        console.log("error: ", errorMessage);
      });
  };

  // const paperStyle = {
  //   padding: 20,
  //   height: "70vh",
  //   width: 280,
  //   margin: "20px auto",
  // };

  return (
    <Container>
      <LoginContainer>
        <Head>
          <title>Login</title>
        </Head>

        {/* <Logo src={whatsappLogo} /> */}
        <Image
          src={whatsappLogo}
          alt="whatsapp clone logo"
          width={100}
          height={100}
        />
        <Button
          onClick={handleSignInGoogle}
          variant="outlined"
          sx={{ m: "10px", width: "55%" }}
        >
          Sign in with Google
        </Button>

        <Divider sx={{ width: "90%" }}>
          <Chip label="OR" />
        </Divider>

        <Grid
          align="center"
          alignContent="center"
          sx={{ p: "20px", width: "60%", my: "20px", mx: "20px" }}
        >
          <TextField
            label="Email"
            placeholder="Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(event) => setEmail(event.target.value)}
            name="email"
            id="signInEmail"
            value={email}
            helperText={error ? "Invalid Email" : ""}
          />
          <TextField
            label="Password"
            placeholder="Password"
            type={checked ? "text" : "password"}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            id="signInPassword"
            helperText={error ? "Invalid Password" : ""}
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
            onClick={handleSignInPassword}
          >
            SIGN IN
          </Button>
          <Typography>
            {"Don't have an Account?"} <Link href="/Register">Sign Up</Link>
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
