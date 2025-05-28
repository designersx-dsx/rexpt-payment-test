import React, { useState, useEffect, useRef } from 'react';
import styles from '../ChatBox/ChatBox.module.css';

const ChatBox = () => {
    const [messages, setMessages] = useState([
        {
            sender: 'support',
            text: 'Hi, I am Rex — your 24/7 AI Support Agent. I bet I can solve more than 95% of queries quickly.',
        },
    ]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed || isSending) return;

        setIsSending(true);

        setTimeout(() => {
            const userMsg = { sender: 'user', text: trimmed };
            setMessages((prev) => [...prev, userMsg]);
            setInput('');

            setTimeout(() => {
                const supportMsg = {
                    sender: 'support',
                    text: 'Thanks! Let me look into it for you.',
                };
                setMessages((prev) => [...prev, supportMsg]);
                setIsSending(false);
            }, 1000);
        }, 400);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={styles.chatContainer}>
            <div className={styles.header}>
                <img src="/images/Rex-profile.png" alt="Rex-profile" className={styles.avatar} />
                <div>
                    <div className={styles.agentName}>Rex</div>
                    <div className={styles.agentTitle}>Rexpt AI Support Agent</div>
                </div>
            </div>

            <div className={styles.messages} ref={messagesEndRef}>
                {messages.map((msg, index) => {
                    const isUser = msg.sender === 'user';
                    return (
                        <div
                            key={index}
                            className={`${styles.messageRow} ${isUser ? styles.user : styles.support}`}
                        >
                            {!isUser && (
                                <img src="/images/Rex-profile.png" alt="Rex-profile" className={styles.messageAvatar} />
                            )}
                            <div className={`${styles.bubble} ${isUser ? styles.userBubble : ''}`}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.inputArea}>
                <input
                    type="text"
                    placeholder="Write a message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isSending}
                />

                <button
                    onClick={handleSend}
                    className={`${styles.sendButton} ${input.trim() ? styles.visible : ''} ${isSending ? styles.sending : ''
                        }`}
                    disabled={isSending}
                >
                    <img src="/svg/send-icon.svg" alt="send" />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
