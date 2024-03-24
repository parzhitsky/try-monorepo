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
        <section className="posts">
          <h2>Posts</h2>
          <ul>
            <li>post 1</li>
            <li>post 2</li>
            <li>post 3</li>
          </ul>
        </section>
        <section className="comments">
          <h2>Comments</h2>
          <ul>
            <li>comment 1</li>
            <li>comment 2</li>
            <li>comment 3</li>
          </ul>
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
