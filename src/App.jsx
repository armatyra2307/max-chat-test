import { useEffect, useRef, useState } from 'react'
import Login from './components/Login.jsx'
import NewChat from './components/NewChat.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import { receiveNotification, deleteNotification } from './api.js'
import { phoneToChatId } from './utils.js'

export default function App() {
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem('green-api-credentials')
    return saved ? JSON.parse(saved) : null
  })
  const [chat, setChat] = useState(null) // { phone, chatId }
  const [messages, setMessages] = useState([]) // сообщения текущего чата
  const pollingRef = useRef(false) // защита от параллельных циклов

  const handleLogin = (creds) => {
    localStorage.setItem('green-api-credentials', JSON.stringify(creds))
    setCredentials(creds)
  }

  const handleLogout = () => {
    localStorage.removeItem('green-api-credentials')
    setCredentials(null)
    setChat(null)
    setMessages([])
  }

  const handleCreateChat = (phone) => {
    setMessages([])
    setChat({ phone, chatId: phoneToChatId(phone) })
  }

  const addMessage = (msg) => {
    setMessages((prev) =>
      prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
    )
  }

  // Цикл приёма входящих сообщений (technology-http-api):
  // receiveNotification -> обработка -> deleteNotification -> повтор
  useEffect(() => {
    if (!credentials || pollingRef.current) return
    pollingRef.current = true
    let stopped = false

    const poll = async () => {
      while (!stopped) {
        try {
          const notification = await receiveNotification(credentials)
          if (stopped) break

          if (notification) {
            const { receiptId, body } = notification
            // Берём только входящие текстовые сообщения
            if (body?.typeWebhook === 'incomingMessageReceived') {
              const msgData = body.messageData
              const isText =
                msgData?.typeMessage === 'textMessage' ||
                msgData?.typeMessage === 'extendedTextMessage'
              if (isText) {
                const text =
                  msgData.textMessageData?.textMessage ??
                  msgData.extendedTextMessageData?.text ??
                  ''
                addMessage({
                  id: body.idMessage,
                  chatId: body.senderData?.chatId,
                  text,
                  isMine: false,
                  timestamp: body.timestamp,
                })
              }
            }
            await deleteNotification(credentials, receiptId)
          }
        } catch {
          // Сетевая ошибка — подождём и продолжим
          await new Promise((r) => setTimeout(r, 5000))
        }
      }
    }

    poll()
    return () => {
      stopped = true
      pollingRef.current = false
    }
  }, [credentials])

  if (!credentials) return <Login onLogin={handleLogin} />
  if (!chat) {
    return (
      <>
        <button className="btn-logout" onClick={handleLogout}>Выйти</button>
        <NewChat onCreate={handleCreateChat} />
      </>
    )
  }
  return (
    <>
      <button className="btn-logout" onClick={handleLogout}>Выйти</button>
      <ChatWindow
        credentials={credentials}
        chat={chat}
        messages={messages.filter((m) => m.chatId === chat.chatId)}
        onBack={() => setChat(null)}
        onNewIncoming={addMessage}
      />
    </>
  )
}
