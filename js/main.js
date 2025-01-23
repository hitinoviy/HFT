import getData from './data.js';
import renderEquipments from './modules/renderEquipment.js';
import renderMarket from './modules/renderMarket.js';
import renderVirtual from './modules/renderVirtual.js';
import activateAccordion from './modules/accordion.js';

window.addEventListener('DOMContentLoaded', async () => {
  activateAccordion();

  const marketContainer = document.querySelector('.market');

  const data = await getData();

  const { market, equipment } = data;

  const equipmentContainer = document.querySelectorAll('.equipment__card');

  renderMarket(market, marketContainer);
  renderEquipments(equipment, equipmentContainer[0]);
  renderVirtual(equipment.virtualMachine.MOEXColocationZone, equipmentContainer[1]);
});
