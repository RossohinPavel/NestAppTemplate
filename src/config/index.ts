export const getConfig = () => {
  const backendPort = Number(process.env.BACKEND_PORT || 0);
  return {backendPort} as const;
}

export type AppConfigType = ReturnType<typeof getConfig>;