import { getUser } from './user-store';

const API_ENDPOINT = 'https://tmc.mooc.fi';

export function request(path, options = {}) {
  let headers = options.headers || {};

  const user = getUser();

  if (user && user.accessToken) {
    headers = Object.assign({
      authorization: `Bearer ${user.accessToken}`,
      'Content-Type': 'application/json',
    }, headers);
  }

  return fetch(new Request(`${API_ENDPOINT}${path}`, Object.assign({ mode: 'cors' }, options, { headers })))
    .then(response => (response.ok ? Promise.resolve(response) : Promise.reject(response)));
}

export function post(path, options = {}) {
  return request(path, Object.assign({}, options, { method: 'POST' }));
}

export function get(path, options = {}) {
  return request(path, Object.assign({}, options, { method: 'GET' }));
}
