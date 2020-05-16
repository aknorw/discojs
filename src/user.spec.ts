import * as t from 'io-ts'

import { Discojs, FolderIdsEnum, SortOrdersEnum, UserSortEnum } from '.'
import {
  AddToFolderResponseIO,
  AddToWantlistResponseIO,
  CustomFieldsResponseIO,
  FolderReleasesResponseIO,
  FoldersResponseIO,
  UserListItemsResponseIO,
  UserListsResponseIO,
  UserSubmissionsResponseIO,
  UserContributionsResponseIO,
  WantlistResponseIO,
} from '../models/api'
import { CollectionValueIO, FolderIO } from '../models/folder'
import { IdentityIO, UserIO } from '../models/user'

declare const client: Discojs

const rodneyfool = 'rodneyfool'
const pagination = { page: 1, perPage: 1 }

describe('User', () => {
  describe('Identity', () => {
    it('getIdentity', async () => {
      const apiResponse = await client.getIdentity()
      expect(t.exact(IdentityIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Profile', () => {
    it('getProfileForUser', async () => {
      const apiResponse = await client.getProfileForUser(rodneyfool)
      expect(t.exact(UserIO).is(apiResponse)).toBeTruthy()
    })

    it('getProfile', async () => {
      const apiResponse = await client.getProfile()
      expect(t.exact(UserIO).is(apiResponse)).toBeTruthy()
    })

    it('editProfile', async () => {
      const input = {
        name: Math.random().toString(),
        homePage: 'https://discojs',
        location: `Planet ${Math.random()}`,
        profile: 'Test',
      }
      const apiResponse = await client.editProfile(input)
      expect(t.exact(UserIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Submissions', () => {
    it('getSubmissionsForUser', async () => {
      const apiResponse = await client.getSubmissionsForUser(rodneyfool)
      expect(t.exact(UserSubmissionsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getSubmissionsForUser - with pagination', async () => {
      const apiResponse = await client.getSubmissionsForUser(rodneyfool, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('getSubmissions', async () => {
      const apiResponse = await client.getSubmissions(pagination)
      expect(t.exact(UserSubmissionsResponseIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Contributions', () => {
    const username = 'shooezgirl'

    it('getContributionsForUser', async () => {
      const apiResponse = await client.getContributionsForUser(username)
      expect(t.exact(UserContributionsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getContributionsForUser - with sort', async () => {
      const by = UserSortEnum.TITLE

      const firstApiResponse = await client.getContributionsForUser(username, { by, order: SortOrdersEnum.ASC })
      // Check if there are at least 2 contributions.
      expect(firstApiResponse.contributions.length).toBeGreaterThanOrEqual(2)
      const firstId = firstApiResponse.contributions[0].id

      const secondApiResponse = await client.getContributionsForUser(username, { by, order: SortOrdersEnum.DESC })
      const secondId = secondApiResponse.contributions[0].id

      expect(firstId).not.toEqual(secondId)
    })

    it('getSubmissionsForUser - with pagination', async () => {
      const apiResponse = await client.getContributionsForUser(username, undefined, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('getContributions', async () => {
      const apiResponse = await client.getContributions()
      expect(t.exact(UserContributionsResponseIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Collection', () => {
    let folderId: number
    let instanceId: number

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

    it('addReleaseToFolder', async () => {
      const releaseId = 3124045
      const apiResponse = await client.addReleaseToFolder(releaseId)
      expect(t.exact(AddToFolderResponseIO).is(apiResponse)).toBeTruthy()
      // Set instanceId for upcoming tests
      instanceId = apiResponse.instance_id
    })

    // TODO: Add listItemsByRelease

    it('editReleaseInstanceRating', async () => {
      const releaseId = 3124045
      const apiResponse = await client.editReleaseInstanceRating(FolderIdsEnum.UNCATEGORIZED, releaseId, instanceId, 4)
      // Empty response has 0 keys
      expect(Object.keys(apiResponse).length).toEqual(0)
    })

    // TODO: Cannot test moveReleaseInstanceToFolder because we cannot create folder via API
    // wrong

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

    it('listCustomFieldsForUser', async () => {
      const apiResponse = await client.listCustomFieldsForUser(rodneyfool)
      expect(t.exact(CustomFieldsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('listCustomFields', async () => {
      const apiResponse = await client.listCustomFields()
      expect(t.exact(CustomFieldsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getCollectionValue', async () => {
      const apiResponse = await client.getCollectionValue()
      expect(t.exact(CollectionValueIO).is(apiResponse)).toBeTruthy()
    })
  })

  describe('Wantlist', () => {
    const releaseId = 3124045

    it('getWantlistForUser', async () => {
      const apiResponse = await client.getWantlistForUser(rodneyfool)
      expect(t.exact(WantlistResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getWantlistForUser - with pagination', async () => {
      const apiResponse = await client.getWantlistForUser(rodneyfool, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('getWantlist', async () => {
      const apiResponse = await client.getWantlist()
      expect(t.exact(WantlistResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('addToWantlist', async () => {
      const notes = `Test-${Math.random()}`
      const apiResponse = await client.addToWantlist(releaseId, notes, 4)
      expect(t.exact(AddToWantlistResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('removeFromWantlist', async () => {
      const apiResponse = await client.removeFromWantlist(releaseId)
      // Empty response has 0 keys
      expect(Object.keys(apiResponse).length).toEqual(0)
    })
  })

  describe('Lists', () => {
    it('getListsForUser', async () => {
      const apiResponse = await client.getListsForUser(rodneyfool)
      expect(t.exact(UserListsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getListsForUser - with pagination', async () => {
      const apiResponse = await client.getListsForUser(rodneyfool, pagination)
      expect(apiResponse.pagination).toHaveProperty('page', pagination.page)
      expect(apiResponse.pagination).toHaveProperty('per_page', pagination.perPage)
    })

    it('getLists', async () => {
      const apiResponse = await client.getLists()
      expect(t.exact(UserListsResponseIO).is(apiResponse)).toBeTruthy()
    })

    it('getListItems', async () => {
      const listId = 515576
      const apiResponse = await client.getListItems(listId)
      expect(t.exact(UserListItemsResponseIO).is(apiResponse)).toBeTruthy()
    })
  })
})
