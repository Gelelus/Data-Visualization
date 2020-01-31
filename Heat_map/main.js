function month(num){
  return ['January','February','March','April','May','June','July','August','September','October','November','December'][num-1]
}
let colors = ['#54278f','#756bb1','#9e9ac8','#cbc9e2','#f2f0f7','#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026']
let temp = ['0','3.1','4.6','6.5','7.7','9.1','10','11','12']
fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response => response.json())
    .then(data => {
       
       const base = data.baseTemperature;
       const dataset = data.monthlyVariance;
  
       const w = 1400;
       const h = 600;
       const padding = 100;
  
       let tooltip = d3.select("body")
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
                     .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
                     .range([padding, w-padding]);
       const yScale = d3.scaleLinear()
                     .domain([0.5, 12.5])
                     .range([padding-40 , h-padding-40]);
  
       
       var colorScale = d3.scaleQuantile()
                     .domain([d3.min(dataset, (d) => base + d.variance), d3.max(dataset, (d) => base + d.variance)])
                     .range(colors);
      
        
  
       const mainBox = d3.select("body")
                  .append("div")
                  .attr('id','heat-map')
       
       const svg = d3.select("#heat-map")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
  
        svg.selectAll("rect")
                  .data(dataset)
                  .enter()
                  .append("rect")
                  .attr("x", (d, i) => xScale(d.year))
                  .attr("y", (d, i) => yScale(d.month-0.5))
                  .attr("width", 4)
                  .attr('class',"cell")
                  .attr('data-month',d => d.month)
                  .attr('data-year',d => d.year)
                  .attr('data-temp',d => base + d.variance)
                  .attr("height", (h-padding*2)/12-1)//fix1231312312312
                  .attr("fill", (d, i) => colorScale(base + d.variance))
                  .on('mouseover', function(d, i) {
                        tooltip.transition().style("opacity", 0.8);
                        tooltip.style('left',d3.event.pageX + 10 + "px")
                               .style('top',d3.event.pageY + 15 + "px")
                               .attr("data-year", d.year)
                               .html(` Date:  ${month(d.month)} ${d.year} <br />
                                       Temperature: ${Math.floor((base + d.variance)*100)/100}&#8451;<br />
                                       Variance: ${Math.floor(d.variance*100)/100}&#8451;`);
                        d3.select(this).style("outline", '1px solid black')
                                       .style("z-index", '1');
          })
          .on('mouseout', function(d) {
             tooltip.transition().style("opacity", 0);
             d3.select(this).style("outline", 'none');
          })
  
       
     
       
       const xAxis = d3.axisBottom(xScale)
                  .tickFormat(d => d)
                       
       const yAxis = d3.axisLeft(yScale)
                  .tickFormat(d => month(d))
       svg.append("g")
          .attr("transform", "translate(0," +(h-padding-40)+ ")")
          .attr('id', 'x-axis')
          .call(xAxis);
  
       svg.append("g")
          .attr("transform", "translate("+padding+ ",0 )")
          .attr('id', 'y-axis')
          .call(yAxis);
  
     
      let legend = svg.append('g')
         .attr('id', 'legend')
      legend.selectAll(".legend").data(colors).enter().append("g").attr("class", "legend");
  
      svg.selectAll(".legend").append("rect")
        .attr("x", (d, i) => (w/2-padding)/2+i*80)
        .attr("y", (d, i) => h-padding/1.5)
        .attr("width", 80)
        .attr("height", (h-padding*2)/12)
        .attr("fill", (d, i) => colors[i]);
     svg.selectAll(".legend").append("text")
        .attr("x", (d, i) => (w/2-padding)/2+i*80+padding-25)
        .attr("y", (d, i) => h-padding/1.5-4)
        .text((d, i) => temp[i])
        
     svg.append("text")
       .attr("x", (w/2-padding)/2)             
       .attr("y", h-10)
       .attr("id", "description")
       .style("font-size", "20px")
       .text("Temperature in Celsius / base temperature 8.66ºC");
    svg.append("text")
        .attr("x", w/2-3*padding)             
        .attr("y", 30)
        .attr("id", "title")
        .style("font-size", "26px")
        .style("font-family", "Avenir")
        .text("Visualizing Global Surface Temperature Change 1753 - 2015");
    })
