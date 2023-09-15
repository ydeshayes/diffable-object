import {
  diffChangesSymbol,
  diffDeleteSymbol,
  diffNameSymbol,
  diffParentSymbol,
  parentCallBackFunction,
} from './types'
import { Diffable } from './Diffable'
import { DiffableArray } from './DiffableArray'

export class DiffableObject<T> extends Diffable<T> {
  constructor(
    value: T,
    name?: keyof T | undefined,
    parentCallbackFunction?: parentCallBackFunction<T>
  ) {
    super()
    this[diffParentSymbol] = parentCallbackFunction
    this[diffNameSymbol] = name

    if (value && value instanceof Object) {
      const keys = Object.keys(value)
      type ObjKey = keyof T
      keys.forEach((key) => {
        if (value[key as ObjKey] instanceof Object) {
          if (Array.isArray(value[key as ObjKey])) {
            Reflect.set(
              this,
              key,
              new DiffableArray(
                value[key as ObjKey] as unknown[],
                key as keyof T,
                this.onChange.bind(this)
              )
            )
          } else {
            Reflect.set(
              this,
              key,
              new DiffableObject(
                value[key as ObjKey] as T,
                key as keyof T,
                this.onChange.bind(this)
              )
            )
          }
        } else {
          Reflect.set(this, key, value[key as ObjKey])
        }
      })
    }

    return new Proxy(this, {
      set(target, p, newValue) {
        if (p === diffChangesSymbol) {
          target[diffChangesSymbol] = newValue
          return true
        }

        target[diffChangesSymbol][p as keyof T] = newValue
        ;(target as any)[p] = newValue

        if (name !== undefined && parentCallbackFunction) {
          parentCallbackFunction(name, target[diffChangesSymbol])
        }

        return true
      },
      deleteProperty(target, p) {
        target[diffDeleteSymbol][p as keyof T] = undefined
        if (name !== undefined && parentCallbackFunction) {
          parentCallbackFunction(name, target[diffChangesSymbol])
        }
        delete (target as any)[p]

        return true
      },
    })
  }
}
