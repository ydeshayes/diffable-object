import { DiffableArray } from './DiffableArray'
import { DiffableObject } from './DiffableObject'

export default function createDiffableObject<T>(value: T) {
  if (Array.isArray(value)) {
    return new DiffableArray(value) as T & DiffableArray<T>
  }
  return new DiffableObject(value) as T & DiffableObject<T>
}

export * from './DiffableObject'
export * from './DiffableArray'
