    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {
       console.log(data)
       const dataset = data;
         dataset.forEach(function(d) {
         d.Time = new Date(2000, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]);
       });
       const w = 900;
       const h = 500;
       const padding = 60;
       let tooltip = d3.select("#scatterplot-graph")
                       .append("div")
                       .attr("id", "tooltip")
                       .style('position', 'absolute')
                       .style('padding', '4px')
                       .style('margin', '0')
                       .style('background', '#fff')
                       .style('border', '1px solid #000')
                       .style('color','#000')
                       .style("opacity", 0);
      
       const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset, (d) => d.Year)-1, d3.max(dataset, (d) => d.Year)])
                     .range([padding, w-10 ]);
       const yScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d.Time))
                     .range([padding , h-padding]);
       const svg = d3.select("#scatterplot-graph")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
      
      svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("cx", (d) => xScale(d.Year))
       .attr("cy",(d) => yScale(d.Time))
       .attr("r", (d) => 6)
       .attr('class','dot')
       .attr('data-xvalue', d => d.Year)
       .attr('data-yvalue', d => d.Time.toISOString())
       .style("fill", (d) =>{return d.Doping ?'red':'green'})
       .style("opacity", 0.6)
       .on('mouseover', function(d, i) {
             tooltip.transition().style("opacity", 0.8);
             tooltip.style('left',d3.event.pageX + 10 + "px")
                    .attr("data-year", d.Year)
                    .style('top',d3.event.pageY + 15 + "px")
                    .style('text-align','left')
                    .html(`${d.Name}:${d.Nationality}<br /><br />Year: ${d.Year}, Time:${d3.timeFormat("%M:%S")(d.Time)}, Place: ${d.Place}<br /><span style ='color: red'>${d.Doping}</span>`);
          })
       .on('mouseout', function(d) {
             tooltip.transition().style("opacity", 0);
             
          })
        svg.append('text')
          .attr('x', -240)
          .attr('y', 17)
          .style('font-size', '20px')
          .text('Minutes')
          .attr('class', 'ok')
         svg.append('text')
          .attr('x', 440)
          .attr('y', 480)
          .style('font-size', '20px')
          .text('Years')
          
       const xAxis = d3.axisBottom(xScale)
                       .tickFormat(d => d)
                       
       const yAxis = d3.axisLeft(yScale)
                       .tickFormat(d3.timeFormat("%M:%S"))
                       
       svg.append("g")
          .attr("transform", "translate(0," +(h-padding)+ ")")
          .attr('id', 'x-axis')
          .call(xAxis);
       svg.append("g")
          .attr("transform", "translate("+padding+ ",0 )")
          .attr('id', 'y-axis')
          .call(yAxis);
      
      svg.append("circle")
         .attr("cx",w-20)
         .attr("cy",130)
         .attr("r", 10)
         .style("fill", "green")
      svg.append("circle")
         .attr("cx",w-20)
         .attr("cy",160)
         .attr("r", 10)
         .style("fill", "red")
      svg.append("text")
        .attr("x", w-180)
        .attr("y", 134)
        .attr("class", "legend")
        .attr("id", "legend")
        .text("no doping charge")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle")
      svg.append("text")
        .attr("x", w-150)
        .attr("y", 164)
        .attr("class", "legend")
        .attr("id", "legend")
        .text("doping charge")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle")                           
    })
    
