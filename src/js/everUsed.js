import './pudding-chart/everUsed-template'

// data
let data = null
let titleInterval = null

// selections
const $everUsed = d3.selectAll('.container-ever_used')

const fullNames = [{
  short: 'CONDOM',
  full: 'condom'
}, {
  short: 'DEPOPROV',
  full: 'Depo-Provera'
}, {
  short: 'IUD',
  full: 'IUD'
}, {
  short: 'MORNPILL',
  full: 'Emergency Contraception'
}, {
  short: 'PATCH',
  full: 'Patch'
}, {
  short: 'PILL',
  full: 'The Pill'
}, {
  short: 'RHYTHM',
  full: 'Calendar Method'
}, {
  short: 'RING',
  full: 'Vaginal Ring'
}, {
  short: 'SDAYCBDS',
  full: 'Standard Days'
}, {
  short: 'TEMPSAFE',
  full: 'Sympto-Thermal Method'
}, {
  short: 'VASECTMY',
  full: "Partner's Vasectomy"
}, {
  short: 'WIDRAWAL',
  full: "Withdrawal"
}]

function titleSpin(){
	const spin = d3.select('#titleMethod')

	const methodsList = ['Condoms',
		'The Pill',
		'Withdrawal',
		'Depo-Provera',
		'Emergency Contraception',
		'Calendar Method',
		'The Patch',
		'Vasectomy',
		'The Vaginal Ring',
    'IUDs',
    'The Sympto-Thermal Method',
    'The Standard Days Method',
    'Hormonal Implants',
    'Sterilization']

	const max = methodsList.length
	let i = 0

	titleInterval = setInterval(function(elapsed){
		spin
			.style('opacity', 0)
			.style('transform', 'translateX(10px)')
			.text(methodsList[i])

			.transition()
			.duration(200)
			.style('transform', 'translateX(0px)')
			.style('opacity', 1)

			.on('end', function(d){
				d3.select(this)
					.transition()
					.duration(200)
					.delay(1000)
					.style('opacity', 0)
					.style('transform', 'translateX(-10px)')

			})
		i++
		if( i > (max - 1)){
			i = 0
		}
	}, 1600)

}

const fullNameMap = d3.map(fullNames, d => d.short)

function resize() {}

function cleanData(arr){
  return arr.map((d, i) => {
    return {
      ...d,
      cleanMethod: d.cleanMethod,
      usage: d.usage,
      count: +d.count,
      percent: +d.percent,
      name: fullNameMap.get(d.cleanMethod).full
    }
  })
}

function setupChart(){
  const $sel = $everUsed
  const charts = $sel
    .selectAll('.chart')
    .data(data)
    .enter()
    .append('div.chart')
    .ever_used()

    const test = d3.selectAll('[data-clippy]')
    console.log({test})
}

function init() {
	return new Promise((resolve) => {
    d3.loadData('assets/data/everused.csv', (err, response) => {
      data = cleanData(response[0])
        .sort((a, b) => d3.descending(a.percent, b.percent))
      setupChart()
      titleSpin()
      resolve()
    })
  })
}

export default { init, resize };
