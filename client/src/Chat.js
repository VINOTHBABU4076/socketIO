import React, { useEffect, useState } from 'react'

const Chat = ({ socket, username, room }) => {

    const [curretMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])

    const sendMessage = async () => {
        if (curretMessage !== '') {
            const messageData = {
                room: room,
                author: username,
                message: curretMessage,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
            }
            await socket.emit('send_message', messageData)
            setMessageList((list) => [...list, messageData])
            setCurrentMessage('')
        }
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessageList((list) => [...list, data])
        })
    }, [socket])

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h6>Live Chat</h6>
            </div>
            <div className="chat-body">
                <div className='message-container'>
                    {messageList.map((msg) => {
                        return (
                            <div className='message' id={username === msg.author ? 'you' : 'other'}>

                                <div>
                                    <div className='message-content'>
                                        <p>{msg.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{msg.time}</p><p id="author"> {msg.author}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
            <div className="chat-footer">
                <input value={curretMessage} placeholder='Hey...' onChange={(e) => { setCurrentMessage(e.target.value) }} onKeyUp={(e) => { e.key === 'Enter' && sendMessage() }} />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat
