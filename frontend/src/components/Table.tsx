import type { ReactNode } from 'react'

type TableHeader = {
  label: string
  align?: 'start' | 'center' | 'end'
  width?: string
}

type TableProps = {
  headers: TableHeader[]
  children: ReactNode
  emptyMessage?: string
  isEmpty?: boolean
  emptyColSpan?: number
}

const Table = ({ headers, children, emptyMessage, isEmpty = false, emptyColSpan }: TableProps) => {
  const colSpan = emptyColSpan ?? headers.length
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100 text-start">
        <thead className="bg-slate-50/60 text-xs font-medium text-slate-500">
          <tr>
            {headers.map((header) => (
              <th
                key={header.label}
                className="px-4 py-3 text-start"
                style={{ textAlign: header.align ?? 'start', width: header.width }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {isEmpty && emptyMessage ? (
            <tr>
              <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table

