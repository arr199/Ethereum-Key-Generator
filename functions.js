const crypto = require('crypto')
const ethUtil = require('ethereumjs-util')
const fs = require('node:fs/promises')
// FORMAT THE PERFORMANCE METHOD TO SEC AND MIN
function formattedPerformance () {
  return Number(performance.now().toString().split('.')[0]) / 1000 > 60
    ? (Number(performance.now().toString().split('.')[0]) / 1000 / 60).toFixed(2) + ' min'
    : (Number(performance.now().toString().split('.')[0]) / 1000).toFixed(2) + ' sec'
}

//
function execute (chunks, worker) {
  function generateKeys () {
    function generateRandomPrivateKey () {
      return '0x' + crypto.randomBytes(32).toString('hex')
    }
    function privateKeyToAddress (privateKey) {
      const privateKeyBuffer = ethUtil.toBuffer(privateKey)
      const publicKey = ethUtil.privateToPublic(privateKeyBuffer)
      const walletAddress = ethUtil.publicToAddress(publicKey).toString('hex')
      return '0x' + walletAddress
    }
    //  GET A RANDOM PRIVATE KEY
    const randomPrivateKey = generateRandomPrivateKey()
    // Get the corresponding wallet address
    const walletAddress = privateKeyToAddress(randomPrivateKey)

    return { randomPrivateKey, walletAddress }
  }

  // fs.appendFile("./file.txt", `Private key ${" ".repeat(60)} Wallet \n`)

  // ITERATES OVER THE NUMBER OF KEYS (CHUNKS)

  for (let i = 0; i < chunks; i++) {
    const { randomPrivateKey, walletAddress } = generateKeys()

    if (walletAddress.startsWith('0xccccc')) {
      fs.appendFile('./file.txt', randomPrivateKey + ' : ' + walletAddress + '\n')
    }
    // fs.appendFile("./file.JSON", worker + " : "  + walletAddress  +  "\n" )
  }
}

module.exports = {
  execute,
  formattedPerformance
}
