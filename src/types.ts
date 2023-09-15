export const diffParentSymbol = Symbol('diff-parent')
export const diffNameSymbol = Symbol('diff-name')
export const diffChangesSymbol = Symbol('diff-changes')
export const diffDeleteSymbol = Symbol('diff-delete')
export const diffable = Symbol('diff-object')

export type parentCallBackFunction<T> = (name: keyof T, changes: any) => void
