import '@testing-library/jest-dom';

// Глобальные типы для тестов
declare global {
  const describe: typeof import('vitest')['describe'];
  const it: typeof import('vitest')['it'];
  const expect: typeof import('vitest')['expect'];
  const beforeEach: typeof import('vitest')['beforeEach'];
  const afterEach: typeof import('vitest')['afterEach'];
}
