export default function getItemsInList(listId) {
  if (typeof listId !== 'number') {
    return Promise.reject(new TypeError(`[getItemsInListMethod] listId must be a number (${listId})`))
  }
  return this._fetch({ uri: `/lists/${listId}` })
}
