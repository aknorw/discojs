/* eslint-disable import/no-extraneous-dependencies, no-undef */

import * as dotenv from 'dotenv'

import { Discojs } from './src'

dotenv.config()

const userAgent = `Discojs/Test/0.0.0`

declare const global: {
  client: Discojs
}

global.client = new Discojs({
  userAgent,
  userToken: process.env.USER_TOKEN,
})

// Set Jest timeout to 60s.
jest.setTimeout(60000)
