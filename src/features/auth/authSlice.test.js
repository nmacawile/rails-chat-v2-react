import authSlice, { logIn, logOut, updateUser } from "./authSlice";

describe("authSlice", () => {
  const timestamp = new Date().toISOString();
  const creds = {
    auth_token: "token",
    user: {
      id: 999,
      first_name: "Foo",
      last_name: "Bar",
      email: "foobar@email.com",
      created_at: timestamp,
      updated_at: timestamp,
    },
  };

  const unauthenticated = {
    auth_token: null,
    user: null,
    exp: null,
    logged_in: false,
  };

  describe("logIn reducer", () => {
    it("should store the user's credentials", () => {
      const newState = authSlice(unauthenticated, logIn(creds));
      expect(newState).toEqual({ ...creds, logged_in: true });
    });
  });

  describe("logOut reducer", () => {
    it("should delete the stored user's credentials", () => {
      const newState = authSlice({ ...creds, logged_in: true }, logOut());
      expect(newState).toEqual(unauthenticated);
    });
  });

  describe("updateUser reducer", () => {
    it("should update the stored user's data", () => {
      const updatedUser = { ...creds.user, first_name: "ABCD" }
      const newState = authSlice({ ...creds, logged_in: true }, updateUser(updatedUser));
      expect(newState.user).toEqual(updatedUser);
    });
  });
});
