import React from 'react'

export const Comment = React.lazy(async () => {
  const module = await import('./comment.js')

  return {
    default: module.Comment,
  }
})
