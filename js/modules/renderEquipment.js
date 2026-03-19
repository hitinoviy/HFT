import {
	decreasePerMonthTotalCost,
	increasePerMonthTotalCost,
} from '../modules/renderCart.js'
import createCheckbox from '../utils/createCheckbox.js'
import createElement from '../utils/createElement.js'

const updateCartPrice = (input, isChecked) => {
	const currentPrice = Number(input.value) * Number(input.dataset.monthlyCost)
	const previousPrice = Number(input.dataset.lastPrice) || 0

	if (isChecked) {
		const diff = currentPrice - previousPrice
		if (diff > 0) increasePerMonthTotalCost(diff)
		else if (diff < 0) decreasePerMonthTotalCost(Math.abs(diff))
	}
	input.dataset.lastPrice = currentPrice
}

const createRange = data => {
	const range = createElement('div', 'equipment__range')
	const rangeTitle = createElement('p', 'equipment__range-title', data.name)
	const rangeTotal = createElement(
		'p',
		'equipment__range-total',
		data.rangeInfo.size.min,
	)
	const rangeInput = createElement('input', 'equipment__range-slider')

	rangeInput.type = 'range'
	rangeInput.min = data.rangeInfo.size.min
	rangeInput.max = data.rangeInfo.size.max
	rangeInput.value = data.rangeInfo.size.min
	rangeInput.step = data.rangeInfo.size.step

	rangeInput.dataset.monthlyCost = data.rangeInfo.monthlyCost
	rangeInput.dataset.lastPrice =
		data.rangeInfo.size.min * data.rangeInfo.monthlyCost

	rangeInput.addEventListener('input', e => {
		const value = e.target.value
		rangeTotal.textContent = value
		const card = range.closest('.equipment__item')
		const checkbox = card.querySelector('input[type="checkbox"]')
		const priceDisplay = card.querySelectorAll('.equipment__price')[1]

		const currentPrice = Number(value) * Number(rangeInput.dataset.monthlyCost)
		if (priceDisplay)
			priceDisplay.textContent = `+${currentPrice.toLocaleString('ru-RU')} ₽ / мес.`

		updateCartPrice(rangeInput, checkbox.checked)
	})

	const rangeLabels = createElement('div', 'equipment__range-labels')
	for (
		let i = data.rangeInfo.size.min;
		i <= data.rangeInfo.size.max;
		i += data.rangeInfo.size.step
	) {
		rangeLabels.append(createElement('span', null, i))
	}
	range.append(rangeTitle, rangeTotal, rangeInput, rangeLabels)
	return range
}

const createEquipment = data => {
	const equipmentDiv = createElement('div', 'equipment__item')
	equipmentDiv.dataset.installationCost = data.installationCost

	const equipmentInfo = createElement('div', 'equipment__info')
	const equipmentCheckbox = createCheckbox(data.name)

	const equipmentSubInfo = createElement('div', 'equipment__sub-info')
	const equipmentInfoTitle = createElement(
		'h3',
		'equipment__info-title',
		data.name,
	)
	const equipmentPriceInstal = createElement(
		'p',
		'equipment__price',
		`+${data.installationCost.toLocaleString('ru-RU')} ₽ за монтаж`,
	)

	equipmentSubInfo.append(equipmentInfoTitle, equipmentPriceInstal)
	equipmentInfo.append(equipmentCheckbox, equipmentSubInfo)

	const equipmentRangeContainer = createElement('div', 'equipment__info')
	const rangeElement = createRange(data.info)

	const initialPrice =
		data.info.rangeInfo.size.min * data.info.rangeInfo.monthlyCost
	const equipmentRangePrice = createElement(
		'p',
		'equipment__price',
		`+${initialPrice.toLocaleString('ru-RU')} ₽ / мес.`,
	)

	equipmentRangeContainer.append(rangeElement, equipmentRangePrice)
	equipmentDiv.append(equipmentInfo, equipmentRangeContainer)

	return equipmentDiv
}

const renderEquipments = (data, container) => {
	container.innerHTML = ''
	if (data.serverPlacement) {
		container.appendChild(
			createEquipment(data.serverPlacement.MOEXColocationZone),
		)
		container.appendChild(createEquipment(data.serverPlacement.FreeZone))
	}
}
export default renderEquipments
