const getTabIndex = (appPosition: number): number => (String(appPosition).length > 1
  ? Number(String(appPosition).slice(1))
  : 0);

export { getTabIndex };
