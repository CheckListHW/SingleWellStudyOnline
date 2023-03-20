import { ICurves, ICoreData } from 'shared/types/models';

const getInitialCoreData = (researchData: ICurves): ICoreData[] => {
  const { PORO, SW, PERM, DEPTH } = researchData;
  const border = 1;
  const depthStep = 0.1;
  const porosityDataLength = PORO.length;
  const waterSaturationLength = SW.length;
  const permabilityLength = SW.length;

  const porosityUpperDotIndex = PORO.findIndex(item => item > 0);
  const porosityLowerDotIndex = porosityDataLength - 1 - PORO
    .slice().reverse().findIndex(item => item > 0);

  const waterSaturationUpperDotIndex = SW.findIndex(item => item > 0);
  const waterSaturationLowerDotIndex = waterSaturationLength - 1 - SW
    .slice().reverse().findIndex(item => item > 0);

  const permabilityUpperDotIndex = PERM.findIndex(item => item > 0);
  const permabilityLowerDotIndex = permabilityLength - 1 - PERM
    .slice().reverse().findIndex(item => item > 0);

  const upperDotIndex = Math
    .min(porosityUpperDotIndex, waterSaturationUpperDotIndex, permabilityUpperDotIndex);
  const lowerDotIndex = Math
    .max(porosityLowerDotIndex, waterSaturationLowerDotIndex, permabilityLowerDotIndex);

  const begin = (upperDotIndex - border / depthStep) >= 0 ? upperDotIndex - border / depthStep : 0;
  const end = (lowerDotIndex + border / depthStep + 1) < DEPTH.length
    ? lowerDotIndex + border / depthStep + 1
    : DEPTH.length;

  const trimmedDepth = DEPTH.slice(begin, end);
  const trimmedPorosity = PORO.slice(begin, end);
  const trimmedWaterSaturation = SW.slice(begin, end);
  const trimmedPermability = PERM.slice(begin, end);

  let i = 0;

  return trimmedDepth.map((depthValue, index) => ({
    id: trimmedPorosity[index] > 0 || trimmedWaterSaturation[index] > 0
      // eslint-disable-next-line no-plusplus
      || trimmedPermability[index] > 0 ? i++ : -1,
    depth: depthValue,
    porosity: trimmedPorosity[index],
    waterSaturation: trimmedWaterSaturation[index],
    permability: trimmedPermability[index],
    isVisible: true,
  }));
};

export { getInitialCoreData };
