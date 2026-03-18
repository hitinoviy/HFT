import {
	decreasePerMonthTotalCost,
	increasePerMonthTotalCost,
} from '../modules/renderCart.js'
import createCheckbox from '../utils/createCheckbox.js'
import createElement from '../utils/createElement.js'

const updateCartPrice = (input, isChecked) => {
	const currentPrice = Number(input.value) * Number(input.dataset.pricePerUnit)
	const previousPrice = Number(input.dataset.lastPrice) || 0

	if (isChecked) {
		decreasePerMonthTotalCost(previousPrice)
		increasePerMonthTotalCost(currentPrice)
	}

	input.dataset.lastPrice = currentPrice
}

const createRange = (data, parentCheckboxId) => {
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

	rangeInput.dataset.pricePerUnit = data.rangeInfo.monthlyCost
	rangeInput.dataset.lastPrice =
		data.rangeInfo.size.min * data.rangeInfo.monthlyCost

	rangeInput.addEventListener('input', e => {
		const value = e.target.value
		rangeTotal.textContent = value

		const card = range.closest('.equipment__item')
		const checkbox = card.querySelector('input[type="checkbox"]')

		const priceDisplay = card.querySelectorAll('.equipment__price')[1]
		const newPrice = value * data.rangeInfo.monthlyCost
		priceDisplay.textContent = `+${newPrice.toLocaleString('ru-RU')} ₽ / мес.`

		updateCartPrice(rangeInput, checkbox.checked)
	})

	const rangeLabels = createElement('div', 'equipment__range-labels')
	for (
		let i = data.rangeInfo.size.min;
		i <= data.rangeInfo.size.max;
		i += data.rangeInfo.size.step
	) {
		const label = createElement('span', null, i)
		rangeLabels.appendChild(label)
	}

	range.append(rangeTitle, rangeTotal, rangeInput, rangeLabels)
	rangeInput.dataset.monthlyCost = data.rangeInfo.monthlyCost
	rangeInput.dataset.lastPrice = 0
	return range
}

const createEquipment = data => {
	const equipmentDiv = createElement('div', 'equipment__item')
	equipmentDiv.dataset.installationCost = data.installationCost

	const equipmentInfo = createElement('div', 'equipment__info')
	const equipmentCheckbox = createCheckbox(data.id)

	equipmentDiv.dataset.monthlyCost =
		data.info.rangeInfo.size.min * data.info.rangeInfo.monthlyCost

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
	const equipmentRange = createRange(data.info, data.id)
	const initialMonthlyPrice = Number(
		equipmentDiv.dataset.monthlyCost,
	).toLocaleString('ru-RU')
	const equipmentRangePrice = createElement(
		'p',
		'equipment__price',
		`+${initialMonthlyPrice} ₽ / мес.`,
	)

	equipmentRangeContainer.append(equipmentRange, equipmentRangePrice)
	equipmentDiv.append(equipmentInfo, equipmentRangeContainer)

	return equipmentDiv
}

const renderEquipments = (data, container) => {
	container.innerHTML = ''
	const equipment1 = createEquipment(data.serverPlacement.MOEXColocationZone)
	container.appendChild(equipment1)
	const equipment2 = createEquipment(data.serverPlacement.FreeZone)
	container.appendChild(equipment2)
}

export default renderEquipments
