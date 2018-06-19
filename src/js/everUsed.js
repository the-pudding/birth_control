import './pudding-chart/everUsed-template'

// data
let data = null

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
}

function init() {
	d3.loadData('assets/data/everused.csv', (err, response) => {
    data = cleanData(response[0])
      .sort((a, b) => d3.descending(a.percent, b.percent))
    setupChart()
  })
}

export default { init, resize };
