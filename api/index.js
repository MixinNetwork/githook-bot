const axios = require('axios')
const { Client } = require('mixin-node-sdk')
const { CLIENT_CONFIG } = require('../config/config')
const client = new Client(CLIENT_CONFIG)

const _mixinAxios = axios.create({
    baseURL: 'https://api.mixin.one',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

class MixinRequest {
    async get_user_by_code(code) {
        let { access_token } = await authenticate(code)
        let { data } = await _mixinAxios({
            method: 'get',
            url: '/me',
            headers: { Authorization: 'Bearer ' + access_token }
        })
        return { user: data.data, access_token }
    }
}

const request = new MixinRequest()

module.exports = { client, request }


async function authenticate(code) {
    let { client_id, client_secret } = CLIENT_CONFIG
    let { data } = await _mixinAxios({
        method: 'post',
        url: '/oauth/token',
        data: { code, client_id, client_secret }
    })
    return data.data
}