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
    let narrow = false
		const marginTop = 30;
		const marginBottom = 10;
		let marginLeft = 230
		const marginRight = 15;
    const numBars = 15
    const numPadding = 15
    let barHeight = null
    let paddingHeight = null
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
        let windowWidth = window.innerWidth

        narrow = windowWidth < 500 ? true : false
        marginLeft = narrow ? 150 : 270
        barHeight = narrow ? 20 : 15
        paddingHeight = narrow ? (fontSize * 2) + (textPaddingTop * 2) : 15


        width = $sel.node().offsetWidth - marginLeft - marginRight;
        height = (barHeight * numBars) + (paddingHeight * numPadding)
        //if (width < 500) narrow = true

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

        $g.at('transform', `translate(${marginLeft}, ${marginTop})`);

				return Chart;
			},
			// update scales and render chart
			render() {

        // axis
        $axis
          .call(d3.axisTop(scaleX)
            .ticks(narrow ? 3 : 5)
            .tickSize(-height - 10)
            .tickSizeOuter(0)
            .tickFormat(function(d, i){
              return i == 0
              ? d + " users" : d
            })
            .tickPadding(10)
          )
          .attr('transform', `translate(5, -10)`)



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
          .attr('transform', `translate(5, 0)`)

        const labels = barGroups
          .selectAll('.g-label')
          .data(d => d.annotation.values)

        const labelsEnter = labels
          .enter()
          .append('g')

        labels.exit().remove

        const labelsMerge = labelsEnter.merge(labels)
          .attr('class', 'g-label')
          .classed('narrow', narrow ? true : false)
					.at('data-clippy', d => {
						if (d == '+') return null
						else return d
					})
					.style('cursor', 'pointer')
          //.attr('text-anchor', 'end')


        labelsEnter
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

        labelsEnter
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

        const allGroups = $vis.selectAll('.g-label').nodes()

        const allBBox = allGroups
          .map((d, i) => {
            const bboxWidth = d.getBBox().width
            const self = bboxWidth + textPaddingSide
            return {bboxWidth: bboxWidth, self: self}
          })

        const gLabels = $vis.selectAll('.g-label')
          .attr('transform', function(d, i){
            const remainder = i % 3
            const self = allBBox[i].self
            let horiz = null
            if (remainder === 0) {
              const second = allBBox[i + 1].bboxWidth
              const third = allBBox[i + 2].bboxWidth

              horiz = second + third + self
            }
            else if (remainder === 1) {
              horiz = allBBox[i + 1].bboxWidth + self
            }
            else if(remainder === 2) horiz = self

            if (narrow == false) return `translate(${-horiz}, ${-textPaddingTop})`
            else if (narrow == true) {
              let y = null
              if (remainder === 0 || remainder === 1) y = 0
              else if (remainder === 2) y = (textPaddingTop * 2) + fontSize

              return `translate(${-self}, ${y})`
            }
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
