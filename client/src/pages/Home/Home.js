import React, { useEffect, useState } from "react";
import "./Home.css";
import { Image } from "cloudinary-react";
import Axios from "axios";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ChatIcon from '@material-ui/icons/Chat';
import avatar from '../../assets/avatar.png';

function Home(props) {
  const [showId, setShowId] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [threadComments, setThreadcomments] = useState([]);
  const [commentaire, setComments] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");
  const toggleComments = (idthread) => { setShowId(showId => showId === idthread ? null : idthread); };

  useEffect(() => {
    Axios.get("http://localhost:3001/thread").then((response) => {
      const order = response.data.reverse()
      setUploads(order);
    });
  }, []);

  const likePost = (idthread) => {
    Axios.post("http://localhost:3001/thread/like", {
      idthread: idthread,
    }, {
      headers: {
        'Authorization': `bearer ${token}`
      }
    }).then((response) => {
      const order = response.data.reverse()
      setUploads(order);
    });
  };

  const comment = (idthread) => {
    if (checkTextInput() === true) {
      Axios.post("http://localhost:3001/thread/comment", {
        idthread: idthread,
        commentaire: commentaire,
      }, {
        headers: {
          'Authorization': `bearer ${token}`
        }
      }).then((response) => {
        const order = response.data[1].reverse()
        setUploads(order)
        setThreadcomments(response.data[0]);
        setComments("");
      });
    }
  };

  const getComment = (idthread) => {
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

  const checkTextInput = () => {
    if (!commentaire.trim()) {
      setErrorMessage("Veuillez remplir le champ");
      return false;
    } else {
      setErrorMessage(null);
      return true;
    }
  };


  return (
    <div className="Home">
      <h1>Les Dernières Publications :</h1>
      {uploads.map((val) => {
        if (val.image) {
          return (
            <div className="Post" key={val.idthread} >
              <div className="Image">
                <Image alt={val.title} cloudName="dzbs5syc9" publicId={val.image} />
              </div>
              <div className="Content">
                <div className="title">
                  {val.title} / publié par {val.author} le {val.date.slice(0, 10)}
                </div>
                <div className="description">{val.description}</div>
              </div>
              <div className="Engagement">
                <ThumbUpAltIcon id="likeButton" onClick={() => { likePost(val.idthread); }} />
                <div className="counts">{val.likecount}</div>
                <ChatIcon id="commentButton" onClick={function (event) { toggleComments(val.idthread); getComment(val.idthread); }} />
                <div className="counts">{val.commentcount}</div>
              </div>
              {showId === val.idthread && (
                <div className="comments">
                  {props.isLoggedIn ? (
                    <div className="send-com">
                      <input
                        className="input-comment"
                        value={commentaire}
                        type="text"
                        placeholder="répondre..."
                        onChange={(event) => {
                          setComments(event.target.value);
                        }} />
                      <button className="btn-comment" onClick={() => { comment(val.idthread); setComments("") }}>Envoyer</button>
                      <p className="msg-err">{errorMessage} </p>
                    </div>
                  ) : (null)}
                  {threadComments.map((com, index) => {
                    return (
                      <div key={index} className="post-bottom">
                        {com.avatar  === null &&(<img className="img-comment" src={avatar} alt="Logo" />)}
                        {com.avatar  != null &&(<Image alt="avatar" cloudName="dzbs5syc9" publicId={com.avatar} className="img-comment" />)}
                        <div className="comment">
                          <p className="userComment">{com.usercomment}</p>
                          <p>{com.comment}</p>
                        </div>
                      </div>)
                  })}
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div className="Post" key={val.idthread}>
              <div className="Content">
                <div className="title-txt">
                  {val.title} / publié par {val.author} le {val.date.slice(0, 10)}
                </div>
                <div className="description">{val.description}</div>
              </div>
              <div className="Engagement">
                <ThumbUpAltIcon id="likeButton" onClick={() => { likePost(val.idthread); }} />
                <div className="counts">{val.likecount}</div>
                <ChatIcon id="commentButton" onClick={function (event) { toggleComments(val.idthread); getComment(val.idthread); }} />
                <div className="counts">{val.commentcount}</div>
              </div>
              {showId === val.idthread && ( // <-- check for index match
                <div className="comments">
                   {props.isLoggedIn ? (
                    <div className="send-com">
                      <input
                        className="input-comment"
                        value={commentaire}
                        type="text"
                        placeholder="répondre..."
                        onChange={(event) => {
                          setComments(event.target.value);
                        }} />
                      <button className="btn-comment" onClick={() => { comment(val.idthread); setComments("") }}>Envoyer</button>
                      <p className="msg-err">{errorMessage} </p>
                    </div>
                  ) : (null)}
                  {threadComments.map((com, index) => {
                    return (
                      <div key={index} className="post-bottom">
                        {com.avatar  === null &&(<img className="img-comment" src={avatar} alt="Logo" />)}
                        {com.avatar  != null &&(<Image alt="avatar" cloudName="dzbs5syc9" publicId={com.avatar} className="img-comment" />)}
                        <div className="comment">
                          <p className="userComment">{com.usercomment}</p>
                          <p>{com.comment}</p>
                        </div>
                      </div>)
                  })}
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
}

export default Home;
