import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'data' or 'password'
const updateSettings = async (data, type) => {
  try {
    let url;
    if (type === 'data') {
      url = 'http://localhost:3000/api/v1/users/updateme';
    } else if (type === 'password') {
      url = 'http://localhost:3000/api/v1/users/updatepassword';
    }
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'You successfully updated your details.');
      window.setInterval(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export default updateSettings;
