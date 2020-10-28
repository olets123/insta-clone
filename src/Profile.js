import React, { useState } from 'react'
import './Profile.css'
import { Input, Button, Avatar } from '@material-ui/core';
import firebase from "firebase";
import { storage, db } from './firebase';


function Profile({ username }) {

    const [profilePicture, setProfilePicture] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`profilePictures/${profilePicture.name}`).put(profilePicture);

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
                .ref("profilePictures")
                .child(profilePicture.name)
                .getDownloadURL()
                .then((url) => {
                    setUrl(url);
                
                    db.collection('posts').add({
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                      imageUrl: url,
                      username: username
                    });

                    setProgress(0);
                    setProfilePicture(null);
            })

          }
        )
    }
    return (
        <div className="profile">
            <div className="profileUpload">
            <h1>Edit Profile</h1>
            

            <Input className="input__caption" type="text" placeholder=" Username"  />
            <Input className="input__caption" type="text" placeholder=" Enter your mail" />
            <label className="input__caption">Update Profile Image</label>
            <div className="profile__upload">
                <label>Choose image</label>
            <input type="file" name="upload" onChange={handleChange} />
            </div>
            <progress className="profileUpload__progress" value={progress} max ="100" />
            <Button className="profileUpload__button" onClick={handleUpload}>
                Save
            </Button>
        </div>
        </div>
    )
}

export default Profile
