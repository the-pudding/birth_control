/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.sideEffects = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();

    let nestedData = null
		// dimension stuff
		let width = 0;
		let height = 0;
    let narrow = false
		const marginTop = 30;
		const marginBottom = 5;
		let marginLeft = 0
		const marginRight = 50;
    const numBars = 5
    const numPadding = 5
    let barHeight = 10
    let paddingHeight = 8
    const textPaddingSide = 6
    const textPaddingTop = 3
    const fontSize = 12

    // colors
    const low = '#DDB2C2'
    const mid = '#C169D4'
    const high = '#5E32FF'

		// scales
		const scaleX = d3.scaleLinear()
		const scaleY = d3.scaleBand()
    const scaleColor = d3.scaleOrdinal()

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
    let $g = null
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
        const titleGroup = $sel.append('div.chart-legend')
        titleGroup.append('text')
          .text(data.key)
          .attr('class', 'method-type')

        titleGroup.append('text')
          .text(`•`)
          .attr('class', 'bullet')

        const thouFormat = d3.format(',')

        titleGroup.append('text')
          .text(`${thouFormat(data.values[0].total)} Respondents`)
          .attr('class', 'method-total')

				$svg = $sel.append('svg.multipleMethods-chart');
				$g = $svg.append('g');

				// offset chart for margins
				$g.at('transform', `translate(${marginLeft}, ${marginTop})`);

				// create axis
				$axis = $g.append('g.g-axis');

				// setup viz group
				$vis = $g.append('g.g-vis');

        barGroups = $vis
          .selectAll('.g-bar')
          .data(data.values)
          .enter()
          .append('g')
          .attr('class', 'g-bar')
          .classed('sideEffect', d => {
            const se = d.label.includes('side')
            return se
          })
          .classed('bleeding', d => {
            const blood = d.label.includes('bleeding')
            return blood
          })
          .classed('weight', d => {
            const weight = d.label.includes('weight')
            return weight
          })
          .classed('pain', d => {
            const pain = d.label.includes('pain')
            return pain
          })

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
          .domain([0, 75])
          .range([0, width - marginRight - marginLeft])

        $g.at('transform', `translate(${marginLeft}, ${marginTop})`);

				return Chart;
			},
			// update scales and render chart
			render() {

        // axis
        $axis
          .call(d3.axisTop(scaleX)
            .ticks(6)
            .tickSize(-height - 10)
            .tickSizeOuter(0)
            .tickFormat(function(d, i){
              return this.parentNode.nextSibling
              ?  d : d + "%"
            })
            .tickPadding(10)
          )
          .attr('transform', `translate(5, -10)`)

        const bars =  barGroups
          .selectAll('.bar')
          .data(d => [d])

        const barsEnter = bars
          .enter()
          .append('rect')
          .attr('class', 'bar')



        bars.exit().remove

        const barsMerge = barsEnter.merge(bars)
          .attr('width', d => scaleX(d.percent))
          .attr('height', barHeight)
          .attr('transform', `translate(5, 0)`)


        const labels = barGroups
          .selectAll('.g-label')
          .data(d => [d])

        const labelsEnter = labels
          .enter()
          .append('g')

        labels.exit().remove

        const labelsMerge = labelsEnter.merge(labels)
          .attr('class', 'g-label')
        //   .classed('narrow', narrow ? true : false)
        //   //.attr('text-anchor', 'end')
        //
        //
        labelsEnter
          .append('text')
          .attr('class', d => {
              return `label-text-bg tk-atlas`})
          .text(d => d.label)
          .attr('transform', `translate(${textPaddingSide}, 0)`)
          .style('text-transform', 'uppercase')
          .style('font-size', fontSize)
          //.style('font-weight', 600)
          .attr('alignment-baseline', 'hanging')
          //.style('fill', '#ffffff')
          //.style('stroke', `4px solid #ffffff`)

        labelsEnter
          .append('text')
          .attr('class', d => {
              return `label-text tk-atlas`})
          .text(d => d.label)
          .attr('transform', `translate(${textPaddingSide}, 0)`)
          .style('text-transform', 'uppercase')
          .style('font-size', fontSize)
          //.style('font-weight', 600)
          .attr('alignment-baseline', 'hanging')

        labelsEnter
          .attr('transform', d => `translate(${scaleX(d.percent) + textPaddingSide}, 0)`)

        // labelsEnter
        //   .append('rect')
        //   .attr('class', 'label-rect')
        //   .attr('width', function(d){
        //     const parent = d3.select(this.parentNode)
        //     const text = parent.selectAll('.label-text')
        //     const bbox = text.node().getBBox()
        //     return bbox.width + (textPaddingSide * 2)
        //   })
        //   .attr('height', (textPaddingTop * 2) + fontSize)
        //   .style('fill', d => {
        //     if (d == "+") return 'none'
        //     else {
        //       const failure = fullNameMap.get(d).failure
        //       const level = setEffectivenessLevel(failure)
        //       return `${scaleColor(level)}`
        //     }
        //   })
        //   .attr('rx', 5)
        //   .attr('ry', 5)
        //   .lower()

        // const allGroups = $vis.selectAll('.g-label').nodes()
        //
        // const allBBox = allGroups
        //   .map((d, i) => {
        //     const bboxWidth = d.getBBox().width
        //     const self = bboxWidth + textPaddingSide
        //     return {bboxWidth: bboxWidth, self: self}
        //   })
        //
        //   console.log({allBBox})
        //
        //
        // const gLabels = $vis.selectAll('.g-label')
        //   .attr('transform', function(d, i){
        //     const remainder = i % 3
        //     const self = allBBox[i].self
        //     let horiz = null
        //     if (remainder === 0) {
        //       const second = allBBox[i + 1].bboxWidth
        //       const third = allBBox[i + 2].bboxWidth
        //
        //       horiz = second + third + self
        //     }
        //     else if (remainder === 1) {
        //       horiz = allBBox[i + 1].bboxWidth + self
        //     }
        //     else if(remainder === 2) horiz = self
        //
        //     if (narrow == false) return `translate(${-horiz}, ${-textPaddingTop})`
        //     else if (narrow == true) {
        //       let y = null
        //       if (remainder === 0 || remainder === 1) y = 0
        //       else if (remainder === 2) y = (textPaddingTop * 2) + fontSize
        //
        //       return `translate(${-self}, ${y})`
        //     }
        //   })

        barGroups
          .attr('transform', (d, i) => `translate(0, ${i * (barHeight + paddingHeight)})`)
        //
        // const barsMove = barGroups.selectAll('.bar')



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
