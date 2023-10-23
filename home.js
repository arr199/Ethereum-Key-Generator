/* eslint-disable eqeqeq */
const { spawn } = require('child_process')
const readline = require('readline')
const process = require('node:process')

const MAX_CORES = 10

const userInputs = {
  threads: 0,
  keys: 0

}
console.log('\n[+] Welcome to Arr-keyGen version 1.0.0')
console.log('[+] PrivateKey/WalletGenerator\n')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Enter the number of keys to find : ', (input) => {
  if (isNaN(input) || !input || input == 0) process.exit()
  userInputs.keys = input

  rl.question('Enter the number of additional threads to use : ', (input) => {
    if (isNaN(input) || !input || input == 0 || input > MAX_CORES) process.exit()

    userInputs.threads = input

    rl.question('Press enter to start generating : ', (input) => {
      const child = spawn('node', ['./keyGenerator.js', userInputs.keys, userInputs.threads], {
        stdio: ['pipe', 'inherit', 'inherit']

      })

      child.on('close', (code) => {
        console.log(`Child process exited with code ${code}`)
        rl.close()
      })
    })
  })
})
