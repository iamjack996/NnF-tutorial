const io = require('socket.io-client')
const feathers = require('@feathersjs/feathers')
const socketio = require('@feathersjs/socketio-client')
// const auth = require('@feathersjs/authentication-client')

const config =
  process.env.NODE_ENV === 'production'
    ? Object.assign(
      {},
      require('~/config/default'),
      require('~/config/production')
    )
    : require('~/config/default')

let protocol = 'http'
if (process.browser) {
  protocol = window.location.protocol.replace(':', '')
}

const port = process.env.NODE_ENV === 'production' ? '' : `:${config.port}`

const socket = io(`${protocol}://${config.host}${port}`, {
  transports: ['websocket']
})

console.log(`http://${config.host}:${config.port}`)

export default feathers()
  .configure(socketio(socket))
  // .configure(auth())
