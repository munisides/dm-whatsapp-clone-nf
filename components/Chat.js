import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import styled from "styled-components";
import { db, auth } from "../firebase";
// import { useCollection, useAuthState } from 'react-firebase-hooks/firestore';
// import getReceiverEmail from "@/utils/getReceiverEmail";

function Chat({ id, chatRecEmail }) {
  // const [user] = useAuthState(auth);
  const [receiverData, setReceiverData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const getSnapshot = async () => {
      if (chatRecEmail) {
        const docRef = collection(db, "users");
        const getReceiverQuery = query(
          docRef,
          where("email", "==", chatRecEmail)
        );
        const querySnapshot = await getDocs(getReceiverQuery);
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          setReceiverData(doc.data());
        });
      }
    };
    getSnapshot();
  }, [chatRecEmail]);

  // const userChatRef = db
  //   .collection('users')
  //   .where('email', '==', chatReceiver);

  // const [receiverSnapshot] = useCollection(userChatRef);

  // console.log('rec: ', chatReceiver)
  // const [receiverSnapshot, loading, error] = useCollection(query(collection(db, "users"), where("email", "==", chatReceiver)),
  // {
  //   snapshotListenOptions: { includeMetadataChanges: true },
  // });
  // const receiverUser = receiverSnapshot?.docs?.[0]?.data();
  // console.log('user: ', receiverUser)

  // console.log(chatInfo?.receiver);
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {chatRecEmail && <UserAvatar src={receiverData.photoURL} />}
      <p>{chatRecEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
