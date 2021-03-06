import baseReducer from '../baseReducer'

describe('without action and without state', () => {
  it('returns initial state', () => {
    expect(baseReducer()).toEqual([
      {
        parentId: undefined,
        state: {
          listPath: null,
          createError: null,
          created: null,
          creating: false,
          destroyError: null,
          destroyed: null,
          destroying: false,
          fetchingInfo: false,
          fetchingList: false,
          info: null,
          infoError: null,
          list: null,
          listError: null,
          updateError: null,
          updated: null,
          updating: false,
        },
      },
    ])
  })
})

describe('without action and with state', () => {
  it('returns state', () => {
    expect(baseReducer([{ foo: 'bar' }])).toEqual([{ foo: 'bar' }])
  })
})

describe('with SET_INFO action', () => {
  it('returns the correct state', () => {
    const action = { type: '@foo/SET_INFO', info: { bar: 'foo' } }

    expect(baseReducer([{ foo: 'bar' }], action)).toEqual([
      {
        foo: 'bar',
        state: { info: action.info },
      },
    ])
  })
})

describe('with RESET_CREATED action', () => {
  it('returns the correct state', () => {
    const action = { type: '@foo/RESET_CREATED' }
    const state = [{ state: { foo: 'bar', created: { bar: 'foo' } } }]

    expect(baseReducer(state, action)).toEqual([
      {
        state: { foo: 'bar', created: null },
      },
    ])
  })
})

describe('with RESET_CREATE_ERROR action', () => {
  it('returns the correct state', () => {
    const action = { type: '@foo/RESET_CREATE_ERROR' }
    const state = [{ state: { foo: 'bar', createError: { bar: 'foo' } } }]

    expect(baseReducer(state, action)).toEqual([
      {
        state: { foo: 'bar', createError: null },
      },
    ])
  })
})

describe('with RESET_UPDATED action', () => {
  it('returns the correct state', () => {
    const action = { type: '@foo/RESET_UPDATED' }
    const state = [{ state: { foo: 'bar', updated: { bar: 'foo' } } }]

    expect(baseReducer(state, action)).toEqual([
      {
        state: { foo: 'bar', updated: null },
      },
    ])
  })
})

describe('with RESET_DESTROYED action', () => {
  it('returns the correct state', () => {
    const action = { type: '@foo/RESET_DESTROYED' }
    const state = [{ state: { foo: 'bar', destroyed: { bar: 'foo' } } }]

    expect(baseReducer(state, action)).toEqual([
      {
        state: { foo: 'bar', destroyed: null },
      },
    ])
  })
})
