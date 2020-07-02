const { Requester, Validator } = require('@chainlink/external-adapter')
const { box, randomBytes } = require('tweetnacl')
const {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} = require('tweetnacl-util')
const customError = (data) => {
  return data.status === 'ERROR'
}
const customParams = {
  base: false,
  quote:false,
  endpoint: false,
  amount: false,
  precision: false,
  deliveryDetails: ['deliveryDetails']
}
const createRequest = (input, callback) => {
  const validator = new Validator(callback, input, customParams)
  const jobRunID = validator.validated.id
  const address = validator.validated.data.address
  const apikey = process.env.API_KEY
  // node priv
  const secretOrSharedKey = decodeBase64('cnFtm/QWY3l+Uzz7Nx0ljtVwLpDH7iNOkX1KAAmTaL4=')
  // app public
  const key = decodeBase64('INdW9zSl/MgfbPcUiUkPP/Baab7hO7mWS5+XeP2I2D8=')
  const messageWithNonce = input.data.deliveryDetails
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength)
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length
  )
  const decrypted = key
    ? box.open(message, nonce, key, secretOrSharedKey)
    : box.open.after(message, nonce, secretOrSharedKey);
  if (!decrypted) {
    return callback(422, Requester.success(jobRunID, { "data": { "result": 0, "error": "failed to unbox" }}))
  }
  const payload = JSON.parse(encodeUTF8(decrypted))
  //console.log(payload)
  //console.log(payload.address)
  var pizzapi = require('pizzapi');
  const theCustomer = pizzapi.Customer({
    firstName: payload.firstname,
    lastName: payload.lastname,
    address: payload.address,
    email: payload.email
  });
  pizzapi.Util.findNearbyStores(payload.address, 'Delivery', function(storeData){
    if (storeData.success == false) {
      return callback(422, Requester.success(jobRunID, { "data": { "result": 0, "error": "can't find store" }}))
    }
    store = storeData.result.Stores[0]
    mystoreID = storeData.result.Stores[0].StoreID
    mystoreDetails = storeData.result.Stores[0].AddressDescription
    const theCustomer = new pizzapi.Customer({
      firstName: payload.firstname,
      lastName: payload.lastname,
      address: payload.address,
      email: payload.email
    });
    var myStore = new pizzapi.Store({ID: mystoreID});
    var order = new pizzapi.Order({
      customer: theCustomer,
      storeID: myStore.ID,
      deliveryMethod: 'Delivery',
    });
    order.addItem(new pizzapi.Item({
      code: '14SCREEN',
      options: {},
      quantity: 1
    }));
    return order.validate(function(result) {
      console.log("We did it!");
      return order.place("sk_test_BSIwKFVgxgkgLeynhYoMRvXO00yyOZUrtq", function(result) {
        console.log("Order placed!");
	console.log(1)
	return callback(200, Requester.success(jobRunID, {
	  "data": {
	    "result": 1,
	    "storeDetails": mystoreDetails
	  }
	}));
      });
    });
  });
};
module.exports.createRequest = createRequest
