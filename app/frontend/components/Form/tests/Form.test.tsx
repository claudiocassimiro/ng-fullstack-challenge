import { describe, it, afterEach, afterAll, vi, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "..";

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

describe("FloatWhatsAppButton", () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  describe("When Form is called", () => {
    it('if the param buttonText is equal to "Criar conta", should have a element p with testid "paragraph-to-call-clients"', () => {
      render(<Form buttonText="Criar conta" pathToCall="/users/create" />);

      expect(
        screen.getByTestId("paragraph-to-call-clients")
      ).toBeInTheDocument();
    });

    it('if the param buttonText is equal to "Criar conta", the button with testid "submit-button" should have the text "Criar conta"', () => {
      render(<Form buttonText="Criar conta" pathToCall="/users/create" />);

      const button = screen.getByTestId("submit-button");

      expect(button).toBeInTheDocument();

      expect(button).toHaveTextContent("Criar conta");
    });

    it(`if the param buttonText is equal to "Entrar", should't have a element p with testid "paragraph-to-call-clients"`, () => {
      render(<Form buttonText="Entrar" pathToCall="/users/login" />);

      expect(
        screen.queryByTestId("paragraph-to-call-clients")
      ).not.toBeInTheDocument();
    });

    it('if the param buttonText is equal to "Entrar", the button with testid "submit-button" should have the text "Entrar"', () => {
      render(<Form buttonText="Entrar" pathToCall="/users/login" />);

      const button = screen.getByTestId("submit-button");

      expect(button).toBeInTheDocument();

      expect(button).toHaveTextContent("Entrar");
    });

    it('if the writes username with less than 3 character, should be render an element with testId "error-paragraph" and the text "Username must contain at least 3 characters"', async () => {
      render(<Form buttonText="Entrar" pathToCall="/users/login" />);

      const inputUsername = screen.getByPlaceholderText("Nome de usuário");

      const inputPassword = screen.getByPlaceholderText("Senha");

      await userEvent.type(inputUsername, "Cl");

      await userEvent.type(inputPassword, "Cassimiro1");

      await userEvent.click(screen.getByTestId("submit-button"));

      const errorMessage = await screen.findByTestId("error-paragraph");

      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(
        "Username must contain at least 3 characters"
      );
    });
  });
});
