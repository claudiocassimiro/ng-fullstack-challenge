import { describe, it, afterEach, afterAll, vi, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ButtonSearchTransactionsByDate from "..";

describe("ButtonSearchTransactionsByDate", () => {
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
    it('if the button with testId "open-transaction-by-date" is clicked, should be render the element with testId "transactions-by-date"', async () => {
      render(<ButtonSearchTransactionsByDate {...mockProps} />);

      expect(
        screen.queryByTestId("transactions-by-date")
      ).not.toBeInTheDocument();

      await userEvent.click(screen.getByTestId("open-transaction-by-date"));

      expect(screen.getByTestId("transactions-by-date")).toBeInTheDocument();
    });
  });
});
