import { describe, it, afterEach, afterAll, vi, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ButtonSearchTransactionsByType from "..";

describe("ButtonSearchTransactionsByType", () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  describe("when the component is called", () => {
    const mockProps = {
      token: "mock token",
      accountId: "mock accountId",
      setTransactions: vi.fn(),
      setShowHistory: vi.fn(),
    };

    it('if the button with testId "open-transaction-by-type" is clicked, should be render the element with testId "transactions-by-type"', async () => {
      render(<ButtonSearchTransactionsByType {...mockProps} />);

      expect(
        screen.queryByTestId("transactions-by-type")
      ).not.toBeInTheDocument();

      await userEvent.click(screen.getByTestId("open-transaction-by-type"));

      expect(screen.getByTestId("transactions-by-type")).toBeInTheDocument();
    });

    it(`when the button with testId "open-transaction-by-type" is clicked, if the user doesn't click on one input radio and click on button with test id "search-by-transactions", should be returned a error message`, async () => {
      render(<ButtonSearchTransactionsByType {...mockProps} />);

      expect(
        screen.queryByTestId("transactions-by-type")
      ).not.toBeInTheDocument();

      await userEvent.click(screen.getByTestId("open-transaction-by-type"));

      expect(screen.getByTestId("transactions-by-type")).toBeInTheDocument();

      await userEvent.click(screen.getByTestId("search-by-transactions"));

      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Please choose a type."
      );
    });
  });
});
