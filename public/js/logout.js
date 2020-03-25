import axios from 'axios';
import { showAlert } from './alerts';

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout'
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      window.setInterval(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Error logging out, please try again.');
  }
};

export default logout;
