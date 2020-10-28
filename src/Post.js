import React, { useState, useEffect, forwardRef } from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar";
import { db, storage } from './firebase';
import firebase from 'firebase';
import * as timeago from 'timeago.js';



const Post = forwardRef(
    ({ user, username, postId, imageUrl, caption, hashtag, timestamp, url }, ref) => {
      const [comments, setComments] = useState([]);
      const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return () => {
            unsubscribe();
          };
        }, [postId]);


        const postComment = (e) => {
            e.preventDefault();

             db.collection("posts").doc(postId).collection("comments").add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
              });

              setComment("");
        };

    return (
        <div className="post">
            <div className="post__header">
            <Avatar 
            className="post__avatar"
            alt={username}
            src={username}
            />
            <h3>{username}</h3>
            <small className="post__date">
            {timeago.format(new Date(timestamp?.toDate()))}
            </small>
            </div>
            
            {/* Header _> avatar + username */ }

            <img className="post__image" src={imageUrl} alt="" />
            {/* image */}
            <div className="post__main">
            <h4 className="post__text"> 
            <strong className="post__username">
            {username}</strong> 
            {caption}</h4> 
            <h5 className="post__hashtag">{hashtag}</h5> 
            </div>

            {/* Username and Caption */}

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong>
                         {comment.text}
                   
                    <small className="post__commentDate">
                      {timeago.format(new Date(comment.timestamp?.toDate()))}
                    </small>
                    </p>
                ))}
            </div>
            {/* Comments */}

            {user && (

            <form className="post__commentBox">

                <input
                  className="post__input"
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
    
                <button
                  disabled={!comment}
                  className="post__button"
                  type="submit"
                  onClick={postComment}
                >
                  Post
                </button>
                </form>
            )}

        </div>
    )
});

export default Post
