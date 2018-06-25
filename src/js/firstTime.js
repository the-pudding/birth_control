import './pudding-chart/firstTime-template'

let data = null

// selections
const $firstTime = d3.selectAll('.firstTime')

function cleanData(arr){
  return arr.map((d, i) => {
    return {
      ...d,
      method: d.method,
      decade: d.decade,
      percent: +d.percent,
    }
  })
}

function setupChart(){
  const $sel = $firstTime
  const charts = $sel
    .selectAll('.graphic-half')
    .datum(data)
    .firstTime()
}

function resize() {}

function init() {
	return new Promise ((resolve) => {
      d3.loadData('assets/data/firstTime.csv', (err, response) => {
        data = cleanData(response[0])
        setupChart()
        resolve()
    })
  })
}
export default { init, resize };
