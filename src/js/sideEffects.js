import './pudding-chart/sideEffects-template'

let data = null

// selections
const $sideEffects = d3.selectAll('.sideEffects')

let charts = null

const generalReasons = [{
  number: 3,
  label: 'too difficult to use'
}, {
  number: 5,
  label: 'partner did not like it'
}, {
  number: 6,
  label: 'side effects'
}, {
  number: 7,
  label: 'worried about side effects'
}, {
  number: 8,
  label: 'worried it would fail'
}, {
  number: 9,
  label: 'method failed'
}, {
  number: 12,
  label: 'decreased sexual pleasure'
}, {
  number: 14,
  label: 'changes to menstrual cycle'
}, {
  number: 15,
  label: 'other'
}]


const specificReasons = [{
  method: 'Condom',
  values: [{
    number: 1,
    label: 'allergy'
  }, {
    number: 2,
    label: "didn't like it"
  }, {
    number: 3,
    label: 'pain or discomfort'
  }, {
    number: 5,
    label: 'worried it would fail'
  }, {
    number: 9,
    label: 'other'
  }]
}, {
  method: 'Depo-Provera',
  values: [{
    number: 1,
    label: 'weight gain'
  }, {
    number: 2,
    label: 'bleeding problems'
  }, {
    number: 4,
    label: 'mood swings/depression'
  }, {
    number: 5,
    label: 'hair loss/growth'
  }, {
    number: 15,
    label: 'other'
  }]
}, {
  method: 'IUD',
  values: [{
    number: 2,
    label: 'bleeding problems'
  }, {
    number: 6,
    label: 'vaginal infection'
  }, {
    number: 7,
    label: 'abdominal pain/cramping'
  }, {
    number: 11,
    label: 'IUD moved/was expelled'
  }, {
    number: 12,
    label: 'other'
  }]
}, {
  method: 'The Pill',
  values: [{
    number: 1,
    label: "Can't remember to take it"
  }, {
    number: 3,
    label: "weight gain"
  }, {
    number: 5,
    label: 'mood swings/depression'
  }, {
    number: 6,
    label: 'bleeding problems'
  }, {
    number: 8,
    label: 'nausea/sickness'
  }]
}]




//const fullNameMap = d3.map(fullNames, d => d.short)

function cleanData(arr){
  return arr.map((d, i) => {
    return {
      ...d,
      stopMethod: d.stopMethod,
      reason: +d.reason,
      total: +d.total,
      percent: +d.percent,
      type: d.type
    }
  })
}

function findReason(type, method, number){
  const generalMap = d3.map(generalReasons, d => d.number)

  if (type == 'general'){
    return generalMap.get(number).label
  }

  else if (type == 'specific') {
    const reas = specificReasons.filter(d => d.method == method)
    const specificMap = d3.map(reas[0].values, d => d.number)

    return specificMap.get(number).label
  }

}

function setupChart(){

  const fullData = data.map(d => {
    return {
      ...d,
      label: findReason(d.type, d.stopMethod, d.reason)
    }
  })

  const $sel = $sideEffects
  const container = $sel.selectAll('.container-sideEffects')

  const type = container.at('data-type')
  const typeData = fullData.filter(d => d.type == type)

  const nested = d3.nest()
    .key(d => d.stopMethod)
    .entries(typeData)

  const charts = container
    .selectAll('.chart')
    .data(nested)
    .enter()
    .append('div.chart')
    .sideEffects()
}

function resize() {
  charts.resize()
  charts.render()
}

function init() {
	d3.loadData('assets/data/sideEffects.csv', (err, response) => {
    data = cleanData(response[0])
    setupChart()
  })
}
export default { init, resize };
