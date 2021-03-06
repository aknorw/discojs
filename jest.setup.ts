/* eslint-disable import/no-extraneous-dependencies, no-undef */

import * as dotenv from 'dotenv'

import { Discojs } from './src'

dotenv.config()

const userAgent = `Discojs/Test/0.0.0`

declare const global: any
global.client = new Discojs({
  userAgent,
  userToken: process.env.USER_TOKEN,
  requestLimitAuth: 20,
})

// Set Jest timeout to 30s.
jest.setTimeout(30000)
