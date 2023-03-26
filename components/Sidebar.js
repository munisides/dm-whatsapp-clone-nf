import { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, IconButton, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { signOut, deleteUser } from "firebase/auth";
import { auth, db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  collectionGroup,
  doc,
  QuerySnapshot,
} from "firebase/firestore";
import Chat from "./Chat";

import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useSnackbar } from "notistack";
import createChat from "@/utils/createChat";

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [newChatEmail, setNewChatEmail] = useState("");

  //
  const { enqueueSnackbar } = useSnackbar();

  //
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [openMenu, setOpenMenu] = useState(false);

  //
  // const userChatRef = user && query(collection(db, "chats"), where("users", "array-contains", user.email));

  const [chatsSnapshot, loading, error] = useCollection(query(collection(db, "chats"), where("users", "array-contains", user?.email)),
  {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  //
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleCloseMenu = (menuOption) => {
    if (menuOption === "profile") {
      setAnchorEl(null);
    } else if (menuOption === "delete") {
      deleteUser(user)
        .then(() => {
          // User deleted.
          enqueueSnackbar("Deleting user...", {
            variant: "error",
            autoHideDuration: 5000,
          });
        })
        .catch((error) => {
          // An error ocurred
          const errorMessage = error.message;
          console.log("error: ", errorMessage);
          enqueueSnackbar(errorMessage.substring(22, errorMessage.length - 2), {
            variant: "error",
            autoHideDuration: 5000,
          });
        });
      setAnchorEl(null);
    } else {
      signOut(auth);
    }
  };

  // useEffect(() => {
  //   const getChats = async () => {
  //     const userChats = query(
  //       collectionGroup(db, "chats"),
  //       where("sender", "==", user.email)
  //     );

  //     const querySnapshot = await getDocs(userChats);
  //     if (querySnapshot) {
  //       let chatters = [];
  //       console.log("snapshot exists");
  //       querySnapshot?.forEach((doc) => {
  //         chatters.push({ ...doc.data(), id: doc.id });
  //       });

  //       setChats(chatters);
  //       console.log("receiver: ", chatters);
  //     }
  //   };
  //   getChats();
  // }, [user.email]);

  useEffect(() => {
    if (chatsSnapshot) {
      let chatters = [];
      chatsSnapshot.docs.map((doc) => {
        // chatters.push({ ...doc.data().users, id: doc.id });
        chatters.push({ chatRecEmail: doc.data().users[1], chatId: doc.id});
      });
      setChats(chatters);
    }
  }, [chatsSnapshot]);

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
      // const docRef = doc(db, `users/${user.uid}`);
      // const colRef = collection(docRef, "chats");
      // await addDoc(
      //   colRef,
      //   {
      //     sender: user.email,
      //     receiver: newChatEmail,
      //   },
      //   { merge: true }
      // );

      // db.collection("chats").add({
      //   users: [user.email, newChatEmail],
      // });

      createChat(user.email, newChatEmail);

      handleModalClose();
      setNewChatEmail("");
    }
  };

  return (
    <Container>
      <Header>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(e) => handleOpenMenu(e)}
        >
          <UserAvatar
            src={user.photoURL}
            // onClick={
            //   // () => {
            //   // signOut(auth);
            //   // }
            //   handleOpenMenu
            // }
          />
        </Button>

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
        <Chat key={chat.chatId} id={chat.chatId} chatRecEmail={chat.chatRecEmail} />
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

      {/*  */}

      {openMenu && (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => handleCloseMenu()}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              handleCloseMenu("profile");
            }}
          >
            Profile
          </MenuItem>
          <MenuItem onClick={() => handleCloseMenu("delete")}>
            Delete Account
          </MenuItem>
          <MenuItem onClick={() => handleCloseMenu("logout")}>Logout</MenuItem>
        </Menu>
      )}
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
