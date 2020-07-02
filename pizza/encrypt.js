const { Requester, Validator } = require('@chainlink/external-adapter')
const { box, randomBytes } = require('tweetnacl')
const {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} = require('tweetnacl-util')

  const newNonce = () => randomBytes(box.nonceLength);

  const json = { "address": "700 Clark Ave, St. Louis, MO, 63102" }
  
  // app priv
  const secretOrSharedKey = decodeBase64('IXNGc7A2v8w+jVqjnKg72TmItBM2n77N2kBYW4eK1Mc=')
  // node public
  const key = decodeBase64('f6Q3CmfIO2JSP6lXcgKoSh1GuydqCPALe9CW4NMwBk4=')

  const nonce = newNonce();
  const messageUint8 = decodeUTF8(JSON.stringify(json));
  const encrypted = key
    ? box(messageUint8, nonce, key, secretOrSharedKey)
    : box.after(messageUint8, nonce, secretOrSharedKey);

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  console.log(base64FullMessage)

