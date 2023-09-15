import createDiffableObject, { DiffableArray } from '../src'

describe('Track the update done to an array', () => {
  it('Array change', async () => {
    const d = createDiffableObject(['a', 'b'])

    d[0] = '1'

    expect(d.getChanges()).toEqual({ 0: '1' })

    d.splice(0, 1)

    expect(d.getChanges()).toEqual({ 0: 'b', 1: undefined })
  })

  it('Deep array change', async () => {
    const d = createDiffableObject({
      foo: {
        bar: ['a', 'b'],
      },
    })

    d.foo.bar[0] = '1'

    d.foo.bar.push('3')

    expect(d.getChanges()).toEqual({ foo: { bar: { 0: '1', 2: '3' } } })
    expect((d.foo.bar as DiffableArray<typeof d>).getChanges()).toEqual({ 0: '1', 2: '3' })
    ;(d.foo.bar as DiffableArray<typeof d>).resetChanges()
    expect((d.foo.bar as DiffableArray<typeof d>).getChanges()).toEqual({})
  })

  it('Deep array of array change', async () => {
    const d = createDiffableObject({
      foo: {
        bar: ['a', ['b']],
      },
    })

    d.foo.bar[0] = '1'

    d.foo.bar.push('3')
    ;(d.foo.bar[1] as string[]).push('3')

    expect(d.getChanges()).toEqual({ foo: { bar: { 0: '1', 1: { 1: '3' }, 2: '3' } } })
  })

  it('Deep multiple array change', async () => {
    const d = createDiffableObject({
      foo: {
        bar: [
          'a',
          {
            arr: ['c'],
          },
        ],
      },
    })

    d.foo.bar[0] = '1'

    d.foo.bar.push('3')
    ;(d.foo.bar[1] as { arr: Array<string> }).arr[0] = '1'

    expect(d.getChanges()).toEqual({ foo: { bar: { 0: '1', 1: { arr: { 0: '1' } }, 2: '3' } } })
  })

  it('Deep deep multiple array change', async () => {
    const d = createDiffableObject({
      foo: {
        bar: [
          'a',
          {
            arr: [
              {
                obj: 'myObject',
              },
            ],
          },
        ],
      },
    })

    d.foo.bar[0] = '1'

    d.foo.bar.push('3')
    ;(d.foo.bar[1] as { arr: Array<any> }).arr[0].obj = '1'

    expect(d.getChanges()).toEqual({
      foo: { bar: { 0: '1', 1: { arr: { 0: { obj: '1' } } }, 2: '3' } },
    })
  })

  it('Splice array change', async () => {
    const d = createDiffableObject({
      foo: {
        bar: ['a', 'b'],
      },
    })

    d.foo.bar.splice(1)

    expect(d.getChanges()).toEqual({ foo: { bar: { 1: undefined } } })
    expect(d.foo.bar.length).toEqual(1)
    expect(d.foo.bar[0]).toEqual('a')
  })

  it('Splice array change with insert', async () => {
    const d = createDiffableObject({
      foo: {
        bar: ['a', 'b'],
      },
    })

    d.foo.bar.splice(1, 1, 'c')

    expect(d.getChanges()).toEqual({ foo: { bar: { 1: 'c' } } })
    expect(d.foo.bar.length).toEqual(2)
    expect(d.foo.bar[0]).toEqual('a')
    expect(d.foo.bar[1]).toEqual('c')
  })

  it('Shift array', async () => {
    const d = createDiffableObject({
      foo: {
        bar: ['a', 'b'],
      },
    })

    d.foo.bar.shift()

    expect(d.getChanges()).toEqual({ foo: { bar: { 0: 'b', 1: undefined } } })
    expect(d.foo.bar.length).toEqual(1)
    expect(d.foo.bar[0]).toEqual('b')
  })

  it('Sort array', async () => {
    const d = createDiffableObject({
      foo: {
        bar: ['b', 'a'],
      },
    })

    d.foo.bar.sort()

    expect(d.getChanges()).toEqual({ foo: { bar: { 0: 'a', 1: 'b' } } })
    expect(d.foo.bar.length).toEqual(2)
    expect(d.foo.bar[0]).toEqual('a')
    expect(d.foo.bar[1]).toEqual('b')
  })

  it('Unshift array', async () => {
    const d = createDiffableObject({
      foo: {
        bar: ['b', 'c'],
      },
    })

    d.foo.bar.unshift('a')

    expect(d.getChanges()).toEqual({ foo: { bar: { 0: 'a', 1: 'b', 2: 'c' } } })
    expect(d.foo.bar.length).toEqual(3)
    expect(d.foo.bar[0]).toEqual('a')
    expect(d.foo.bar[1]).toEqual('b')
    expect(d.foo.bar[2]).toEqual('c')
  })
})
