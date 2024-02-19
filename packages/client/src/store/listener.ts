import { createListenerMiddleware } from '@reduxjs/toolkit'
import { getUsers } from '@/api/users/get-users.js'
import { store } from '@/store/store.js'
import * as appActions from './app/actions.js'
import * as homeActions from './home/actions.js'

export const listener = createListenerMiddleware()

listener.startListening({
  actionCreator: appActions.initialize,
  async effect(action, rtk) {
    rtk.dispatch(appActions.stopLoading())
  },
})

listener.startListening({
  actionCreator: homeActions.getUsers,
  async effect(action, rtk) {
    const users = await getUsers(action.payload)

    for (const user of users.items) {
      rtk.dispatch(homeActions.addUser(user))
    }

    const userIds = users.items.map((user) => user.id)

    rtk.dispatch(homeActions.setUsersList({
      items: userIds,
      pagination: users.pagination,
    }))
  },
})

listener.startListening({
  actionCreator: homeActions.refreshUsersListIfNeeded,
  async effect(action, rtk) {
    const { home: { usersListTotalCount } } = store.getState()

    if (Number.isNaN(usersListTotalCount)) {
      rtk.dispatch(homeActions.getUsers({}))
    }
  },
})
