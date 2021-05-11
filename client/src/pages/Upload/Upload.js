import React, { useState, useRef } from "react";
import "./Upload.css";
import Axios from "axios";
import { useHistory } from "react-router-dom";

function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const token = localStorage.getItem("token");
  const [errorMessage, setErrorMessage] = useState("");
  const reference = useRef();

  let history = useHistory();

  const upload = () => {
    reference.current.setAttribute("disabled", "disabled");
    const formData = new FormData();
    formData.append("file", image[0]);
    formData.append("upload_preset", "h0vs2ijr");
    checkTextInput();
    if(checkTextInput() === true){
      if (image.length > 0 ){
        Axios.post(
          `https://api.cloudinary.com/v1_1/dzbs5syc9/image/upload`,
          formData
        ).then((response) => {
          const fileName = response.data.public_id;
          Axios.post("http://localhost:3001/thread", {
            title: title,
            description: description,
            image: fileName,
            author: localStorage.getItem("username")}, {
              headers: {
                'Authorization': `bearer ${token}` 
              } 
          }).then(() => {
            history.push("/");
          });
        });
      }else{
        Axios.post("http://localhost:3001/thread", {
          title: title,
          description: description,
          author: localStorage.getItem("username")}, {
            headers: {
              'Authorization': `bearer ${token}` 
            } 
        }).then(() => {
          history.push("/");
        });
      }
    }  
  };
  
  const checkTextInput = () => {
    if(!title.trim() && !description.trim()){
      setErrorMessage("Les champs titre et description sont vides");
      return false;
    } else if (!title.trim()) {
      setErrorMessage("Le champ titre est vide");
      return false;
    } else if (!description.trim()) {
      setErrorMessage("Le champ description est vide");
      return false;
    } else {
      setErrorMessage(null)
      return true;
    }
  };

  return (
    <main className="Upload">
      <article className="UploadForm">
      <h1>Publier un article</h1>
      <label className="label-img" htmlFor="input-title">Choisir un titre</label>
        <input
          id="input-title"
          type="text"
          placeholder="Titre..."
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <label className="label-img" htmlFor="textarea-description">Choisir une description</label>
        <textarea
          id="textarea-description"
          className="description-input"
          type="text"
          placeholder="Description..."
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          >
        </textarea>
        <label className="label-img" htmlFor="file">Choisir une image</label>
        <input id ="file" className="img-input" type="file" onChange={(e) => setImage(e.target.files)} />
        <button ref={reference} value="Publication" onClick={() => upload()}>Publier</button>
      </article>
      <p className="msg-err">{errorMessage} </p>
    </main>
  );
}

export default Upload;
