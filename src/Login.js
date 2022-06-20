import './Login.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';

function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerMode, setRegisterMode] = useState(false);

  const navigate = useNavigate();

  async function loginToTheApp() {
    if (!user || user == '' || !password || password == '')
      return;

    const hashedPassword = await hashPassword(password);

    // Call a endpoint that will create a new entry in db with this login and hashed password and prefill it with info then call "loginToTheApp"
    try {
      const responseJson = await fetch("/api/password", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'auth': hashedPassword,
          'user': user
        },
        method: "GET"
      });
      if (!responseJson.ok) {
        console.error("failed to login", await responseJson.text());
        return;
      }
    } catch (err) {
      console.error("failed to login", err);
      return;
    }

    localStorage.setItem('auth', hashedPassword);

    navigate({
      pathname: '/app',
      search: `?user=${user}`,
    });
  }

  async function registerToTheApp() {

    let hashedPassword = await hashPassword(password);

    // Call a endpoint that will create a new entry in db with this login and hashed password and prefill it with info then call "loginToTheApp"
    try {
    const responseJson = await fetch("/api/register", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'auth': hashedPassword,
        'user': user
      },
      method: "POST"
    });
    if (!responseJson.ok) {
      console.error("failed to register", await responseJson.text());
      return;
    }
  } catch (err) {
    console.error("failed to register", err);
    return;
  }

    loginToTheApp();
  }

  return (
    <div className="Login">
      <div className="login-box">
        <TextField
          label="Login"
          type="string"
          variant="standard"
          onChange={(event) => { setUser(event.target.value) }}
        />
        <TextField
          label="Password"
          variant="standard"
          type="password"
          onChange={(event) => { setPassword(event.target.value) }}
        />

        { registerMode ? <TextField
          label="Confirm Password"
          variant="standard"
          type="password"
          onChange={(event) => { setConfirmPassword(event.target.value) }}
        /> : null }

        <div>
        { !registerMode ? <>
            <button className="actionButton" onClick={() => loginToTheApp()} disabled={!user || user == '' || !password || password == ''}>Login</button>
            <button className="actionButton light" onClick={() => setRegisterMode(true)}>Register</button>
          </>
          : 
          <>
            <button className="actionButton" onClick={() => registerToTheApp()} disabled={!user || user == '' || !password || password == '' || confirmPassword != password}>New account</button>
            <button className="actionButton light" onClick={() => setRegisterMode(false)}>Back</button>
          </>
        }
        </div>
      </div>
    </div >
  )
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return buf2hex(hashBuffer);
} 

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

export default Login;