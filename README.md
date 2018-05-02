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

// Methods return promises

client.searchArtist('Jacob Desvarieux')
  .then((data) => {
    doSomethingWith(data)
  })
  .catch((error) => {
    console.warn('Oops, something went wrong!', error)
  })

// If you're using ES7, you can use async functions

async function notifyShipmentForOrder(orderId) {
  const result = await client.sendMessageForOrder(1337, {
    message: 'Your order is dispatched!',
    status: 'Shipped',
  })
  return result.timestamp
}

// Just chain methods!

client.getIdentity()
  .then((identity) => {
    const { username } = identity
    return client.addToWantlist({
      username,
      releaseId: 1189932,
      notes: 'Must buy this!',
      rating: 4,
    })
  })
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.warn(error)
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

Key | Type | Default | Details
--- | --- | --- | ---
userAgent | *string* | `Discojs/1.0.1` |
outputFormat | *string* | `discogs` | Must be `discogs`, `plaintext` or `html`
userToken | *string* | - | For auth purposes
consumerKey | *string* | - | For auth purposes
consumerSecret | *string* | - | For auth purposes
requestLimit | *int* | 25 | For API throttling purposes when not authenticated
requestLimitAuth | *int* | 60 | For API throttling purposes when authenticated
requestLimitInterval | *int* | 60000 |
fetchOptions | *object* | {} | Options to be passed to `fetch`

### Methods

Documentation about methods is available in the [wiki](https://github.com/aknorw/discojs/wiki).

* Static methods
  * [`getSupportedCurrencies`](https://github.com/aknorw/discojs/wiki/Static-methods#get-supported-currencies)
  * [`getReleaseConditions`](https://github.com/aknorw/discojs/wiki/Static-methods#get-release-conditions)
  * [`getSleeveConditions`](https://github.com/aknorw/discojs/wiki/Static-methods#get-sleeve-conditions)


* Database
  * Search
    * [`searchDatabase`](https://github.com/aknorw/discojs/wiki/Database#search)
  * Releases
    * [`getRelease`](https://github.com/aknorw/discojs/wiki/Database#get-release)
    * [`searchRelease`](https://github.com/aknorw/discojs/wiki/Database#search-release)
  * Masters
    * [`getMaster`](https://github.com/aknorw/discojs/wiki/Database#get-master-release)
    * [`getVersionsForMaster`](https://github.com/aknorw/discojs/wiki/Database#list-versions-for-master-release)
  * Artists
   * [`getArtist`](https://github.com/aknorw/discojs/wiki/Database#get-artist)
   * [`getReleasesForArtist`](https://github.com/aknorw/discojs/wiki/Database#list-releases-for-artist)
   * [`searchArtist`](https://github.com/aknorw/discojs/wiki/Database#search-artist)
  * Labels
    * [`getLabel`](https://github.com/aknorw/discojs/wiki/Database#get-label)
    * [`getReleasesForLabel`](https://github.com/aknorw/discojs/wiki/Database#list-releases-for-label)
    * [`searchLabel`](https://github.com/aknorw/discojs/wiki/Database#search-label)


* Lists
  * [`getItemsInList`](https://github.com/aknorw/discojs/wiki/Lists#get-items-in-list)


* Marketplace
  * Listings
    * [`getListing`](https://github.com/aknorw/discojs/wiki/Marketplace#get-listing)
    * [`editListing`](https://github.com/aknorw/discojs/wiki/Marketplace#edit-listing)
    * [`removeListing`](https://github.com/aknorw/discojs/wiki/Marketplace#remove-listing)
    * [`createListing`](https://github.com/aknorw/discojs/wiki/Marketplace#create-listing)
  * Orders
    * [`listOrders`](https://github.com/aknorw/discojs/wiki/Marketplace#list-orders)
    * [`getOrder`](https://github.com/aknorw/discojs/wiki/Marketplace#get-order)
    * [`editOrder`](https://github.com/aknorw/discojs/wiki/Marketplace#edit-order)
    * [`listMessagesForOrder`](https://github.com/aknorw/discojs/wiki/Marketplace#list-order-messages)
    * [`sendMessageForOrder`](https://github.com/aknorw/discojs/wiki/Marketplace#send-order-message)
  * Fees
    * [`getFee`](https://github.com/aknorw/discojs/wiki/Marketplace#fees)
  * Price suggestions
    * [`getPriceSuggestions`](https://github.com/aknorw/discojs/wiki/Marketplace#price-suggestions)


* User
  * Inventory
    * [`getInventory`](https://github.com/aknorw/discojs/wiki/User#inventory)
  * Identity
    * [`getIdentity`](https://github.com/aknorw/discojs/wiki/User#get-identity)
    * Profile
      * [`getProfile`](https://github.com/aknorw/discojs/wiki/User#get-profile)
      * [`editProfile`](https://github.com/aknorw/discojs/wiki/User#edit-profile)
    * Submissions
      * [`getSubmissionsForUser`](https://github.com/aknorw/discojs/wiki/User#submissions)
    * Contributions
      * [`getContributionsForUser`](https://github.com/aknorw/discojs/wiki/User#contributions)
  * Collection
    * Folders
      * [`listFoldersForUser`](https://github.com/aknorw/discojs/wiki/User#list-folders)
      * [`getFolderForUser`](https://github.com/aknorw/discojs/wiki/User#get-folder)
      * [`editFolderForUser`](https://github.com/aknorw/discojs/wiki/User#edit-folder)
      * [`removeFolderForUser`](https://github.com/aknorw/discojs/wiki/User#remove-folder)
      * [`createFolderForUser`](https://github.com/aknorw/discojs/wiki/User#create-folder)
    * Custom fields
      * [`getCustomFields`](https://github.com/aknorw/discojs/wiki/User#custom-fields)
    * Collection value
      * [`getValue`](https://github.com/aknorw/discojs/wiki/User#collection-value)
  * Wantlist
    * [`getWantlist`](https://github.com/aknorw/discojs/wiki/User#get-wantlist)
    * [`addToWantlist`](https://github.com/aknorw/discojs/wiki/User#add-to-wantlist)
    * [`removeFromWantlist`](https://github.com/aknorw/discojs/wiki/User#remove-from-wantlist)
  * Lists
    * [`getListsForUser`](https://github.com/aknorw/discojs/wiki/User#lists)

## Tests

As several methods need authentication, you'll need 2 environment variables: *DGS_USERNAME* and *USER_TOKEN*.

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
