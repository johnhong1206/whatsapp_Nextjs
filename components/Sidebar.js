import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import * as EmailValidator from "email-validator";

import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";

function Sidebar() {
  const [user, loading] = useAuthState(auth);

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);

  const [chatSnapshot] = useCollection(userChatRef);

  const creteChat = () => {
    const input = prompt(
      "Please Enter an Email Address for you  to wish to Chat"
    );

    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !ChatAlreadyExists(input) &&
      input !== user.email
    ) {
      //need to add the chat into db 'chat' collection
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const ChatAlreadyExists = (recipientEmail) =>
    !!chatSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <SidebarContainer>
      <SidebarHeader>
        <UseAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconContainer>
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconContainer>
      </SidebarHeader>
      <SearchIconContainer>
        <SearchIcon />
        <SearchInput placeholder="Search Chat" />
      </SearchIconContainer>
      <SidebarButton onClick={creteChat}>Start A New Chat</SidebarButton>
      {chatSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </SidebarContainer>
  );
}

export default Sidebar;

const SidebarContainer = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const SidebarHeader = styled.div`
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

const UseAvatar = styled(Avatar)`
  cursor: pointer;

  > :hover {
    opacity: 0.8;
  }
`;

const IconContainer = styled.div``;

const SearchIconContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
