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
    start = '\u001b]1337;File=inline=1:'
    image = fs.readFileSync('slackmock.png')
    end = '\u0007'
    console.log(start + image.toString('base64') + end)
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
    emojis = user.text.match(/:[0-9a-z-_+]+?:/g)
    emojiOnly = false
    if (emojis){
      if (emojis.join('') == user.text) {
        emojiOnly = true
      }
      emojis.forEach((emoji) => {
        name = emoji.slice(1,-1)
        if (emojiList.emoji[name]) {
          emojiUrl = emojiList.emoji[name]
          while (emojiUrl.indexOf('alias:') == 0) {
            emojiUrl = emojiList.emoji[emojiUrl.slice(6)]
          }
          if (emojiOnly) {
            emojiTag = `<span class="emoji emoji-sizer emoji-only" style="background-image:url(${emojiUrl})" title="${name}">${emoji}</span>`
          } else {
            emojiTag = `<span class="emoji emoji-sizer" style="background-image:url(${emojiUrl})" title="${name}">${emoji}</span>`
          }
          user.text = user.text.replace(emoji, emojiTag)
        } else if (emojione.shortnameToUnicode(emoji)) {
          emojiUnicode = emojione.shortnameToUnicode(emoji)
          if (emojiOnly) {
            emojiTag = `<span class="unicode-emoji unicode-emoji-sizer unicode-emoji-only" title="${name}">${emojiUnicode}</span>`
          } else {
            emojiTag = `<span class="unicode-emoji unicode-emoji-sizer" title="${name}">${emojiUnicode}</span>`
          }
          user.text = user.text.replace(emoji, emojiTag)
        } else {
          console.error('emoji not found: ' + emoji)
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
