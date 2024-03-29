import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

const createChats = async (user, receiver) => {
  // const docRef = doc(db, `users/${user.uid}`);
  // const colRef = collection(docRef, "chats");
  const colRef = collection(db, "chats");
  await addDoc(
    colRef,
    {
      users: [user.email, receiver.email],
    },
    { merge: true }
  );
};

export default createChats;
