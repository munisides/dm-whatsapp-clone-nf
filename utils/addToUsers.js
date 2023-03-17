import { db, setDoc, doc, Timestamp } from 'firebase/firestore'

const addToUsers = async (user, imgUrl) => {
    const document = doc(db, `users/${user.uid}`);
    await setDoc(
      document,
      {
        username: user.username,
        email: user.email,
        lastSeen: Timestamp.now(),
        photoURL: imgUrl,
      },
      { merge: true }
    );
  };

  export default addToUsers;
