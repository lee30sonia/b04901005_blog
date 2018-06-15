import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import ImageUploader from 'react-images-upload';
import ImageLoader from 'react-image-file';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import green from '@material-ui/core/colors/green';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ImageIcon from '@material-ui/icons/Image';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

//var classNames = require('./classnames.js');
const socket = socketIOClient("http://localhost:4001");

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.primary.light,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  success: {
    backgroundColor: green[600],
  },
  icon: {
    fontSize: 20,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  addBtn: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

const App = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state={
          me: null,
          loggedIn: false,
          articles: [{
        title: "Hello world!",
        text: "This is the very first post of this diary!",
        poster: "Admin", _id: 0
    }]
      };
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
      this.newPost = this.newPost.bind(this);
    }

    login(person) {
      this.setState({loggedIn: true, me: person});
    }

    logout() {
      this.setState({loggedIn: false, me: null});
    }

    newPost(a)
    {
      console.log(this.state.articles.find((obj)=>{obj._id===a._id}))
      if (!this.state.articles.find((obj)=>{obj._id===a._id}))
        this.setState({articles: this.state.articles.concat([a])});
      console.log(this.state.articles)
    }

    render() {
      const { classes } = this.props;
      var addBtn = this.state.loggedIn? 
      (<PostDialog me={this.state.me} reRender={this.newPost}/>): 
      (<div/>);

      return (
        <div className="App">
          <div className={classes.root+" root"}>
            <Grid container className="Nav">
              <Grid item xs={12}>
              <AppBar position="static">
                <Toolbar>
                  <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="title" color="inherit" className={classes.flex}>
                    My Diary
                  </Typography>
                  <LoginDialog 
                    login={(person)=>{this.login(person);}} 
                    logout={()=>{this.logout();}} 
                    loggedIn={this.state.loggedIn} />
                </Toolbar>
              </AppBar>
              </Grid>
            </Grid>

            <Grid container spacing={24}>
              <Grid item xs={3}>
                <ArticleList articles={this.state.articles}/>
              </Grid>
              <Grid item xs>
                <Articles articles={this.state.articles}/>
              </Grid>
            </Grid>

            {addBtn}
          </div>
        </div>
      );
    }
  }
);

const ArticleList = withStyles(styles)(
  class extends Component {
    render() {
      const { classes } = this.props;

      var list = this.props.articles.map((article)=> (
        <ListItem>
          <ListItemText primary={article.title} secondary={article.text} />
        </ListItem>
      ) );

      return (
        <List className={classes.list}>
          {list}
        </List>
      );
    }
  }
);

const Articles = withStyles(styles)(
  class extends Component {
    render() {
      const { classes } = this.props;
      var list = this.props.articles.map((article)=> (
        <Article title={article.title} text={article.text} poster={article.poster} img={article.image}/>
      ));
      return (
        <div>
          {list}
        </div>
      );
    }
  }
);

const Article = withStyles(styles)(
  class extends Component {
    render() {
      const { classes } = this.props;
      return (
        <Paper className={classes.paper+" article"}>
          <h3>{this.props.title}</h3>
          <p className="poster"> By {this.props.poster} </p>
          
          <p>{this.props.text}</p>
        </Paper>
      );

      //<ImageLoader className="img" file={this.props.img} />
    }
  }
);

const LoginDialog = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state={
        open: false, 
        snackBarOpen: false,
        username: null,
        password: null
      };   
      this.handleClickOpen = this.handleClickOpen.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.snackBarClose = this.snackBarClose.bind(this);
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
    }
  
    handleClickOpen = () => {
      this.setState({ open: true });
    };
  
    handleClose = () => {
      this.setState({ open: false });
    };

    snackBarClose()
    {
      this.setState({snackBarOpen: false});
    }
  
    login(username, password)
    {
      socket.emit('login request', {username: username, password: password});
      socket.on('login success', (person) => {
        this.props.login(person);
        this.setState({snackBarOpen: true});
      })
      socket.on('login failed', () => {
        alert('wrong username/password!');
        this.setState({username: '', password: ''});
      })
      this.handleClose();
    }

    logout()
    {
      socket.emit('logout request');
      socket.on('logout success', () => {
        this.props.logout();
        //this.setState({snackBarOpen: true});
      })
    }
  
    render() {
      const { classes } = this.props;

      var login = (<Button color="inherit" onClick={this.handleClickOpen}>Login</Button>);
      var logout = (<Button color="inherit" onClick={this.logout}>Logout</Button>);
      var button = this.props.loggedIn? logout: login;
      return (
        <div>
          {button}
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Login</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please login to post new diaries.
              </DialogContentText>
  
              <div className={classes.margin}>
                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <AccountCircle />
                  </Grid>
                  <Grid item>
                    <TextField label="Username" 
                    onChange={(evt) => this.setState({username: evt.target.value})}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <i className="material-icons">lock</i>
                  </Grid>
                  <Grid item>
                    <TextField label="Password" type="password"
                    onChange={(evt) => this.setState({password: evt.target.value})}
                    onKeyPress={ (event)=>{ if(event.key === 'Enter') this.login(this.state.username, this.state.password); }}
                    />
                  </Grid>
                </Grid>

              </div>
  
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={() => {this.login(this.state.username, this.state.password);}} 
                color="primary">
                Login
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.snackBarOpen}
            autoHideDuration={4000}
            onClose={this.snackBarClose}
          >
            

            <SnackbarContent
              className={classes.success}
              aria-describedby="client-snackbar"
              message={
                <span className={classes.message}>
                  <CheckCircleIcon className="success" />
                  Logged in successfully!
                </span>
              }
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={this.snackBarClose}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>,
              ]}
            />

          </Snackbar>
        </div>
      );
    }
  }
);

const PostDialog = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state={
        open: false, 
        snackBarOpen: false,
        title: null,
        text: null,
        img: null
      };   
      this.handleClickOpen = this.handleClickOpen.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.snackBarClose = this.snackBarClose.bind(this);
      this.onDrop = this.onDrop.bind(this);
    }
  
    handleClickOpen = () => {
      this.setState({ open: true });
    };
  
    handleClose = () => {
      this.setState({ open: false, img: null });
    };

    snackBarClose()
    {
      this.setState({snackBarOpen: false});
    }
    
    onDrop(img) {
      this.setState({
          img: img[0]
      });
    }

    post() {
      console.log(this.state.img)
      socket.emit('post request', {
        title: this.state.title, 
        image: this.state.img, 
        text: this.state.text, 
        poster: this.props.me.name
      });
      this.handleClose();
      socket.on('new post', (obj) => {
        this.setState({snackBarOpen: true})
        this.props.reRender(obj);
      })
    }

/*    fileChangedHandler = (event) => {
  this.setState({img: event.target.files[0]})
}

uploadHandler = () => { 
  console.log(this.state.img)
}*/
  
    render() {
      const { classes } = this.props;
      var img = (this.state.img!==null)?(<ImageLoader className="img" file={this.state.img} />):(<div/>);
      return (
        <div>
          <Tooltip title="Post new diary">
            <Button variant="fab" color="primary" className={classes.addBtn}
              onClick={this.handleClickOpen}
            >
              <AddIcon />
            </Button>
          </Tooltip>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">New Diary</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Write some words to post a new diary!
              </DialogContentText>
  
              <div className={classes.margin}>
                

                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <TextField label="Title" 
                    onChange={(evt) => this.setState({title: evt.target.value})}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <TextField label="What's in your mind..." 
                    onChange={(evt) => this.setState({text: evt.target.value})}
                    />
                  </Grid>
                </Grid>
              </div>
  
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={() => {this.post();}} 
                color="primary">
                Post
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.snackBarOpen}
            autoHideDuration={4000}
            onClose={this.snackBarClose}
          >
            

            <SnackbarContent
              className={classes.success}
              aria-describedby="client-snackbar"
              message={
                <span className={classes.message}>
                  <CheckCircleIcon className="success" />
                  Article posted successfully!
                </span>
              }
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.close}
                  onClick={this.snackBarClose}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>,
              ]}
            />

          </Snackbar>
        </div>
      );

      /*
              {img}
                <ImageUploader
                  withIcon={true}
                  buttonText='Choose image'
                  onChange={this.onDrop}
                  imgExtension={['.jpg', '.png', '.gif']}
                  maxFileSize={5242880}
                />
      */
    }
  }
);

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default App;
