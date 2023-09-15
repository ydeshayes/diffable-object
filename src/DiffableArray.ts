import {
  parentCallBackFunction,
  diffChangesSymbol,
  diffNameSymbol,
  diffParentSymbol,
  diffable,
} from './types'
import { Diffable } from './Diffable'
import { DiffableObject } from './DiffableObject'

export class DiffableArray<T> extends Array<unknown> {
  [diffable]: Diffable<T>

  constructor(
    value: Array<unknown>,
    name?: keyof T | undefined,
    parentCallbackFunction?: parentCallBackFunction<T>
  ) {
    super(value.length)

    this[diffable] = new Diffable()

    this[diffable][diffParentSymbol] = parentCallbackFunction
    this[diffable][diffNameSymbol] = name

    if (value && value instanceof Object) {
      value.forEach((v, index) => {
        if (v instanceof Object) {
          if (Array.isArray(v)) {
            this[index] = new DiffableArray(v, index as keyof T, this.onChange.bind(this))
          } else {
            this[index] = new DiffableObject(v as T, index as keyof T, this.onChange.bind(this))
          }
        } else {
          this[index] = v
        }
      })
    }

    return new Proxy(this, {
      set(target, p, newValue) {
        if (p === 'length') {
          target.length = newValue
          return true
        }

        target[diffable][diffChangesSymbol][p as keyof T] = newValue
        ;(target as any)[p] = newValue

        if (name !== undefined && parentCallbackFunction) {
          parentCallbackFunction(name, target[diffable][diffChangesSymbol])
        }

        return true
      },
      deleteProperty(target, p) {
        target[diffable][diffChangesSymbol][p as keyof T] = undefined

        if (name !== undefined && parentCallbackFunction) {
          parentCallbackFunction(name, target[diffable][diffChangesSymbol])
        }

        return true
      },
    })
  }

  onChange(name: keyof T, changes: any) {
    this[diffable].onChange(name, changes)
  }

  getChanges() {
    return this[diffable].getChanges()
  }

  resetChanges() {
    this[diffable].resetChanges()
  }
}
