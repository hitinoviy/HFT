import createCheckbox from '../utils/createCheckbox.js';
import createItemInfo from '../utils/createItemInfo.js';

const createElement = (elData) => {
  const div = document.createElement('div');
  div.classList.add('item');
  if (elData.hasOwnProperty('installationCost')) {
    div.dataset.installationCost = elData.installationCost;
  }
  if (elData.hasOwnProperty('monthlyCost')) {
    div.dataset.monthlyCost = elData.monthlyCost;
  }

  const checkbox = createCheckbox(elData.name);
  const itemInfo = createItemInfo(elData);

  div.append(checkbox, itemInfo);

  return div;
};

const renderMarket = (data, marketContainer) => {
  const container = marketContainer.querySelector('.form__group');

  data.forEach((el) => {
    const element = createElement(el);
    container.appendChild(element);
  });
};

export default renderMarket;
