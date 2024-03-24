import { client } from '@/api/client.js'

export async function getCommentById(id: string): Promise<Api.Comment> {
  const response = await client.get<Api.HttpResponseBody<Api.Comment>>(`/v1/comments/${id}`)
  const comment = response.data.result

  return comment
}
