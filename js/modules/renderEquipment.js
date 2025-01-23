import createElement from '../utils/createElement.js';
import createCheckbox from '../utils/createCheckbox.js';
import { increasePerMonthTotalCost, decreasePerMonthTotalCost } from '../modules/renderCart.js';

let oldPrice;
let totalPrice;
let oldRangeValue;

const updateTotalPriceMonth = (rangeBlock) => {
  const rangeContainer = rangeBlock.closest('.equipment__item');
  const itemCheckbox = rangeContainer.querySelector('.item__checkbox input');
  const rangeInput = rangeBlock.querySelector('.equipment__range-slider');

  if (itemCheckbox.checked) {
    if (oldRangeValue < rangeInput.value) {
      if (!oldPrice) {
        increasePerMonthTotalCost(totalPrice);

        decreasePerMonthTotalCost(rangeInput.dataset.monthlyCost);
      } else {
        increasePerMonthTotalCost(totalPrice);
        decreasePerMonthTotalCost(oldPrice);
      }
    } else {
      decreasePerMonthTotalCost(oldPrice);
      increasePerMonthTotalCost(totalPrice);
    }
  }
  oldPrice = totalPrice;
  oldRangeValue = rangeInput.value;
};

const changePriceMonth = (rangeBlock) => {
  const rangeContainer = rangeBlock.closest('.equipment__item');
  const rangeInput = rangeBlock.querySelector('.equipment__range-slider');
  const price = rangeContainer.querySelectorAll('.equipment__price');

  totalPrice = rangeInput.value * rangeInput.dataset.monthlyCost;

  rangeContainer.dataset.monthlyCost = totalPrice;
  const modifiedPrice = totalPrice.toLocaleString('ru-RU');
  price[1].textContent = `+${modifiedPrice} ₽ / мес.`;
};

const createRange = (data) => {
  const range = createElement('div', 'equipment__range');
  const rangeTitle = createElement('p', 'equipment__range-title', data.name);
  const rangeTotal = createElement('p', 'equipment__range-total', data.rangeInfo.size.min);
  const rangeInput = createElement('input', 'equipment__range-slider');
  rangeInput.type = 'range';
  rangeInput.min = data.rangeInfo.size.min;
  rangeInput.max = data.rangeInfo.size.max;
  rangeInput.value = data.rangeInfo.size.min;
  oldRangeValue = rangeInput.value;
  rangeInput.step = data.rangeInfo.size.step;
  rangeInput.name = data.name;
  rangeInput.dataset.monthlyCost = data.rangeInfo.monthlyCost;
  rangeInput.addEventListener('change', (e) => {
    const value = rangeInput.value;
    rangeTotal.textContent = value;
    changePriceMonth(range);
    updateTotalPriceMonth(range);
  });

  const rangeLabels = createElement('div', 'equipment__range-labels');

  for (
    let i = data.rangeInfo.size.min;
    i <= data.rangeInfo.size.max;
    i += data.rangeInfo.size.step
  ) {
    const label = createElement('span', null, i);
    rangeLabels.appendChild(label);
  }

  range.append(rangeTitle, rangeTotal, rangeInput, rangeLabels);

  return range;
};

const createEquipment = (data) => {
  const equipmentDiv = createElement('div', 'equipment__item');
  equipmentDiv.dataset.installationCost = data.installationCost;
  const equipmentInfo = createElement('div', 'equipment__info');
  const equipmentCheckbox = createCheckbox(data.id);
  const equipmentSubInfo = createElement('div', 'equipment__sub-info');
  const equipmentInfoTitle = createElement('h3', 'equipment__info-title', data.name);
  let modifiedPrice = data.installationCost.toLocaleString('ru-RU');
  const equipmentPriceInstal = createElement(
    'p',
    'equipment__price',
    `+${modifiedPrice} ₽ за монтаж`
  );
  equipmentSubInfo.append(equipmentInfoTitle, equipmentPriceInstal);
  equipmentInfo.append(equipmentCheckbox, equipmentSubInfo);

  const equipmentRangeContainer = createElement('div', 'equipment__info');
  const equipmentRange = createRange(data.info);

  modifiedPrice = data.info.rangeInfo.monthlyCost.toLocaleString('ru-RU');
  const equipmentRangePrice = createElement('p', 'equipment__price', `+${modifiedPrice} ₽ / мес.`);

  equipmentRangeContainer.append(equipmentRange, equipmentRangePrice);

  equipmentDiv.append(equipmentInfo, equipmentRangeContainer);
  changePriceMonth(equipmentRange);

  return equipmentDiv;
};

const renderEquipments = (data, container) => {
  const equipment = createEquipment(data.serverPlacement.MOEXColocationZone);
  container.appendChild(equipment);
  const equipment2 = createEquipment(data.serverPlacement.FreeZone);
  container.appendChild(equipment2);
};

export default renderEquipments;
