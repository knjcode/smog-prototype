# smog-prototype - slack mock generator (prototype)

Generates Slack-like image file from yaml conifg that defines members' name
and their messages.  This is really useful for documentation using screenshots
of Slack .

![mock image sample](samplemock.png)

This image is generated from the following simple yaml.

```
teamname: yourteam
yourname: andrew
channel_num: 24
channels:
  - develop
  - general
  - random
current_channel: 1
dm_num: 9
dmusers:
  - andrew (you)
  - dave
  - steve
messages:
  - name: andrew
    date: 11:57 AM
    text: 'hello'
    icon: https://randomuser.me/api/portraits/men/41.jpg
  - name: dave
    date: 1:25 PM
    text: 'hi :smile:'
    icon: https://randomuser.me/api/portraits/men/99.jpg
  - name: steve
    date: 1:30 PM
    text: 'See <a href="#">http://example.com</a>'
    icon: https://randomuser.me/api/portraits/men/91.jpg
```

You don't need to sepcify user defined emoji and users' icon when you export
users' information from your slack team (described bellow).

## Usage

__Installation{__

```
$ npm install
```

__Export users' information (if you prefer)__

You don't need to sepcify user defined emoji and users' icon when you export
users' information from your slack team.

```
$ export token="your-slack-test-token"
$ npm run export
```

You can get your Slack test token from here [https://api.slack.com/docs/oauth-test-tokens](https://api.slack.com/docs/oauth-test-tokens)

__Prepare yaml__

Edit `data.yml` as you like.

__Bring up your local server and capture the screenshot__

```
$ npm start
```

This starts a local server ([http://localhost:3000](http://localhost:3000)) and then capture the screenshot from its mock screen.

The taken screenshot is saved as `slackmock.png`

Re-capture automatically when you edit the `data.yml`

## Acknowledgements

- Slack-like screens are from [Slack Chat CSS | #codevember](https://codepen.io/mikemang/pen/YpNYWV)
- Users' icon in this document from [RANDOM USER GENERATOR](https://randomuser.me/)
