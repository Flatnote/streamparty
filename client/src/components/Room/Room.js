import React, { useState, useEffect } from "react";
// import Chat from '../Chat/Chat';
import Video from '../Video/Video';
import JoinUser from './JoinUser';

import { sckt } from '../Socket';

import './Room.css';
import Panel from "../Panel/Panel";

const Room = ({ location, history }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const [videoProps, setVideoProps] = useState({
        queueIndex: 0,
        queue: [
            {
                "video": {
                    "id": "GbtF3oA7NMM",
                    "title": "Every Brooklyn Nine-Nine Cold Open - Brooklyn Nine-Nine",
                    "url": "https://www.youtube.com/watch?v=GbtF3oA7NMM",
                    "upload_date": "Streamed 3 weeks ago",
                    "thumbnail_src": "https://i.ytimg.com/vi/GbtF3oA7NMM/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAu2-W_1kAs4s78O6OjQ4R9PjRkAw",
                    "views": "1.1M views"
                },
                "channel": {
                    "username": "NBC ",
                    "url": "https://www.youtube.com/user/NBC",
                    "verified": true
                }
            }
        ],
        playing: true,
        seekTime: 0,
        lastStateYT: -1,
        receiving: false,
    });
    const updateState = (paramsToChange) => {
        setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
    }
    const log = (msg, type) => {
        let baseStyles = [
            "color: #fff",
            "background-color: #444",
            "padding: 2px 4px",
            "border-radius: 2px"
        ].join(';');
        let serverStyles = [
            "background-color: gray"
        ].join(';');
        let otherStyles = [
            "color: #eee",
            "background-color: red"
        ].join(';');
        let meStyles = [
            "background-color: green"
        ].join(';');
        // Set style based on input type
        let style = baseStyles + ';';
        switch(type) {
            case "server": style += serverStyles; break;
            case "other": style += otherStyles; break;
            case "me": style += meStyles; break;
            case "none": style = ''; break;
            default: break;
        }
        console.log(`%c${msg}`, style);
    }

    // From JoinRoom.js 
    useEffect(() => {
        const room = location.pathname.split('/').pop().trim();
        if(room.length > 0)
            setRoom(room);
        else {
            history.push('/');
        }
        // sckt.socket.emit('createRoom', { room }, () => {});
        // sckt.socket.on("roomData", ({ users }) => {
        //     setUsers(users);
        // });
    }, [location.pathname]);

    // From JoinUser.js
    const joinRoomAsUser = (name) => {
        setName(name);
        sckt.socket.emit('join', { name, room }, (error) => {
            if (error === 'DUPLICATE_USER') {
                setName('');
            }
        });
    }

    return (
        name && room
            ? (
                <div className="outerContainer">
                    <Video log={log} name={name} room={room} videoProps={videoProps} updateState={updateState} />
                    <Panel log={log} name={name} room={room} videoProps={videoProps} updateState={updateState} />
                    {/* <Chat log={log} name={name} room={room} /> */}
                </div>
            ) : (
                <JoinUser room={room} joinRoomAsUser={joinRoomAsUser} />
            )
    );
}

export default Room;