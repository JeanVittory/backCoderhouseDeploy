import { dataToDataBase } from './helper.register.js';

const email = document.querySelector('#emailInput');
const username = document.querySelector('#usernameInput');
const password = document.querySelector('#passwordInput');
const passwordConfirm = document.querySelector('#passwordConfirmInput');
const phoneNumber = document.querySelector('#phoneInput');
const address = document.querySelector('#addressInput');
const age = document.querySelector('#ageInput');
const avatar = document.querySelector('#image');
const { origin } = window.location;
const resetsInputs = [email, password, username, passwordConfirm, phoneNumber, age, address];

const toastyAlert = (message) => {
  return Toastify({
    text: message,
    className: 'alert',
    style: {
      background: 'linear-gradient(to right, #eb5757, #000000)',
      color: 'wheat',
      fontFamily: 'monospace',
    },
  }).showToast();
};

document.addEventListener('click', async (e) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const prefixNumberRegex =
    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
  const numberRegex = /^[1-9][0-9]?$/;

  if (e.target.matches('#signin-btn')) {
    e.preventDefault();
    location.href = `${origin}/`;
  }

  if (e.target.matches('#signupBtn')) {
    e.preventDefault();
    if (
      email.value === '' ||
      password.value === '' ||
      username.value === '' ||
      passwordConfirm.value === '' ||
      phoneNumber.value === '' ||
      address.value === '' ||
      age.value === ''
    ) {
      toastyAlert('please fill all the fields');
      return resetsInputs.forEach((item) => (item.value = ''));
    }

    if (!age.value.match(numberRegex)) {
      toastyAlert('invalid age');
      return resetsInputs.forEach((item) => (item.value = ''));
    }

    if (!phoneNumber.value.match(prefixNumberRegex)) {
      toastyAlert('Invalid number. Please provide your country prefix');
      return resetsInputs.forEach((item) => (item.value = ''));
    }

    if (!email.value.match(emailRegex)) {
      toastyAlert('Invalid email');
      return resetsInputs.forEach((item) => (item.value = ''));
    }

    const passwordTrim = password.value.trim();
    const passwordConfirmTrim = passwordConfirm.value.trim();

    if (passwordTrim !== passwordConfirmTrim) {
      toastyAlert("Your passwords don't match ");
      return resetsInputs.forEach((item) => (item.value = ''));
    }

    const userData = {
      email: email.value,
      username: username.value,
      password: passwordTrim,
      address: address.value,
      phone: phoneNumber.value,
      age: age.value,
      role: 'user',
      avatar: avatar.files,
    };

    const userDataParse = dataToDataBase(userData);

    const response = await fetch(`${origin}/api/v1/register/`, {
      method: 'POST',
      body: userDataParse,
    });

    if (response.status === 409) {
      toastyAlert('The user or the email already exist');
      return resetsInputs.forEach((item) => (item.value = ''));
    }
    location.href = `${origin}/`;
  }
});
