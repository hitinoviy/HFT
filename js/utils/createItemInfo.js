import createCheckbox from './createCheckbox.js';
import createElement from './createElement.js';

const createSubInfo = (title, price) => {
  const subInfoDiv = createElement('div', 'item__sub-info');
  const titleElement = createElement('h3', 'item__title', title);
  const priceElement = createElement('p', 'item__price', price);
  subInfoDiv.append(titleElement, priceElement);
  return subInfoDiv;
};

const createSubItem = (subServices) => {
  const subItemDiv = createElement('div', 'item__sub-item');
  subServices.forEach((el) => {
    const itemDiv = createElement('div', 'item');
    if (el.hasOwnProperty('monthlyCost')) {
      itemDiv.dataset.monthlyCost = el.monthlyCost;
    }
    const checkbox = createCheckbox(el.id, true);
    const itemInfoDiv = createElement('div', 'item__sub-info');
    const itemTitle = createElement('p', 'item__title', el.name);
    const modifiedPrice = el.monthlyCost.toLocaleString('ru-RU');
    const monthlyCost = createElement('p', 'item__price', `+${modifiedPrice} ₽ / мес.`);

    itemInfoDiv.append(itemTitle, monthlyCost);
    itemDiv.append(checkbox, itemInfoDiv);
    subItemDiv.append(itemDiv);
  });
  return subItemDiv;
};

const createItemInfo = (data) => {
  const itemInfoDiv = createElement('div', 'item__info');

  const modifiedPrice = data.installationCost.toLocaleString('ru-RU');
  const itemSubInfo1 = createSubInfo(data.name, `${modifiedPrice} ₽ за подключение`);
  const itemSubInfo2 = createElement('div', 'item__sub-info');
  const itemSubTitle = createElement('p', 'item__sub-title', data.subName);

  itemSubInfo2.append(itemSubTitle);

  if (data.hasAdditionalProperties) {
    const subItem = createSubItem(data.subServices);
    itemInfoDiv.append(itemSubInfo1, itemSubInfo2, subItem);
  } else {
    const modifiedPrice = data.monthlyCost.toLocaleString('ru-RU');
    const monthlyCost = createElement('p', 'item__price', `+${modifiedPrice} ₽ / мес.`);
    itemSubInfo2.append(monthlyCost);
    itemInfoDiv.append(itemSubInfo1, itemSubInfo2);
  }

  return itemInfoDiv;
};

export default createItemInfo;
