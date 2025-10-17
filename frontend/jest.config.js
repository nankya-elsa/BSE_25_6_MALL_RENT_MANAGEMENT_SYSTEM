export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react",
          esModuleInterop: true,
          module: "esnext", // Add this
          target: "esnext", // Add this
        },
      },
    ],
  },
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  globals: {
    "import.meta": {
      // Mock import.meta for tests
      env: {
        VITE_API_URL: "http://localhost:8000",
      },
    },
  },
};
