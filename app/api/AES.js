import CryptoJS from 'crypto-js'

const PRI_KEY = 'Qh1mpmCN09BGEwdB'

const getKey = (keyStr) => CryptoJS.enc.Utf8.parse(keyStr || PRI_KEY)

export const encrypt = (word, keyStr) => {
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(word), getKey(keyStr), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

export const decrypt = (word, keyStr) => {
  const decrypted = CryptoJS.AES.decrypt(word, getKey(keyStr), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return CryptoJS.enc.Utf8.stringify(decrypted).toString()
}
