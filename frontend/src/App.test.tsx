import React from "react";
import { render } from "@testing-library/react";
import { describe, test, expect, jest } from "@jest/globals";

// Mock the config module with correct path
jest.mock("./config", () => ({
  API_BASE_URL: "http://localhost:8000",
}));

import App from "./App";

describe("App Component", () => {
  test("renders without crashing", () => {
    const { container } = render(<App />);
    const appDiv = container.querySelector(".App");
    expect(appDiv).toBeTruthy();
  });
});
