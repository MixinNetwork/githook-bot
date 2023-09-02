const pgsql = require('pg')
const { DATABASE_CONFIG } = require('../config/config')
const SQL = require('./sql')


async function query(sql, params) {
    const client = new pgsql.Client(DATABASE_CONFIG)
    await client.connect()
    try {
      const { rows } = await client.query(sql, params)
      return rows
    } catch (err) {
      console.error("sql %s, params %s, error %s", query, params, err)
    } finally {
      await client.end()
    }
}

class DB {
    constructor() {
        this.SQL = SQL
    }
    async add_user({ user_id, identity_number, access_token, full_name, avatar_url, created_at }) {
        let user = await this.get_user(user_id)
        let params = [user_id, identity_number, access_token, full_name, avatar_url, created_at]
        return user ? await query(this.SQL.UPDATE_USER, params) : await query(this.SQL.ADD_USER, params)
    }
    async get_user(user_id) {
        let t = await query(this.SQL.GET_USER, [user_id])
        return t[0]
    }
    async update_user({ user_id, identity_number, access_token, full_name, avatar_url, created_at }) {
        return await query(this.SQL.UPDATE_USER, [user_id, identity_number, access_token, full_name, avatar_url, created_at])
    }

    async add_one({ webhook_id, conversation_id, user_id, name, tag, signature }) {
        return await query(this.SQL.ADD_HOOKS, [webhook_id, conversation_id, user_id, name, tag, signature])
    }
    async update_one({ webhook_id, name, tag, signature }) {
        return await query(this.SQL.UPDATE_HOOKS, [webhook_id, name, tag, signature])
    }
    async get_hooks_by_name(name, tag) {
        return await query(this.SQL.GET_HOOKS_BY_NAME, [name, tag])
    }
    async get_hooks_by_conversation(conversation_id) {
        return await query(this.SQL.GET_HOOKS_BY_CONVERSATION, [conversation_id])
    }
    async get_hook_by_conversation_and_name({ conversation_id, name, tag }) {
        let t = await query(this.SQL.GET_HOOK_BY_CONVERSATION_AND_NAME, [name, conversation_id, tag])
        return t[0]
    }
    async get_hook_by_id(webhook_id) {
        let t = await query(this.SQL.GET_HOOKS_BY_ID, [webhook_id])
        return t[0]
    }
    async delete_one(webhook_id) {
        return await query(this.SQL.DELETE_HOOKS, [webhook_id])
    }
}

module.exports = DB