import { getNavigationMetricParams, prepareRouteParams } from '../../navigationConfig';

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
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(
      prepareRouteParams('expo-router', { userId: '1', tab: 'posts', token: circular })
    ).toEqual({ tab: 'posts' });
  });

  it('returns an empty object when every param is filtered', () => {
    mockNative.getIntegrations.mockReturnValue({ 'expo-router': { filteredParams: ['userId'] } });

    expect(prepareRouteParams('expo-router', { userId: '1' })).toEqual({});
  });

  it('omits only route param values that fail JSON round-trip', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(
      prepareRouteParams('expo-router', {
        id: '42',
        callback: () => {},
        circular,
        nested: { ok: true },
      })
    ).toEqual({ id: '42', nested: { ok: true } });
  });

  it('keeps params and URL visible by default', () => {
    mockNative.getIntegrations.mockReturnValue({ 'expo-router': true });

    const params = { userId: '1' };
    expect(prepareRouteParams('expo-router', params)).toEqual(params);
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

  it('hides the URL when a route param cannot be serialized', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(getNavigationMetricParams('expo-router', { id: '42', circular }, '/users/42')).toEqual({
      routeParams: { id: '42' },
      urlHidden: true,
    });
  });
});
