const fs = require('fs')
const yaml = require('js-yaml')
const express = require('express')
const emojione = require('emojione')
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
  console.log('Auto loading user icons...')
  data.messages.forEach((user) => {
    if(!user.icon) {
      user.icon = usersList.members.filter((u) => {
        return u.name == user.name
      })[0].profile.image_48
    }
  })
}
catch(err) {
  console.error(err)
  console.error('Slack user not found or userslist.json does not exists')
  process.exit(1)
}

try {
  const emojiList = require('./emojilist.json')
  console.log('Auto loading emoji...')
  data.messages.forEach((user) => {
    user.text = emojione.shortnameToUnicode(user.text)
    emojis = user.text.match(/:.*?:/g)
    if (emojis){
      emojis.forEach((emoji) => {
        name = emoji.slice(1,-1)
        if (emojiList.emoji[name]) {
          emojiUrl = emojiList.emoji[name]
          while (emojiUrl.indexOf('alias:') == 0) {
            emojiUrl = emojiList.emoji[emojiUrl.slice(6)]
          }
          if (user.text == emoji) {
            // emoji-only
            emojiTag = `<span class="emoji emoji-sizer emoji-only" style="background-image:url(${emojiUrl})" title="${name}">${emoji}</span>`
          } else {
            // not emoji-only
            emojiTag = `<span class="emoji emoji-sizer" style="background-image:url(${emojiUrl})" title="${name}">${emoji}</span>`
          }
          user.text = user.text.replace(emoji, emojiTag)
        }
      })
    }
  })
}
catch(err) {
  console.error(err)
  console.error('emojilist.json does not exists')
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
