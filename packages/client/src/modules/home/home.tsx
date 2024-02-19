import { useDispatch } from '@/store/store.js'
import * as usersActions from '@/store/home/actions.js'
import { Health } from './health/health.js'
import { UsersList } from './users-list/users-list.js'
import { useEffect } from 'react'

export const Home: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(usersActions.refreshUsersListIfNeeded())
  }, [])

  return (
    <>
      <header>
        <h1>Home</h1>
      </header>
      <hr />
      <main>
        <section className="users-list my-2">
          <UsersList />
        </section>
      </main>
      <hr />
      <footer>
        <small>
          <Health />
        </small>
      </footer>
    </>
  )
}
