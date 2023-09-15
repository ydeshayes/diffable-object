import createDiffableObject, { DiffableObject } from '../src'

function getMock() {
  return {
    foo: {
      bar: {
        key: 'val',
        key2: 'val2',
      },
      bar2: {
        key3: 'val3',
      },
    },
    other: {
      list: [
        {
          foo: {
            bar: 'listvar',
          },
        },
        {
          foo: {
            bar: 'listvar2',
          },
        },
        {
          foo: {
            bar: 'listvar3',
          },
        },
      ],
      props: {
        key: 'here',
      },
      here: {
        ok: 'value',
      },
    },
  }
}

describe('Track the update done to an object', () => {
  it('Simple case, not nested', async () => {
    const d = createDiffableObject({
      foo: 1,
    })

    d.foo = 2

    expect(d.foo).toEqual(2)
    expect(d.getChanges()).toEqual({
      foo: 2,
    })
  })

  it('Simple case, object construction', async () => {
    const d = createDiffableObject({
      foo: {
        bar: {
          key: 'val1',
        },
      },
    })

    expect(d.foo.bar.key).toEqual('val1')
    expect(typeof d.foo.bar.key).toEqual('string')
    expect(d instanceof DiffableObject).toBeTruthy()
    expect(d.foo instanceof DiffableObject).toBeTruthy()
    expect(d.foo.bar instanceof DiffableObject).toBeTruthy()
    expect((d as any).foo.bar.key instanceof DiffableObject).toBeFalsy()
  })

  it('Simple change case', async () => {
    const d = createDiffableObject({
      foo: {
        bar: {
          key: 'val1',
        },
      },
    })

    d.foo.bar.key = 'newVal'

    expect(d.getChanges()).toEqual({ foo: { bar: { key: 'newVal' } } })
  })

  it('Simple change case with Object.assign', async () => {
    const d = createDiffableObject({
      foo: {
        bar: {
          key: 'val1',
          key2: 'val2',
        },
      },
    })

    Object.assign(d, { foo: { bar: { key: 'newVal' } } })

    expect(d.getChanges()).toEqual({ foo: { bar: { key: 'newVal' } } })
  })

  it('Simple delete case', async () => {
    const d = createDiffableObject<{
      foo: {
        bar: {
          key?: string
        }
      }
    }>({
      foo: {
        bar: {
          key: 'val1',
        },
      },
    })

    delete d.foo.bar.key

    expect(d.getChanges()).toEqual({ foo: { bar: { key: undefined } } })
  })

  it('Two key in the same object case', async () => {
    const d = createDiffableObject({
      foo: {
        bar: {
          key: 'val1',
          key2: 'val2',
        },
      },
    })

    expect(d.getChanges()).toEqual({})
  })

  it('Complexe object', async () => {
    const fullObject = getMock()

    const d = createDiffableObject<{
      foo: {
        bar: any
      }
    }>(fullObject)

    expect(d.getChanges()).toEqual({})

    d.foo.bar = { test: 2 }

    expect(d.getChanges()).toEqual({ foo: { bar: { test: 2 } } })

    d.resetChanges()

    expect(d.getChanges()).toEqual({})
  })

  it('No object', async () => {
    const fullObject = getMock()

    const d = createDiffableObject('fullObject')

    expect(d.getChanges()).toEqual({})
  })

  it('Root change', async () => {
    const d = createDiffableObject({
      foo: 1,
    })

    d.foo = 2

    expect(d.getChanges()).toEqual({ foo: 2 })
  })

  it('Complete object change', async () => {
    const d = createDiffableObject<any>({
      foo: {
        bar: {
          test: 2,
          here: 'ok',
        },
      },
    })

    d.foo = {
      bar: {
        test: 3,
      },
    }

    expect(d.getChanges()).toEqual({ foo: { bar: { test: 3 } } })
  })
})
