'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FimtxnSchema extends Schema
{
  up()
  {
    this.dropTableIfExists('fimtxn')
    this.create('fimtxn', (table) =>
    {
      table.date('date').comment('開盤日期').notNullable().index()
      table.integer('price', 10).comment('price').notNullable()
      table.integer('open', 10).comment('open').notNullable()
      table.integer('high', 10).default(0).comment('high').notNullable()
      table.integer('low', 10).default(0).comment('low').notNullable()
      table.integer('volume', 10).default(0).comment('volume').notNullable()
      table.datetime('created_at').comment('傳送時間').notNullable().index()
    })
  }

  down () {
    this.dropTableIfExists('fimtxn')
  }
}

module.exports = FimtxnSchema
