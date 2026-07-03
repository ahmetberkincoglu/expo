import native from '../nativeModule';
import type { ObserveIntegrationsConfig, ObserveNavigationIntegrationConfig } from '../types';

type NavigationIntegrationName = 'expo-router' | 'react-navigation';
type NavigationMetricParams = {
  routeParams: Record<string, unknown>;
} & ({ url: string | undefined; urlHidden?: false } | { url?: undefined; urlHidden: true });
type NavigationRouteParams = {
  routeParams: Record<string, unknown>;
  urlHidden?: true;
};
type PreparedNavigationRouteParams = NavigationRouteParams & {
  ignoredParam: boolean;
};

function getIntegrations(): ObserveIntegrationsConfig {
  return native.getIntegrations();
}

function getIntegrationConfig(
  integration: NavigationIntegrationName
): ObserveNavigationIntegrationConfig | null {
  const integrationsConfig = getIntegrations();
  const config = integrationsConfig[integration];
  if (!config || typeof config !== 'object') {
    return null;
  }
  return config;
}

function getFilteredParamKeys(integration: NavigationIntegrationName): Set<string> | null {
  const filteredParams = getIntegrationConfig(integration)?.filteredParams;
  if (!Array.isArray(filteredParams)) return null;

  const keys = new Set(filteredParams.filter((key): key is string => typeof key === 'string'));
  return keys.size > 0 ? keys : null;
}

function prepareNavigationRouteParams(
  integration: NavigationIntegrationName,
  params: object | undefined
): PreparedNavigationRouteParams {
  const filteredKeys = getFilteredParamKeys(integration);
  let ignoredParam = false;
  const routeParams = Object.fromEntries(
    Object.entries(params ?? {})
      .filter(([key]) => {
        const keep = !filteredKeys?.has(key);
        ignoredParam ||= !keep;
        return keep;
      })
      .map(([key, value]) => {
        try {
          return [key, JSON.parse(JSON.stringify(value))] as const;
        } catch {
          ignoredParam = true;
          // Ignore only the individual param value that cannot cross the native boundary.
          return null;
        }
      })
      .filter((entry): entry is readonly [string, unknown] => entry != null)
  );

  return {
    routeParams,
    ignoredParam,
    ...(ignoredParam ? { urlHidden: true as const } : {}),
  };
}

export function prepareRouteParams(
  integration: NavigationIntegrationName,
  params: object | undefined
): Record<string, unknown> {
  return prepareNavigationRouteParams(integration, params).routeParams;
}

export function getNavigationRouteParams(
  integration: NavigationIntegrationName,
  params: object | undefined
): NavigationRouteParams {
  const navigationParams = prepareNavigationRouteParams(integration, params);
  return navigationParams.urlHidden
    ? { routeParams: navigationParams.routeParams, urlHidden: true }
    : { routeParams: navigationParams.routeParams };
}

export function getNavigationMetricParams(
  integration: NavigationIntegrationName,
  routeParams: object | undefined,
  url: string | undefined
): NavigationMetricParams {
  const navigationParams = getNavigationRouteParams(integration, routeParams);

  return navigationParams.urlHidden
    ? { routeParams: navigationParams.routeParams, urlHidden: true }
    : { routeParams: navigationParams.routeParams, url };
}
