/* eslint-disable linebreak-style */
import LoginForm from "../LoginForm";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../features/userSlice";

const mockStore = configureStore();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../../features/userSlice", () => ({
  loginUser: jest.fn(),
}));
describe("testing LoginForm", () => {
  let store;
  let routerMock;
  beforeEach(() => {
    store = mockStore({
      userState: { status: "idle", error: null, user: null },
    });
    routerMock = { push: jest.fn() };
    useRouter.mockReturnValue(routerMock);
  });
  it("should renders the form correctly", () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    expect(
      screen.getByRole("heading", { name: /Sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Facebook/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();

    expect(screen.getByText(/Or use your account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot your password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it("should shows error message when form is submitted with empty fields", async () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it("should redirect to home page when user is logged in", async () => {
    store.dispatch = jest.fn().mockResolvedValueOnce({
      payload: { user: { id: "1", name: "test" } },
    });
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith("/");
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      loginUser({ email: "test@gmail.com", password: "password" })
    );
  });

  it("shoud show an error if the login fail", async () => {
    store = mockStore({
      userState: {
        status: "failed",
        error: "Invalid email or password",
        user: null,
      },
    });

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    expect(routerMock.push).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.getByText(/Invalid email or password/i)
      ).toBeInTheDocument();
    });
  });
});
