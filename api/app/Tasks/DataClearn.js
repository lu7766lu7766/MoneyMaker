'use strict'

const Task = use('Task')

class DataClearn extends Task {
  static get schedule () {
    return '0 0 14 * * *'
  }

  async handle () {
    // this.info('Task DataClearn handle')
    DB.table('fimtxn').where('date', '<', moment().subtract(5, 'days').getDate()).delete()
  }
}

module.exports = DataClearn
