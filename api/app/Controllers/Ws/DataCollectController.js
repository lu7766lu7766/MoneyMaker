'use strict'
// const redisService = App.make('Service/Redis')
const FimtxnModel = use('Models/Fimtxn')
const ActionModel = use('Models/Action')
const actionService = App.make('Service/Action')

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
      datas: await FimtxnModel.query()
        .where('date', date)
        .fetch(),
      actions: await ActionModel.query()
        .where('date', date)
        .fetch()
    }, [this.socket.id])
  }

  async onBordcast(data)
  {
    data = JSON.parse(data)
    await DB.table('fimtxn').insert(data)
    this.socket.broadcast('advice', data)
  }

  async onAction(data)
  {
    // await DB.table('actions').insert(data)
    this.socket.emitTo('action', await actionService.doAction(data), [this.socket.id])
  }

  async onGetDate()
  {
    const dates = _.orderBy(_.map(await DB.table('fimtxn').distinct('date'), x => moment(x.date).getDate()), null, 'desc')
    this.socket.emitTo('getDate', dates, [this.socket.id])
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
