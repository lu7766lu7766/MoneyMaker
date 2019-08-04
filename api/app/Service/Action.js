const ActionModel = use('Models/Action')

class ActionService
{
  async doAction(data)
  {
    const res = _.first(await DB.table('actions').select('id').where('type', -data.type).whereNull('cover').limit(1))
    if (res) {
      await DB.table('actions').update('cover', data.price).where('id', res.id)
    } else {
      await DB.table('actions').insert(data)
    }
    return {
      source: data,
      result: await ActionModel.query()
        .where('date', data.date)
        .orderBy('id', 'desc')
        .fetch()
    }
  }

  async getDates()
  {
    return _.orderBy(_.map(await DB.table('fimtxn').distinct('date'), 'date'), null, 'desc')
  }
}

module.exports = ActionService
