import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import axiosInstance from "../axios/axiosInstance";
import MockAdapter from "axios-mock-adapter";
import { loginThunk } from "./authThunks";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("authThunks", () => {
  let store;
  let axiosMock;

  beforeEach(() => {
    store = mockStore({ auth: {} });
    axiosMock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    axiosMock.restore();
  });

  const email = "foobar@email.com";
  const password = "password";
  const timestamp = new Date().toISOString();
  const user = {
    id: 999,
    first_name: "Foo",
    last_name: "Bar",
    email: "foobar@email.com",
    created_at: timestamp,
    updated_at: timestamp,
  };
  const auth_token = "token";
  const exp = Date.now();

  describe("when successful login", () => {
    it("dispatches logIn reducer", async () => {
      axiosMock.onPost("/api/v1/auth/login").reply(200, { user, auth_token, exp });

      const expectedActions = [
        { type: "auth/logIn", payload: { user, auth_token, exp } },
      ];

      await store.dispatch(loginThunk(email, password));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe("when unsuccessful login", () => {
    it("doesn't dispatch logIn reducer", async () => {
      axiosMock
        .onPost("/api/v1/auth/login")
        .reply(401, { message: "Invalid credentials." });

      let e;
      try {
        await store.dispatch(loginThunk(email, password));
      } catch (error) {
        e = error.message;
      }

      expect(e).toEqual("Invalid credentials.");
      expect(store.getActions()).toEqual([]);
    });
  });
});
