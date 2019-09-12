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
    this.socket.emitTo('getDatas', await dataService.getDatas(date), [this.socket.id])
    this.socket.emitTo('getActions', await dataService.getActions(date), [this.socket.id])
  }


  async onBordcast(data)
  {
    data = JSON.parse(data)
    Log.info(JSON.stringify({
      type: 'advice',
      data
    }))
    await dataService.doAdvice(data)
    Log.info(JSON.stringify({
      type: 'advice',
      data: 'doAdvice success!'
    }))
    this.socket.broadcastToAll('advice', data)
    Log.info(JSON.stringify({
      type: 'advice',
      data: 'broadcast success!'
    }))
    this.socket.broadcastToAll('getDateList', await dataService.getDateList())
    this.socket.broadcastToAll('getDatas', await dataService.getDatas(data.date))
    Log.info(JSON.stringify({
      type: 'advice',
      data: `advice end at: ${moment().getDateTime()}`
    }))
  }

  async onAction(data)
  {
    Log.info(JSON.stringify({
      type: 'action',
      data
    }))
    // this.socket.broadcastToAll('action', await dataService.doAction(data, date))
    try
    {
      // data.isCover = await dataService.doAction(data)
      data = await dataService.doAction(data)
      this.socket.broadcastToAll('action', data)
      this.socket.broadcastToAll('getActions', await dataService.getActions(data.date))
    } catch (e)
    {
      Log.error(JSON.stringify({
        msg: e
      }))
      console.log(e)
    }
  }

  async onActions(datas) {
    Log.info(JSON.stringify({
      type: 'actions',
      datas
    }))
    let date
    for (let data of datas)
    {
      try
      {
        data = await dataService.doAction(data)
        date = data.date
        this.socket.broadcastToAll('action', data)
      } catch (e)
      {
        console.log(e)
      }
    }
    this.socket.broadcastToAll('getActions', await dataService.getActions(date))
  }

  async onGetDateList()
  {
    this.socket.emitTo('getDateList', await dataService.getDateList(), [this.socket.id])
  }

  async onClose(socket)
  {

  }

  async onError({socket})
  {

  }
}

module.exports = DataCollectController
