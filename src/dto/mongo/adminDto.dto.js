class AdminDTO {
  constructor({ _id, username, avatar, role }) {
    this.#id = _id;
    this.#username = username;
    this.#avatar = avatar;
    this.#role = role;
  }
}

export { AdminDTO };
