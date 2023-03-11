import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { login } from "../../store/session";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";

const LoginForm = () => {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);

        return dispatch(sessionActions.login({ credential, password }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.message) setErrors(data.message);
          console.log("errors from login:", errors);
        });
    };

    const logInDemo = () => {
      return dispatch(sessionActions.login({credential: "Demo-lition", password: "password"}));
    };

    return (
      <>
        <form className="login-form" onSubmit={handleSubmit}>
        {/* <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul> */}
        <p className="validation-error">{errors}</p>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
        type="submit"
        disabled={credential.length < 4 || password.length < 6}
        >Log In</button>
      </form>
      <button
      onClick={logInDemo}
      >Demo User</button>
      </>
    );
};

export default LoginForm;
