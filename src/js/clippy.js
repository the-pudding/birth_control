// D3 is included by globally by default
import enterView from 'enter-view';

// selections
const clippy = d3.select('.clippy-character');
const info = d3.select('.info-container')
const dim = d3.select('.clippy-dim')
const close = d3.select('.close-info')
const welcome = d3.select('.clippy-speech')
const arrow = d3.select('.info-container-arrow')

let copy = null

function setupEnter() {
	enterView({
		selector: '#clippy-welcome',
		offset: 0,
		once: false,
		enter(el) {
			welcome.classed('active', true)
		},
		exit(el) {
			welcome.classed('active', false)
		}
	});
}
function resize() {}

function handleClick(){
  const sel = d3.select(this)
  const name = sel.at('data-clippy').toLowerCase()

	// Making sure info is scrolled to top
	const scroll = info.select('.simplebar-scroll-content')

	const node = scroll.node()

	node.scrollTop = 0

  const methodNames = ['condom', 'pill', 'withdrawal', 'depo-provera', 'calendar', 'patch', 'vasectomy', 'ring', 'iud', 'thermal', 'standard', 'tubal', 'emergency', 'hormonal implant', 'diaphragm']

  const justNames = methodNames.map(d => {
    const incl = name.includes(d)
    return {name: d, includes: incl}
  })
    .filter(d => d.includes === true)[0]

  const details = copy[`${justNames.name}`]

  welcome.classed('active', false)

  info
    .classed('active', true)

  info.select('.info-title')
    .text(name)

  info.select('.info-def')
    .text(details.definition)

  info.select('.info-prose-cost')
    .text(details.cost)

  info.select('.info-prose-eff')
    .text(`${details.effectiveness} effective at preventing pregnancy`)

  info.select('.info-prose-how')
    .text(details.how)

  info.select('.link')
    .attr('href', details.learn)

  info.select('.info-img')
    .attr('src', `assets/images/${details.img}.png`)

  clippy
    .classed('hiding', false)

  dim
    .classed('active', true)

	close
		.classed('active', true)

	arrow
		.classed('active', true)
}

function closeInfo(){
  info
    .classed('active', false)

  clippy
    .classed('hiding', true)

  dim
    .classed('active', false)

	close
		.classed('active', false)

	arrow
		.classed('active', false)
}

function init() {
  d3.loadData('assets/data/methods.json', (err, response) => {
    copy = response[0]
    setupEnter()
  })

	const clickable = d3.selectAll('[data-clippy]')
    .on('click', handleClick);

  close
    .on('click', closeInfo)

  const closeWelcome = welcome.select('.welcome-close span')
    .on('click', d => {
      welcome.classed('active', false)
    })

	dim
		.on('click', closeInfo)
}

export default { init, resize };
