export const dataToDataBase = (data) => {
  console.log(data);
  const dataToPost = new FormData();
  dataToPost.append('image', data.avatar[0]);
  dataToPost.append('email', data.email);
  dataToPost.append('username', data.username);
  dataToPost.append('password', data.password);
  dataToPost.append('address', data.address);
  dataToPost.append('phone', data.phone);
  dataToPost.append('age', data.age);
  dataToPost.append('role', data.role);
  return dataToPost;
};
