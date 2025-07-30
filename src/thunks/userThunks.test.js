import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import axiosAuthInstance from "../axios/axiosAuthInstance";
import MockAdapter from "axios-mock-adapter";
import { updateVisibilityThunk } from "./userThunks";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { authUserFixture } from "../../tests/fixtures/usersFixture";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("updateVisibilityThunk", () => {
  let store;
  let axiosMock;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: authUserFixture,
      },
    });
    axiosMock = new MockAdapter(axiosAuthInstance);
  });

  afterEach(() => {
    axiosMock.restore();
  });

  describe("when successful update", () => {
    it("dispatches updateUser reducer", async () => {
      const updatedUser = { ...authUserFixture, visibility: false };

      axiosMock
        .onPatch("/api/v1/visibility", { visibility: false })
        .reply(200, { user: updatedUser });

      const expectedActions = [
        { type: "auth/updateUser", payload: updatedUser },
      ];

      await store.dispatch(updateVisibilityThunk(false));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe("when unsuccessful update", () => {
    it("does not dispatch updateUser reducer", async () => {
      const updatedUser = { ...authUserFixture, visibility: false };

      axiosMock
        .onPatch("/api/v1/visibility", { visibility: false })
        .networkError();

      const expectedActions = [
        { type: "auth/updateUser", payload: updatedUser },
      ];

      let e;
      try {
        await store.dispatch(updateVisibilityThunk(false));
      } catch (error) {
        e = error.message;
      }

      expect(e).toEqual("Network Error");
      expect(store.getActions()).toEqual([]);
    });
  });
});
