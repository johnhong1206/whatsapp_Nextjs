import Head from "next/head";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import React, { useState } from "react";

import { db, auth, provider } from "../firebase";
import firebase from "firebase";

function login() {
  const [isSignup, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const signIn = () => {
    auth.signInWithPopup(provider).catch((error) => alert(error.message));
  };

  const login = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((e) => alert(e.message));
  };

  const register = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;

        const usersRef = db.collection("users");
        usersRef.doc(uid).set({
          email: email,
          displayName: username,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: imageUrl,
        });
      })
      .then((authUser) => {
        const Updateuser = auth.currentUser;
        Updateuser.updateProfile({
          displayName: username,
          photoURL: imageUrl,
        });
      })
      .then(() => {})
      .catch((error) => alert(error.message));
  };

  return (
    <Container>
      <Head>
        <title>Zong Hong Whatsapp Login</title>
      </Head>
      {isSignup ? (
        <>
          <SignUpEmail>
            <h1>Sign In</h1>
            <form>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                type="username"
                placeholder="Username"
              />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="email"
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="password"
              />
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                type="imageurl"
                placeholder="Please paste your Image URL"
              />
              <button
                onClick={login}
                type="submit"
                disabled={!email || !password.replace(/\s/g, "").length}
              >
                Sign In
              </button>
            </form>
            <h4 onClick={register}>
              Dont Have account? Click to
              <span className="register__Link"> Sign Up</span>
            </h4>
            <span onClick={() => setIsSignUp(false)}>
              Use Google Account to <span>Sign in</span>
            </span>
          </SignUpEmail>
        </>
      ) : (
        <>
          <LoginContainer>
            <Logo src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
            <Button onClick={signIn} variant="outlined">
              Sign In With Google
            </Button>
            <SignInWithEmail onClick={() => setIsSignUp(true)}>
              Dont have Google Account Sign In with Email
            </SignInWithEmail>
          </LoginContainer>
        </>
      )}
    </Container>
  );
}

export default login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;

  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 14px -3px rgba(0, 0, 0, 0.7), 0 1px;

  > button {
    margin-top: 50px;
    text-transform: inherit !important;
    background-color: #0a8d48;
    color: white;
  }

  > button:hover {
    background-color: white;
    color: #0a8d48;
  }
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;

const SignUpEmail = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;

  align-items: center;
  background-color: whitesmoke;
  border-radius: 5px;
  box-shadow: 0 4px 14px -3px rgba(0, 0, 0, 0.7), 0 1px;

  > h4 {
    margin-top: 50px;
    text-align: left;
  }
  > h4 > span:hover {
    cursor: pointer;
    text-decoration: underline;
    color: #e60914;
  }

  > span > span {
    color: #0a8d48;
    font-weight: 600;
  }
  > span > span:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  > form {
    display: flex;
    flex-direction: column;
  }

  > form > input {
    outline-width: 0;
    height: 40px;
    width: 300px;
    box-shadow: 0 4px 14px -3px rgba(0, 0, 0, 0.7), 0 1px;
    margin-bottom: 14px;
    border-radius: 5px;
    border: none;
    padding: 5px 15px;
  }

  > form > button {
    padding: 16px 20px;
    font-size: 1rem;
    color: #fff;
    background-color: #e60914;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    font-weight: 600;
    margin-top: 20px;
    box-shadow: 0 4px 14px -3px rgba(0, 0, 0, 0.7), 0 1px;
  }

  > form > button:hover {
    background-color: white;
    color: #e60914;
  }

  > form > h1 {
    text-align: left;
    margin-bottom: 25px;
  }
`;

const SignInWithEmail = styled.p`
  margin-top: 40px;
  font-size: 16px;

  :hover {
    text-decoration: underline;
    cursor: pointer;
    color: #e60914;
  }
`;
