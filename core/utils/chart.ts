interface ChartScale {
  maxValue: number;
  stepValue: number;
  noOfSections: number;
  yAxisLabelTexts: string[];
}

export function calculateChartScale(values: number[]): ChartScale {
  const maxValue = Math.max(...values);

  // Get the magnitude (power of 10) close to the maxValue
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));

  // Calculate normalized value (between 1-10)
  const normalized = maxValue / magnitude;

  // Choose an appropriate step based on the normalized value
  let stepValue: number;

  if (normalized <= 2) stepValue = 0.2 * magnitude;
  else if (normalized <= 5) stepValue = 0.5 * magnitude;
  else stepValue = magnitude;

  const noOfSections = Math.min(Math.ceil(maxValue / stepValue), 6);

  // Generate labels
  const yAxisLabelTexts = Array.from({ length: noOfSections + 1 }, (_, i) => {
    const value = Math.round(i * (maxValue / noOfSections));

    return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
  });

  return {
    maxValue,
    stepValue,
    noOfSections,
    yAxisLabelTexts
  };
}
