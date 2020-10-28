import React, {useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Post from './Post';
import './App.css';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { Button, Input, withStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload';
import Avatar from "@material-ui/core/Avatar";
import FlipMove from 'react-flip-move';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsApplicationsRoundedIcon from '@material-ui/icons/SettingsApplicationsRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import Profile from './Profile';
import Footer from './Footer';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
} 

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 250,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  // style from materialUI
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  

  /* Hooks */
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {

   const unsubscribe = auth.onAuthStateChanged((authUser) => {

      if (authUser) { // if user is logged in
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // dont update username
        

      } else {
        return authUser.updateProfile({
          displayName: username,
        
        });
       }
      } else { // if user is not logged in
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  // useEffect runs a piece of code based on a specific condition 

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // map and create object with keys
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile({
         displayName: username,
        
       })
     }) 
    .catch((error) => alert(error.message))

    setOpenSignUp(false);
  } 

  const signIn = (e) => {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (

    <Router >
    <div className="app">
    
      <header className="App-header">
       {/* Header */}
      <div className="app__header">
      <Link to ="/">
      <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                alt=""
              />
    </Link>
      
       {/* <h1>Summitity</h1> */}
        <Modal
        open={open}
        onClose={() => setOpen(false)}
        >

        <div style={modalStyle} className={classes.paper}>
         
        <form className="app__signup" >
        <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                alt=""
              />
          
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <Button className="button__signUp" type="submit" onClick={signUp}>Register</Button>
             </form>
             </div>
      </Modal>

      

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        >

        <div style={modalStyle} className={classes.paper}>
         
        <form className="app__signup" >
        <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                alt="logo"
              />
          
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <Button className="button__signIn" type="submit" onClick={signIn}>Sign In</Button>
             </form>
             </div>
      </Modal>

      
      
      {user ? (
          <div className="app__headerRight">
        <Link to="/" className="app__feed"><HomeRoundedIcon /></Link>
        <Link to="/upload"> <AddAPhotoIcon /></Link>
        
        <StyledBadge
        overlap="circle"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        variant="dot"
          >
          <Avatar
            className="app__headerAvatar"
            onClick={handleClick}
          />
          </StyledBadge>
           <Menu

            className="app__menuAvatar"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            >
          <MenuItem className="app__menuItem" onClick={handleClose}> <AccountBoxIcon /> <Link to="/profile"> My Account </Link></MenuItem>
          <MenuItem className="app__menuItem" onClick={handleClose}><SettingsApplicationsRoundedIcon /> Settings </MenuItem>
          <MenuItem className="app__menuItem" onClick={() => auth.signOut()}><ExitToAppSharpIcon /> Logout</MenuItem>
          </Menu>
         
          </div>

      ): (
        <div className="app__loginContainer">
        <Button className="button__signIn"  onClick={() => setOpenSignIn(true)}>Sign In</Button>
        <Button className="button__signUp"  onClick={() => setOpen(true)}>Sign Up</Button>
        
        </div>
      )}
      </div>
      </header>



      <Switch>
      <Route path="/upload">
      <div className="app__upload">
        {user?.displayName ? (
        <ImageUpload username={user.displayName} />
        ): (
        <h3 className="uploadMessage">Sorry bro :( You need to login to upload </h3>
        )}
      </div>
          </Route>
          <Route path="/profile">
            <Profile/>
          </Route>

          <Route path="/">
          <div className="app__posts">
        <FlipMove>
      {
            posts.map(({id, post}) => (
              <Post key={id} postId={id}
               user={user} 
               username={post.username} 
               caption={post.caption}
               hashtag={post.hashtag} 
               timestamp={post.timestamp}
               imageUrl={post.imageUrl} />
            ))
          }
        </FlipMove>
      </div>
      <Footer />
          </Route>
        </Switch>

      


      

      
    </div>
    </Router>
    
  );
}

export default App;
