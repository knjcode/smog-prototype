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

rp(usersListUrl).then((value) => {
  var usersList = JSON.parse(value);
  if ( usersList.ok ) {
    return saveAsFile(value, 'userslist.json')
  } else {
    return Promise.reject('Error: Slack API request failed. Check your slack test token.');
  }
}).then(() => {
  console.log('Your slack team users list exported successfully!');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
