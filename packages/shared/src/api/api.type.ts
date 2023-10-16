import { type HealthCheckResult } from './health-check-result/health-check-result.type.js'
import { type HttpErrorResponseDetail, type HttpErrorResponseBody } from './http-error-response-body/http-error-response-body.type.js'
import { type HttpResponseBody, type HttpResponseBodyList, type HttpResponseBodyListPaginated } from './http-response-body/http-response-body.type.js'
import { type Comment } from './comment/comment.type.js'
import { type Post } from './post/post.type.js'
import { type User } from './user/user.type.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Api {
    export { type HealthCheckResult }
    export { type HttpResponseBody }
    export { type HttpResponseBodyList }
    export { type HttpResponseBodyListPaginated }
    export { type HttpErrorResponseBody }
    export { type HttpErrorResponseDetail }

    export { type User }
    export { type Post }
    export { type Comment }
  }
}
