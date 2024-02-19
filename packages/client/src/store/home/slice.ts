import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type ListPaginated } from '@@shared/pagination/list-paginated.type.js'

export interface State {
  allUsersMap: Record<string, Api.User>
  usersListUserIds: string[]
  usersListOffset: number
  usersListLimit: number
  usersListTotalCount: number
}

/** @private */
const initialState: State = {
  allUsersMap: {},
  usersListUserIds: [],
  usersListOffset: NaN,
  usersListLimit: NaN,
  usersListTotalCount: NaN,
}

export const home = createSlice({
  name: 'home',
  initialState,
  reducers: {
    addUser(state, { payload: user }: PayloadAction<Api.User>) {
      state.allUsersMap[user.id] = user
    },

    setUsersList(state, action: PayloadAction<ListPaginated<string>>) {
      const { items: userIds, pagination } = action.payload

      state.usersListUserIds = userIds
      state.usersListOffset = pagination.offset
      state.usersListLimit = pagination.limit
      state.usersListTotalCount = pagination.totalCount
    },
  },
})
