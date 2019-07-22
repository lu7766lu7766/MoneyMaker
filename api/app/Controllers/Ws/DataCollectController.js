'use strict'
const redisService = use('Service/Redis')
const OptionModel = use('Model/Option')

class DataCollectController
{
  constructor({socket})
  {
    // this.socket = socket
  }

  async onInit(date)
  {
    let res = await redisService.get('fimtxn') || []
    if (!res.length) {
      res = await OptionModel.query()
        .where('date', date)
        .fetch()
      await redisService.set('fimtxn', res)
    }
    return res
  }

  async onBordcast(data)
  {
    let res = redisService.get('fimtxn')
    res.push(data)
    await redisService.set('fimtxn', res)
    await DB.table('fimtxn').insert(data)
    // console.log(data)
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
