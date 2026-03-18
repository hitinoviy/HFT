import {
	decreasePerMonthTotalCost,
	increasePerMonthTotalCost,
} from '../modules/renderCart.js'
import createCheckbox from '../utils/createCheckbox.js'
import createElement from '../utils/createElement.js'

const updateComponentPrice = (element, newPrice, isChecked) => {
	const lastPrice = Number(element.dataset.lastPrice) || 0
	if (isChecked) {
		decreasePerMonthTotalCost(lastPrice)
		increasePerMonthTotalCost(newPrice)
	}
	element.dataset.lastPrice = newPrice
}

const changePriceMonth = rangeBlock => {
	const rangeContainer = rangeBlock.closest('.equipment__info')
	const rangeInput = rangeBlock.querySelector('.equipment__range-slider')
	const priceDisplay = rangeContainer.querySelector('.equipment__price')
	const item = rangeBlock.closest('.equipment__item')
	const checkbox = item.querySelector('input[type="checkbox"]')

	let totalPrice =
		Number(rangeInput.value) * Number(rangeInput.dataset.monthlyCost)

	if (rangeBlock.id === 'storage') {
		totalPrice = totalPrice / 60
	}

	priceDisplay.textContent = `+${totalPrice.toLocaleString('ru-RU')} ₽ / мес.`
	updateComponentPrice(rangeInput, totalPrice, checkbox.checked)
}

const createRange = data => {
	const range = createElement('div', 'equipment__range')
	range.id = data.id
	const rangeTitle = createElement('p', 'equipment__range-title', data.name)
	const rangeTotal = createElement(
		'p',
		'equipment__range-total',
		`${data.rangeInfo.size.min} ${data.rangeInfo.nameCurrentValue}`,
	)
	const rangeInput = createElement('input', 'equipment__range-slider')

	rangeInput.type = 'range'
	rangeInput.min = data.rangeInfo.size.min
	rangeInput.max = data.rangeInfo.size.max
	rangeInput.value = data.rangeInfo.size.min
	rangeInput.step = data.rangeInfo.size.step
	rangeInput.dataset.monthlyCost = data.rangeInfo.monthlyPrice
	rangeInput.dataset.installationCost = data.rangeInfo.installationCost
	rangeInput.dataset.lastPrice = 0

	rangeInput.addEventListener('input', e => {
		rangeTotal.textContent = `${e.target.value} ${data.rangeInfo.nameCurrentValue}`
		changePriceMonth(range)
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

const createSelect = osData => {
	const select = createElement('select', 'equipment__select')

	const fillOptions = data => {
		select.innerHTML = ''
		data.versions.forEach(v => {
			const option = createElement('option', 'equipment__option', v.version)
			option.value = v.monthlyPrice
			select.append(option)
		})
	}

	fillOptions(osData)
	select.dataset.lastPrice = 0

	select.addEventListener('change', e => {
		const item = select.closest('.equipment__item')
		const checkbox = item.querySelector('input[type="checkbox"]')
		const priceDisplay = select
			.closest('.equipment__sub-info')
			.querySelector('.equipment__price')
		const newPrice = Number(e.target.value)

		priceDisplay.textContent = `${newPrice.toLocaleString('ru-RU')} ₽ / мес.`
		updateComponentPrice(select, newPrice, checkbox.checked)
	})

	return select
}

const createToggler = (data, selectComponent) => {
	const cardToggle = createElement('div', 'equipment__toggle')
	const cardSwitcher = createElement('div', 'equipment__switcher')

	data.forEach((os, index) => {
		const radio = createElement('input')
		radio.type = 'radio'
		radio.name = 'os_virtual'
		radio.id = os.name
		radio.value = index
		radio.checked = index === 0

		radio.addEventListener('change', () => {
			const selectedOS = data[radio.value]
			selectComponent.innerHTML = ''
			selectedOS.versions.forEach(v => {
				const option = createElement('option', 'equipment__option', v.version)
				option.value = v.monthlyPrice
				selectComponent.append(option)
			})
			selectComponent.dispatchEvent(new Event('change'))
		})

		const label = createElement('label', null, os.name)
		label.htmlFor = os.name

		cardToggle.append(radio)
		cardSwitcher.append(label)
	})

	cardToggle.append(cardSwitcher)
	return cardToggle
}

const createRangeContainer = data => {
	const container = createElement('div', 'equipment__info')
	const range = createRange(data)
	const price = createElement('p', 'equipment__price', `+0 ₽ / мес.`)
	container.append(range, price)
	return container
}

const createVirtualItem = data => {
	const item = createElement('div', 'equipment__item')
	item.dataset.monthlyCost = data.monthlyCost
	item.dataset.installationCost = data.installationCost

	const info = createElement('div', 'equipment__info')
	const checkbox = createCheckbox(data.name)

	const nameBlock = createElement('div', 'equipment__name')
	nameBlock.append(
		createElement('h3', 'equipment__title', data.name),
		createElement('h4', 'equipment__sub-title', data.subName),
	)

	info.append(checkbox, nameBlock)
	item.append(info)
	return item
}

const renderVirtual = (data, container) => {
	container.innerHTML = ''
	const item = createVirtualItem(data)
	const content = createElement('div', 'equipment__content')

	const cardInfo = createElement('div', 'equipment__sub-info')
	const cardChoice = createElement('div', 'equipment__choice')
	const cardSelect = createSelect(data.operatingSystems[0])
	const cardToggle = createToggler(data.operatingSystems, cardSelect)

	cardChoice.append(cardToggle, cardSelect)
	cardInfo.append(
		cardChoice,
		createElement('p', 'equipment__price', `0 ₽ / мес.`),
	)

	content.append(
		cardInfo,
		createRangeContainer(data.cpu),
		createRangeContainer(data.ram),
		createRangeContainer(data.storage),
	)
	item.append(content)
	container.append(item)

	const sliders = item.querySelectorAll('.equipment__range-slider')
	const select = item.querySelector('.equipment__select')

	if (sliders) {
		sliders.forEach(input => {
			const rangeBlock = input.closest('.equipment__range')
			let startPrice = Number(input.value) * Number(input.dataset.monthlyCost)
			if (rangeBlock && rangeBlock.id === 'storage') startPrice /= 60

			input.dataset.lastPrice = startPrice
			const priceLabel = rangeBlock
				?.closest('.equipment__info')
				?.querySelector('.equipment__price')
			if (priceLabel)
				priceLabel.textContent = `+${startPrice.toLocaleString('ru-RU')} ₽ / мес.`
		})
	}

	if (select) {
		const osPrice = Number(select.value)
		select.dataset.lastPrice = osPrice
		const osPriceLabel = select
			.closest('.equipment__sub-info')
			?.querySelector('.equipment__price')
		if (osPriceLabel)
			osPriceLabel.textContent = `${osPrice.toLocaleString('ru-RU')} ₽ / мес.`
	}

	item.addEventListener('checkboxChange', e => {
		const isChecked = e.detail.isChecked

		const currentSliders = item.querySelectorAll('.equipment__range-slider')
		currentSliders.forEach(slider => {
			const mPrice = Number(slider.dataset.lastPrice) || 0
			if (isChecked) {
				increasePerMonthTotalCost(mPrice)
			} else {
				decreasePerMonthTotalCost(mPrice)
			}
		})

		const currentSelect = item.querySelector('.equipment__select')
		const osMPrice = Number(currentSelect.dataset.lastPrice) || 0
		if (isChecked) {
			increasePerMonthTotalCost(osMPrice)
		} else {
			decreasePerMonthTotalCost(osMPrice)
		}
	})
}
export default renderVirtual
