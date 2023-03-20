interface ITrimmedData {
  depth: number[];
  firstCurve: number[];
  secondCurve: number[];
}

const cutDataByCore = (depthData: number[], curveData: number[] | undefined = [],
  secondCurveData: number[] | undefined = []): ITrimmedData => {
  const border = 1;
  const depthStep = 0.1;
  const secondCurveDataLength = secondCurveData.length;

  const upperDotIndex = secondCurveData.findIndex(item => item > 0);
  const secondCurveDataCopy = secondCurveData.slice();
  const lowerDotIndex = secondCurveDataLength - 1 - secondCurveDataCopy
    .reverse().findIndex(item => item > 0);

  if (upperDotIndex >= 0 && lowerDotIndex !== secondCurveDataLength) {
    const begin = (upperDotIndex - border / depthStep) >= 0
      ? upperDotIndex - border / depthStep
      : 0;
    const end = (lowerDotIndex + border / depthStep + 1) < secondCurveDataLength
      ? lowerDotIndex + border / depthStep + 1
      : secondCurveDataLength;
    return {
      depth: depthData.slice(begin, end),
      firstCurve: curveData.slice(begin, end),
      secondCurve: secondCurveData.slice(begin, end),
    };
  }

  return {
    depth: [],
    firstCurve: [],
    secondCurve: [],
  };
};

export { cutDataByCore };
