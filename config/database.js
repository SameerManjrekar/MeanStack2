const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://localhost:27017/mean-stack2-db',
    secret: crypto,
    db: 'mean-stack2-db'
}