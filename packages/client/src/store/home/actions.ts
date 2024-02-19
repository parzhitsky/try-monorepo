import { type PaginationParams } from '@@shared/pagination/pagination-params.type.js'
import { forSlice } from '@/store/for-slice.js'
import { home } from './slice.js'

export const {
  addUser,
  setUsersList,
} = home.actions

export const getUsers = forSlice(home).withName('getUsers').createAction<PaginationParams>()

export const refreshUsersListIfNeeded = forSlice(home).withName('refreshUsersListIfNeeded').createAction()
