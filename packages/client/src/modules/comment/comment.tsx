import { useParams } from 'react-router-dom'
import { Loader } from '@/modules/common/loader/loader.js'
import { useCommentFetched } from './use-comment-fetched.js'

/** @private */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RouteParams = {
  readonly commentId: string
}

export const Comment: React.FC = () => {
  const { commentId } = useParams<RouteParams>()
  const { comment, fetched, fetching } = useCommentFetched(commentId!) // eslint-disable-line @typescript-eslint/no-non-null-assertion

  if (fetching) {
    return <Loader />
  }

  if (!fetched || !comment) {
    return (
      <em>An unknown error occurred while fetching comment {commentId}</em>
    )
  }

  return (
    <>
      <div>&lt; Home</div>
      <div>
        <h1>Comment</h1>
        <small>id: {comment.id}</small>
      </div>
      <div>
        by {comment.author.alias}
      </div>
      <div>
        {comment.content}
      </div>
      <div>
        to {comment.post.id}
      </div>
      <div>
        <button type="button">
          Delete
        </button>
      </div>
    </>
  )
}
