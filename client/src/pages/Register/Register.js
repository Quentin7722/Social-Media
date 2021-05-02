import React, { useState } from "react";
import "./Register.css";
import background from '../../assets/icon.png';
import Axios from "axios";
import { useHistory } from "react-router-dom";


function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  let history = useHistory();

  const register = () => {
    checkTextInput();
    console.log(checkTextInput());
    if (checkTextInput() === true) {
      Axios.post("http://localhost:3001/user/register", {
        username: username,
        password: password,
      }).then((response) => {
        history.push("/");
        alert("Votre compte a bien été enregistré");
      }).catch(function (error) {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        }
      });
    }
  };


  const checkTextInput = () => {
    if (!username.trim() && !password.trim()) {
      setErrorMessage("Les champs sont vides");
      return false;
    } else if (!username.trim()) {
      setErrorMessage("Le champ nom d'utilisateur est vide")
      return false;
    } else if (!password.trim()) {
      setErrorMessage("Le champ mot de passe est vide");
      return false;
    } else {
      return true;
    }
  };

  return (
    <main className="Register">
      <img className="navbar-img" src={background} alt="Logo de Groupomania" />
      <h1>Inscription</h1>
      <div className="RegisterForm">
        <label className="label-img" htmlFor="input-username-register">Choisir un nom d'utilisateur</label>
        <input
          id="input-username-register"
          type="text"
          placeholder="Nom d'utilisateur..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label className="label-img" htmlFor="input-password-register">Choisir un mot de passe</label>
        <input
          id="input-password-register"
          type="password"
          placeholder="Mot de passe..."
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button value="Inscription" onClick={register}>S'inscrire</button>
      </div>
      <p className="msg-err">{errorMessage}</p>
    </main>
  );
}

export default Register;
