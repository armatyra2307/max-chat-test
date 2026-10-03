// Слой работы с GREEN-API
// Документация: https://green-api.com/v3/docs/api/sending/SendMessage/
//               https://green-api.com/v3/docs/api/receiving/technology-http-api/

const API_BASE = 'https://api.green-api.com'

// Отправка текстового сообщения
export async function sendMessage({ idInstance, apiTokenInstance }, chatId, message) {
  const url = `${API_BASE}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Ошибка отправки (${res.status}): ${text}`)
  }
  return res.json()
}

// Получение одного уведомления из очереди (long polling)
export async function receiveNotification({ idInstance, apiTokenInstance }) {
  const url = `${API_BASE}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Ошибка получения (${res.status}): ${text}`)
  }
  // null — очередь пуста
  return res.json()
}

// Удаление уведомления из очереди после обработки
export async function deleteNotification({ idInstance, apiTokenInstance }, receiptId) {
  const url = `${API_BASE}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
  await fetch(url, { method: 'DELETE' })
}
