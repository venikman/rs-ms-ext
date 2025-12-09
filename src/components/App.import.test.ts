import { describe, test, expect } from '@rstest/core';
import { App } from './App';

describe('App import', () => {
  test('exports component', () => {
    expect(App).toBeTruthy();
  });
});
