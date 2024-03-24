import { useEffect, useState } from 'react'
import { getCommentById } from '@/api/comments/get-comment-by-id.js'

/** @private */
interface CommentFetched {
  readonly fetched: boolean
  readonly fetching: boolean
  readonly comment: Api.Comment | undefined
}

export function useCommentFetched(commentId: string): CommentFetched {
  let mounted = true

  const [fetching, setFetching] = useState(true)
  const [fetched, setFetched] = useState(false)
  const [comment, setComment] = useState<Api.Comment>()

  useEffect(() => {
    if (!fetched) {
      void (async () => {
        setFetching(true)

        const comment = await getCommentById(commentId)

        if (!mounted) {
          return
        }

        setComment(comment)
        setFetching(false)
        setFetched(true)
      })()
    }

    return () => {
      mounted = false
    }
  }, [commentId, setFetching, setFetched, setComment])

  return {
    fetching,
    fetched,
    comment,
  }
}
