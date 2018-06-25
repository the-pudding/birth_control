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

  const details = copy[`${name}`]
  console.log({details})

  info
    .classed('active', true)

  info.select('.info-title')
    .text(name)

  info.select('.info-def')
    .text(details.definition)

  info.select('.info-prose-eff')
    .text(`${details.effectiveness} effective at preventing pregnancy`)

  info.select('.info-prose-how')
    .text(details.how)

  info.select('.link')
    .attr('href', details.learn)

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
    copy = response[0]
    console.log({copy})
  })

	const clickable = d3.selectAll('[data-clippy]')
    .on('click', handleClick);

  close
    .on('click', closeInfo)
	console.log({ clickable });
}

export default { init, resize };
