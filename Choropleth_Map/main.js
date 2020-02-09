
fetch('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json')
    .then(response => response.json())
    .then(data => {
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
      .then(response => response.json())
      .then(EducationData => {
            let colors = ['#f7fcf0','#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081','#081d58'];
            let path = d3.geoPath();
            let svg = d3.select("body").append("svg")
                        .attr("width", 1200)
                        .attr("height", 700);
      
            let color = d3.scaleThreshold()
                         .domain(d3.range(2.6, 75.1, (75.1-2.6)/10))
                         .range(colors)
            let g = svg.append("g")
                         .attr("id", "legend")
                         .attr("transform", "translate(1000,150)");
            let scaleLeg = d3.scaleLinear()
                             .domain([2.6, 75.1])
                             .rangeRound([0, 400]);
      
            let scale = d3.axisLeft(scaleLeg)
                     .tickValues(color.domain())
                     .tickFormat(d=>d+"%")
                     
            
      
            g.selectAll("rect")
                         .data(colors)
                         .enter().append("rect")
                         .attr("border", '1px solid black')
                         .attr("y", (d,i) => i*40)
                         .attr("width", 80)
                         .attr("height", 40)
                         .attr("fill", (d,i)=> colors[i]);
            g.call(scale)
             
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
      
            svg.append("g")
                .attr("class", "counties")
                .selectAll("path")
                .data(topojson.feature(data, data.objects.counties).features)
                .enter().append("path")
                .attr("class", "county")
                .attr("data-fips", d => d.id)
                .attr("data-education", d => {
                   let date = EducationData.find(a=>a.fips == d.id)
                   return date ? date.bachelorsOrHigher : 0;
                })
                .attr("fill", d => {
                   let date = EducationData.find(a=>a.fips == d.id)
                   return date ? color(date.bachelorsOrHigher) : colors[0];
                })
                .on('mouseover', function(d, i) {
                tooltip.transition().style("opacity", 0.8);
                tooltip.style('left',d3.event.pageX + 10 + "px")
                       .style('top',d3.event.pageY + 15 + "px")
                       .style('text-align','left')
                       .attr("data-education", d3.event.target.getAttribute('data-education'))
                       .html(function(){
                         let date = EducationData.find(a=>a.fips == d.id)
                         return `State ${date.state} / ${date['area_name']}  <br /> Bachelor's degree or higher - ${date.bachelorsOrHigher}%`
                       })
                })
                .on('mouseout', function(d) {
                   tooltip.transition().style("opacity", 0);  
                })
                .attr("d", path);
            /*
                       
            */
      
      
    })
})

