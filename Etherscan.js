const API_KEY = '6BAJ5UABNXJ1MWM6NY1CNFNQBD9RI5ZXZJ'
const wallet = '0x73Cb30D4A914BaF41261b523399D6DE1f73F915b'

fetch(`https://api.etherscan.io/api
?module=account
&action=balance
&address=${wallet}
&tag=latest
&apikey=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const balance = Number(data.result) * (10 ** -18)
    return console.log(balance)
  })
