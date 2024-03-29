import "../styles/globals.css";
import { SnackbarProvider } from "notistack";
import Login from "./Login";
import Loading from "@/components/Loading";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
// import { useEffect } from "react";
// import { doc, setDoc, Timestamp } from "firebase/firestore";

// import Login from "./Login";
// import LoginFrom from "../components/LoginForm";
// import Loading from "../components/Loading";

export default function App({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  // useEffect(() => {
  //   if (user) {
  //     const document = doc(db, `users/${user.uid}`);
  //     setDoc(
  //       document,
  //       {
  //         email: user.email,
  //         lastSeen: Timestamp.now(),
  //         photoURL: user.photoURL,
  //       },
  //       { merge: true }
  //     );
  //   }
  // }, [user]);

  // if (loading) return <Loading />;
  // if (!user) return <Login />;

  // return <Login />;

  return (<>
    {loading && <Loading />}
    {!user || user === undefined || user === null  && <Login />}
    <SnackbarProvider maxSnack={3}>
      <Component {...pageProps} />
    </SnackbarProvider></>
  );
}
