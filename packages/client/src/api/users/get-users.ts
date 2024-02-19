import { type ListPaginated } from '@@shared/pagination/list-paginated.type.js'
import { type PaginationParams } from '@@shared/pagination/pagination-params.type.js'
import { client } from '@/api/client.js'

export const DEFAULT_OFFSET = 0
export const DEFAULT_LIMIT = 2

export async function getUsers({
  offset = DEFAULT_OFFSET,
  limit = DEFAULT_LIMIT,
}: PaginationParams = {}): Promise<ListPaginated<Api.User>> {
  const searchParams = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  })

  const query = searchParams.toString()
  const response = await client.get<Api.HttpResponseBodyListPaginated<Api.User>>(`/v1/users?${query}`)

  const { result: items, pagination } = response.data

  return {
    items,
    pagination,
  }
}
