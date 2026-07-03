import { getNavigationRouteParams, prepareRouteParams } from '../../navigationConfig';

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
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(
      prepareRouteParams('react-navigation', { userId: '1', tab: 'posts', token: circular })
    ).toEqual({ tab: 'posts' });
  });

  it('returns an empty object when every param is filtered', () => {
    mockNative.getIntegrations.mockReturnValue({
      'react-navigation': { filteredParams: ['token'] },
    });

    expect(prepareRouteParams('react-navigation', { token: 'secret' })).toEqual({});
  });

  it('omits only route param values that fail JSON round-trip', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(
      prepareRouteParams('react-navigation', {
        id: '42',
        callback: () => {},
        circular,
        nested: { ok: true },
      })
    ).toEqual({ id: '42', nested: { ok: true } });
  });

  it('keeps params by default', () => {
    mockNative.getIntegrations.mockReturnValue({ 'react-navigation': true });

    const params = { userId: '1' };
    expect(prepareRouteParams('react-navigation', params)).toEqual(params);
  });

  it('sets urlHidden when a route param is filtered', () => {
    mockNative.getIntegrations.mockReturnValue({ 'react-navigation': { filteredParams: ['token'] } });

    expect(getNavigationRouteParams('react-navigation', { token: 'secret', tab: 'posts' })).toEqual({
      routeParams: { tab: 'posts' },
      urlHidden: true,
    });
  });
});
