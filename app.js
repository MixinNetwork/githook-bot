const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const gikHook = require('./models')

const { client } = require('./api')
const { MixinApi, base64RawURLEncode } = require('@mixin.dev/mixin-node-sdk');
const { v4 } = require('uuid');

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

app.use(bodyParser.json({limit : "2100000kb"}))


app.get('/api/', async (req, res) => {
  let base64data = base64RawURLEncode('hi githook');
  client.message.sendLegacy({
    conversation_id: '9451292c-c81c-4574-961a-ce9075e32400',
    message_id: v4(),
    category: 'PLAIN_POST',
    data_base64: base64data,
  })
  return res.json({ data: 'ok' })
})

app.post('/api/webhook', async (req, res) => {
  try {
    let data = await gikHook.get_message(req)
    return res.json({ data })
  } catch (e) {
    console.log(e)
    return res.json({ error: e })
  }
})


app.post('/api/test', async (req, res) => {
  return res.json({ data: 'ok' })
})




app.post('/api/authenticate', async (req, res) => {
  try {
    let data = await gikHook.init_user(req.body)
    return res.json({ data })
  } catch (e) {
    console.error(e)
    return res.json({ error: e })
  }
})

app.post('/api/addOne', async (req, res) => {
  try {
    let data = await gikHook.add_githook(req.body)
    return res.json({ data })
  } catch (e) {
    console.error(e)
    return res.json({ error: e })
  }
})

app.post('/api/editOne', async (req, res) => {
  try {
    await gikHook.update_githook(req.body)
    return res.json({ data: 'ok' })
  } catch (e) {
    console.error(e)
    return res.json({ error: e })
  }
})

app.post('/api/deleteOne', async (req, res) => {
  try {
    let { webhook_id } = req.body
    let data = await gikHook.delete_one(webhook_id)
    return res.json({ data })
  } catch (e) {
    console.error(e)
    return res.json({ error: e })
  }
})

app.post('/api/getList', async (req, res) => {
  try {
    let { conversation_id } = req.body
    let data = await gikHook.get_githook_list_by_conversation(conversation_id)
    return res.json({ data })
  } catch (e) {
    console.error(e)
    return res.json({ error: e })
  }
})
app.listen(9088, () => {
  console.log('Server started on 9088')
})
