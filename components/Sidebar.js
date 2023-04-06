import { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, IconButton, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { deleteUser, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
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
import { useRouter } from "next/router";

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [newChatEmail, setNewChatEmail] = useState("");

  //
  const { enqueueSnackbar } = useSnackbar();

  //
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [openMenu, setOpenMenu] = useState(false);
  const [menuOption, setMenuOption] = useState("");

  //
  const userChatRef =
    user &&
    query(
      collection(db, "chats"),
      where("users", "array-contains", user.email)
    );

  const [chatsSnapshot, loading, error] = useCollection(userChatRef, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  //
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  useEffect(() => {
    if (menuOption === "logout") {
      // signOutUser();
      router.push("/Login");
      signOut(auth);
    }
    if (menuOption === "delete") {
      deleteUser(user)
        .then(() => {
          enqueueSnackbar("Deleting user...", {
            variant: "error",
            autoHideDuration: 5000,
          });
        })
        .catch((e) => {
          // An error ocurred
          const errorMessage = e.message;
          console.log("error: ", errorMessage);
          enqueueSnackbar(errorMessage.substring(22, errorMessage.length - 2), {
            variant: "error",
            autoHideDuration: 5000,
          });
        });
      setAnchorEl(null);
    }
    console.log("option: ", menuOption);
  }, [enqueueSnackbar, menuOption, router, user]);

  const handleCloseMenu = () => {
    if (menuOption === "profile") {
      setAnchorEl(null);
    } else if (menuOption === "delete") {
      deleteUser(user)
        .then(() => {
          enqueueSnackbar("Deleting user...", {
            variant: "error",
            autoHideDuration: 5000,
          });
        })
        .catch((e) => {
          // An error ocurred
          const errorMessage = e.message;
          console.log("error: ", errorMessage);
          enqueueSnackbar(errorMessage.substring(22, errorMessage.length - 2), {
            variant: "error",
            autoHideDuration: 5000,
          });
        });
      setAnchorEl(null);
    } else {
      setAnchorEl(null);
      setMenuOption("logout");
    }
  };

  useEffect(() => {
    if (chatsSnapshot) {
      let chatters = [];
      chatsSnapshot.docs.map((doc) => {
        // chatters.push({ ...doc.data().users, id: doc.id });
        doc.data().users[0] === user.email
          ? doc.data().users[1]
          : doc.data().users[0];
        // chatters.push({ chatRecEmail: doc.data().users[1], chatId: doc.id });
        chatters.push({
          chatRecEmail:
            doc.data().users[0] === user.email
              ? doc.data().users[1]
              : doc.data().users[0],
          chatId: doc.id,
        });
        console.log("rec: ", doc.data().users[0]);
      });
      setChats(chatters);
    }
  }, [error, chatsSnapshot, user?.email]);

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
          <UserAvatar src={user?.photoURL} />
          <p>{user?.email}</p>
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
        <SearchInput placeholder="Search" />
      </Search>

      <SidebarButton onClick={handleModalOpen}>Start a New Chat</SidebarButton>
      {loading && <span>Loading...</span>}
      {chats?.map((chat) => (
        <Chat
          key={chat.chatId}
          id={chat.chatId}
          chatRecEmail={
            chat.chatRecEmail === user?.email
              ? `${chat.chatRecEmail}(You)`
              : chat.chatRecEmail
          }
        />
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
              setMenuOption("profile");
              // handleCloseMenu();
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuOption("delete");
              // handleCloseMenu();
            }}
          >
            Delete Account
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuOption("logout");
              // handleCloseMenu();
            }}
          >
            Logout
          </MenuItem>
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
  min-width: 50px;
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
