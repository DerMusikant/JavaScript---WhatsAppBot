const qrcode = require('qrcode-terminal');

const fs = require('fs')

const { Client } = require('whatsapp-web.js');
let client

const SESSION_FILE_PATH = './session.json'

const knownCommands = () => {
  return `Comandos existentes:
  hola,
  ping,
  chau`
}

const withSession = () => {
  sessionData = require(SESSION_FILE_PATH)

  client = new Client({
    qrTimeoutMs: 0,
    session: sessionData
  });

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.initialize()
}

const noSession = () => {
  client = new Client({
    qrTimeoutMs: 0
  });

  const saveSession = (session) => {
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err => {console.log(err)})
  }

  client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
  });

  client.on('authenticated', saveSession)

  client.on('ready', () => {
    console.log('Client is ready!');
  });


  client.initialize();
}

const readMessage = (message) => {

  console.log((message.body).toLowerCase())

  switch((message.body).toLowerCase()){
    case 'ping':
      message.reply('pong')
      break
    case 'hola':
      client.sendMessage(message.from, `Hola!
        Para conocer los comandos escribime 'ayuda'`)
      break
    case 'chau':
      client.sendMessage(message.from, 'Nos vemos')
      break
    case 'ayuda':
      client.sendMessage(message.from, knownCommands())
  }
}

(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : noSession()

client.on('message', readMessage)
