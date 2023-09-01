module.exports = {
    // users
    ADD_USER: 'INSERT INTO users(user_id, identity_number, access_token, full_name, avatar_url, created_at) VALUES($1::varchar, $2::bigint, $3::varchar, $4::varchar, $5::varchar, $6::varchar)',
    UPDATE_USER: 'UPDATE users SET identity_number=$2, access_token=$3, full_name=$4, avatar_url=$5, created_at=$6 WHERE user_id=$1',
    GET_USER: 'SELECT * FROM users WHERE user_id=$1',
    
    // webhooks
    ADD_HOOKS: 'INSERT INTO webhooks(webhook_id, conversation_id, user_id, name, tag, signature)  VALUES($1::varchar, $2::varchar, $3::varchar, $4::varchar, $5::varchar, $6::varchar)',
    UPDATE_HOOKS: 'UPDATE webhooks SET name=$2, tag=$3, signature=$4 WHERE webhook_id=$1',
    GET_HOOKS_BY_NAME: 'SELECT * FROM webhooks WHERE name=$1 AND tag=$2',
    GET_HOOKS_BY_ID: 'SELECT * FROM webhooks WHERE webhook_id=$1',
    GET_HOOKS_BY_CONVERSATION: 'SELECT * FROM webhooks WHERE conversation_id=$1',
    GET_HOOK_BY_CONVERSATION_AND_NAME: 'SELECT * FROM webhooks WHERE name=$1 AND conversation_id=$2 AND tag=$3',
    DELETE_HOOKS: 'DELETE FROM webhooks WHERE webhook_id=$1'
}