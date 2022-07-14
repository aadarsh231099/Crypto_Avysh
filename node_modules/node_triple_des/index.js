const tripleDes = require('./lib/encryption');

class EncryptFactory {
    static getInstance() {
        return new tripleDes
    }
}

const TripleDes = EncryptFactory.getInstance();
module.exports = TripleDes;
