class UsersDTO {
  constructor({ _id, username, avatar, role, email }) {
    this.id = _id;
    this.username = username;
    this.avatar = avatar;
    this.email = email;
    this.role = role;
  }
}

export { UsersDTO };
