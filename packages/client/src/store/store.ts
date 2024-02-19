import * as reactRedux from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { app } from './app/slice.js'
import { home } from './home/slice.js'
import * as appActions from './app/actions.js'
import { listener } from './listener.js'

/** @private */
const rootReducer = combineReducers({
  app: app.reducer,
  home: home.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listener.middleware),
})

setTimeout(() => {
  store.dispatch(appActions.initialize())
}, 0)

export type Dispatch = typeof store.dispatch

export type State = ReturnType<typeof store.getState>

export const useDispatch: () => Dispatch = reactRedux.useDispatch

export const useSelector: reactRedux.TypedUseSelectorHook<State> = reactRedux.useSelector
