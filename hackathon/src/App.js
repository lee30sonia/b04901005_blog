import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import './App.css';
import logo from './image/logo.png';

const socket = socketIOClient("http://localhost:4001");

/*
socket.emit('login', this.state.name);

socket.on('new user', (obj) => { });
*/

class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            me: null,
            loggedIn: false
        };
        this.login = this.login.bind(this);
    }

    login(person) {
        this.setState({loggedIn: true, me: person});
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <div class="container"> 
                    <p> Successfully logged in as {this.state.me.name}!! </p>
                </div>
            );
        }
        else{
            return (<LoginPage login={(person)=>{this.login(person);}}/>);
        }
    }
}

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            username: null,
            password: null
        };
        this.login = this.login.bind(this);
    }

    login(username, password)
    {
        console.log('login')
        socket.emit('login request', {username: username, password: password});
        socket.on('login success', (person) => {
            this.props.login(person);
        })
        socket.on('login failed', () => {
            alert('wrong username/password!');
            this.setState({username: '', password: ''});
        })
    }

    render() {
        return(
            <div id="loginPage" class="container"><div class="notification">

<div class="field">
  <label class="label">Username</label>
  <div class="control has-icons-left has-icons-right">
    <input class="input" type="text" placeholder="Username" value={this.state.username}
        onChange={(evt) => this.setState({username: evt.target.value})}/>
    <span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>
  </div>
</div>

<div class="field">
  <label class="label">Password</label>
  <p class="control has-icons-left">
    <input class="input" type="password" placeholder="Password" value={this.state.password}
        onChange={(evt) => this.setState({password: evt.target.value})}
        onKeyPress={ (event)=>{ if(event.key === 'Enter') this.login(this.state.username, this.state.password); }}/>
    <span class="icon is-small is-left">
      <i class="fas fa-lock"></i>
    </span>
  </p>
</div>

<div class="field is-grouped">
  <div class="control">
    <button class="button is-link" onClick={() => {this.login(this.state.username, this.state.password);}}>
        Submit
    </button>
  </div>
  <div class="control">
    <button class="button is-text">Cancel</button>
  </div>
</div>
            </div></div>
        );
    }
}


/*
class Nav extends Component {
    render() {
        return(
            <div>
                <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="index.html">
                            <img src={logo} />
                        </a>
                        
                        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                      </a>
                    </div>
                </nav>  
            </div>
        );
    }
}
*/
export default App;
