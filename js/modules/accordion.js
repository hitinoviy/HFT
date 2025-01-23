const toggleAccordion = () => {};

const activateAccordion = () => {
  const accordion = document.querySelectorAll('.accordion');
  accordion.forEach((item) => {
    item.querySelector('.accordion__btn').addEventListener('click', () => {
      item.classList.toggle('accordion__active');
      const container = item.querySelector('.accordion__content');
      if (container.style.maxHeight) {
        container.style.maxHeight = null;
      } else {
        container.style.maxHeight = container.scrollHeight + 'px';
      }
    });
  });
};

export default activateAccordion;
