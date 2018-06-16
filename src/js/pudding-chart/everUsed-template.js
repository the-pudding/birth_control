/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.ever_used = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();

		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 0;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;

		// scales
		const scaleX = null;
		const scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
    let $blocks = null
    let $title = null
    let $sub = null

		// helper functions

		const Chart = {
			// called once at start
			init() {
        $blocks = $sel.append('div.blocks')
        $title = $sel.append('text.title')
        $sub = $sel.append('text.sub')

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				// width = $sel.node().offsetWidth - marginLeft - marginRight;
				// height = $sel.node().offsetHeight - marginTop - marginBottom;
				// $svg.at({
				// 	width: width + marginLeft + marginRight,
				// 	height: height + marginTop + marginBottom
				// });
				return Chart;
			},
			// update scales and render chart
			render() {
        const numbers = [...Array(100).keys()]
        const trueVals = numbers.map(d => {
          let state = null
          if (d < (data.percent)) state = 'true'
          else state = 'false'
          return {number: d, state: state}
        })

        const block = $blocks
          .selectAll('.data-block')
          .data(trueVals)
          .enter()
          .append('div')
          .attr('class', (d, i) => `data-block data-block-${d.state}`)

        $title
          //.data(data)
          .text(data.name)
          .classed('tk-atlas', true)

        $sub
          .text(`${data.percent}%`)
          .classed('tk-atlas', true)


        console.log({trueVals})
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
  console.log({charts})
	return charts.length > 1 ? charts : charts.pop();
};
