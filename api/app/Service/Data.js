const ActionModel = use('Models/Action')
const FimtxnModel = use('Models/Fimtxn')

class DataService
{
  async getDatas(date)
  {
    return await FimtxnModel.query()
      .where('date', date)
      .fetch()
  }

  async getActions(date)
  {
    return await ActionModel.query()
      .where('date', date)
      .orderBy('id', 'desc')
      .fetch()
  }

  async doAction(data)
  {
    const res = _.first(await DB.table('actions')
      .select('id', 'date')
      .where('type', -data.type)
      .whereNull('cover')
      .limit(1))

    if (res) {
      await DB.table('actions').update('cover', data.price).where('id', res.id)
    } else {
      await DB.table('actions').insert(data)
    }

    return data
  }

  async getDates()
  {
    return _.orderBy(_.map(await DB.table('fimtxn').distinct('date'), 'date'), null, 'desc')
  }
}

module.exports = DataService
