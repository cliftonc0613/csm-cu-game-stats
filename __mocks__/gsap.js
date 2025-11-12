/**
 * Mock for GSAP and ScrollTrigger for testing
 */

const gsap = {
  registerPlugin: jest.fn(),
  context: jest.fn((callback) => {
    if (typeof callback === 'function') {
      callback();
    }
    return {
      revert: jest.fn(),
    };
  }),
  from: jest.fn(),
  to: jest.fn(),
  fromTo: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn(),
  })),
};

const ScrollTrigger = jest.fn();

module.exports = {
  gsap,
  ScrollTrigger,
  default: gsap,
};
