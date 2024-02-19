import { Link } from 'react-router-dom'
import { ListOrEmpty } from '@/modules/common/list-or-empty/list-or-empty.js'

/** @private */
interface Props {
  readonly users: Api.User[]
}

export const UsersListBody: React.FC<Props> = ({ users }) => {
  return (
    <ListOrEmpty
      items={users}
      getKeyByItem={(user) => user.alias}
    >
      {(user) => (
        <Link to={`/users/${user.alias}`}>{user.alias}</Link>
      )}
    </ListOrEmpty>
  )
}
