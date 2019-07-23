'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Fimtxn extends Model
{
  static get table()
  {
    return 'fimtxn'
  }

  static get dates()
  {
    return super.dates.concat('created_at')
  }
}

module.exports = Fimtxn
