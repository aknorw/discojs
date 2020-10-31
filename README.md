# Discojs

> Easiest way to use the Discogs API in Javascript - now with Typescript support! :musical_note:

[![CircleCI](https://circleci.com/gh/aknorw/discojs.svg?style=svg)](https://circleci.com/gh/aknorw/discojs)
[![Coverage Status](https://coveralls.io/repos/github/aknorw/discojs/badge.svg?branch=master)](https://coveralls.io/github/aknorw/discojs?branch=master)

## Installation

```sh
yarn add discojs
```

## Usage example

```js
import Discojs from 'discojs'

const client = new Discojs({
  userToken: process.env.USER_TOKEN,
})

client
  .searchArtist('Jacob Desvarieux')
  .then(data => doSomethingWith(data))
```

## API Reference

### v2

Documentation for `discojs@2.x` is available on [GitHub Pages](https://aknorw.github.io/discojs/);

### v1

Documentation for `discojs@1.x` is available in the [wiki](https://github.com/aknorw/discojs/wiki).

## Tests

As several methods need authentication, you'll need 2 environment variables: _DGS_USERNAME_ and _USER_TOKEN_.

Create a `.env` file at the root of the directory, and add the following lines:

```
DGS_USERNAME=0ctocat
USER_TOKEN=7h1515myu53r70k3n
```

:warning: Use a test account as public information will be edited.

As stated by Discogs API, some methods need a seller account. As I do not have one, I could not test them (which explains the coverage).

```sh
npm run test
```

When running tests, go grab a cup of coffee as this may be long because of Discogs API rate limiting.

## Credits

Inspired by [`disconnect`](https://github.com/bartve/disconnect) from [@bartve](https://github.com/bartve)
