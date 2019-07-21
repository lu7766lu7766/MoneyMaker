'use strict'

class DataCollectController
{
  constructor({socket, auth})
  {
    this.socket = socket
    this.auth = auth
  }

  async onBordcast(data)
  {
    console.log(data)
    this.socket.broadcast('event', data)
  }

  async onClose(socket)
  {
    // await this.clearData('DataCollect', this.auth.user.user_name)
    // same as: socket.on('close')
    // await this.clearData('OptionTodayItemCollect', this.auth.user.user_name)
  }

  onError({socket})
  {
    // same as: socket.on('error')
  }
}

module.exports = DataCollectController
