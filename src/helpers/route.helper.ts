export const withWildcard = (path: string) => path.endsWith("/*") ? path : `${path}/*`;
