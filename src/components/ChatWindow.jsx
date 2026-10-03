import { useEffect, useRef, useState } from 'react'
import { sendMessage } from '../api.js'
import { formatTime } from '../utils.js'

export default function ChatWindow({ credentials, chat, messages, onBack, onNewIncoming }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  // Прокрутка к последнему сообщению
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    setSending(true)
    setError('')
    try {
      const result = await sendMessage(credentials, chat.chatId, trimmed)
      onNewIncoming({
        id: result.idMessage,
        chatId: chat.chatId,
        text: trimmed,
        isMine: true,
        timestamp: Math.floor(Date.now() / 1000),
      })
      setText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="chat-window">
      <header className="chat-header">
        <button className="btn-back" onClick={onBack} title="Назад">←</button>
        <div className="chat-peer">
          <div className="avatar">{chat.phone.slice(-2)}</div>
          <div>
            <div className="chat-name">+{chat.phone}</div>
            <div className="chat-status">в сети</div>
          </div>
        </div>
      </header>

      <div className="messages">
        {messages.length === 0 && (
          <div className="messages-empty">
            Сообщений пока нет. Напишите первое!
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isMine ? 'message-mine' : 'message-theirs'}`}>
            <div className="message-text">{msg.text}</div>
            <div className="message-time">{formatTime(msg.timestamp)}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <div className="send-error">{error}</div>}

      <form className="composer" onSubmit={handleSend}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сообщение…"
          disabled={sending}
        />
        <button type="submit" className="btn-send" disabled={sending || !text.trim()}>
          ➤
        </button>
      </form>
    </div>
  )
}
