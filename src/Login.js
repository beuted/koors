import './Login.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerMode, setRegisterMode] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [registerError, setRegisterError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // If you already had a user when the page load we redirect you to it
    const user = localStorage.getItem('user');
    if (!user) return;
    navigate({
      pathname: '/app',
      search: `?user=${user}`,
    });
  }, [])

  async function loginToTheApp() {
    if (!user || user === '' || !password || password === '')
      return;

    const hashedPassword = hashPassword(password);

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
        setLoginError(true);
        return;
      }
    } catch (err) {
      console.error("failed to login", err);
      setLoginError(true);
      return;
    }
    setLoginError(false);

    localStorage.setItem('auth', hashedPassword);
    localStorage.setItem('user', user);

    navigate({
      pathname: '/app',
      search: `?user=${user}`,
    });
  }

  async function registerToTheApp() {
    let hashedPassword = hashPassword(password);

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
        setRegisterError(true);
        return;
      }
    } catch (err) {
      console.error("failed to register", err);
      setRegisterError(true);
      return;
    }

    setRegisterError(false);

    loginToTheApp();
  }

  return (
    <div className="Login">
      <div className="title">
        Koors
      </div>
      <div className="login-box">
        <TextField
          label="Utilisateur"
          type="string"
          variant="standard"
          onChange={(event) => { setUser(event.target.value) }}
          error={loginError || registerError}
          helperText={loginError ? "Utilisateur ou Mot de passe invalide" : (registerError ? "L'utilisateur existe déjà" : null)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mot de passe"
          variant="standard"
          type="password"
          onChange={(event) => { setPassword(event.target.value) }}
          sx={{ mb: 2 }}
        />

        { registerMode ? <TextField
          label="Confirmer le Mot de passe"
          variant="standard"
          type="password"
          onChange={(event) => { setConfirmPassword(event.target.value) }}
          sx={{ mb: 2 }}
        /> : null }

        <div>
        { !registerMode ? <>
            <button className="actionButton" onClick={() => loginToTheApp()} disabled={!user || user === '' || !password || password === ''}>S'indentifier</button>
            <button className="actionButton light" onClick={() => {setRegisterMode(true); setLoginError(false);}}>S'enregister</button>
          </>
          : 
          <>
            <button className="actionButton" onClick={() => registerToTheApp()} disabled={!user || user === '' || !password || password === '' || confirmPassword !== password}>Nouveau compte</button>
            <button className="actionButton light" onClick={() => {setRegisterMode(false); setRegisterError(false);}}>Retour</button>
          </>
        }
        </div>
      </div>
    </div >
  )
}

// NOTE I use a lib because the use of crypto.subtle is restricted in non secure context (http)
// And if someone wants to man in the middle on the app I don't give a flying fuck so it'll stay http
export function hashPassword(password) {
  const hashBuffer = sha256(password);
  console.log(Base64.stringify(hashBuffer));
  return Base64.stringify(hashBuffer);
} 

export default Login;