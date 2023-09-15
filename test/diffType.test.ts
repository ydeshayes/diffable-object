import createDiffableObject from '../src'

import mock from './mock'

describe('Check the types', () => {
  it('Simple case', async () => {
    const d = createDiffableObject(mock)

    // @ts-expect-error
    d.basic.test

    // @ts-expect-error
    d.structure.composition.again = 'ERROR'
  })
})
