import React from 'react'

/** @private */
interface Props<Item> {
  readonly items: Item[]
  readonly children: (item: Item) => React.ReactNode
  readonly getKeyByItem: (item: Item) => React.Key
  readonly emptyText?: string
}

/** @private */
const DEFAULT_EMPTY_TEXT = 'Empty'

export function ListOrEmpty<Item>({
  items,
  children: getNodeByItem,
  getKeyByItem,
  emptyText = DEFAULT_EMPTY_TEXT,
}: Props<Item>): React.ReactNode {
  if (items.length === 0) {
    return (
      <em>{emptyText}</em>
    )
  }

  return (
    <ul>
      {
        items.map((item) => (
          <li key={getKeyByItem(item)}>
            {getNodeByItem(item)}
          </li>
        ))
      }
    </ul>
  )
}
