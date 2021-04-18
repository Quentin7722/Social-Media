import React, { useEffect, useState } from "react";
import "./Home.css";
import { Image } from "cloudinary-react";
import Axios from "axios";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ChatIcon from '@material-ui/icons/Chat';
import avatar from 'C:/Users/quent/Desktop/Projet 7/client/src/assets/avatar.png';

function Home(props) {
  const [showId, setShowId] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [threadComments, setThreadcomments] = useState([]);
  const [commentaire, setComments] = useState("");
  const token = localStorage.getItem("token");
  const toggleDescription = (idthread) => { setShowId(showId => showId === idthread ? null : idthread); };

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
    if (1) {
      Axios.post("http://localhost:3001/thread/comment", {
        idthread: idthread,
        commentaire: commentaire,
      }, {
        headers: {
          'Authorization': `bearer ${token}`
        }
      }).then((response) => {
        setThreadcomments(response.data);
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
                <ChatIcon id="commentButton" onClick={function (event) { toggleDescription(val.idthread); getComment(val.idthread); }} />
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
                    </div>
                  ) : (null)}
                  {threadComments.map((com, index) => {
                    return (
                      <div key={index} className="post-bottom">
                        <img className="img-comment" src={avatar} alt="Logo" />
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
                <div className="title">
                  {" "}
                  {val.title} / publié par {val.author} le {val.date.slice(0, 10)}
                </div>
                <div className="description">{val.description}</div>
              </div>
              <div className="Engagement">
                <ThumbUpAltIcon id="likeButton" onClick={() => { likePost(val.idthread); }} />
                <div className="counts">{val.likecount}</div>
                <ChatIcon id="commentButton" onClick={function (event) { toggleDescription(val.idthread); getComment(val.idthread); }} />
                <div className="counts">{val.commentcount}</div>
              </div>
              {showId === val.idthread && ( // <-- check for index match
                <div className="comments">
                  <input
                    value={commentaire}
                    className="input-comment"
                    type="text"
                    placeholder="répondre..."
                    onChange={(event) => {
                      setComments(event.target.value);
                    }}
                  />
                  <button className="btn-comment" onClick={() => { comment(val.idthread); }}>Envoyer</button>
                  {threadComments.map((com, index) => {
                    return (
                      <div key={index} className="post-bottom">
                        <img className="img-comment" src={avatar} alt="Logo" />
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
