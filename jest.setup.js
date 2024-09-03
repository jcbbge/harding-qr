import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime';

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

// Add this line to make expect available globally
global.expect = expect;
