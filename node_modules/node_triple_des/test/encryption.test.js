const { expect, should } = require('chai')
const Encryption = require('../index')

describe('Test encryption and decription', () => {
  let cipherKey = '834y9yuhjsdjfdsjfbk++',
    plainText = 'Hello World',
    cipherText
  it('should run encrypt without errors', () => {
    const data = Encryption.encrypt(cipherKey, plainText)
    cipherText = data
    expect(data).to.be.a('string')
  })

  it('should run decrypt without errors', () => {
    const data = Encryption.decrypt(cipherKey, cipherText)
    expect(data).to.be.a('string')
    expect(data).to.equal(plainText)
  })
})

describe('Behaviour when different keys are used to encrypt and decrypt', () => {
  let cipherKey1 = '834y9yuhjsdjfdsjfbk++',
    cipherKey2 = '834y9yuhjsdjfdsjfbk--',
    plainText = 'Hello World',
    cipherText
  it('should run encrypt without errors', () => {
    const data = Encryption.encrypt(cipherKey1, plainText)
    cipherText = data
    expect(data).to.be.a('string')
  })

  it('should throw error if differnt key is used to decrypt cipher text', () => {
    const decrypt = ()=> Encryption.decrypt(cipherKey2, cipherText)
    should().Throw(decrypt)
  })
})
