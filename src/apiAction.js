import humps from 'lodash-humps'

import snakeCase from './snakeCase'
import parseError from './parseError'

const fetchOptions = ({
  method = 'get',
  params,
  credentials,
  headers = {},
}) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const options = {
    method,
    credentials,
    headers: {
      ...defaultHeaders,
      ...(typeof headers === 'function' ? headers(defaultHeaders) : headers),
    },
  }

  if (params) {
    options.body = JSON.stringify(snakeCase(params))
  }

  return options
}

const jsonResponse = async response => {
  const body = await response.text()
  const contentType = response.headers.get('content-type')

  let json
  if (contentType && contentType.match(/application\/json/)) {
    json = humps(JSON.parse(body))
  } else {
    json = {
      id: `${response.status}`,
      message: body,
    }
  }

  return json
}

const dispatchError = (dispatch, options) => async response => {
  const { parentId, prefix, requestAttributes } = options

  const json = await jsonResponse(response)

  dispatch({
    parentId,
    type: `${prefix}_FAILURE`,
    ...requestAttributes,
    error: parseError(json),
  })
}

const dispatchResponse = (dispatch, options) => async response => {
  const {
    parentId,
    prefix,
    parseResponse,
    requestAttributes,
    afterSuccess,
  } = options

  const json = await jsonResponse(response)

  if (response.ok) {
    dispatch({
      parentId,
      type: `${prefix}_SUCCESS`,
      ...(parseResponse &&
        (await parseResponse(json, response, requestAttributes))),
    })

    afterSuccess && afterSuccess(response, json)
  } else {
    dispatch({
      parentId,
      type: `${prefix}_FAILURE`,
      ...requestAttributes,
      error: parseError(json),
    })
  }
}

const dispatchAction = (dispatch, options) => {
  const { baseUrl, path, parentId, prefix, requestAttributes } = options

  dispatch({ parentId, type: `${prefix}_REQUEST`, ...requestAttributes })

  return fetch(`${baseUrl}${path}`, fetchOptions(options)).then(
    dispatchResponse(dispatch, options),
    dispatchError(dispatch, options),
  )
}

const apiAction = options => dispatch => dispatchAction(dispatch, options)

export default apiAction
