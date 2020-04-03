const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const models = require('./models')


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
})

app.use(bodyParser.json())

app.post('/api/webhook', async (req, res) => {
    try {
        let data = await models.get_message(req)
        return res.json({ data })
    } catch (e) {
        return res.json({ error: e })
    }
})

app.post('/api/authenticate', async (req, res) => {
    try {
        let data = await models.init_user(req.body)
        return res.json({ data })
    } catch (e) {
        console.error(e)
        return res.json({ error: e })
    }
})

app.post('/api/addOne', async (req, res) => {
    try {
        let data = await models.add_githook(req.body)
        return res.json({ data })
    } catch (e) {
        console.error(e)
        return res.json({ error: e })
    }
})

app.post('/api/editOne', async (req, res) => {
    try {
        await models.update_githook(req.body)
        return res.json({ data: 'ok' })
    } catch (e) {
        console.error(e)
        return res.json({ error: e })
    }
})

app.post('/api/deleteOne', async (req, res) => {
    try {
        let { webhook_id } = req.body
        let data = await models.delete_one(webhook_id)
        return res.json({ data })
    } catch (e) {
        console.error(e)
        return res.json({ error: e })
    }
})

app.post('/api/getList', async (req, res) => {
    try {
        let { conversation_id } = req.body
        let data = await models.get_githook_list_by_conversation(conversation_id)
        return res.json({ data })
    } catch (e) {
        console.error(e)
        return res.json({ error: e })
    }
})
app.listen(9088, () => {
    console.log('Server started on 9088')
})
