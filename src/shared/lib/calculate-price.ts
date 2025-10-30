export function calculatePrice(totalAmount: number, unitsCount: number) {
  if (unitsCount <= 0) return [];
  if (unitsCount === 1) return [totalAmount];

  const ratios = [];
  for (let i = 0; i < unitsCount; i++) {
    const ratio = 1 - (i / (unitsCount - 1)) * 0.6; // Линейно убывает от 1 до 0.4
    ratios.push(ratio);
  }

  // Нормализуем коэффициенты чтобы получить цены
  const sumRatios = ratios.reduce((sum, ratio) => sum + ratio, 0);
  const prices = ratios.map((ratio) => Math.round((ratio / sumRatios) * totalAmount));

  // Корректируем сумму из-за округления
  const currentSum = prices.reduce((sum, price) => sum + price, 0);
  let difference = totalAmount - currentSum;

  if (difference !== 0) {
    // Распределяем разницу начиная с самых дорогих позиций
    const sortedIndices = prices.map((price, index) => index).sort((a, b) => prices[b] - prices[a]);

    let index = 0;
    while (difference !== 0) {
      const adjust = difference > 0 ? 1 : -1;
      prices[sortedIndices[index]] += adjust;
      difference -= adjust;
      index = (index + 1) % sortedIndices.length;
    }
  }

  let result = 0;
  return prices.map((num) => (result += num));
}
