import native from '../nativeModule';
import type { ObserveIntegrationsConfig, ObserveNavigationIntegrationConfig } from '../types';

type NavigationIntegrationName = 'expo-router' | 'react-navigation';
type NavigationMetricParams<T extends object | undefined> = {
  routeParams: T | Record<string, never>;
} & ({ url: string | undefined; urlHidden?: false } | { url?: undefined; urlHidden: true });
type FilteredNavigationParams<T extends object | undefined> = {
  routeParams: T | Record<string, never>;
  ignoredParam: boolean;
};
type NavigationRouteParams<T extends object | undefined> = {
  routeParams: T | Record<string, never>;
  urlHidden?: true;
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

export function filterNavigationParams<T extends object | undefined>(
  integration: NavigationIntegrationName,
  params: T
): T | Record<string, never> {
  return getFilteredNavigationParams(integration, params).routeParams;
}

export function getNavigationRouteParams<T extends object | undefined>(
  integration: NavigationIntegrationName,
  params: T
): NavigationRouteParams<T> {
  const { routeParams, ignoredParam } = getFilteredNavigationParams(integration, params);
  return {
    routeParams,
    ...(ignoredParam ? { urlHidden: true as const } : {}),
  };
}

function getFilteredNavigationParams<T extends object | undefined>(
  integration: NavigationIntegrationName,
  params: T
): FilteredNavigationParams<T> {
  const filteredKeys = getFilteredParamKeys(integration);
  if (!params || !filteredKeys) return { routeParams: params, ignoredParam: false };

  let ignoredParam = false;
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([key]) => {
      const keep = !filteredKeys.has(key);
      ignoredParam ||= !keep;
      return keep;
    })
  );
  return { routeParams: filtered as T | Record<string, never>, ignoredParam };
}

export function getNavigationMetricParams<T extends object | undefined>(
  integration: NavigationIntegrationName,
  routeParams: T,
  url: string | undefined
): NavigationMetricParams<T> {
  const navigationParams = getNavigationRouteParams(integration, routeParams);

  return navigationParams.urlHidden
    ? { routeParams: navigationParams.routeParams, urlHidden: true }
    : { routeParams: navigationParams.routeParams, url };
}
