// D3 is included by globally by default

// selections
const clippy = d3.select('.clippy-character');
function resize() {}

function init() {
	const clickable = d3.selectAll('[data-clippy]');
	console.log({ clickable });
}

export default { init, resize };
