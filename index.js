const fs = require('fs')
const yaml = require('js-yaml')
const express = require('express')
const Nightmare = require('nightmare')
const nightmare = Nightmare({ width:800, height:675 })

function capture() {
  console.log('Capturing screenshot...')
  nightmare
    .goto('http://localhost:3000/')
    .screenshot('slackmock.png', {
      x: 0,
      y: 50,
      width:800,
      height:450
    })
  .then(()=>{
    console.log('Screenshot saved!')
  })
  .catch((err)=>{
    console.log(err)
  })
  nightmare.end()
}

const data = yaml.safeLoad(fs.readFileSync('./data.yml', 'utf8'))

try {
  const usersList = require('./userslist.json')
  console.log('auto load user icons')
  data.comments.forEach(function(user){
    if(!user.icon) {
      user.icon = usersList.members.filter((u) => {
        return u.name == user.name
      })[0].profile.image_48
    }
  })
}
catch(err) {
  console.log('userslist.json does not exists')
}

console.log(data)

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', data)
})

app.listen(3000)
capture()
