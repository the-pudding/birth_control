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
		let data = $sel.datum()[0];
    const fullNames = $sel.datum()[1]

    let nestedData = null
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 30;
		const marginBottom = 10;
		const marginLeft = 270;
		const marginRight = 10;
    const numBars = 10
    const numPadding = 10
    const barHeight = 15
    const paddingHeight = 15
    const textPaddingSide = 6
    const textPaddingTop = 3
    const fontSize = 12

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
    function setEffectivenessLevel(failure){
      const eff = 100 - failure
      if (eff >= 99) return ">99%"
      else if (eff < 99 && eff >= 88) return "88 - 98%"
      else if (eff < 88) return "72 - 87%"
    }

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

        const fullNameMap = d3.map(fullNames, d => d.full)

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
          .data(d => d.annotation.values)

        const labelsEnter = labels
          .enter()
          .append('g')

        labels.exit().remove

        const labelsMerge = labelsEnter.merge(labels)
          .attr('class', 'g-label')
          //.attr('text-anchor', 'end')


        labelsMerge
          .append('text')
          .attr('class', d => {
            if (d == "+") return `label-text label-text-plus tk-atlas`
            else return `label-text tk-atlas`})
          .text(d => d)
          .attr('transform', `translate(${textPaddingSide}, ${(textPaddingTop)})`)
          .style('text-transform', 'uppercase')
          .style('font-size', fontSize)
          .style('font-weight', 600)
          .attr('alignment-baseline', 'hanging')

        labelsMerge
          .append('rect')
          .attr('class', 'label-rect')
          .attr('width', function(d){
            const parent = d3.select(this.parentNode)
            const text = parent.selectAll('.label-text')
            const bbox = text.node().getBBox()
            return bbox.width + (textPaddingSide * 2)
          })
          .attr('height', (textPaddingTop * 2) + fontSize)
          .style('fill', d => {
            if (d == "+") return 'none'
            else {
              const failure = fullNameMap.get(d).failure
              const level = setEffectivenessLevel(failure)
              return `${scaleColor(level)}`
            }
          })
          .attr('rx', 5)
          .attr('ry', 5)
          .lower()

        $vis.selectAll('.g-label')
          .attr('transform', function(d, i){
            const grandParent = d3.select(this.parentNode.parentNode)
            const relatives = grandParent.selectAll('.g-label')
              .nodes()
              .map((d, i) => {
                const allLabels = barGroups.selectAll('.g-label').nodes()

                const remainder = i % 3

                const bbox = d.getBBox()
                const self = bbox.width + textPaddingSide

                let x = null
                if (remainder == 0) {
                  return x = allLabels[i + 1].getBBox().width + allLabels[i + 2].getBBox().width + self
                }
                if (remainder == 1) {
                  return x = allLabels[i + 1].getBBox().width + self
                }
                else x = self
                return x
              })

            return `translate(${-relatives[i]}, ${-textPaddingTop})`
          })

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
