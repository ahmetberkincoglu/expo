import {
  filterNavigationParams,
  getNavigationMetricParams,
} from '../../navigationConfig';

const mockNative = {
  getIntegrations: jest.fn(() => ({})),
};

jest.mock('../../../nativeModule', () => ({ __esModule: true, default: mockNative }));

describe('expo-router navigation config', () => {
  beforeEach(() => {
    mockNative.getIntegrations.mockReturnValue({});
  });

  it('filters configured route and query param keys', () => {
    mockNative.getIntegrations.mockReturnValue({
      'expo-router': { filteredParams: ['userId', 'token', 42 as unknown as string] },
    });

    expect(
      filterNavigationParams('expo-router', { userId: '1', tab: 'posts', token: 'secret' })
    ).toEqual({ tab: 'posts' });
  });

  it('returns an empty object when every param is filtered', () => {
    mockNative.getIntegrations.mockReturnValue({ 'expo-router': { filteredParams: ['userId'] } });

    expect(filterNavigationParams('expo-router', { userId: '1' })).toEqual({});
  });

  it('keeps params and URL visible by default', () => {
    mockNative.getIntegrations.mockReturnValue({ 'expo-router': true });

    const params = { userId: '1' };
    expect(filterNavigationParams('expo-router', params)).toBe(params);
    expect(getNavigationMetricParams('expo-router', params, '/users/1')).toEqual({
      routeParams: params,
      url: '/users/1',
    });
  });

  it('keeps the URL visible when no route param is filtered', () => {
    mockNative.getIntegrations.mockReturnValue({ 'expo-router': { filteredParams: ['token'] } });

    expect(getNavigationMetricParams('expo-router', { tab: 'posts' }, '/users/1')).toEqual({
      routeParams: { tab: 'posts' },
      url: '/users/1',
    });
  });

  it('hides the URL when a route param is filtered', () => {
    mockNative.getIntegrations.mockReturnValue({
      'expo-router': { filteredParams: ['token'] },
    });

    expect(
      getNavigationMetricParams('expo-router', { token: 'secret', tab: 'posts' }, '/u?token=secret')
    ).toEqual({ routeParams: { tab: 'posts' }, urlHidden: true });
  });
});
