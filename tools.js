const crypto = require('crypto')

function sign(data, secret) {
    return `sha1=${crypto.createHmac('sha1', secret).update(data).digest('hex')}`
}

function verify(signature, data, secret) {
    const sig = Buffer.from(signature)
    data = JSON.stringify(data)
    const signed = Buffer.from(sign(data, secret))
    if (sig.length !== signed.length) {
        return false
    }
    return crypto.timingSafeEqual(sig, signed)
}


function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

module.exports = { verify, getUUID }
