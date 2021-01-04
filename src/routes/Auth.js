import React, { useState } from "react";
import { authService, firebaseInstance } from "../fbase";
const Auth = () => {
  const onSocialClick = async (event) => {
    let provider;
    const {
      target: { name },
    } = event;
    if (name === "Google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "Github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };
  return (
    <div>
      <button onClick={onSocialClick} name="Google">
        Continue with Google
      </button>
      <button onClick={onSocialClick} name="Github">
        Continue with Github
      </button>
    </div>
  );
};
export default Auth;
