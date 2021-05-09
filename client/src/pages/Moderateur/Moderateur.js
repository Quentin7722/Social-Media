import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import "./Moderateur.css";
import avatar from '../../assets/avatar.png';
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ChatIcon from '@material-ui/icons/Chat';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

function Moderateur() {
  
  const [showId, setShowId] = useState(null);
  const [yourUploads, setYourUploads] = useState([]);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const toggleComments = (idthread) => { setShowId(showId => showId === idthread ? null : idthread); };
  const [threadComments, setThreadcomments] = useState([]);
  const [ariaExpanded, setariaExpanded] = useState("false");

  useEffect(() => {
    const token = localStorage.getItem("token");
    Axios.get(`http://localhost:3001/thread`, {
      headers: { 'Authorization': `token ${token}` }
    }).then((response) => {
      console.log(response)
      setYourUploads(response.data);
    });
  }, []);

  const deleteThread = (idthread, image) => {
    Axios.delete("http://localhost:3001/thread/delete", {
      headers: { 'Authorization': `bearer ${token}` },
      data: {
        idthread: idthread,
        username: username,
        image: image
      }
    }).then((response) => {
      setYourUploads(response.data[4]);
    });
  };

  const getComment = (idthread) => {
    if(ariaExpanded === "true"){setariaExpanded("false")}else{setariaExpanded("true")}
    Axios.post("http://localhost:3001/thread/getComments", {
      idthread: idthread,
    }, {
      headers: {
        'Authorization': `bearer ${token}`
      }
    }).then((response) => {
      setThreadcomments(response.data);
    });
  };

  const deleteComment = (idcomment, threadComment) => {
    Axios.delete("http://localhost:3001/thread/deleteComment", {
      headers: { 'Authorization': `bearer ${token}` },
      data: {
        idcomments: idcomment,
        threadComment: threadComment,
      }
    }).then((response) => {
      setThreadcomments(response.data[2]);
      setYourUploads(response.data[3])
    });
  };

  return (
    <main className="moderateur">
      <div className="moderateur-top">
        <img className="img-moderateur" src={avatar} alt="Avatar du profil" />
        <h1>Modérateur</h1>
      </div>
      <h2>Gérer les publications :</h2>
      {yourUploads.map((val, key) => {
        if (val.image) {
          return (
            <div className="moderateur" key={val.idthread}>
              <article className="Post">
                <div className="Image">
                  <Image alt={"Image de l'article " + val.title} cloudName="dzbs5syc9" publicId={val.image} />
                </div>
                <div className="Content">
                  <div className="title">
                    {val.title} / publié par {val.author} le {val.date.slice(0, 10)}
                  </div>
                  <div className="description">{val.description}</div>
                  <div className="Engagement">
                    <ThumbUpAltIcon id="likeButton" />
                    {val.likecount}
                    <button className="btn-icons" aria-expanded={ariaExpanded} aria-label="Comments" aria-controls="send-com" onClick={function (event) { toggleComments(val.idthread); getComment(val.idthread); }} ><ChatIcon id="commentButton"/></button>
                    <div className="counts">{val.commentcount}</div>
                  </div>
                  {showId === val.idthread && (
                    <div className="comments" id="send-com">
                      {threadComments.map((com, index) => {
                        return (
                          <div key={index} className="post-bottom">
                            {com.avatar === null && (<img className="img-comment" src={avatar} alt="Avatar du profil" />)}
                            {com.avatar != null && (<Image alt="avatar" cloudName="dzbs5syc9" publicId={com.avatar} className="img-comment" />)}
                            <div className="comment">
                              <p className="userComment">{com.usercomment}</p>
                              <p>{com.comment}</p>
                            </div>
                            <button className="icon-delete" onClick={() =>{ deleteComment(com.idcomments, val.idthread) } }><DeleteForeverIcon/></button>
                          </div>)
                      })}
                    </div>
                  )}
                </div>
              </article>
              <div className="buttons">
                <button className="btn-post" onClick={() => { deleteThread(val.idthread, key) }}>Supprimer</button>
              </div>
            </div>
          );
        } else {
          return (
            <div className="moderateur" key={val.idthread}>
              <article className="Post">
                <div className="Content">
                  <div className="title">
                    {val.title} / publié par {val.author} le {val.date.slice(0, 10)}
                  </div>
                  <div className="description">{val.description}</div>
                  <div className="Engagement">
                    <ThumbUpAltIcon id="likeButton"/>
                    {val.likecount}
                    <button className="btn-icons" aria-expanded={ariaExpanded} aria-controls="send-com" onClick={function (event) { toggleComments(val.idthread); getComment(val.idthread); }} ><ChatIcon id="commentButton"/></button>
                    <div className="counts">{val.commentcount}</div>
                  </div>
                  {showId === val.idthread && (
                    <div className="comments" id="send-com">
                      {threadComments.map((com, index) => {
                        return (
                          <div key={index} className="post-bottom">
                            {com.avatar === null && (<img className="img-comment" src={avatar} alt="Avatar du profil" />)}
                            {com.avatar != null && (<Image alt="avatar" cloudName="dzbs5syc9" publicId={com.avatar} className="img-comment" />)}
                            <div className="comment">
                              <p className="userComment">{com.usercomment}</p>
                              <p>{com.comment}</p>
                            </div>
                            <button className="icon-delete" onClick={() =>{ deleteComment(com.idcomments, val.idthread) } }><DeleteForeverIcon/></button>
                          </div>)
                      })}
                    </div>
                  )}
                </div>
              </article>
              <div className="buttons">
                <button className="btn-post" onClick={() => { deleteThread(val.idthread, key); }}>Supprimer</button>
              </div>
            </div>
          );
        }
      })}
    </main>
  );
}

export default Moderateur;
