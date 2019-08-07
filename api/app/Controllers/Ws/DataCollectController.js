'use strict'
// const redisService = App.make('Service/Redis')

const dataService = App.make('Service/Data')

class DataCollectController
{
  constructor({socket})
  {
    // console.log('init')
    this.socket = socket
  }

  async onInit(date)
  {
    this.socket.emitTo('init', {
      datas: await dataService.getDatas(date),
      actions: await dataService.getActions(date)
    }, [this.socket.id])
  }

  async onGetActions(date)
  {
    this.socket.emitTo('getActions', await dataService.getActions(date), [this.socket.id])
  }

  async onGetDatas(date)
  {
    this.socket.emitTo('getActions', await dataService.getDatas(date), [this.socket.id])
  }

  async onBordcast(data)
  {
    data = JSON.parse(data)
    console.log(data)
    await dataService.doAdvice(data)
    await this.socket.broadcast('getDate', await dataService.getDates())
    this.socket.broadcast('advice', data)
  }

  async onAction(data, date)
  {
    // await DB.table('actions').insert(data)
    this.socket.broadcastToAll('action', await dataService.doAction(data, date))
  }

  async onGetDate()
  {
    this.socket.emitTo('getDate', await dataService.getDates(), [this.socket.id])
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
