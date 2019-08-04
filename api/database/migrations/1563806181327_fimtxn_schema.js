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
      table.increments()
      table.string('date', 10).comment('開盤日期').notNullable().index()
      table.integer('close', 10).comment('close').notNullable()
      table.integer('open', 10).comment('open').notNullable()
      table.integer('high', 10).comment('high').notNullable()
      table.integer('low', 10).comment('low').notNullable()
      table.datetime('created_at').comment('傳送時間').notNullable().index()
    })
  }

  down () {
    this.dropTableIfExists('fimtxn')
  }
}

module.exports = FimtxnSchema
