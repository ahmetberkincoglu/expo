import { filterNavigationParams } from '../../navigationConfig';

const mockNative = {
  getIntegrations: jest.fn(() => ({})),
};

jest.mock('../../../nativeModule', () => ({ __esModule: true, default: mockNative }));

describe('react-navigation navigation config', () => {
  beforeEach(() => {
    mockNative.getIntegrations.mockReturnValue({});
  });

  it('filters configured route param keys', () => {
    mockNative.getIntegrations.mockReturnValue({
      'react-navigation': { filteredParams: ['userId', 'token', null as unknown as string] },
    });

    expect(
      filterNavigationParams('react-navigation', { userId: '1', tab: 'posts', token: 'secret' })
    ).toEqual({ tab: 'posts' });
  });

  it('returns an empty object when every param is filtered', () => {
    mockNative.getIntegrations.mockReturnValue({
      'react-navigation': { filteredParams: ['token'] },
    });

    expect(filterNavigationParams('react-navigation', { token: 'secret' })).toEqual({});
  });

  it('keeps params by default', () => {
    mockNative.getIntegrations.mockReturnValue({ 'react-navigation': true });

    const params = { userId: '1' };
    expect(filterNavigationParams('react-navigation', params)).toBe(params);
  });
});
