import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  try {
    const encryptPassword = await bcrypt.hash(password, 10);
    return encryptPassword;
  } catch (error) {
    return error;
  }
};

const matchPasswords = async (password, encryptPwd) => {
  try {
    return await bcrypt.compare(password, encryptPwd);
  } catch (error) {
    return error;
  }
};

export { hashPassword, matchPasswords };
