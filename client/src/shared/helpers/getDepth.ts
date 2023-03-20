const getDepth = (cursorPosition: [number, number],
  depthData: number[] | number, fieldSize: [number, number]): number => {
  const length = Array.isArray(depthData) ? depthData.length : depthData;
  const step = fieldSize[1] / length;
  const index = Math.round(cursorPosition[1] / step);
  return index === 0 ? 0 : index - 1;
};

export { getDepth };
