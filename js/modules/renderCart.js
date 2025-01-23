const accordionTotal = document.querySelectorAll('.accordion__total');
const formCardPrice = document.querySelectorAll('.form__card-price');

let totalOneTime = 0;
let totalPerMonth = 0;

const updatePrice = () => {
  let modifiedPrice = totalOneTime.toLocaleString('ru-RU');
  accordionTotal[0].querySelector('span').textContent = modifiedPrice;
  modifiedPrice = totalPerMonth.toLocaleString('ru-RU');
  accordionTotal[1].querySelector('span').textContent = modifiedPrice;
  formCardPrice[1].querySelector('span').textContent = modifiedPrice;

  modifiedPrice = (totalOneTime + totalPerMonth).toLocaleString('ru-RU');
  formCardPrice[0].querySelector('span').textContent = modifiedPrice;
};
updatePrice();

const increaseOneTimeTotalCost = (cost) => {
  totalOneTime += +cost;
  updatePrice();
};

const decreaseOneTimeTotalCost = (cost) => {
  totalOneTime -= +cost;
  updatePrice();
};
const increasePerMonthTotalCost = (cost) => {
  totalPerMonth += +cost;
  updatePrice();
};

const decreasePerMonthTotalCost = (cost) => {
  totalPerMonth -= +cost;
  updatePrice();
};
export {
  increaseOneTimeTotalCost,
  decreaseOneTimeTotalCost,
  increasePerMonthTotalCost,
  decreasePerMonthTotalCost,
};
