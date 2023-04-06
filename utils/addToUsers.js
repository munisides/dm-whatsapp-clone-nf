import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

const addToUsers = async (username, email, imgUrl) => {
  const colRef = collection(db, "users");
  await addDoc(
    colRef,
    {
      username: username,
      email: email,
      lastSeen: Timestamp.now(),
      photoURL: imgUrl,
    },
    { merge: true }
  ).catch((e) => {
    console.log("error: ", e);
  });
};

export default addToUsers;
