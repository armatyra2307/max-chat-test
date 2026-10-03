import { useState } from 'react'

export default function Login({ onLogin }) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      setError('Заполните оба поля')
      return
    }
    onLogin({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() })
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">MAX Chat</h1>
        <p className="login-subtitle">Введите учётные данные GREEN-API</p>

        <label>idInstance</label>
        <input
          type="text"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          placeholder="Например: 1101123456"
        />

        <label>apiTokenInstance</label>
        <input
          type="password"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          placeholder="Токен из личного кабинета"
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="btn-primary">Войти</button>
      </form>
    </div>
  )
}
