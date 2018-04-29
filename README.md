# Discojs
> Easiest way to use the Discogs API in Javascript :musical_note:

[![CircleCI](https://circleci.com/gh/aknorw/discojs.svg?style=svg)](https://circleci.com/gh/aknorw/discojs)
[![Coverage Status](https://coveralls.io/repos/github/aknorw/discojs/badge.svg?branch=master)](https://coveralls.io/github/aknorw/discojs?branch=master)

## Installation

```sh
npm install --save discojs
```

## Usage example

```js
import Discojs from 'discojs'

const client = new Discojs({
  userToken: process.env.USER_TOKEN,
})

// Search for an artist
client.searchArtist('Jacob Desvarieux')

// Send a message for an order
client.sendMessageForOrder(1337, {
  message: 'Your order is dispatched!',
  status: 'Shipped',
})

// Add a release to your wantlist
client.addToWantlist({
  username: 'discojs',
  releaseId: 1189932,
  notes: 'Must buy this!',
  rating: 4,
})
```

## API Reference

### Discojs instance

```js
const options = {
  userAgent,
  outputFormat,
  userToken,
  consumerKey,
  consumerSecret,
  requestLimit,
  requestLimitAuth,
  requestLimitInterval,
  fetchOptions,
}

const client = new Discojs(options)
```

#### Options

Key | Type | Default | Details
--- | --- | --- | ---
userAgent | *string* | `Discojs/1.0.0` |
outputFormat | *string* | `discogs` | Must be `discogs`, `plaintext` or `html`
userToken | *string* | - | For auth purposes
consumerKey | *string* | - | For auth purposes
consumerSecret | *string* | - | For auth purposes
requestLimit | *int* | 25 | For API throttling purposes when not authenticated
requestLimitAuth | *int* | 60 | For API throttling purposes when authenticated
requestLimitInterval | *int* | 60000 |
fetchOptions | *object* | {} | Options to be passed to `fetch`

For methods, please refer to the [wiki](https://github.com/aknorw/discojs/wiki).

## Tests

As several methods need authentication, you'll need 2 environment variables: *DGS_USERNAME* and *USER_TOKEN*. See [`dotenv`](https://github.com/motdotla/dotenv) documentation to add them easily.

When running tests, go grab a cup of coffee as this may be long because of Discogs API rate limiting.

:warning: Use a test account as public information will be edited (ie. `editProfile`)

```sh
npm run test
```

## Credits

Inspired by [`disconnect`](https://github.com/bartve/disconnect) from [@bartve](https://github.com/bartve)
