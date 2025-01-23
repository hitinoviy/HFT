import {
  increaseOneTimeTotalCost,
  decreaseOneTimeTotalCost,
  increasePerMonthTotalCost,
  decreasePerMonthTotalCost,
} from '../modules/renderCart.js';
const toCamelCase = (str) => {
  return str
    .split(' ')
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
};

const updateInternalCheckboxes = (e) => {
  const item = e.target.closest('.item');
  if (item) {
    const subItem = item.querySelector('.item__sub-item');
    let internalCheckboxes;
    if (subItem) {
      internalCheckboxes = subItem.querySelectorAll('.item__sub-item input[type="checkbox"]');
      const isChecked = e.target.checked;
      internalCheckboxes.forEach((checkbox) => {
        checkbox.disabled = !isChecked;
        if (!isChecked) {
          const item = checkbox.closest('.item');
          if (item.dataset.monthlyCost && checkbox.checked) {
            decreasePerMonthTotalCost(item.dataset.monthlyCost);
          }
          checkbox.checked = false;
        }
      });
    }
  }
};

const createCheckbox = (name, disabled) => {
  const id = toCamelCase(name);

  const div = document.createElement('div');
  div.classList.add('item__checkbox');

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id;
  input.name = id;
  if (disabled) input.disabled = disabled;
  input.addEventListener('change', (e) => {
    if (e.target.checked) {
      const item = e.target.closest('.item') || e.target.closest('.equipment__item');
      if (item.dataset.installationCost) {
        increaseOneTimeTotalCost(item.dataset.installationCost);
      }
      if (item.dataset.monthlyCost) {
        increasePerMonthTotalCost(item.dataset.monthlyCost);
      }
    } else {
      const item = e.target.closest('.item') || e.target.closest('.equipment__item');
      if (item.dataset.installationCost) {
        decreaseOneTimeTotalCost(item.dataset.installationCost);
      }
      if (item.dataset.monthlyCost) {
        decreasePerMonthTotalCost(item.dataset.monthlyCost);
      }
    }
  });
  input.addEventListener('change', updateInternalCheckboxes);

  const label = document.createElement('label');
  label.htmlFor = id;

  div.append(input, label);

  return div;
};

export default createCheckbox;
