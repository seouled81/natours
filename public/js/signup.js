import axios from 'axios';
import { showAlert } from './alerts';

const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: { name, email, password, passwordConfirm }
    });

    if (res.data.status === 'success') {
      const UserFirstName = res.data.data.user.name.split(' ')[0];
      showAlert('success', `${UserFirstName}, Welcome to Natours!`);
      window.setInterval(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export default signup;
