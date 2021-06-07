const { port, hostName } = require('../../../config/env/all')

module.exports = (on, config) => {

  config.baseUrl = `http://${hostName}:${port}`

  return config
}
