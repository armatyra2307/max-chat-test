# MAX Chat — тестовое задание Frontend React

Пользовательский интерфейс для отправки и получения текстовых сообщений
через мессенджер MAX (GREEN-API).

## Стек

- React 18 + Vite
- GREEN-API v3 (`sendMessage`, `receiveNotification`, `deleteNotification`)
- Без дополнительных UI-библиотек — максимально простой интерфейс

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:5173

## Как пользоваться

1. На экране входа введите `idInstance` и `apiTokenInstance`
   из личного кабинета GREEN-API (https://console.green-api.com).
2. Введите номер телефона получателя в международном формате (например, `79991234567`) — создаётся новый чат.
3. Пишите и отправляйте текстовые сообщения — они уходят получателю в MAX.
4. Ответы получателя приходят автоматически (опрос очереди уведомлений `receiveNotification` с интервалом long polling).

## Структура

```
src/
  api.js                   # обёртка над GREEN-API
  utils.js                 # phone <-> chatId, формат времени
  App.jsx                  # состояние, цикл приёма сообщений
  components/
    Login.jsx              # экран ввода учётных данных
    NewChat.jsx            # экран создания чата по номеру
    ChatWindow.jsx         # окно чата: сообщения + поле ввода
```

## Деплой

Статический билд можно развернуть на Vercel :

```bash
npm run build   # папка dist/
```
