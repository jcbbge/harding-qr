import '@testing-library/jest-dom'; // For additional matchers
import 'regenerator-runtime/runtime'; // If using async/await in tests

// Mock window.matchMedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {}
    };
  };
