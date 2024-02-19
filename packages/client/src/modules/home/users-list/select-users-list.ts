import { createSelector } from '@reduxjs/toolkit'
import { type State } from '@/store/store.js'

export const selectUsersList = createSelector(
  (state: State) => state.home.allUsersMap,
  (state: State) => state.home.usersListUserIds,
  (state: State) => state.home.usersListOffset,
  (state: State) => state.home.usersListLimit,
  (state: State) => state.home.usersListTotalCount,
  (
    allUsersMap,
    usersListUserIds,
    usersListOffset,
    usersListLimit,
    usersListTotalCount,
  ) => ({
    items: usersListUserIds.map((userId) => allUsersMap[userId]),
    pagination: {
      offset: usersListOffset,
      limit: usersListLimit,
      totalCount: usersListTotalCount,
    },
  }),
)
