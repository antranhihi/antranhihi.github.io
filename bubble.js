// setting up the canvas
var margin = {top: 10, right: 20, bottom: 50, left: 100},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
// setting up svg

var fea = ["Country","Air pollution","Dwellings without basic facilities","Educational attainment","Employees working very long hours","Employment rate","Feeling safe walking alone at night",
"Homicide rate","Household net adjusted disposable income","Household net financial wealth","Housing expenditure","Labour market insecurity","Life expectancy"
,"Life satisfaction","Long-term unemployment rate","Personal earnings","Quality of support network","Rooms per person","Self-reported health","Stakeholder engagement for developing regulations",
"Student skills","Time devoted to leisure and personal care","Voter turnout","Water quality","Years in education","Positive","Net_Migration"]


let fea1, fea2;


function changeValue(sel){
  var select_value1 = document.querySelector("#fea-1-select").value;  // dwelling
  var select_value2 = document.querySelector("#fea-2-select").value;  // air pol
  
  d3.csv("description.csv").then( function(desc) {
    
    if ( sel === 1 ) {
        fea1 = select_value1;
        // console.log(fea1)
        let descBox = d3.select("#description1");
        let selectedDesc = desc.filter( function(d) { return d.name === select_value1;})[0]
        descBox.html(selectedDesc.desc)
        
        update_draw();
      } else {
        fea2 = select_value2;
        // console.log(fea2)
        let descBox = d3.select("#description2");
        let selectedDesc = desc.filter( function(d) { return d.name === select_value2;})[0]
        descBox.html(selectedDesc.desc)
        update_draw();   // thay thành update
    } 
    
  })

} 


function draw() {
    popFill(fea);
    changeValue(1);
    changeValue(2);

    var svg = d3.select("#bubble")
            .append("svg")
            .attr("id", "outer-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .attr("viewBox", [margin.left, margin.top, width, height]);

    // setting up the data
    d3.json("betterlife_total_new.json").then(function(data){
        
        
        data.sort((a, b) => b[fea[26]] - a[fea[26]]);
        console.log(data);
        // console.log(d3.max(data, function(d){ return d[fea2]}))
        // Add X scale
        var x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){
          return d[fea1]
        })])
        .range([ 0, width ]);
        
        
        // adding y scale
        var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){
          return d[fea2]
        })])
        .range([ height, 0]);
        
        

        d3.selectAll(".axis-group").raise();
        
      // console.log(d3.max(data, function(d){ return d[fea[26]]}))
      // Add a scale for bubble size
      var z = d3.scaleSqrt()
        .domain([d3.min(data, function(d){
            return d[fea[26]]
        }), d3.max(data, function(d){
            return d[fea[26]]
        })])
        .range([1, 40]);

        // adding a scale for bubble color
        var bubbleColor = d3.scaleOrdinal()
                            .domain(["Positive","Negative"])
                            .range(["#7fbc41", "#de77ae"]);

        var bubbles = svg.append("g").attr("id", "bubble-path")
        // Add dots
        bubbles
          .selectAll(".data-circle")
          .data(data)
          .enter()
          .append("circle")
            .attr('class', (d) => d.Positive + ' data-circle')
            .classed((d) => d.Positive, true)
            .attr("cx", function (d) { return x(d[fea1]); } )
            .attr("cy", function (d) { return y(d[fea2]); } )
            .attr("r", function (d) { return z(d[fea[26]]); } )
            .style("fill", d => bubbleColor(d.Positive))
            .style("opacity", "0.7")
          // -
          
          ;
        
        // manual bubble clipping mask
        
        // Just a work-around for clipping the bubbles that are out-of-bound
        let clipGroup = d3.select("#outer-svg").append("g")
        .attr("id", "clip-group")
        
        
        // clip the x-axis
        clipGroup.append("rect")
        .attr("x", 0).attr("y", height + margin.top)
        .attr("width", width + margin.left + margin.right)
        .attr("height", margin.bottom);
        
        // clip the y-axis
        clipGroup.append("rect")
          .attr("x", 0).attr("y", 0)
          .attr("width", margin.left)
          .attr("height", height+ margin.top + margin.bottom)
          .style("transform", "translate(-100, 0)");

        // add x axis
        d3.select("#outer-svg").append("g")
        .attr('id', 'x-axis')
        .attr("class", "axis-group")
        .attr("transform", "translate(" + margin.left +"," + (height + margin.top) + ")")
        .call(d3.axisBottom(x));
        
        // add y axis
        d3.select("#outer-svg").append("g")
        .attr('id', 'y-axis')
        .attr("class", "axis-group")
        .attr("transform", "translate(" + margin.left +"," + margin.top + ")")
        .call(d3.axisLeft(y));

        // =================================================================================
        // legend designing
          var h = 250;
          var w = 160;
          // create svg canvas for the legend
          var legendsvg = d3.select("#bubble")
                              .append("svg")
                              .attr("id", "legend-svg")
                              .attr("width", w)
                              .attr("height", h)
                              // .style("border", "1px solid black")
        
        
        var valuesShow = [d3.min(data, function(d){
          return d[fea[26]]}),Math.round(1377630/4000)*1000,Math.round(1377630/2000)*1000,1377630] //361274
        var xLabel = 5.5*w/8 // x cordinates of the legend text
        var xCircle = 1.5*w/4
        var yCircle = 3*h/8

        legendsvg.selectAll("legend")
                .data(valuesShow)
                .enter()
                .append("circle")
                    .attr("cx", xCircle)
                    .attr("cy", function(d){ return yCircle - z(d) } )
                    .attr("r", function(d){ return z(d) })
                    .style("fill", "none")
                    .attr("stroke", "black")

        d3.select("#legend-svg")
              .append("circle")
              .attr("id", "showing-legend")
              .attr("cx", xCircle)
              .attr("cy", yCircle)
              .attr("r", 0 )

        // draw circles legends on hover
        d3.selectAll(".data-circle").on("mouseover", function(_, d) { 
          d3.select("#showing-legend")
              .transition()
              .duration(100)
              .attr("cx", xCircle)
              .attr("cy", yCircle - z(d[fea[26]]))
              .attr("r", z(d[fea[26]]) )
              .attr("fill-opacity", 0.5)
              .attr("mix-blend-mode", "overlay")
              .style("fill",  bubbleColor(d.Positive) )
              .attr("stroke", "black")
              
              d3.select(this).style("opacity", "1").attr("stroke","black")
        })

        bubbles.on("mouseout", function(d) {
          d3.select("#showing-legend")
            .transition()
            .duration(100)
            .attr("id", "showing-legend")
              .attr("cx", xCircle)
              .attr("cy", yCircle)
              .attr("r", 0 );
         
          d3.selectAll(".data-circle")
          .style("fill",  d => bubbleColor(d.Positive) )
          .style("opacity", "0.7")
          .attr("stroke","none");
        })
    
        // Drawing some legend texts burh
        legendsvg.selectAll("legend")
        .data(valuesShow)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function(d){ return (d === 0) ? yCircle : yCircle - 2*z(d) +10} )
        .text( function(d){ return "±" + d3.format("~s")(d) } )
        .style("font-size", 14)
        .style('font-family', 'montserrat')
        .attr('alignment-baseline', 'middle');
        
        // add axis titles into REAL svg canvas (not the translate group)
        d3.select("#outer-svg").append("text")
           .attr("id", "yLabel")
        
        d3.select("#outer-svg").append("text")
           .attr("id", "xLabel");
        
           // CREATING COLOR LEGEND THAT ALLOWS HIGHLIGHT ON HOVER
        legendsvg.append("circle")
                  .attr("cx", xCircle - 30)
                  .attr("cy", yCircle + 70 )
                  .attr("r", 20)
                  .style("fill","#7fbc41")
                  .on("mouseover", function() {d3.selectAll('.Negative').style('opacity', 0.1);} )
                  .on("mouseout", function() {d3.selectAll('.data-circle').style('opacity', 0.7)});
                  
                  
        legendsvg.append("circle")
                  .attr("cx", xCircle - 30 )
                  .attr("cy", yCircle + 130)
                  .attr("r", 20)
                  .style("fill","#de77ae")
                  .on("mouseover", function() {d3.selectAll('.Positive').style('opacity', 0.1);} )
                  .on("mouseout", function() {d3.selectAll('.data-circle').style('opacity', 0.7)})
        
        legendsvg.append("text")
                    .attr("x", xCircle)
                    .attr("y", yCircle + 130)
                    .text("Negative")
                    .style("font-size", 14)
                    .style('font-family', 'montserrat')
                    .attr('alignment-baseline', 'middle');
        
        legendsvg.append("text")
                    .attr("x", xCircle)
                    .attr("y", yCircle + 70)
                    .text("Positive")
                    .style("font-size", 14)
                    .style('font-family', 'montserrat')
                    .attr('alignment-baseline', 'middle');

        legendsvg.append("text")
                    .attr("x", xCircle - 30 )
                    .attr("y", yCircle + 30)
                    .text("Migration Value")
                    .style("font-size", 14)
                    .style('font-family', 'montserrat')
                    .attr('alignment-baseline', 'middle')
                    .style("font-weight", "bold");
                    

      })      // end of data injection 

} // end draw()

// update view
function update_draw(){
  

  let svg = d3.select("#outer-svg");
  

  d3.json("betterlife_total_new.json").then(function(data){
      
      // data.sort((a, b) => b[fea[26]] - a[fea[26]]);
      console.log(data);
      // adding a scale for bubble color
      var bubbleColor = d3.scaleOrdinal()
              .domain(["Positive","Negative"])
              .range(["#7fbc41", "#de77ae"]);

      // update scale & axis
      var x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){
          return d[fea1]
        })])
        .range([ 0, width ]);
        
        // update x axis
        d3.select('#x-axis')
        .transition()
        .duration(200)
        .call(d3.axisBottom(x));

        d3.select("#yLabel")
           .attr("x", margin.left/2 -2)
           .attr("y", height/2)
           .text(fea2)
           .style("text-anchor", "middle")
           .attr("transform",`rotate(-90 ${margin.left/2 -2} ${height/2})`);
        
        d3.select("#xLabel")
           .attr("x", (width + margin.left + margin.right)/2)
           .attr("y", height + margin.bottom +2)
           .text(fea1)
           .style("text-anchor", "middle");
        
        // update y scale
        var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){
          return d[fea2]
        })])
        .range([ height, 0]);
    
        // update y axis
        d3.select('#y-axis')
        .transition()
        .duration(200)
        .call(d3.axisLeft(y));
        
      // console.log(d3.max(data, function(d){ return d[fea[26]]}))
      // update a scale for bubble size
      var z = d3.scaleSqrt()
        .domain([d3.min(data, function(d){
            return d[fea[26]]
        }), d3.max(data, function(d){
            return d[fea[26]]
        })])
        .range([1, 40]);
    
      // update bubble
      let bubbles = d3.selectAll('.data-circle')
        
      bubbles.transition()
        .duration(200)
        .attr("cx", function (d) { return x(d[fea1]); } )
        .attr("cy", function (d) { return y(d[fea2]); } )
        .attr("r", function (d) { return z(d[fea[26]]); } )
    
        
        bubbles.append('title')
                .text(function(d){
                    return d[fea[0]];
                });

        

          // Set zoom and pan features
  var zoom = d3.zoom()
  // .scaleExtent(0.5, 10) // how much to zoom out and zoom in  
  .extent([[margin.left,margin.top],[width, height]]) 
  .on("zoom", zoomed);
  

  // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom

  // changing function
  function zoomed(event){
  const t = event.transform;

  var newx = t.rescaleX(x).interpolate(d3.interpolateRound);
  var newy = t.rescaleY(y).interpolate(d3.interpolateRound);

  d3.select('#x-axis').call(d3.axisBottom(newx));
  d3.select('#y-axis').call(d3.axisLeft(newy));
  console.log(event.transform);
  
  // adding a clipPath: everything out of the area wont be drawn
  var clipPath = svg.append("defs").append("clipPath")
                    .attr("id","clip")
                    .append("svg:rect")
                    .attr("width",width)
                    .attr("height", height)
                    .attr("x",0)
                    .attr("y",0);

  d3.select('#bubble-path')
    .attr('transform', event.transform);
  }

  svg.call(zoom);
  }) // end

}