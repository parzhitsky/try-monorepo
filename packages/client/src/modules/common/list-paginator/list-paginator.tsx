import { Button, Stack } from 'react-bootstrap'
import { type Pagination } from '@@shared/pagination/pagination.type.js'
import { type PaginationParams } from '@@shared/pagination/pagination-params.type.js'

/** @private */
interface Props {
  readonly items: unknown[]
  readonly pagination: Pagination
  readonly onNewParams: (params: PaginationParams) => void
}

export const ListPaginator: React.FC<Props> = ({ items, pagination, onNewParams }) => {
  const hasPrevPage = pagination.offset > 0
  const hasNextPage = pagination.offset + pagination.limit < pagination.totalCount

  return (
    <div className='list-paginator'>
      {
        items.length !== 0 && (
          <Stack direction='horizontal' gap={3}>
            <Button
              className='px-2'
              type='button'
              variant='primary'
              size='sm'
              disabled={!hasPrevPage}
              onClick={() => {
                onNewParams({
                  offset: Math.max(0, pagination.offset - pagination.limit),
                  limit: pagination.limit,
                })
              }}
            >
              &larr; Back
            </Button>
            <div className="px-2">
              Showing items {pagination.offset + 1}&mdash;{pagination.offset + items.length} out of total {pagination.totalCount}
            </div>
            <Button
              className='px-2'
              variant='primary'
              type='button'
              size='sm'
              disabled={!hasNextPage}
              onClick={() => {
                onNewParams({
                  offset: pagination.offset + pagination.limit,
                  limit: pagination.limit,
                })
              }}
            >
              Next &rarr;
            </Button>
          </Stack>
        )
      }
    </div>
  )
}
