export const normalizeWgConfig = (config: string) => {
  if (!config.includes('DNS')) {
    config = config.replace('[Interface]', `[Interface]\nDNS = 1.1.1.1`);
  }
  if (!config.includes('PersistentKeepalive')) {
    config = config.replace('Endpoint =', 'PersistentKeepalive = 25\nEndpoint =');
  }

  return config;
};
