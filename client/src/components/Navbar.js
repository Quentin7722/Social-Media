import React, { useState } from "react";
import "./Navbar.css";
import ReorderIcon from "@material-ui/icons/Reorder";
import logo from '../assets/icon-left-font-monochrome-white.png';
import { useHistory } from "react-router-dom";


function Navbar(props) {

  let history = useHistory();
  const [showLinks, setshowLinks] = useState(false);

  const disconnect = () => {
    localStorage.removeItem("role");
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    history.push("/");
  };

  return (
    <header className="Navbar">
      <img className="navbar-img" src={logo} alt="Logo de l'entreprise" />
      <nav className="right-side">
        <div className="links" id={showLinks ? "hidden" : ""}>
          <a href="/">Forum</a>
          {props.isLoggedIn ? ( // Opérateur ternaire
            <>
              <a href="/upload">Publier</a>
              <a href="/profile">Profil</a>
              {props.userRole === "moderateur" && (
                <>
                  <a href="/moderateur">Gérer les publications</a>
                </>
              )}
              <button className="btn-disconnect" onClick={disconnect}>Se déconnecter</button>
            </>
          ) : (
            <>
              <a href="/register">Inscription</a>
              <a href="/login">Connexion</a>
            </>
          )}
        </div>
        <button className="btn-menu" aria-label="Bouton du menu" onClick={() => setshowLinks(!showLinks)}><ReorderIcon /></button>
      </nav>
    </header>
  );
}

export default Navbar;
