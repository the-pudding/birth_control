/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.over_time = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();

		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 10;
		const marginBottom = 25;
		const marginLeft = 25;
		const marginRight = 10;

		// scales
		const scaleX = d3.scaleLinear();
		const scaleY = d3.scaleLinear();
		const area = d3.area()
		const line = d3.line()


		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
    let $blocks = null
    let $title = null
    let $sub = null
		let $method = null

		// helper functions

		const Chart = {
			// called once at start
			init() {
				$sel.at('data-clippy', data.key)
					.style('cursor', 'pointer')
				$method = $sel.append('div.title')

        $svg = $sel.append('svg.overTime-chart');
				const $g = $svg.append('g');

				// offset chart for margins
				$g.at('transform', `translate(${marginLeft}, ${marginTop})`);

				// create axis
				$axis = $g.append('g.g-axis');

				// setup viz group
				$vis = $g.append('g.g-vis');
        // $blocks = $sel.append('div.blocks')
        // $title = $sel.append('text.title')
        // $sub = $sel.append('text.sub')

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - (marginLeft * 2) - (marginRight * 2);
				height = $sel.node().offsetHeight - (marginTop * 2) - (marginBottom * 2);
				$svg.at({
					width: width + marginLeft + marginRight,
					height: height + marginTop + marginBottom
				});

				scaleX
					.domain([15, 45])
					.rangeRound([0, width])

				scaleY
					.domain([0, 40])
					.rangeRound([height, 0])

				return Chart;
			},
			// update scales and render chart
			render() {
				$method
					.append('text')
					.text(data.key)

				area
					.x(d => scaleX(d.calcAge))
					.y0(height)
					.y1(d => scaleY(d.percent))

				line
					.x(d => scaleX(d.calcAge))
					.y(d => scaleY(d.percent))

				const yAxis = $axis.append('g')
					.attr('class', 'axis-y axis')
					.call(d3.axisLeft(scaleY)
						.ticks(3)
						.tickSize(-width)
						.tickSizeOuter(0)
						.tickPadding(5)
						.tickFormat(d => `${d}%`)
					)

				const xAxis = $axis.append('g.axis-x')
					.attr('transform', `translate(0, ${height + 2})`)
					.selectAll('.axis-x-values')
					.data([15, 'Age', 45])



				xAxis
					.enter()
					.append('text')
					.attr('class', 'axis-x-values')
					.text(d => d)
					.attr('transform', d => {
						let amount = null
						if (d == 'Age') amount = 30
						else amount = d
						return `translate(${scaleX(amount)}, 0)`
					})
					.attr('text-anchor', 'middle')
					.attr('alignment-baseline', 'hanging')



				const areaGraphic = $vis
					.append('path')
					.data([data.values])
					.attr('class', 'area overTime-area')
					.attr('d', area)

				$vis
					.append('path')
					.data([data.values])
					.attr('class', 'line overTime-line')
					.attr('d', line)

				return Chart;
			},
			// get / set data
			data(val) {
				if (!arguments.length) return data;
				data = val;
				$sel.datum(data);
				Chart.render();
				return Chart;
			}
		};
		Chart.init();

		return Chart;
	}

	// create charts
	const charts = this.nodes().map(createChart);

	return charts.length > 1 ? charts : charts.pop();
};
