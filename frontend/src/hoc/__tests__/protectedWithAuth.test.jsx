/* eslint-disable linebreak-style */
// FILE: src/hoc/protectedWithAuth.test.jsx

import React from "react";

import { render, screen, waitFor } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import protectedWithAuth from "../protectedWithAuth";

import { checkAuth } from "../checkAuth";

// import { logout, updateAccessToken } from "../../features/userSlice";

// mock dependencies

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../checkAuth", () => ({
  checkAuth: jest.fn(),
}));

const MockComponent = () => <div>Mock Component</div>;

describe("Testing protectedWithAuth HOC", () => {
  let mockDispatch;
  let mockRouter;
  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    mockRouter = { replace: jest.fn() };
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the spinner while loading is set to true", () => {
    useSelector.mockReturnValue({ user: { accessToken: "valid-token" } });

    checkAuth.mockImplementationOnce(({ setLoading }) => {
      setLoading(true);
    });

    const ProtectedComponent = protectedWithAuth(MockComponent);

    const { getByTestId } = render(<ProtectedComponent />);

    expect(getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should hide the spinner and render the wrapped component if loding i set to false", async () => {
    useSelector.mockReturnValue({ user: { accessToken: "valid-token" } });

    checkAuth.mockImplementationOnce(({ setLoading }) => {
      setLoading(false); // Simulate the spinner being removed
    });

    const ProtectComponent = protectedWithAuth(MockComponent);

    const { container, queryByTestId, getByText } = render(
      <ProtectComponent />
    );

    await waitFor(() => {
      expect(queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByText("Mock Component")).toBeInTheDocument();
    });
  });
});
