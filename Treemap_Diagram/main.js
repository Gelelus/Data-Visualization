let width = 1500;
let height = 600;
let colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'];
let color = d3.scaleOrdinal(colors);
// append the svg object to the body of the page
let legend = d3.select("#main")
               .append("svg")
               .attr("width", width)
               .attr("height", 40)
               .attr("id", 'legend')

      legend.selectAll("rect")
            .data(colors)
            .enter().append("rect")
            .attr("class", 'legend-item')
            .attr("x", (d,i) => 440 + i*100)
            
            .attr("height", 20)
            .attr("width", 20)
            .attr("fill", (d,i)=> colors[i]);

let svg = d3.select("#main")
            .append("svg")
            .attr("width", width)
            .attr("height", height)

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

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json", function(data) {
  // Give the data to this cluster layout:
  var root = d3.hierarchy(data).sum(d => d.value) // Here the size of each leave is given in the 'value' field in input data
  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .size([width, height])
    .padding(1)
    (root)
  // use this information to add rectangles:
  svg.selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .style("stroke", "black")
    .attr("fill", d => color(d.data.category))
    .on("mousemove", function(d) {      
        tooltip.style("opacity", .9); 
        tooltip.html(
          'Movie: ' + d.data.name + 
          '<br>Genre: ' + d.data.category + 
          '<br>Grossing: ' + d.data.value
        )
        .attr("data-value", d.data.value)
        .style("left", (d3.event.pageX + 10) + "px") 
        .style("top", (d3.event.pageY - 28) + "px"); 
    })    
    .on("mouseout", function(d) { 
        tooltip.style("opacity", 0); 
    })      
legend.selectAll("text")
            .data(data.children.map(a=> a.name))
            .enter().append("text")
            .attr("x", (d,i) => 465 + i*100)
            .attr("y", 15)
            .attr('fill','white')
            .text(d => d)
  
 svg.selectAll("text")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "group")
    .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")")
      .append("text")
      .attr('class', 'tile-text')
      .selectAll("tspan")
      .data(d => {
        //getting rid of mistakes with text
        if(d.data.name.includes('Harry Potter')){return ['Harry','Potter']}
        else if(d.data.name.includes('Star Wars')){return ['Star','Wars']}
        else if(d.data.name.includes('Transformers')){return ['Transform','ers']}
        else if(d.data.name.includes('Indiana Jones')){return ['Indiana','Jones']}
        else if(d.data.name.includes('Pirates of the Caribbean')){return ['Pirates of the ','Caribbean']}
        else if(d.data.name.includes('The Hobbit')){return ['Hobbit']}
        else if(d.data.name.includes('The Chronicles of Narnia')){return ['Narnia']}
        else if(d.data.name.includes('The Lord of the Rings')){return ['The Lord','of the','Rings']}
        else if(d.data.name.includes('Night at the Museum')){return ['Night','at the','Museu','m']}
        else if(d.data.name.includes('The Hunger')){return ['The','Hunger','games']}
        else if(d.data.name.includes('The Twilight ')){return ['The','Twilight']}
        else if(d.data.name.includes('The Blind Side')){return ['The Blind Side']}
        else if(d.data.name.includes('Alice in')){return ['Alice in','Wonder-','land']}
        else if(d.data.name.includes('E.T. the')){return ['E.T. the','Extra-Terrestrial']}
        else if(d.data.name.includes('Monsters University')){return ['Monster','Univer-','sity']}
        else if(d.data.name.includes('Inception')){return ['Incep-','tion']}
       ///////
        return d.data.name.split(/(?=[A-Z][^A-Z])/g)
      })
      .enter().append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 14 + i * 15 )
      .text(d => d);
  /*
    */
})
