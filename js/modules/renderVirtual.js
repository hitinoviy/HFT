import createElement from '../utils/createElement.js';
import createCheckbox from '../utils/createCheckbox.js';
import { increasePerMonthTotalCost, decreasePerMonthTotalCost } from '../modules/renderCart.js';

const changePriceMonth = (rangeBlock) => {
  const rangeContainer = rangeBlock.closest('.equipment__info');
  const rangeInput = rangeBlock.querySelector('.equipment__range-slider');
  const price = rangeContainer.querySelector('.equipment__price');
  let totalPrice;
  if (rangeBlock.id === 'storage') {
    totalPrice = (rangeInput.value * rangeInput.dataset.monthlyCost) / 60;
  } else {
    totalPrice = rangeInput.value * rangeInput.dataset.monthlyCost;
  }

  rangeContainer.dataset.monthlyCost = totalPrice;
  const modifiedPrice = totalPrice.toLocaleString('ru-RU');
  price.textContent = `+${modifiedPrice} ₽ / мес.`;
};

const createRange = (data) => {
  const range = createElement('div', 'equipment__range');
  range.id = data.id;
  const rangeTitle = createElement('p', 'equipment__range-title', data.name);
  const rangeTotal = createElement(
    'p',
    'equipment__range-total',
    `${data.rangeInfo.size.min} ${data.rangeInfo.nameCurrentValue}`
  );
  const rangeInput = createElement('input', 'equipment__range-slider');

  rangeInput.type = 'range';
  rangeInput.min = data.rangeInfo.size.min;
  rangeInput.max = data.rangeInfo.size.max;
  rangeInput.value = data.rangeInfo.size.min;
  //oldRangeValue = rangeInput.value;
  rangeInput.step = data.rangeInfo.size.step;
  rangeInput.name = data.name;
  rangeInput.dataset.monthlyCost = data.rangeInfo.monthlyPrice;
  rangeInput.addEventListener('change', (e) => {
    const value = rangeInput.value;
    rangeTotal.textContent = `${value} ${data.rangeInfo.nameCurrentValue}`;
    changePriceMonth(range);
    //updateTotalPriceMonth(range);
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

const updateVirtualCardPrice = (data, select) => {
  const itemPrice = select.closest('.equipment__sub-info').querySelector('.equipment__price');
  let modifiedPrice = data.toLocaleString('ru-RU');
  itemPrice.textContent = `${modifiedPrice} ₽ / мес.`;
};

const virtualCardPrice = (data) => {
  let modifiedPrice = data.toLocaleString('ru-RU');
  const itemPrice = createElement('p', 'equipment__price', `${modifiedPrice} ₽ / мес.`);

  return itemPrice;
};

const updateSelect = (data) => {
  const select = document.querySelector('.equipment__select');
  select.innerHTML = '';
  data.versions.forEach((el) => {
    const option = createElement('option', 'equipment__option', el.version);
    option.dataset.price = el.monthlyPrice;
    select.appendChild(option);
  });
};

const createSelect = (data) => {
  const select = createElement('select', 'equipment__select');
  data.versions.forEach((el) => {
    const option = createElement('option', 'equipment__option', el.version);
    option.dataset.price = el.monthlyPrice;
    select.appendChild(option);
  });
  select.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedPrice = selectedOption.dataset.price;
    updateVirtualCardPrice(selectedPrice, select);
  });
  return select;
};

const createInput = (type, value, checked, data) => {
  const cardInput = createElement('input');
  cardInput.type = type;
  cardInput.name = 'os';
  cardInput.checked = checked;
  cardInput.value = value;
  cardInput.id = value;
  cardInput.addEventListener('click', (e) => {
    if (e.target.value === 'Windows') {
      updateSelect(data[0]);
      const equipmentSelect = document.querySelector('.equipment__select');
      updateVirtualCardPrice(data[0].versions[0].monthlyPrice, equipmentSelect);
    } else {
      updateSelect(data[1]);
      const equipmentSelect = document.querySelector('.equipment__select');
      updateVirtualCardPrice(data[1].versions[0].monthlyPrice, equipmentSelect);
    }
  });
  return cardInput;
};

const createLabel = (id) => {
  const cardLabel = createElement('label', null, id);
  cardLabel.htmlFor = id;
  return cardLabel;
};

const createToggler = (data) => {
  const cardToggle = createElement('div', 'equipment__toggle');
  const cardInput1 = createInput('radio', data[0].name, true, data);
  const cardInput2 = createInput('radio', data[1].name, false, data);

  const cardSwitcher = createElement('div', 'equipment__switcher');
  const label1 = createLabel(data[0].name);
  const label2 = createLabel(data[1].name);
  cardSwitcher.append(label1, label2);

  cardToggle.append(cardInput1, cardInput2, cardSwitcher);

  return cardToggle;
};

const createRangeContainer = (data) => {
  const equipmentRangeContainer = createElement('div', 'equipment__info');
  const cpuRange = createRange(data);
  let modifiedPrice = data.rangeInfo.monthlyPrice.toLocaleString('ru-RU');
  const equipmentRangePrice = createElement('p', 'equipment__price', `+${modifiedPrice} ₽ / мес.`);
  equipmentRangeContainer.append(cpuRange, equipmentRangePrice);

  return equipmentRangeContainer;
};

const createVirtualCard = (data) => {
  const card = createElement('div', 'equipment__content');
  const cardInfo = createElement('div', 'equipment__sub-info');
  const cardChoice = createElement('div', 'equipment__choice');
  const cartToggle = createToggler(data.operatingSystems);
  const cardSelect = createSelect(data.operatingSystems[0]);
  cardChoice.append(cartToggle, cardSelect);
  const cardPrice = virtualCardPrice(data.operatingSystems[0].versions[0].monthlyPrice);
  cardInfo.append(cardChoice, cardPrice);

  const cpuRange = createRangeContainer(data.cpu);
  const ramRange = createRangeContainer(data.ram);
  const storageRange = createRangeContainer(data.storage);

  card.append(cardInfo, cpuRange, ramRange, storageRange);
  return card;
};

const createVirtualItem = (data) => {
  const equipmentItem = createElement('div', 'equipment__item');
  const equipmentInfo = createElement('div', 'equipment__info');
  const equipmentCheckbox = createCheckbox(data.id);
  const equipmentName = createElement('div', 'equipment__name');
  const equipmentTitle = createElement('h3', 'equipment__title', data.name);
  const equipmentSubTitle = createElement('h4', 'equipment__sub-title', data.subName);
  equipmentName.append(equipmentTitle, equipmentSubTitle);
  equipmentInfo.append(equipmentCheckbox, equipmentName);
  equipmentItem.append(equipmentInfo);

  return equipmentItem;
};

const renderVirtual = (data, container) => {
  const virtualItem = createVirtualItem(data);
  const card = createVirtualCard(data);
  container.append(virtualItem, card);
};

export default renderVirtual;
