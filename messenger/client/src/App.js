import React, { Component } from "react";
//import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
import default1 from "./default1.png"
import ding from "./facebook_messenger.mp3"
var classNames = require('./classnames.js');

const socket = socketIOClient("http://localhost:4001");

class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            name: '',
            img: default1,
            setting: true, 
            contacts: {},
            talking: null
        };
        this.setName = this.setName.bind(this);
    }

    setName() 
    {
        this.setState({setting: false}); 
        socket.emit('login', this.state.name);
    }

    render() {
        socket.on('new user', (obj) => {
            //console.log('state:',this.state.contacts)
            var con;
            if (obj.user.name !== this.state.name)
            {
                con = this.state.contacts;
                con[obj.user.key] = obj.user;
                con[obj.user.key].img = default1;
                con[obj.user.key].msg = [];

                this.setState({contacts: con});
            }
            else
            {
                con = obj.users;
                delete con[obj.user.key];
                for (let i in con) {
                    if (!('name' in con[i])) {
                        delete con[i];
                        continue;
                    }
                    con[i].img = default1;
                    con[i].msg = [];
                }
                this.setState({contacts: con, key: obj.user.key});
            }
        }); 

        socket.on('user leave', (user) => {
            if (user.name !== this.state.name)
            {
                var con = this.state.contacts;
                for (let i in con)
                {
                    if (con[i].key === user.key)
                    {
                        delete con[i];
                        break;
                    }
                }
                this.setState({contacts: con});
            }
        });

        socket.on('new msg', (obj)=> {
            var con = this.state.contacts;
            //console.log(this.state.contacts[obj.to])
            if (obj.from === this.state.key)
            {
                //sent by me
                if (obj.key === con[obj.to].msg.length)
                    con[obj.to].msg.push({me: true, msg: obj.msg});
            }
            else if (obj.to === this.state.key)
            {
                //I receive
                if (obj.key === con[obj.from].msg.length){
                    con[obj.from].msg.push({me: false, msg: obj.msg});
                    document.getElementById("audio").play();
                    con[obj.from].unread = true;
                }
            }
            this.setState({contacts: con});
        });

        if (this.state.setting)
            return( 
                <div> 
                <title> My messenger </title>
                <p> Please enter your user name: <br/> </p>
                <input onChange={(evt) => this.setState({name: evt.target.value})}
                    onKeyPress={ (event)=>{ if(event.key === 'Enter') this.setName(); }} />
                <button onClick={() => {this.setName();}} > OK </button>
                </div>
            );
        else
            var p;
            if (this.state.talking === null)
                p = null;
            else
                p = this.state.contacts[this.state.talking];

            return(
                <div id="frame">
                    <title> {this.state.name} </title>
                    <audio id="audio" src={ding} />
                    <SidePanel name={this.state.name} img={this.state.img} 
                            contacts={this.state.contacts} talking={this.state.talking}
                            changePerson={(i)=>{var con = this.state.contacts; con[i].unread=false; this.setState({talking: i, contacts: con})}}/>
                    <Content img={this.state.img} person={p} 
                        send={(msg)=>{socket.emit('send', {msg: msg, from: this.state.key, to: this.state.talking, key: p.msg.length})}}/>
                </div>
            );
    }
}

 
/* this.props
name: "Mike Ross",
img: "http://emilcarlsson.se/assets/mikeross.png",
contacts: [{
    key: ,
    name: "Louis Litt",
    img: ,
    msg: [{me: false, msg: "sss"}, ...]
}]
*/
class SidePanel extends Component {
    render() {
        var contacts = []
        //for (let i=0; i<this.state.contacts.length; i++)
        for (let i in this.props.contacts) 
        {
            var a = (i===this.props.talking)
            var pre = this.props.contacts[i].msg.length>0? this.props.contacts[i].msg[this.props.contacts[i].msg.length-1]: null;
            var ur = this.props.contacts[i].unread;
            contacts.push(<Contact name={this.props.contacts[i].name} img={this.props.contacts[i].img} 
                active={a} preview={pre} unread={ur} changePerson={ ()=>{ this.props.changePerson(i) } } />);
        }
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
    constructor(props) {
        super(props);
        this.state = {
            msg: ''
        }
        this.send = this.send.bind(this);
        this.myRef = React.createRef();
    }

    send()
    {
        if (this.state.msg==='')
            return;
        this.props.send(this.state.msg); 
        this.setState({msg: ''});
    }

    /*componentDidMount() {
        //console.log(ReactDOM.findDOMNode(this))
        this.myRef.current.scrollIntoView(false, { behavior: "smooth" });
    }*/

    render() {
        if (this.props.person === null)
            return(
                <div className="content">
                    <div className="contact-profile">
                        <p></p><div className="social-media"></div>
                    </div>
                    <div ref={this.myRef} className="messages">
                        <ul></ul>
                    </div>
                    <div className="message-input">
                        <div className="wrap"></div>
                    </div>
                </div>
            );
        else {
            var messages = [];
            for (let i=0; i<this.props.person.msg.length; i++)
            {
                var msg = this.props.person.msg[i];
                var c = msg.me? "sent": "replies";
                var img = msg.me? this.props.img :this.props.person.img;
                messages.push(
                    <li className={c}>
                        <img src={img} alt="" />
                        <p>{msg.msg}</p>
                    </li>
                );
            }

            return(
                <div className="content">
                    <div className="contact-profile">
                        <img src={this.props.person.img} alt="" />
                        <p>{this.props.person.name}</p>
                        <div className="social-media">
                            <i className="fa fa-facebook" aria-hidden="true"></i>
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                            <i className="fa fa-instagram" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div ref={this.myRef} className="messages">
                        <ul>
                            {messages}
                        </ul>
                    </div>
                    <div className="message-input">
                        <div className="wrap">
                        <input type="text" placeholder="Write your message..." value={this.state.msg}
                            onChange={(evt) => this.setState({msg: evt.target.value})}
                            onKeyPress={ (event)=>{ if(event.key === 'Enter') this.send(); }}/>
                        <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                        <button className="submit" 
                            onClick={()=>{ this.send() }}>
                            <i className="fa fa-paper-plane fa-lg" aria-hidden="true"></i>
                        </button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

/*
name: "Louis Litt",
img: "http://emilcarlsson.se/assets/louislitt.png"

*/
class Contact extends Component {
    render() {
        var c = classNames({'contact': true, 'active': this.props.active});
        //console.log(this.props.preview)
        var prev, prevSpan, preview;
        if (this.props.preview===null){
            preview = null;
        }
        else{
            prev = this.props.preview.msg;
            prevSpan = this.props.preview.me? <span>You: </span>: null;

            if (this.props.unread)
                preview = (<div className="emph"> {prevSpan}{prev} </div>);
            else
                preview = (<div>{prevSpan}{prev}</div>);
        }
        
        return(
            <li className={c} onClick={this.props.changePerson}>
                <div className="wrap">
                    <span className="contact-status online"></span>
                    <img src={this.props.img} alt="" />
                    <div className="meta">
                        <p className="name">{this.props.name}</p>
                        <p className="preview">{preview}</p>
                    </div>
                </div>
            </li>
        );
    }
}
export default App;