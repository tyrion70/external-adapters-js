const { Requester, Validator } = require('@chainlink/external-adapter')
const { box, randomBytes } = require('tweetnacl')
const {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} = require('tweetnacl-util')

  // node priv
  const secretOrSharedKey = decodeBase64('cnFtm/QWY3l+Uzz7Nx0ljtVwLpDH7iNOkX1KAAmTaL4=')
  // app public
  const key = decodeBase64('INdW9zSl/MgfbPcUiUkPP/Baab7hO7mWS5+XeP2I2D8=')

//  const messageWithNonce = input.data.deliveryDetails
  const messageWithNonce = '/hFCmsKfC3kmYG9nnUih6FN7eS7wlbatOaEh8NZxQM0krtosa/P5M+Lk5RVRG51bTicAC6pFmw=='
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength)
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length
  )
console.log(message)

  const decrypted = key
    ? box.open(message, nonce, key, secretOrSharedKey)
    : box.open.after(message, nonce, secretOrSharedKey);

console.log(decrypted)
  if (!decrypted) {
    callback(422, Requester.success(jobRunID, { "data": { "result": 0, "error": "failed to unbox" }}))
  }

  const base64DecryptedMessage = encodeUTF8(decrypted)
  console.log(JSON.parse(base64DecryptedMessage))
