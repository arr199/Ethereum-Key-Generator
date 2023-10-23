const fs = require('node:fs/promises')
const fsSync = require('node:fs')
const { Worker } = require('worker_threads')
const { execute } = require('./functions')
const { formattedPerformance } = require('./functions')
const process = require('node:process')
const path = require('node:path')

// GETTING ARGUMENTS WICH ARE THE USER INPUTS
const NUMBER_OF_KEYS = Number(process.argv[2])
const WORKERS_NUMBER = Number(process.argv[3])
async function __main__ () {
  // CREATING A DIRECTORY WILL ALL THE WORKERS
  console.log(typeof path.basename('/workers'))
  if (fsSync.existsSync('./workers')) {
    fsSync.rmSync('./workers', { recursive: true })
  }
  fs.mkdir('workers')

  for (let i = 1; i < WORKERS_NUMBER + 1; i++) {
    const WORKER_CODE = `const { parentPort } = require('worker_threads')
      const { execute } = require('../functions.js')
      const fs = require("node:fs/promises")
      const {formattedPerformance} = require("../functions")

      parentPort.on("message" , (chunk) => {
          const startTime = formattedPerformance()
          execute(chunk, "Worker 1")
          const elapsedTime = formattedPerformance()
          fs.appendFile('./permormance.txt',"WORKER ${i} : " +  
          elapsedTime  + '\\n')
          
          parentPort.postMessage([elapsedTime , startTime])
        
      } )
      `
    fs.writeFile(`./workers/worker${i}.js`, WORKER_CODE)
  }

  // object with all the info
  const info = {
    keys: NUMBER_OF_KEYS,
    main: '',
    workers: [],
    totalTime: []
  }

  // CHUNK THE NUMBEr OF KEYs DEPENDING ON THE WORKERS
  function createChunks (keys, workers) {
    const chunk = Math.floor(keys / (workers + 1))

    return chunk
  }

  // SETTING UP THE WORKERS
  const chunk = createChunks(NUMBER_OF_KEYS, WORKERS_NUMBER)
  for (let i = 1; i < WORKERS_NUMBER + 1; i++) {
    const worker = new Worker(`./workers/worker${i}.js`)
    worker.postMessage(chunk)
    worker.on('message', (endTime) => {
      info.workers.push({ [`worker${i}`]: endTime[0] })
      info.totalTime.push(endTime[0])
      const keySec = endTime[0].split(' ')[1] === 'min' ? (chunk / (Number(endTime[0].split(' ')[0]) * 60)).toFixed(2) : (chunk / Number(endTime[0].split(' ')[0])).toFixed(2)

      // LOGIN OUT THE  WORKERS DATA //
      console.log(`\n[+] Worker ${i}`)
      console.log(`\n[+] Start Time ${endTime[1]}`)
      console.log('[+] Elapsed Time : ' + endTime[0])
      console.log(`[+] Keys generated : ${chunk} `)
      console.log(`[+] Speed ${keySec} keys/sec \n`)
    })
  }
  setTimeout(() => {
    const startTime = formattedPerformance()
    execute(chunk, 'Main')
    const elapsedTime = formattedPerformance()
    info.main = elapsedTime
    info.totalTime.push(elapsedTime)
    // MAIN THREAD PERFORMANCE
    const keySec = elapsedTime.split(' ')[1] === 'min' ? (chunk / (Number(elapsedTime.split(' ')[0]) * 60)).toFixed(2) : (chunk / Number(elapsedTime.split(' ')[0])).toFixed(2)

    // LOGIN OUT THE  WORKERS DATA //
    console.log(`\n[+] StartTime : ${startTime} `)
    console.log('\n[+] Main ')
    console.log('[+] Elapsed Time : ' + elapsedTime)
    console.log(`[+] Keys generated : ${chunk} `)
    console.log(`[+] Speed ${keySec} keys/sec \n`)

    fs.appendFile('./permormance.txt', 'Main : ' + ((performance.now() / 1000).toFixed(2)).toString() + ' sec' + '\n')
  }, 200)

  return info
};

__main__().then((info) =>
  setTimeout(() => {
    const totalTimeElapsed = info.totalTime.map(e => {
      const numberPart = Number(e.split(' ')[0])
      if (e.split(' ')[1] === 'sec') {
        return numberPart * 1000
      } else return numberPart * 60 * 1000
    }).sort((a, b) => b - a)[0]

    console.log(info)
    console.log(`\n[+] Keys Generated ${info.keys} `)
    console.log('[+] Elapsed Time : ' + totalTimeElapsed / 1000 + ' sec')
    console.log(`[+] Speed : ${(info.keys / (totalTimeElapsed / 1000)).toFixed(2)} keys/sec `)
    console.log(`[+] Threads : ${info.workers.length + 1}`)
    fs.rm('./workers', { recursive: true })
  }, 2000)
)
