const ActionModel = use('Models/Action')
const FimtxnModel = use('Models/Fimtxn')
const Env = use('Env')

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

  async doAdvice(data)
  {
    try
    {
      data.created_at = moment(data.created_at).getDateTime()
      const res = _.first(await DB.table('fimtxn').where('created_at', data.created_at).count('* as count'))
      if (res.count > 0)
      {
        await DB.table('fimtxn').update(data).where('created_at', data.created_at)
      }
      else
      {
        await DB.table('fimtxn').insert(data)
      }
    } catch (e)
    {
      console.log('error', e)
    }
  }

  async doAction(data)
  {
    const res = _.first(await DB.table('actions')
      .select('id', 'created_at')
      .where('type', -data.type)
      .whereNull('cover')
      .limit(1))
    // lock time
    const created_at_format = moment(data.created_at).format('YYYY-MM-DD HH:mm:00')
    const now_format = moment().format('YYYY-MM-DD HH:mm:00')
    if (Math.abs(moment().diff(data.created_at, 'seconds')) < Env.get('ACTION_SECS', 70)
      || Env.get('NODE_ENV') === 'development')
    {
      if (res)
      {
        // 平倉
        await DB.table('actions').update({
          'cover': data.price,
          'updated_at': data.created_at
        }).where('id', res.id)
        return _.first(await DB.table('actions').whereNotNull('cover').orderBy('id', 'desc').limit(1))
      }
      else
      {
        // 下單
        await DB.table('actions').insert(data)
        return data
      }
    }
    throw `not in transfer time ${created_at_format} - ${now_format}`
  }

  async getDateList()
  {
    return _.orderBy(_.map(await DB.table('fimtxn').distinct('date'), 'date'), null, 'desc')
  }
}

module.exports = DataService
