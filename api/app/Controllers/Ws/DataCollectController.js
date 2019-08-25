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
    console.log(`advice start at: ${moment().getDateTime()}`)
    await dataService.doAdvice(data)
    console.log('doAdvice success!')
    this.socket.broadcastToAll('advice', data)
    console.log('broadcast success!')
    this.socket.broadcastToAll('getDateList', await dataService.getDateList())
    this.socket.broadcastToAll('getDatas', await dataService.getDatas(data.date))
    console.log(`advice end at: ${moment().getDateTime()}`)
  }

  async onAction(data)
  {
    // this.socket.broadcastToAll('action', await dataService.doAction(data, date))
    try
    {
      // data.isCover = await dataService.doAction(data)
      data = await dataService.doAction(data)
      this.socket.broadcastToAll('action', data)
      this.socket.broadcastToAll('getActions', await dataService.getActions(data.date))
    } catch (e)
    {
      console.log(e)
    }
  }

  async onActions(datas) {
    try {
      let date
      for(let data of datas) {
        data = await dataService.doAction(data)
        date = data.date
        this.socket.broadcastToAll('action', data)
      }
      this.socket.broadcastToAll('getActions', await dataService.getActions(date))
    } catch(e) {
      console.log(e)
    }
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
