import './pudding-chart/overTime-template'

// data
let data = null

// selections
const $overTime = d3.selectAll('.container-over_time')



const fullNames = [{
  short: '6',
  full: 'The Pill'
}, {
  short: '12',
  full: 'Condom'
}, {
  short: '2',
  full: "Partner's Vasectomy"
}, {
  short: '1',
  full: 'Tubal Ligation'
}, {
  short: '21',
  full: 'Withdrawal'
}, {
  short: '5',
  full: 'Depo-Provera'
}, {
  short: '3',
  full: 'Hormonal Implant'
}, {
  short: '20',
  full: 'Calendar Method'
}, {
  short: '19',
  full: 'Sympto-Thermal'
}, {
  short: '11',
  full: 'Diaphragm'
}, {
  short: '10',
  full: "IUD"
}, {
  short: '9',
  full: 'Emergency'
}, {
  short: '7',
  full: 'Patch'
}, {
  short: '8',
  full: 'Vaginal Ring'
}]

const fullNameMap = d3.map(fullNames, d => d.short)

function resize() {}

function cleanData(arr){
  return arr.map((d, i) => {
    return {
      ...d,
      method: d.method,
      calcAge: +d.calcAge,
      percent: +d.percent,
      name: fullNameMap.get(d.method).full
    }
  })
}

function setupChart(){
  const $sel = $overTime
  const nestedData = d3.nest()
    .key(d => d.name)
    .entries(data)

    const mapNest = nestedData.map(d => {
      const first = d.values.shift().percent
      return {key: d.key, values: d.values, first: first}
    })
      .sort((a, b) => d3.descending(a.first, b.first))

  const charts = $sel
    .selectAll('.chart')
    .data(mapNest)
    .enter()
    .append('div.chart')
    .over_time()
}

function init() {
  return new Promise((resolve) => {
    d3.loadData('assets/data/overTime.csv', (err, response) => {
      data = cleanData(response[0])
      setupChart()
      resolve()
    })
  })
}

export default { init, resize };
