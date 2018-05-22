import React, { Component } from "react";
import socketIOClient from "socket.io-client";
//var classNames = require('./classnames.js');

class App extends Component {
    render() {
        return(
            <div id="frame">
                <SidePanel name={this.props.p.name} img={this.props.p.img} contacts={this.props.p.contacts} />
                <Content />
            </div>
        );
    }
}

 
/* this.props
name: "Mike Ross",
img: "http://emilcarlsson.se/assets/mikeross.png",
contacts: [{
    name: "Louis Litt",
    img: "http://emilcarlsson.se/assets/louislitt.png"
}]
*/
class SidePanel extends Component {
    render() {
        var contacts = []
        for (let i=0; i<this.props.contacts.length; i++)
            contacts.push(<Contact name={this.props.contacts[i].name} img={this.props.contacts[i].img}/>);
        return(
            <div id="sidepanel">
                <div id="profile">
                    <div className="wrap">
                        <img id="profile-img" src={this.props.img} className="online" alt="" />
                        <p>{this.props.name}</p>
                        <div id="status-options">
                            <ul>
                                <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                                <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                                <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                                <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="search">
                    <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                    <input type="text" placeholder="Search contacts..." />
                </div>
                <div id="contacts">
                    <ul>
                        {contacts}
                    </ul>
                </div>
                <div id="bottom-bar">
                    <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span></button>
                    <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
                </div>
            </div>
        );
    }
}


class Content extends Component {
    render() {
        return(
            <div className="content">
                <div className="contact-profile">
                    <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                    <p>Harvey Specter</p>
                    <div className="social-media">
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                        <i className="fa fa-twitter" aria-hidden="true"></i>
                        <i className="fa fa-instagram" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="messages">
                    <ul>
                        <li className="sent">
                            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
                            <p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
                        </li>
                        <li className="replies">
                            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                            <p>When you're backed against the wall, break the god damn thing down.</p>
                        </li>
                    </ul>
                </div>
                <div className="message-input">
                    <div className="wrap">
                    <input type="text" placeholder="Write your message..." />
                    <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                    <button className="submit"><i className="fa fa-paper-plane fa-lg" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
        );
    }
}

/*
name: "Louis Litt",
img: "http://emilcarlsson.se/assets/louislitt.png"

*/
class Contact extends Component {
    render() {
        return(
            <li className="contact">
                <div className="wrap">
                    <span className="contact-status online"></span>
                    <img src={this.props.img} alt="" />
                    <div className="meta">
                        <p className="name">{this.props.name}</p>
                        <p className="preview">You just got LITT up, Mike.</p>
                    </div>
                </div>
            </li>
        );
    }
}
export default App;





/* reference:

      $(function () {
        var socket = io();
        $('form').submit(function(){
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
        });
        socket.on('chat message', function(msg){
          $('#messages').append($('<li>').text(msg));
        });
      });

*/

/*

constructor() {
    super();
    this.state = {
      endpoint: "http://localhost:4001",
      color: 'white'
    };
  }

  // sending sockets
  send = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('change color', this.state.color) // change 'red' to this.state.color
  }
  
  // adding the function
  setColor = (color) => {
    this.setState({ color })
  }

  render() {
    // testing for socket connections

    const socket = socketIOClient(this.state.endpoint);
    socket.on('change color', (col) => {
      document.body.style.backgroundColor = col
    })

    return (
      <div style={{ textAlign: "center" }}>
        <button onClick={() => this.send() }>Change Color</button>
        <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
        <button id="red" onClick={() => this.setColor('red')}>Red</button>
      </div>
    )
  }

*/