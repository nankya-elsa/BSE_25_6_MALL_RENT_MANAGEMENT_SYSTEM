import { render } from "@testing-library/react";
import { describe, test, expect } from "@jest/globals";
import App from "./App";

describe("App Component", () => {
  test("renders without crashing", () => {
    const { container } = render(<App />);
    // Just checking the app renders without errors
    const appDiv = container.querySelector(".App");
    expect(appDiv).toBeTruthy();
  });
});
