import { vi, describe, it, beforeEach } from "vitest";
import {
  screen,
  render,
  act,
  fireEvent,
} from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import UserQueryItem from "./UserQueryItem.jsx";
import { usersFixture } from "../../../tests/fixtures/usersFixture";
import { findOrCreateChat } from "../../services/chatsService";

vi.mock("../../services/chatsService.js");
vi.mock("react-router-dom");

describe("UserQueryItem Component", () => {
  let navigate = vi.fn();
  useNavigate = vi.fn().mockReturnValue(navigate);
  findOrCreateChat = vi.fn().mockResolvedValue({ id: 1 });
  const user = usersFixture[0];
  let userElement;

  beforeEach(() => {
    render(<UserQueryItem user={user} />);
    userElement = screen.getByText(user.full_name);
  });

  it("shows the user name", () => {
    expect(userElement).toBeInTheDocument();
  });

  it("links to the chat", async () => {
    await act(() => {
      fireEvent.click(userElement);
    });

    expect(navigate).toHaveBeenCalledWith("/chats/1");
  });
});
