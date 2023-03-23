import { db } from "@/firebase";
import { doc, addDoc, collection } from "firebase/firestore";

const createChats = async (user, receiver) => {
  const docRef = doc(db, `users/${user.uid}`);
  const colRef = collection(docRef, "chats");
  await addDoc(
    colRef,
    {
      sender: user.email,
      receiver: receiver.email,
    },
    { merge: true }
  );
};

export default createChats;
