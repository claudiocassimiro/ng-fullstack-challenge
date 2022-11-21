import { describe, it, afterEach, afterAll, vi, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransactionForm from "..";

// const nextRouterMock = {
//   route: `/`,
//   pathname: ``,
//   query: ``,
//   asPath: ``,
// };

// vi.mock(`next/router`, () => ({
//   useRouter() {
//     return nextRouterMock;
//   },
// }));

describe("TransactionForm", () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  describe("when the component is called", () => {
    const mockProps = {
      username: "mock username",
      accountId: "mock accountId",
      token: "mock token",
      balance: 500,
      getAccountBalance: vi.fn(),
    };

    it("if the user tries to send money to another user and the money to be transferred is equal to or less than the money in the account, it should return the success message", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ message: "Successful transfer" }),
        })
      ) as jest.Mock;

      render(<TransactionForm {...mockProps} />);

      const inputUsername = screen.getByPlaceholderText("Quem vai receber?");

      const inputValue = screen.getByPlaceholderText("Valor");

      const submitButton = screen.getByTestId("submit-button");

      await userEvent.type(inputUsername, "another username");

      await userEvent.type(inputValue, "100");

      await userEvent.click(submitButton);

      const successMessage = await screen.findByTestId("success-message");

      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveTextContent("Successful transfer");
    });

    it("if the user tries to send money to himself, it should return the error message", async () => {
      render(<TransactionForm {...mockProps} />);

      const inputUsername = screen.getByPlaceholderText("Quem vai receber?");

      const inputValue = screen.getByPlaceholderText("Valor");

      const submitButton = screen.getByTestId("submit-button");

      await userEvent.type(inputUsername, "mock username");

      await userEvent.type(inputValue, "100");

      await userEvent.click(submitButton);

      const errorMessage = await screen.findByTestId("error-message");

      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(
        "You cannot make a transaction for yourself."
      );
    });

    it("if the user tries to send money to another user and the money to be transferred is bigger than the money in the account, it should return the error message", async () => {
      render(<TransactionForm {...mockProps} />);

      const inputUsername = screen.getByPlaceholderText("Quem vai receber?");

      const inputValue = screen.getByPlaceholderText("Valor");

      const submitButton = screen.getByTestId("submit-button");

      await userEvent.type(inputUsername, "another username");

      await userEvent.type(inputValue, "600");

      await userEvent.click(submitButton);

      const errorMessage = await screen.findByTestId("error-message");

      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent("Insufficient funds.");
    });
  });
});
