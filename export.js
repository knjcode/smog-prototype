'use strict';

var fs = require('fs');
var rp = require('request-promise');
var https = require('https');
var token = process.env.token;

if (!token) {
  console.error('Error: Set your slack test token');
  process.exit(1);
}

var usersListUrl = 'https://slack.com/api/users.list?token=' + token;
var emojiListUrl = 'https://slack.com/api/emoji.list?token=' + token;

function saveAsFile(data, dest) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, data, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Saved: ' + dest);
        resolve();
      }
    });
  });
}

Promise.all([rp(usersListUrl), rp(emojiListUrl)])
.then((values) => {
  var usersList = JSON.parse(values[0]);
  var emojiList = JSON.parse(values[1]);
  if ( usersList.ok && emojiList.ok ) {
    return Promise.all([saveAsFile(values[0], 'userslist.json'), saveAsFile(values[1], 'emojilist.json')])
  } else {
    return Promise.reject('Error: Slack API request failed. Check your slack test token.');
  }
}).then(() => {
  console.log('Your slack team users list exported successfully!');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
