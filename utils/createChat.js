import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

const createChat = async (senderEmail, receiverEmail) => {
  // const docRef = doc(db, `users/${user.uid}`);
  // const colRef = collection(docRef, "chats");
  const colRef = collection(db, "chats");
  await addDoc(
    colRef,
    {
      users: [senderEmail, receiverEmail],
    },
    { merge: true }
  );
};

export default createChat;
