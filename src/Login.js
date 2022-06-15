import './Login.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';

function Login() {
  const [login, setLogin] = useState([]);
  const [password, setPassword] = useState([]);

  const navigate = useNavigate();

  async function loginToTheApp() {
    if (!login || login == '' || !password || password == '')
      return;

    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hash = buf2hex(hashBuffer);

    localStorage.setItem('auth', hash);

    navigate({
      pathname: '/app',
      search: `?login=${login}`,
    });
  }

  function registerToTheApp() {
    // Call a endpoint that will create a new entry in db with this login and hashed password and prefill it with info then call "loginToTheApp"

    loginToTheApp();
  }


  function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  }

  return (
    <div className="Login">
      <div className="login-box">
        <TextField
          label="Login"
          type="string"
          variant="standard"
          onChange={(event) => { setLogin(event.target.value) }}
        />
        <TextField
          label="Password"
          type="string"
          variant="standard"
          onChange={(event) => { setPassword(event.target.value) }}
        />

        <div>
          <button className="actionButton" onClick={() => loginToTheApp()} disabled={!login || login == '' || !password || password == ''}>Login</button>

          <button className="actionButton light" onClick={() => registerToTheApp()}>Register</button>
        </div>
      </div>
    </div >
  )
}

export default Login;