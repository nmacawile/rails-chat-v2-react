import authSlice, { logIn, logOut } from "./authSlice";

describe("authSlice", () => {
  describe("login reducer", () => {
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
    const unauthenticated = { auth_token: null, user: null, logged_in: false };

    it("should store the user's credentials", () => {
      const newState = authSlice(unauthenticated, logIn(creds));
      expect(newState).toEqual({ ...creds, logged_in: true });
    });

    it("should delete the stored user's credentials", () => {
      const newState = authSlice({ ...creds, logged_in: true }, logOut());
      expect(newState).toEqual(unauthenticated);
    });
  });
});
