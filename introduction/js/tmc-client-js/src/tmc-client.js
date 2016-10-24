import { post } from './utils/api';
import { getUser, setUser, removeUser } from './utils/user-store';

const CLIENT_ID = 'ffb9fccb2a873a9eaa56ef3d2624ddce9dff60d51cf423f52af5db020c51c580';
const CLIENT_SECRET = 'f33e39d88736beb471048f56bc86a6f8f7ede82382383cef1283fc21ab633705';

class TmcClient {
  authenticate({ username, password }) {
    const body = [
      `client_id=${CLIENT_ID}`,
      `client_secret=${CLIENT_SECRET}`,
      `username=${username}`,
      `password=${password}`,
      'grant_type=password',
    ].join('&');

    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    };

    return post('/oauth/token', options)
      .then(response => response.json())
      .then(response => {
        const user = { username, accessToken: response.access_token };

        setUser(user);

        return user;
      });
  }

  unauthenticate() {
    removeUser();

    return this;
  }

  getUser() {
    return getUser();
  }
}

export default TmcClient;
