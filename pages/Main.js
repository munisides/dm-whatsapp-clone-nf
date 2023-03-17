import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import { useRouter } from "next/router";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const Main = () => {
  const router = useRouter();
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

  if (loading) return <Loading />;
  if (!user) {
    router.push("/Login");
    return;
  }

  return (
    <Layout>
      <Chat />
    </Layout>
  );
};

export default Main;
