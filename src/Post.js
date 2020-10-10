import React, { useState, useEffect, forwardRef } from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import firebase from 'firebase';


const Post = forwardRef(
    ({ user, username, postId, imageUrl, caption }, ref) => {
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
            alt="{username}"
            src="https://images.unsplash.com/photo-1545996124-0501ebae84d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
            />
            <h3>{username}</h3>
            </div>
            
            {/* Heade _> avatar + username */ }

            <img className="post__image" src={imageUrl} alt="" />
            {/* image */}

            <h4 className="post__text"> <strong>{username}</strong> {caption}</h4>
            {/* Username and Caption */}

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong>
                        {comment.text}
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
