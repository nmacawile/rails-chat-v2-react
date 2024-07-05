import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ChatBar from "./ChatBar.jsx";
import { postChatMessage } from "../services/chatMessagesService";

vi.mock("../services/chatMessagesService");

describe("ChatBar Component", () => {
  const chatId = 1;

  let messageBox;
  let submitButton;

  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={[`/chats/${chatId}`]}>
        <Routes>
          <Route path="/chats/:id" element={<ChatBar />} />
        </Routes>
      </MemoryRouter>
    );
    messageBox = screen.getByRole("textarea");
    submitButton = document.getElementById("submit-message-button");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("sends the message after hitting the submit button", async () => {
    postChatMessage = vi.fn();

    await act(() => {
      fireEvent.input(messageBox, { target: { innerText: "Bonjour!" } });
      fireEvent.blur(messageBox);
    });

    await act(() => {
      fireEvent.click(submitButton);
    });

    expect(postChatMessage).toHaveBeenCalledWith("1", "Bonjour!");
  });

  it("sends the message after hitting Enter key", async () => {
    postChatMessage = vi.fn();

    await act(() => {
      fireEvent.input(messageBox, { target: { innerText: "Bonjour!" } });
      fireEvent.blur(messageBox);
    });

    await act(() => {
      fireEvent.keyDown(messageBox, { key: "Enter", code: "Enter" });
      fireEvent.keyUp(messageBox, { key: "Enter", code: "Enter" });
    });

    expect(postChatMessage).toHaveBeenCalledWith("1", "Bonjour!");
  });

  it("prevents sending the message after hitting Shift and Enter keys simultaneously", async () => {
    postChatMessage = vi.fn();

    await act(() => {
      fireEvent.input(messageBox, { target: { innerText: "Bonjour!" } });
      fireEvent.blur(messageBox);
    });

    await act(() => {
      fireEvent.keyDown(messageBox, {
        key: "Shift",
        code: "ShiftLeft",
        shiftKey: true,
      });
      fireEvent.keyDown(messageBox, {
        key: "Enter",
        code: "Enter",
        shiftKey: true,
      });
      fireEvent.keyUp(messageBox, {
        key: "Shift",
        code: "ShiftLeft",
        shiftKey: true,
      });
      fireEvent.keyUp(messageBox, {
        key: "Enter",
        code: "Enter",
        shiftKey: true,
      });
    });

    expect(postChatMessage).not.toHaveBeenCalled();
  });

  it("resets the message box after a successful submission", async () => {
    postChatMessage = vi.fn();

    await act(() => {
      fireEvent.input(messageBox, { target: { innerText: "Bonjour!" } });
      fireEvent.blur(messageBox);
    });

    await act(() => {
      fireEvent.click(submitButton);
    });

    expect(messageBox.innerText).toBe("");
  });

  it("keeps the text input after an unsuccessful submission", async () => {
    postChatMessage = vi
      .fn()
      .mockRejectedValue(new Error("Error sending data."));

    await act(() => {
      fireEvent.input(messageBox, { target: { innerText: "Bonjour!" } });
      fireEvent.blur(messageBox);
    });

    await act(() => {
      fireEvent.click(submitButton);
    });

    expect(messageBox.innerText).toBe("Bonjour!");
  });

  it("disables sending of new messages when another submission is still in progress", async () => {
    postChatMessage = vi.fn();
    await act(() => {
      fireEvent.input(messageBox, { target: { innerText: "Bonjour!" } });
      fireEvent.blur(messageBox);
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(submitButton.disabled).toBe(true);
      expect(messageBox).toHaveAttribute("contentEditable", "false");
    });
  });
});
