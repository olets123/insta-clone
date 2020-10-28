import { Input, Button, Avatar } from '@material-ui/core';
import React, { useState } from 'react';
import firebase from "firebase";
import { storage, db } from './firebase';
import './ImageUpload.css';

function ImageUpload({username}) {

    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const [hashtag, setHashtag] = useState('');
    

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {

                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  );
                  setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                    setUrl(url);
                
                    db.collection('posts').add({
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                      caption: caption,
                      hashtag: hashtag,
                      imageUrl: url,
                      username: username
                    });

                    setProgress(0);
                    setCaption('');
                    setHashtag('');
                    setImage(null);
            })

          }
        )
    }

    return (

        <div className="imageupload">
            <Avatar 
            className="imageupload__avatar"
            alt={username}
            src={username}
            />
            <h1>Image Upload for <strong>{username}</strong></h1>
            
            <Input className="input__caption" type="text" placeholder=" Enter a caption" 
            onChange={event => setCaption(event.target.value)} value={caption} />
            <Input className="input__caption" type="text" placeholder=" Enter your hashtag"
            onChange={event => setHashtag(event.target.value)} value={hashtag} />
            <div className="imageupload__upload">
                <label>Choose image</label>
            <input type="file" name="upload" onChange={handleChange} />
            </div>
            
            <progress className="imageupload__progress" value={progress} max ="100" />
            <Button className="imageupload__button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
  }


export default ImageUpload
