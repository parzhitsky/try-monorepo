import { Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const UsersListHeader: React.FC = () => {
  return (
    <Stack direction='horizontal'>
      <div className='p-2'>
        <h2>Users</h2>
      </div>
      <div className='p-2'>
        <Link to='/users/create-user'>+ Create user</Link>
      </div>
    </Stack>
  )
}
