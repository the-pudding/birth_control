/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.firstTime = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();

    let nestedData = null
		// dimension stuff
		let width = 240;
		let height = 260;
		const marginTop = 20;
		const marginBottom = 10;
		const marginLeft = 35;
		const marginRight = 35;

		// scales
		const scaleX = d3.scaleBand()
		const scaleY = d3.scaleLinear()
    const line = d3.line()


		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;

		// helper functions

		const Chart = {
			// called once at start
			init() {
				$svg = $sel.append('svg.firstTime-chart');
				const $g = $svg.append('g');

				// offset chart for margins
				$g.at('transform', `translate(${marginLeft}, ${marginTop})`);

				// create axis
				$axis = $g.append('g.g-axis');

				// setup viz group
				$vis = $g.append('g.g-vis');

        // setup data

        nestedData = d3.nest()
          .key(d => d.method)
          .entries(data)

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
        width = $sel.node().offsetWidth - marginLeft - marginRight;
        height = $sel.node().offsetHeight - marginTop - marginBottom;
				$svg.at({
					width: width + marginLeft + marginRight,
					height: height + marginTop + marginBottom
				});

        const graphicH = height - marginBottom - marginTop
        scaleX
          .domain(["70's", "80's", "90's", "00's", "10's"])
          .rangeRound([0, width - marginRight])

        scaleY
          .domain([0, 80])
          .range([graphicH, 0])

				return Chart;
			},
			// update scales and render chart
			render() {
        line
          .x(d => scaleX(d.decade))
          .y(d => scaleY(d.percent))

        // x-axis
        const xAxis = $axis.append('g')
          .attr('transform', `translate(${-marginLeft + 10}, ${height - marginBottom - marginTop})`)
          .attr('class', 'axis-x axis')
          .call(d3.axisBottom(scaleX)
            .tickSize(0, 0)
            .tickSizeInner(0)
            .tickSizeOuter(0)
            .tickPadding(10)
          )

        const yAxis = $axis.append('g')
          .attr('class', 'axis-y axis')
          .call(d3.axisLeft(scaleY)
            .ticks(4)
            .tickSize(-width + marginLeft + marginRight)
            //.tickSizeInner(0)
            .tickPadding(10)
            .tickFormat(d => `${d}%`)
          )


        const lineGroups = $vis
          .selectAll('.groups-firstTime')
          .data(nestedData)
          .enter()
          .append('g')
          .attr('class', 'groups-firstTime')
					.at('data-clippy', d => {
						let label = null
						if (d.key == 3) label = "Condoms"
						else if (d.key == 4) label = "The Pill"
						else if (d.key == 8) label = "Depo-Provera"
						else label = null
						return label
					})

        lineGroups
          .append('path')
          .attr('class', d => `line-firstTime line line-${d.key}`)
          .attr('d', d => line(d.values))

        lineGroups
          .append('text')
          .attr('class', d => `label-firstTime label label-${d.key}`)
          .text(d => {
            let label = null
            if (d.key == 3) label = "Condoms"
            else if (d.key == 4) label = "The Pill"
            else if (d.key == 8) label = "Depo-Provera"
            else label = null
            return label
          })
          .attr('transform', d => {
            const last = d.values.pop()
            return `translate(${scaleX("10's") + 5}, ${scaleY(last.percent)})`
          })
          .attr('alignment-baseline', 'middle')


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
