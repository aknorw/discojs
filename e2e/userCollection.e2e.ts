import * as t from 'io-ts'

import { Discojs, FolderIdsEnum, SortOrdersEnum, UserSortEnum } from '../lib'

import { FoldersResponseIO, FolderReleasesResponseIO, AddToFolderResponseIO, CustomFieldsResponseIO } from '../models'
import { FolderIO, CollectionValueIO } from '../models/folder'

declare const client: Discojs

const rodneyfool = 'rodneyfool'
const pagination = { page: 1, perPage: 1 }

describe('User Collection', () => {
  let folderId: number
  let instanceId: number

  describe('Collection', () => {
    it('listFoldersForUser', async () => {
      const apiResponse = await client.listFoldersForUser(rodneyfool)
      expect(t.exact(FoldersResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('listFolders', async () => {
      const apiResponse = await client.listFolders()
      expect(t.exact(FoldersResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('createFolder', async () => {
      const name = `Test-${Math.random()}`
      const apiResponse = await client.createFolder(name)
      expect(t.exact(FolderIO).is(apiResponse)).toBeTruthy()
      expect(apiResponse).toHaveProperty('name', name)
      // Set folderId for upcoming tests
      folderId = apiResponse.id
    })
  })

  describe('Collection Folder', () => {
    it('getFolderForUser', async () => {
      const apiResponse = await client.getFolderForUser(rodneyfool, FolderIdsEnum.ALL)
      expect(t.exact(FolderIO).is(apiResponse)).toBeTruthy()
    })

    it('getFolder', async () => {
      const apiResponse = await client.getFolder(folderId)
      expect(t.exact(FolderIO).is(apiResponse)).toBeTruthy()
    })

    it('editFolder', async () => {
      const name = `Another-test-${Math.random()}`
      const apiResponse = await client.editFolder(folderId, name)
      expect(t.exact(FolderIO).is(apiResponse)).toBeTruthy()
      expect(apiResponse).toHaveProperty('name', name)
    })

    it('deleteFolder', async () => {
      const apiResponse = await client.deleteFolder(folderId)
      // Empty response has 0 keys
      expect(Object.keys(apiResponse).length).toEqual(0)
    })
  })

  describe('Collection Items By Release', () => {
    it('listItemsByReleaseForUser', async () => {
      const username = 'susan.salkeld'
      const releaseId = 7781525
      const apiResponse = await client.listItemsByReleaseForUser(username, releaseId)
      expect(t.exact(FolderReleasesResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('listItemsByReleaseForUser - with pagination', async () => {
      const username = 'susan.salkeld'
      const releaseId = 7781525
      const apiResponse = await client.listItemsByReleaseForUser(username, releaseId, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('listAllItemsByReleaseForUser', async () => {
      const username = 'susan.salkeld'
      const releaseId = 7781525
      // eslint-disable-next-line no-restricted-syntax
      for await (const response of client.listAllItemsByReleaseForUser(username, releaseId)) {
        expect('releases' in response).toBeTruthy()
      }
    })

    // @TODO: Add tests for listItemsByRelease + listAllItemsByRelease.
  })

  describe('Collection Items By Folder', () => {
    // TODO: If folder_id is not 0, or the collection has been made private by its owner, authentication as the collection owner is required.
    it('listItemsInFolderForUser', async () => {
      const apiResponse = await client.listItemsInFolderForUser(rodneyfool, FolderIdsEnum.ALL)
      expect(t.exact(FolderReleasesResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('listItemsInFolderForUser - with sort', async () => {
      const by = UserSortEnum.TITLE

      const firstApiResponse = await client.listItemsInFolderForUser(rodneyfool, FolderIdsEnum.ALL, {
        by,
        order: SortOrdersEnum.ASC,
      })
      // Check if there are at least 2 releases.
      expect(firstApiResponse.releases.length).toBeGreaterThanOrEqual(2)
      const firstId = firstApiResponse.releases[0].id

      const secondApiResponse = await client.listItemsInFolderForUser(rodneyfool, FolderIdsEnum.ALL, {
        by,
        order: SortOrdersEnum.DESC,
      })
      const secondId = secondApiResponse.releases[0].id

      expect(firstId).not.toEqual(secondId)
    })

    it('listItemsInFolderForUser - with pagination', async () => {
      const apiResponse = await client.listItemsInFolderForUser(rodneyfool, FolderIdsEnum.ALL, undefined, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('listAllItemsInFolderForUser', async () => {
      // eslint-disable-next-line no-restricted-syntax
      for await (const response of client.listAllItemsInFolderForUser(rodneyfool, FolderIdsEnum.ALL)) {
        expect('releases' in response).toBeTruthy()
      }
    })
  })

  describe('Add To Collection Folder', () => {
    it('addReleaseToFolder', async () => {
      const releaseId = 3124045
      const apiResponse = await client.addReleaseToFolder(releaseId)
      expect(t.exact(AddToFolderResponseIO).is(apiResponse)).toBeTruthy()
      // Set instanceId for upcoming tests
      instanceId = apiResponse.instance_id
    })
  })

  describe('Change Rating Of Release', () => {
    it('editReleaseInstanceRating', async () => {
      const releaseId = 3124045
      const apiResponse = await client.editReleaseInstanceRating(FolderIdsEnum.UNCATEGORIZED, releaseId, instanceId, 4)
      // Empty response has 0 keys
      expect(Object.keys(apiResponse).length).toEqual(0)
    })

    // @TODO: Add tests for moveReleaseInstanceToFolder
  })

  describe('Delete Instance From Folder', () => {
    it('deleteReleaseInstanceFromFolder', async () => {
      const releaseId = 3124045
      const apiResponse = await client.deleteReleaseInstanceFromFolder(
        FolderIdsEnum.UNCATEGORIZED,
        releaseId,
        instanceId,
      )
      // Empty response has 0 keys
      expect(Object.keys(apiResponse).length).toEqual(0)
    })
  })

  describe('List Custom Fields', () => {
    it('listCustomFieldsForUser', async () => {
      const apiResponse = await client.listCustomFieldsForUser(rodneyfool)
      expect(t.exact(CustomFieldsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('listCustomFields', async () => {
      const apiResponse = await client.listCustomFields()
      expect(t.exact(CustomFieldsResponseIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Edit Fields Instance', () => {
    // @TODO: Add tests for editCustomFieldForInstance
  })

  describe('Collection Value', () => {
    it('getCollectionValue', async () => {
      const apiResponse = await client.getCollectionValue()
      expect(t.exact(CollectionValueIO).is(apiResponse)).toBeTruthy()
    })
  })
})
