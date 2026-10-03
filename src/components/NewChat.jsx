import { useState } from 'react'

export default function NewChat({ onCreate }) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      setError('Введите корректный номер телефона (с кодом страны)')
      return
    }
    onCreate(digits)
  }

  return (
    <div className="new-chat-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Новый чат</h1>
        <p className="login-subtitle">Введите номер телефона получателя</p>

        <label>Номер телефона</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="79991234567"
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="btn-primary">Создать чат</button>
      </form>
    </div>
  )
}
