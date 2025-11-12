// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  useParams() {
    return {};
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock GSAP and ScrollTrigger
jest.mock('gsap', () => ({
  __esModule: true,
  default: {
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn(),
    set: jest.fn(),
    timeline: jest.fn(() => ({
      to: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    })),
    registerPlugin: jest.fn(),
    killTweensOf: jest.fn(),
  },
  gsap: {
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn(),
    set: jest.fn(),
    timeline: jest.fn(() => ({
      to: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    })),
    registerPlugin: jest.fn(),
    killTweensOf: jest.fn(),
  },
}));

jest.mock('gsap/ScrollTrigger', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    refresh: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn(() => []),
  },
  ScrollTrigger: {
    create: jest.fn(),
    refresh: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn(() => []),
  },
}));

// Mock @gsap/react
jest.mock('@gsap/react', () => ({
  __esModule: true,
  useGSAP: jest.fn((fn) => {
    // Call the function immediately for tests
    if (typeof fn === 'function') {
      fn();
    }
  }),
}));

// Suppress console errors and warnings during tests (optional)
// Uncomment if you want cleaner test output
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

// Mock remark with intelligent markdown-to-HTML conversion for testing
jest.mock('remark', () => {
  return {
    __esModule: true,
    remark: jest.fn(() => ({
      use: jest.fn().mockReturnThis(),
      process: jest.fn().mockImplementation((markdown) => {
        // Simple markdown to HTML conversion for testing
        let html = String(markdown);

        // Convert headers
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');

        // Convert bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Convert italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Convert paragraphs (simple version)
        html = html.split('\n\n').map(para => {
          if (!para.match(/^<h[123]>/) && para.trim()) {
            return `<p>${para}</p>`;
          }
          return para;
        }).join('\n');

        return Promise.resolve({
          toString: () => html,
        });
      }),
    })),
  };
});

jest.mock('remark-html', () => ({
  __esModule: true,
  default: jest.fn(),
}));
