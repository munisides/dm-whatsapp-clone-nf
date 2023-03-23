import { useEffect, useState } from "react";
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
  doc
} from "firebase/firestore";
import Chat from "./Chat";
import createNewChat from "@/utils/createChats";

import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSnackbar } from "notistack";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [newChatEmail, setNewChatEmail] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getChats = async () => {
      const userChats = query(
        collectionGroup(db, "chats"),
        where("sender", "==", user.email)
      );

      const querySnapshot = await getDocs(userChats);
      if (querySnapshot) {
        let chatters = [];
        console.log("snapshot exists");
        querySnapshot?.forEach((doc) => {
          chatters.push({ ...doc.data(), id: doc.id });
        });

        setChats(chatters);
        console.log("receiver: ", chatters);
      }
    };
    getChats();
  }, [user.email]);

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    setNewChatEmail("");
  };

  const createNewChat = async () => {
    if (!newChatEmail) {
      return null;
    }

    if (!EmailValidator.validate(newChatEmail)) {
      enqueueSnackbar("Incorrect email", {
        variant: "error",
        autoHideDuration: 5000,
      });
      // handleModalClose();
      return null;
    }

    if (chats.find((chat) => chat.receiver === newChatEmail)) {
      enqueueSnackbar("Chat already exists", {
        variant: "error",
        autoHideDuration: 5000,
      });
      // handleModalClose();
      return null;
    }

    if (newChatEmail !== user.email) {
      const docRef = doc(db, `users/${user.uid}`);
      const colRef = collection(docRef, "chats");
      await addDoc(
        colRef,
        {
          sender: user.email,
          receiver: newChatEmail,
        },
        { merge: true }
      );
      handleModalClose();
      setNewChatEmail("");
    }
  };

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

      <SidebarButton onClick={handleModalOpen}>Start a New Chat</SidebarButton>

      {chats?.map((chat) => (
        <Chat key={chat.id} id={chat.id} chatInfo={chat} />
      ))}

      <Dialog open={open} onClose={handleModalClose}>
        <DialogTitle>New Direct Message</DialogTitle>
        <DialogContent>
          <DialogContentText>{"Enter the Contact's Email"}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="new-chat-modal"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={(event) => setNewChatEmail(event.target.value)}
            name="newChatEmail"
            value={newChatEmail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>CANCEL</Button>
          <Button onClick={createNewChat}>START</Button>
        </DialogActions>
      </Dialog>
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
