// import { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, IconButton, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  collectionGroup,
} from "firebase/firestore";
import Chat from "./Chat";
import createChats from "@/utils/createChats";

const Sidebar = async () => {
  // const [chats, setChats] = useState([]);
  const [user] = useAuthState(auth);
  // const userChatRef = query(
  //   collection(db, `users/${user.uid}/chats`),
  //   where("email", "==", user?.email)
  // );

  // const userChatRef = doc(db, 'users', `${user.id}`)
  // const doc = await getDoc(userChatRef);
  // const [chatsSnapshot, loading, error] = useCollection(userChatRef);
  // const chatsSnapshot = getDocs(userChatRef);
  // console.log("chatsnapshot: ", doc.data());

  const userChats = query(
    collectionGroup(db, "chats"),
    where("sender", "==", user.email)
  );
  const querySnapshot = await getDocs(userChats);
  let chatters = [];
  if(user) {
    querySnapshot.forEach((doc) => {
      chatters.push(doc?.data()?.receiver);
      // console.log(doc.id, " => ", doc.data());
    });
    console.log("receiver: ", chatters)
  }

  // useEffect(() => {
  //   const getChats = () => {
  //     const unsub = onSnapshot(queryChats, (snapshot) => {
  //       let chatters = [];
  //       snapshot.forEach((doc) => {
  //         chatters.push(doc?.data());
  //       });
  //       setChats(chatters);
  //       console.log(chatters);
  //       // setChats(doc.data());
  //     });

  //     return () => unsub();
  //   };

  //   user.uid && getChats();
  // }, [user.uid, queryChats]);

  // console.log("chats: ", chats);

  // const createChat = () => {
  //   const input = prompt(
  //     "Please enter an email address for the user you wish to chat with: "
  //   );

  //   if (!input) {
  //     return null;
  //   }

  //   if (
  //     EmailValidator.validate(input) &&
  //     !chatAlreadyExists(input) &&
  //     input !== user.email
  //   ) {
  //     // add chat into DB 'chats' collection if it doesnt exists and is a valid email
  //     // const col = collection(db, "chats");
  //     // addDoc(col, {
  //     //   users: [user.email, input],
  //     // });
  //     createChats(user, input);
  //   }
  // };

  // const chatAlreadyExists = (receiverEmail) =>
  //   !!chatsSnapshot?.docs.find(
  //     (chat) =>
  //       chat.data().users.find((user) => user === receiverEmail) !== undefined
  //   );

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user.photoURL}
          onClick={() => {
            signOut(auth);
          }}
        />

        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in Chats" />
      </Search>

      <SidebarButton>Start a New Chat</SidebarButton>

      {/* {chatsSnapshot?.docs?.map((chat) => (
        <Chat key={chat.id} id={chat.id} receiver={receiver} />
      ))} */}
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 2px;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    color: black;
  }
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
