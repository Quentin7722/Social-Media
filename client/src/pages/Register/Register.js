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
    <div className="Register">
      <img className="navbar-img" src={background} alt="Logo" />
      <h1>Inscription</h1>
      <div className="RegisterForm">
        <input
          type="text"
          placeholder="Nom d'utilisateur..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Mot de passe..."
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button onClick={register}>S'inscrire</button>
      </div>
      <p className="msg-err">{errorMessage}</p>
    </div>
  );
}

export default Register;
