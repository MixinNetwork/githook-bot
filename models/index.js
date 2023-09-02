
const githubMessage = require('./github')
const gitlabMessage = require('./gitlab')
const { verify, getUUID } = require('../tools')
const DB = require('../db')
const { client, request } = require('../api')
class Githook extends DB {
    constructor() {
        super()
    }
    async init_user({ code }) {
        let { user, access_token } = await request.get_user_by_code(code)
        await this.add_user({ ...user, access_token })
        return user
    }
    async get_message(req) {
        if (req.headers['x-gitlab-event']) {
            return await this.get_gitlab_message(req)
        } else {
            return await this.get_github_message(req)
        }
    }
    async get_github_message(req) {
        let data = githubMessage(req.body, req.headers['x-github-event'])
        if (!data) return { error: 'unhandle' }
        let res = await this.get_githook_list_by_name(req.body.repository.full_name, 'github')
        if (!res.length) return { error: 'no config' }
        let sig = req.headers['x-hub-signature']
        for (let i = 0; i < res.length; i++) {
            let { conversation_id, signature } = res[i]
            if (sig) {
                let isVerify = verify(sig, req.body, signature)
                if (!isVerify) {
                    continue
                }
            }
            let buff = new Buffer(data);
            let base64data = buff.toString('base64');
            client.sendMessage({
                data_base64: base64data,
                message_id:client.newUUID(),
                conversation_id,
                category: 'PLAIN_POST',
            })
        }
        return { data: 'ok' }
    }
    async get_gitlab_message(req) {
        let data = gitlabMessage(req.body, req.headers['x-gitlab-event'])
        if (!data) return { message: 'unhandle' }
        let res = await this.get_githook_list_by_name(req.body.project.path_with_namespace, 'gitlab')
        if (!res.length) return { error: 'no config' }
        let sig = req.headers['x-gitlab-token']
        for (let i = 0; i < res.length; i++) {
            let { conversation_id, signature } = res[i]
            if (sig) {
                let isVerify = signature === sig
                if (!isVerify) {
                    continue
                }
            }
            client.sendMessage({
                data,
                message_id:client.newUUID(),
                conversation_id,
                category: 'PLAIN_POST',
            })
        }
        return { data: 'ok' }
    }
    async add_githook({ conversation_id, user_id, name, tag, signature }) {
        let is_exist = await this._check_hook_is_exist(conversation_id, name, tag)
        let webhook_id = getUUID()
        !is_exist && await this.add_one({ webhook_id, conversation_id, user_id, name, tag, signature })
        return true
    }
    async update_githook({ webhook_id, name, tag, signature }) {
        let is_exist = await this._check_hook_is_exist_by_id(webhook_id)
        is_exist && await this.update_one({ webhook_id, name, tag, signature })
        return true
    }
    async get_githook_list_by_name(name, tag) {
        return await this.get_hooks_by_name(name, tag)
    }
    async get_githook_list_by_conversation(conversation_id) {
        return await this.get_hooks_by_conversation(conversation_id)
    }

    async _check_hook_is_exist(conversation_id, name, tag) {
        let t = await this.get_hook_by_conversation_and_name({ conversation_id, name, tag })
        return !!t
    }
    async _check_hook_is_exist_by_id(id) {
        let t = await this.get_hook_by_id(id)
        return !!t
    }
}



module.exports = new Githook()
