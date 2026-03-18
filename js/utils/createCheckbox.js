import {
	decreaseOneTimeTotalCost,
	decreasePerMonthTotalCost,
	increaseOneTimeTotalCost,
	increasePerMonthTotalCost,
} from '../modules/renderCart.js'

const toCamelCase = str => {
	return str
		.split(' ')
		.map((word, index) =>
			index === 0
				? word.toLowerCase()
				: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
		)
		.join('')
}

const updateInternalCheckboxes = e => {
	const item = e.target.closest('.item')
	if (item) {
		const subItem = item.querySelector('.item__sub-item')
		if (subItem) {
			const internalCheckboxes = subItem.querySelectorAll(
				'input[type="checkbox"]',
			)
			const isChecked = e.target.checked
			internalCheckboxes.forEach(checkbox => {
				checkbox.disabled = !isChecked
				if (!isChecked) {
					const subItemElement = checkbox.closest('.item')
					if (
						subItemElement &&
						subItemElement.dataset.monthlyCost &&
						checkbox.checked
					) {
						decreasePerMonthTotalCost(
							Number(subItemElement.dataset.monthlyCost) || 0,
						)
					}
					checkbox.checked = false
				}
			})
		}
	}
}

const createCheckbox = (name, disabled) => {
	const id = toCamelCase(name)

	const div = document.createElement('div')
	div.classList.add('item__checkbox')

	const input = document.createElement('input') // Вот определение input
	input.type = 'checkbox'
	input.id = id
	input.name = id
	if (disabled) input.disabled = disabled

	input.addEventListener('change', e => {
		const isChecked = e.target.checked
		const item =
			e.target.closest('.item') || e.target.closest('.equipment__item')

		if (!item) return

		// Если у элемента НЕТ внутренних ползунков — считаем его здесь (простые услуги)
		const sliders = item.querySelectorAll('.equipment__range-slider')
		if (sliders.length === 0) {
			const instCost = Number(item.dataset.installationCost) || 0
			const baseMonthlyCost = Number(item.dataset.monthlyCost) || 0

			if (isChecked) {
				if (instCost) increaseOneTimeTotalCost(instCost)
				if (baseMonthlyCost) increasePerMonthTotalCost(baseMonthlyCost)
			} else {
				if (instCost) decreaseOneTimeTotalCost(instCost)
				if (baseMonthlyCost) decreasePerMonthTotalCost(baseMonthlyCost)
			}
		}

		// Всегда уведомляем внешние скрипты (для виртуалки)
		item.dispatchEvent(
			new CustomEvent('checkboxChange', { detail: { isChecked } }),
		)
	})

	input.addEventListener('change', updateInternalCheckboxes)

	const label = document.createElement('label')
	label.htmlFor = id
	div.append(input, label)

	return div
}

// ОБЯЗАТЕЛЬНО В КОНЦЕ
export default createCheckbox
