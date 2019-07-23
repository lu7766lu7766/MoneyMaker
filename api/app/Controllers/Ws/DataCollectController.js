'use strict'
// const redisService = App.make('Service/Redis')
const FimtxnModel = use('Models/Fimtxn')

class DataCollectController
{
  constructor({socket})
  {
    // console.log('init')
    this.socket = socket
  }

  async onInit(date)
  {
    const res = await FimtxnModel.query()
      .where('date', date)
      .fetch()
    this.socket.emitTo('init', res, [this.socket.id])
  }

  async onBordcast(data)
  {
    data = JSON.parse(data)
    await DB.table('fimtxn').insert(data)
    this.socket.broadcast('advice', data)
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
