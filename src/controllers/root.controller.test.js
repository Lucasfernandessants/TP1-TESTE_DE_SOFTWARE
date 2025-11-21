import { sum } from './root.controller.js';

test('should return the correct sum', () => {
    expect(sum(1, 2)).toBe(3);
});

test('should handle negative numbers', () => {
    expect(sum(-1, -1)).toBe(-2);
});

test('should return zero when no arguments are provided', () => {
    expect(sum()).toBe(0);
});