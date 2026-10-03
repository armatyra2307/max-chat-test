// Номер телефона -> chatId формата GREEN-API (79991234567@c.us)
export function phoneToChatId(phone) {
  const digits = phone.replace(/\D/g, '')
  return `${digits}@c.us`
}

export function chatIdToPhone(chatId) {
  return chatId.replace('@c.us', '')
}

export function formatTime(ts) {
  return new Date(ts * 1000).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
