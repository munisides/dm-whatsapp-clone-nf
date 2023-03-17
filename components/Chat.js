import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import styled from "styled-components";
import { db } from "../firebase";

function Chat({ id, chatInfo }) {
  const [receiverData, setReceiverData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const getSnapshot = async () => {
      if (chatInfo) {
        const docRef = collection(db, "users");
        const getReceiverQuery = query(
          docRef,
          where("email", "==", chatInfo?.receiver)
        );
        const querySnapshot = await getDocs(getReceiverQuery);
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          setReceiverData(doc.data());
        });
      }
    };
    getSnapshot();
  }, [chatInfo]);

  console.log(chatInfo?.receiver);
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {chatInfo && <UserAvatar src={receiverData.photoURL} />}
      <p>{chatInfo?.receiver}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
