import {
  parentCallBackFunction,
  diffChangesSymbol,
  diffDeleteSymbol,
  diffNameSymbol,
  diffParentSymbol,
} from './types'

export class Diffable<T> {
  [diffChangesSymbol]: Partial<T> = {};
  [diffDeleteSymbol]: Partial<T> = {};
  [diffParentSymbol]: parentCallBackFunction<T> | undefined;
  [diffNameSymbol]: keyof T | undefined

  onChange(name: keyof T, changes: T[keyof T] | undefined) {
    this[diffChangesSymbol][name] = changes

    if (!this[diffNameSymbol] || !this[diffParentSymbol]) {
      return
    }

    this[diffParentSymbol](this[diffNameSymbol], { ...this[diffChangesSymbol], [name]: changes })
  }

  getChanges() {
    return this[diffChangesSymbol]
  }

  resetChanges() {
    this[diffChangesSymbol] = {}
  }
}
