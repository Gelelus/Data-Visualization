    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => {
       console.log(data.data)
       const dataset = data.data;

       const w = 900;
       const h = 500;
       const padding = 60;

       let tooltip = d3.select("#bar-chart")
                       .append("div")
                       .attr("id", "tooltip")
                       .style('position', 'absolute')
                       .style('padding', '4px')
                       .style('background', '#fff')
                       .style('border', '1px solid #000')
                       .style('color','#000')
                       .style("opacity", 0);
      
       const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset, (d) => +d[0].slice(0,4)), d3.max(dataset, (d) => +d[0].slice(0,4)+1)])
                     .range([padding, w-10 ]);
       const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, (d) => d[1])])
                     .range([h-padding , padding]);
      
       const svg = d3.select("#bar-chart")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
      
       svg.selectAll("rect")
          .data(dataset)
          .enter()
          .append("rect")
          .attr("x", (d, i) => xScale(+d[0].slice(0,4)+ +d[0].slice(5,-3)/12))
          .attr("y", (d, i) => yScale(d[1]))
          .attr("width", w/320)
          .attr("height", (d, i) => yScale(d3.max(dataset, (d) => d[1])-d[1])-padding)
          .attr("fill", "gray")
          .attr("class", "bar")
          .attr('data-date', d=>d[0])
          .attr('data-gdp', d=>d[1])
          .on('mouseover', function(d, i) {
             tooltip.transition().style("opacity", 0.8);
             tooltip.style('left',d3.event.pageX + 10 + "px")
                    .style('top',d3.event.pageY + 15 + "px")
                    .attr('data-date', data.data[i][0])
                    .html("<p> Date: " + d[0] + "</p>" + "<p> Billions: " + d[1] + "</p>");
             d3.select(this).style("opacity", 0.1);
          })
          .on('mouseout', function(d) {
             tooltip.transition().style("opacity", 0);
             d3.select(this).style("opacity", 1);
          })
          
       const xAxis = d3.axisBottom(xScale)
                       .tickFormat(d => d)
                       
       const yAxis = d3.axisLeft(yScale);
      
       svg.append("g")
          .attr("transform", "translate(0," +(h-padding)+ ")")
          .attr('id', 'x-axis')
          .call(xAxis);
       svg.append("g")
          .attr("transform", "translate("+padding+ ",0 )")
          .attr('id', 'y-axis')
          .call(yAxis);
    })

