// D3 is included by globally by default

// selections
const clippy = d3.select('.clippy-character');
const info = d3.select('.info-container')
const dim = d3.select('.clippy-dim')
const close = d3.select('.close-info')

let copy = null

function resize() {}

function handleClick(){
  const sel = d3.select(this)
  const name = sel.at('data-clippy').toLowerCase()

  info
    .classed('active', true)

  clippy
    .classed('hiding', false)

  dim
    .classed('active', true)
  console.log({sel, name})
}

function closeInfo(){
  info
    .classed('active', false)

  clippy
    .classed('hiding', true)

  dim
    .classed('active', false)
}

function init() {
  d3.loadData('assets/data/methods.json', (err, response) => {
    copy = response
    console.log({response})
  })

	const clickable = d3.selectAll('[data-clippy]')
    .on('click', handleClick);

  close
    .on('click', closeInfo)
	console.log({ clickable });
}

export default { init, resize };
