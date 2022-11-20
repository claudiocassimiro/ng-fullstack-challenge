import { describe, it, afterEach, afterAll, vi, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Header from "..";

const nextRouterMock = {
  route: `/`,
  pathname: ``,
  query: ``,
  asPath: ``,
};

vi.mock(`next/router`, () => ({
  useRouter() {
    return nextRouterMock;
  },
}));

describe("Header", () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  describe("when Header is called", () => {
    it('and not have the cookie token, should be rendered a element with testid "container-login-and-sign-in-buttons" and not should be the element with testid "button-go-to-account"', () => {
      render(<Header />);

      expect(
        screen.getByTestId("container-login-and-sign-in-buttons")
      ).toBeInTheDocument();

      expect(
        screen.queryByTestId("button-go-to-account")
      ).not.toBeInTheDocument();
    });

    it('and have the cookie token, should be rendered a element with testid "button-go-to-account" and not should be the element with testid "container-login-and-sign-in-buttons"', () => {
      Object.defineProperty(window.document, "cookie", {
        writable: true,
        value: "token=asdasw232423qwe32512eqw23qwd",
      });

      render(<Header />);

      expect(screen.getByTestId("button-go-to-account")).toBeInTheDocument();

      expect(
        screen.queryByTestId("container-login-and-sign-in-buttons")
      ).not.toBeInTheDocument();
    });
  });
});
