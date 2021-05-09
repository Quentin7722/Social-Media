import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import "./Profile.css";
import avatarDefault from '../../assets/avatar.png';
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { useHistory } from "react-router-dom";

function Profile() {
  const [yourUploads, setYourUploads] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [showId, setShowId] = useState(null);
  const toggleModify = (idthread) => { setShowId(showId => showId === idthread ? null : idthread); };
  const [avatar, setAvatar] = useState([]);
  const [checkNewAvatar, setcheckNewAvatar] = useState(true);
  const [newAvatar, setnewAvatar] = useState("");

  let history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    Axios.get(`http://localhost:3001/thread/byUser/${localStorage.getItem("username")}`, {
      headers: { 'Authorization': `bearer ${token}` }
    }).then((response) => {
      setYourUploads(response.data[0]);
      if (response.data[1][0].avatar == null) {
        setcheckNewAvatar(false)
      } else {
        setnewAvatar(response.data[1][0].avatar)
      }
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", avatar[0]);
    formData.append("upload_preset", "h0vs2ijr");
    if (avatar.length > 0) {
      Axios.post(
        `https://api.cloudinary.com/v1_1/dzbs5syc9/image/upload`,
        formData
      ).then((response) => {
        const fileName = response.data.public_id;
        Axios.post("http://localhost:3001/user/avatar", {
          image: fileName,
        }, {
          headers: {
            'Authorization': `bearer ${token}`
          }
        }).then((response) => {
          setnewAvatar(response.data[0].avatar)
        })
      });
    }
  }, [avatar]);


  const deleteThread = (image, idthread) => {
    Axios.delete("http://localhost:3001/thread/delete", {
      headers: { 'Authorization': `bearer ${token}` },
      data: {
        idthread: idthread,
        username: username,
        image: image
      }
    }).then((response) => {
      setYourUploads(response.data[3]);
    });
  };

  const deleteProfile = () => {
    Axios.delete("http://localhost:3001/user/delete", {
      headers: { 'Authorization': `bearer ${token}` },
    }).then((response) => {
      localStorage.removeItem("role");
      localStorage.setItem("loggedIn", "false");
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      history.push("/");
    });
  };

  const modify = (idthread) => {
    checkTextInput();
    if (checkTextInput() === true) {
      Axios.post("http://localhost:3001/thread/modify", {
        title: title,
        description: description,
        idthread: idthread,
      }, {
        headers: {
          'Authorization': `bearer ${token}`
        }
      }).then((response) => {
        setYourUploads(response.data);
        toggleModify(idthread);
      }).catch(function (error) {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        }
      });
    }
  };

  const checkTextInput = () => {
    if (!title.trim()) {
      setErrorMessage("Le champ du titre est vide");
      return false;
    } else if (!description.trim()) {
      setErrorMessage("Le champ de la description est vide");
      return false;
    } else {
      return true;
    }
  };

  return (
    <main className="Profile">
      <article className="profile-top">
        <div className="user-info">
          {checkNewAvatar ? (<Image alt="Avatar" cloudName="dzbs5syc9" publicId={newAvatar} className="img-profile" />) : (<img className="img-profile" src={avatarDefault} alt="Default Avatar" />)}
          <h1>{localStorage.getItem("username")}</h1>
          <button className="btn-profile" onClick={deleteProfile}>Supprimer le compte</button>
        </div>
        <div>
          <label htmlFor="file" className="label-file">Changer d'avatar</label>
          <input id="file" type="file" onChange={(e) => setAvatar(e.target.files)} className="input-avatar"></input>
        </div>
      </article>
      <h2>Vos publications :</h2>
      {yourUploads.map((val) => {
        console.log("val", val)
        if (val.image) {
          return (
            <article className="thread-profile" key={val.idthread}>
              <div className="Post">
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
                  </div>
                </div>
              </div>
              <div className="buttons">
                <button className="btn-post" onClick={() => { deleteThread(val.image, val.idthread) }}>Supprimer</button>
                <button className="btn-update" onClick={() => { toggleModify(val.idthread) }}>Modifier</button>
              </div>
              {showId === val.idthread && (
                <div className="input-upload">
                  <h3>Titre</h3>
                  <input
                    type="text"
                    placeholder={val.title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                  />
                  <h3>Description</h3>
                  <textarea
                    placeholder={val.description}
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }}
                  />
                  <button onClick={() => { modify(val.idthread) }}>Confirmer la modification</button>
                  <p className="msg-err">{errorMessage}</p>
                </div>
              )}
            </article>
          );
        } else {
          return (
            <article className="thread-profile" key={val.idthread}>
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
                <button className="btn-post" onClick={() => { deleteThread(val.image, val.idthread) }}>Supprimer</button>
                <button className="btn-update" onClick={() => { toggleModify(val.idthread) }}>Modifier</button>
              </div>
              {showId === val.idthread && (
                <div className="input-upload">
                  <h3>Titre</h3>
                  <input
                    type="text"
                    placeholder={val.title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                  />
                  <h3>Description</h3>
                  <textarea
                    type="text"
                    placeholder={val.description}
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }} />
                  <button onClick={() => { modify(val.idthread) }}>Confirmer la modification</button>
                  <p className="msg-err">{errorMessage}</p>
                </div>
              )}
            </article>
          );
        }
      })}
    </main>
  );
}

export default Profile;
