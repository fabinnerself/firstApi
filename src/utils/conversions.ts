export const convertToMeters = (value: number, unit: string): number => {
  switch (unit) {
    case 'metros':
      return value;
    case 'pulgadas':
      return value * 0.0254;
    case 'pies':
      return value * 0.3048;
    default:
      return value;
  }
};

export const convertToKilograms = (value: number, unit: string): number => {
  switch (unit) {
    case 'kg':
      return value;
    case 'libras':
      return value * 0.453592;
    default:
      return value;
  }
};

export const getUnitsFromSystem = (system: string): { heightUnit: string; weightUnit: string } => {
  const [heightUnit, weightUnit] = system.split('-');
  return { heightUnit, weightUnit };
};