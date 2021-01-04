import React, { useState } from "react";
import { authService } from "../fbase";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [haveAccount, setHaveAccount] = useState(false);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const {
      target: { type, value },
    } = event;

    if (type === "text") {
      setEmail(value);
    }
    if (type === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    // onsubmit 이벤트의 기존 이벤트를 삭제하지 않으면 페이지가 리로딩 된다 -> state가 날아감
    event.preventDefault();
    try {
      let data;
      if (!haveAccount) {
        // create account
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        // log in
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        value={email}
        onChange={onChange}
        name="email"
        type="text"
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={onChange}
      />
      <input type={"submit"} value="Create Account" required />
      <input
        type={"submit"}
        onClick={() => {
          setHaveAccount(true);
        }}
        value="Log in"
        required
      />
      {error}
    </form>
  );
};

export default AuthForm;
