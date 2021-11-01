const qrcode = require('qrcode-terminal');
const fs = require('fs')
const { Client } = require('whatsapp-web.js');

let client

const SESSION_FILE_PATH = './session.json'

// Known commands completely hardcoded xd

const knownCommands = () => {
  return `Comandos existentes:
  hola,
  ping,
  chau`
}

// This function executes if session.json exists in the root directory (aka a whatsapp session was saved previously)

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

//This one executes if session.json does not exist within the root directory

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

// Replies a msg if it is an existing command

const readMessage = (message) => {

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

// if session.json exists

(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : noSession()

// message listener

client.on('message', readMessage)
