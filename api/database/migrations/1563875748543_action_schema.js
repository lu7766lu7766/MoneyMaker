'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActionSchema extends Schema {
  up () {
    this.dropTableIfExists('actions')
    this.create('actions', (table) => {
      table.increments()
      table.string('date', 10).comment('開盤日期').notNullable().index()
      table.integer('type', 1).comment('1:buy, -1:sell').notNullable()
      table.integer('price', 10).comment('price').notNullable()
      table.integer('cover', 10).comment('平倉').notNullable()
      table.datetime('created_at').comment('執行時間').notNullable().index()
    })
  }

  down () {
    this.dropTableIfExists('actions')
  }
}

module.exports = ActionSchema
