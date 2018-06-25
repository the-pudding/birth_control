// D3 is included by globally by default

// selections
const clippy = d3.select('.clippy-character')
const clickable = d3.selectAll('[data-clippy]')


function resize() {}

function init() {
	console.log({clickable});
  console.log("clippy ran")
}

export default { init, resize };
