import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import "./Moderateur.css";
import avatar from 'C:/Users/quent/Desktop/Projet 7/client/src/assets/avatar.png';
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

function Moderateur() {
  const [yourUploads, setYourUploads] = useState([]);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    Axios.get(`http://localhost:3001/thread`, {
      headers: { 'Authorization': `token ${token}` }
    }).then((response) => {
      console.log(response)
      setYourUploads(response.data);
    });
  }, []);

  const deleteThread = (idthread,image ) => {
    Axios.delete("http://localhost:3001/thread/delete", {
      headers: { 'Authorization': `bearer ${token}` },
      data: {
        idthread: idthread,
        username: username,
        image: image
      }
    }).then((response) => {
      setYourUploads(response.data);
    });
  };

  return (
    <div className="moderateur">
      <div className="moderateur-top">
        <img className="img-moderateur" src={avatar} alt="Logo" />
        <h1>Modérateur</h1>
      </div>
      <h2>Gérer les publications :</h2>
      {yourUploads.map((val, key) => {
        if (val.image) {
          return (
            <div className="moderateur" key={val.idthread}>
              <div className="Post">
                <div className="Image">
                  <Image alt= {val.title} cloudName="dzbs5syc9" publicId={val.image} />
                </div>
                <div className="Content">
                  <div className="title">
                    {" "}
                    {val.title} / publié par {val.author} le {val.date.slice(0, 10)}
                  </div>
                  <div className="description">{val.description}</div>
                  <div className="Engagement">
                    <ThumbUpAltIcon id="likeButton" />
                    {val.likecount}
                  </div>
                </div>
              </div>
              <div className="buttons">
              <button className="btn-post" onClick={() => { deleteThread(val.idthread, key); }}>Supprimer</button>
              </div>
            </div>
          );
        } else {
          return (
            <div className="moderateur" key={val.idthread}>
              <div className="Post">
                <div className="Content">
                  <div className="title">
                    {val.title} / publié par {val.author} le {val.date.slice(0, 10)}
                  </div>
                  <div className="description">{val.description}</div>
                  <div className="Engagement">
                    <ThumbUpAltIcon id="likeButton" />
                    {val.likecount}
                  </div>
                </div>
              </div>
              <div className="buttons">
              <button className="btn-post" onClick={() => { deleteThread(val.idthread, key); }}>Supprimer</button>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default Moderateur;
