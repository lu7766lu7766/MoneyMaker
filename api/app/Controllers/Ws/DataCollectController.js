'use strict'
const redisService = App.make('Service/Redis')
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
    let res = await redisService.get('fimtxn') || []
    if (!res.length) {
      res = await FimtxnModel.query()
        .where('date', date)
        .fetch()
      await redisService.set('fimtxn', res)
    }
    return res
  }

  async onBordcast(data)
  {
    let res = await redisService.get('fimtxn') || []
    data = JSON.parse(data)
    //console.log(data)
    res.push(data)
    //console.log(res)
    await redisService.set('fimtxn', res)
    await DB.table('fimtxn').insert(data)
    // console.log(data)
    this.socket.broadcast('event', data)
  }

  async onClose(socket)
  {
    redisService.set('fimtxn', [])
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
