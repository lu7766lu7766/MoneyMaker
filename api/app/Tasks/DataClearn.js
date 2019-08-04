'use strict'

const Task = use('Task')
const env = require('../../env')

class DataClearn extends Task {
  static get schedule () {
    return '0 0 14 * * *'
  }

  async handle () {
    // this.info('Task DataClearn handle')
    DB.table('fimtxn').where('date', '<', moment().subtract(env.dataDays, 'days').getDate()).delete()
  }
}

module.exports = DataClearn
