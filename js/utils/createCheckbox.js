import {
	decreaseOneTimeTotalCost,
	decreasePerMonthTotalCost,
	increaseOneTimeTotalCost,
	increasePerMonthTotalCost,
} from '../modules/renderCart.js'

const toCamelCase = str => {
	if (!str) return 'id-' + Math.random()
	return str.split(' ').map((word, index) =>
		index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	).join('')
}

const createCheckbox = (name, disabled) => {
	const id = toCamelCase(name)
	const div = document.createElement('div')
	div.classList.add('item__checkbox')

	const input = document.createElement('input')
	input.type = 'checkbox'
	input.id = id
	if (disabled) input.disabled = disabled

	input.addEventListener('change', e => {
		const isChecked = e.target.checked
		const item = e.target.closest('.equipment__item') || e.target.closest('.item')
		if (!item) return

		const instCost = Number(item.dataset.installationCost) || 0
		const sliders = item.querySelectorAll('.equipment__range-slider')
		
		// Проверка: это виртуальная машина или обычное оборудование?
		// У виртуалок есть специфический контент, у оборудования — слайдеры напрямую
		const isVirtual = item.querySelector('.equipment__content') 

		// 1. Разовая оплата (Монтаж)
		if (isChecked) {
			if (instCost) increaseOneTimeTotalCost(instCost)
		} else {
			if (instCost) decreaseOneTimeTotalCost(instCost)
		}

		// 2. Ежемесячная оплата (Оборудование / MOEX)
		if (!isVirtual && sliders.length > 0) {
			sliders.forEach(slider => {
				const currentSliderPrice = Number(slider.dataset.lastPrice) || 0
				if (isChecked) {
					increasePerMonthTotalCost(currentSliderPrice)
				} else {
					decreasePerMonthTotalCost(currentSliderPrice)
				}
			})
		}

		// 3. Сигнал для Виртуалок (у них своя логика в renderVirtual.js)
		item.dispatchEvent(new CustomEvent('checkboxChange', { detail: { isChecked } }))
	})

	const label = document.createElement('label')
	label.htmlFor = id
	div.append(input, label)
	return div
}
export default createCheckbox