export const appendHeadersRecord = (
  headers: Headers,
  updateHeaders: Record<string, string | string[]>,
  shouldOverwrite: boolean
): void => {
  for (const headerName in updateHeaders) {
    if (Array.isArray(updateHeaders[headerName])) {
      for (const headerValue of updateHeaders[headerName]) {
        headers.append(headerName, headerValue);
      }
    } else if (!shouldOverwrite && headers.has(headerName)) {
      continue;
    } else if (updateHeaders[headerName] != null) {
      headers.set(headerName, updateHeaders[headerName]);
    }
  }
};

/**
 * Merges two header records, with `update` taking precedence over `base`.
 * A scalar in `update` takes the header over entirely; an array accumulates onto whatever
 * `base` declared. Keys are lowercased so names collide case-insensitively, like `Headers`.
 */
export const mergeHeaderInputs = (
  base: Record<string, string | string[]>,
  update: Record<string, string | string[]>
): Record<string, string | string[]> => {
  const merged: Record<string, string | string[]> = {};

  for (const headerName in base) {
    const value = base[headerName];
    if (value != null) {
      merged[headerName.toLowerCase()] = Array.isArray(value) ? [...value] : value;
    }
  }

  for (const headerName in update) {
    const value = update[headerName];
    if (value == null) {
      continue;
    }
    const key = headerName.toLowerCase();
    if (Array.isArray(value)) {
      const existing = merged[key];
      merged[key] =
        existing != null
          ? [...(Array.isArray(existing) ? existing : [existing]), ...value]
          : [...value];
    } else {
      merged[key] = value;
    }
  }

  return merged;
};
