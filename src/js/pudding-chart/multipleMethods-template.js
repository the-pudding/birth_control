/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.multipleMethods = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
    console.log({data})

    let nestedData = null
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 30;
		const marginBottom = 10;
		const marginLeft = 230;
		const marginRight = 10;
    const numBars = 10
    const numPadding = 10
    const barHeight = 15
    const paddingHeight = 15

    // colors
    const low = '#DDB2C2'
    const mid = '#C169D4'
    const high = '#A841EA'

		// scales
		const scaleX = d3.scaleLinear()
		const scaleY = d3.scaleBand()
    const scaleColor = d3.scaleOrdinal()

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
    let barGroups = null

		// helper functions

		const Chart = {
			// called once at start
			init() {
				$svg = $sel.append('svg.multipleMethods-chart');
				const $g = $svg.append('g');

				// offset chart for margins
				$g.at('transform', `translate(${marginLeft}, ${marginTop})`);

				// create axis
				$axis = $g.append('g.g-axis');

				// setup viz group
				$vis = $g.append('g.g-vis');

        barGroups = $vis
          .selectAll('.g-bar')
          .data(data)
          .enter()
          .append('g')
          .attr('class', 'g-bar')

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
        width = $sel.node().offsetWidth - marginLeft - marginRight;
        height = (barHeight * numBars) + (paddingHeight * numPadding)

        console.log({height})

				$svg.at({
					width: width + marginLeft + marginRight,
					height: height + marginTop + marginBottom
				});

        scaleX
          .domain([0, d3.max(data, d => d.uniqueR)])
          .range([0, width - marginRight])

        scaleColor
          .domain(["72 - 87%", "88 - 98%", ">99%"])
          .range([low, mid, high])

				return Chart;
			},
			// update scales and render chart
			render() {

        const bars =  barGroups
          .selectAll('.bar')
          .data(d => [d])

        const barsEnter = bars
          .enter()
          .append('rect')
          .attr('class', 'bar')

        bars.exit().remove

        const barsMerge = barsEnter.merge(bars)
          .attr('width', d => scaleX(d.uniqueR))
          .attr('height', barHeight)
          .attr('transform', `translate(10, 0)`)

        const labels = barGroups
          .selectAll('.g-label')
          .data(d => [d])

        const labelsEnter = labels
          .enter()
          .append('g')


        labels.exit().remove

        const labelsMerge = labelsEnter.merge(labels)
          .attr('class', 'g-label')
          .attr('text-anchor', 'end')
          .attr('alignment-baseline', 'hanging')

        labelsMerge
          .append('text')
          .attr('class', 'label label-1')
          .text(d => d.name1)

        labelsMerge
          .append('text')
          .attr('class', 'label label-symbol')
          .text(' + ')

        labelsMerge
          .append('text')
          .attr('class', 'label label-2')
          .text(d => d.name2)
        // const labelsMerge = labelsEnter.merge(labels)
        //   //.text(d => `${d.name1} + ${d.name2}`)
        //   .append('tspan')
        //   .text(d => d.name1)
        //   .attr('dy', barHeight)
        //   .attr('background-color', 'red')
        //   .append('tspan')
        //   .text('+')
        //   .append('tspan')
        //   .text(d => d.name2)
        // .attr('text-anchor', 'end')
        // .attr('alignment-baseline', 'hanging')

      // const t = barGroups.selectAll('tspan')
      //
      // console.log({t})
      // t
      //   .attr('transform', d => `translate(0, ${barHeight}px)`)

        barGroups
          .attr('transform', (d, i) => `translate(0, ${i * (barHeight + paddingHeight)})`)

        const barsMove = barGroups.selectAll('.bar')



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
