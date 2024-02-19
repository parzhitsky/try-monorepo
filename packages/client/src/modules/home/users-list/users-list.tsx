import { ListPaginator } from '@/modules/common/list-paginator/list-paginator.js'
import { useDispatch, useSelector } from '@/store/store.js'
import { getUsers } from '@/store/home/actions.js'
import { selectUsersList } from './select-users-list.js'
import { UsersListBody } from './users-list-body/users-list-body.js'
import { UsersListHeader } from './users-list-header/users-list-header.js'

export const UsersList: React.FC = () => {
  const { items: users, pagination } = useSelector(selectUsersList)
  const dispatch = useDispatch()

  return (
    <>
      <header className='users-list-header'>
        <UsersListHeader />
      </header>
      <section className='users-list-body'>
        <UsersListBody users={users} />
      </section>
      <footer className="users-list-pagination">
        <ListPaginator
          items={users}
          pagination={pagination}
          onNewParams={(params) => {
            console.log(params)
            dispatch(getUsers(params))
          }}
        />
      </footer>
    </>
  )
}
