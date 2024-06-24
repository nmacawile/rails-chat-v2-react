import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import Sidebar from "./Sidebar.jsx";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import SearchForm from "./SearchForm";
import ChatSelection from "./ChatSelection.jsx";
import UserInfoPanel from "./UserInfoPanel.jsx";
import QueryResults from "./QueryResults.jsx";

vi.mock("./SearchForm", () => {
  return {
    default: () => <div id="search-form" />,
  };
});

vi.mock("./ChatSelection", () => {
  return {
    default: () => <div id="chat-selection" />,
  };
});

vi.mock("./UserInfoPanel", () => {
  return {
    default: () => <div id="user-info-panel" />,
  };
});

vi.mock("./QueryResults", () => {
  return {
    default: () => <div id="query-results" />,
  };
});

const mockStore = configureMockStore([]);

describe("Sidebar Component", () => {
  const renderComponent = (searchMode = false) => {
    const store = mockStore({ sidebar: { searchMode: searchMode } });
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );
  };
  describe("when search mode is on", () => {
    it("hides the ChatSelection component", () => {
      renderComponent(true);
      expect(document.getElementById("chat-selection")).not.toBeInTheDocument();
    });

    it("shows the query results component", () => {
      renderComponent(true);
      expect(document.getElementById("query-results")).toBeInTheDocument();
    });
  });

  describe("when search mode is off", () => {
    it("shows the ChatSelection component", () => {
      renderComponent();
      expect(document.getElementById("chat-selection")).toBeInTheDocument();
    });

    it("hides the query results component", () => {
      renderComponent();
      expect(document.getElementById("query-results")).not.toBeInTheDocument();
    });
  });
});
