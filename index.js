function init() {
  

  // When the user scrolls down 20px from the top of the document, show the button
  
  
 
  
  // When the user clicks on the button, scroll to the top of the document
  
    //Width and height
    var w = 1000;
    var h = 400;
    
    //Define path generator
    var projection = d3.geoMercator()
    .center([52.132633,5.291266])
                       .translate([w / 2, h/2])
                        .scale(100);
    
    
    var path = d3.geoPath()
                  .projection(projection);
    
    var colorScalePos = d3.scaleSequential()
                       .range([ "white","green"])
                       .clamp(false);
    var colorScaleNeg = d3.scaleSequential()
    .range(["#ecc5fa","#f7f7f7"])
    .clamp(false);
    
    var OCED_countries = ['Australia','Austria','Belgium','Canada','Chile','Czech Republic','Denmark','Estonia','Finland','France','Germany','Greece','Hungary','Iceland','Ireland','Israel',	
'Italy',	
'Japan',
'South Korea',	
'Latvia',	
'Luxembourg',	
'Mexico',	
'Netherlands',	
'New Zealand',	
'Norway',	
'Poland',
'Portugal',	
'Slovak Republic',
'Slovenia',	
'Spain',
'Sweden',
'Switzerland',	
'Türkiye',
'Russia',
'South Africa',
'Slovakia',
'Brazil',
'United Kingdom',	
'United States of America'];
    

    //Create SVG element
    var svg = d3.select("#world_map")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
        
    
    
            
    d3.csv("betterlife_total_tumi.csv",function(data){
      return {
        "Country": data.Country,
        "Net_migration": parseInt(data.Net_migration)
      }
    }).then(function(data) {

      console.log(d3.max(data, function(d) {return d.Net_migration;}));
      colorScalePos.domain([
        d3.min(data, function(d) {return d.Net_migration;}),
        d3.max(data, function(d) {return d.Net_migration;})

    ]);
    colorScaleNeg.domain([
      d3.min(data, function(d) {return d.Net_migration;}),
      d3.max(data, function(d) {return d.Net_migration;})
  ]);
        //Load in GeoJSON data
        d3.json("custom.geo.json").then(function(json) {
console.log(json);
for (var i = 0; i < data.length; i++) {
  // grab state nane
  var dataCountry = data[i].Country;

  // grab data value, convert from string to float
  var dataValue = parseFloat(data[i].Net_migration);

  // find corresponding state inside the GeoJSON
  for (var j = 0; j < json.features.length; j++) {
      var jsonCountry = json.features[j].properties.name;

      if (dataCountry == jsonCountry) {
          // copy data value into json
          json.features[j].properties.value = dataValue;

          break;
      }
  }
}
                // var tooltip = d3.select("body")
                // .append("div")
                // .attr("class", "tooltip")
                // .style("opacity", 0);
              
            //   // Create a group element for each country
              var countries = svg.selectAll("g")
                                 .data(json.features)
                                 .enter()
                                 .append("g")
                                 .attr("class", "country")
                                 .attr("id", function(d) { return d.id; });
                                  
                countries.append('path')
                         .attr('d',path)
                         .attr("fill", (d) => {
                          var value = d.properties.value;
    
                          if (value >=0) {
                            return colorScalePos(value);
                          }
                          else if (value <0) {
                            return colorScaleNeg(value);
                          } else {
                              // if value is undefined
                              return "#ccc";
                          }
                         })
                        .style("stroke", "black")
                        .style("stroke-width", "0.1px");
                countries.append('title')
                .text(function(d){
                    return d.properties.name;
                });
                // var svg = d3.select("#heatmap")
                //                     .append("svg")
                //                     .attr("width", 100)
                //                     .attr("height", 400);

                //   // Add the image to the heatmap SVG
                  svg.append("image")
                    .attr("xlink:href", "legend.png") // Replace "image.png" with the path to your image file
                    .attr("x", 5)
                    .attr("y", h-150)
                    .attr("width", 275)
                    .attr("height", 200);

                 d3.json('convertcsv.json').then(function(data){
                    console.log(data[0].name);
                     svg.selectAll('circle')
                       .data(data)
                       .enter()
                       .append('circle')
                       .attr('cx',function(d){
                        return projection([d.longitude,d.latitude])[0];
                       })
                       .attr('cy',function(d){
                        return projection([d.longitude,d.latitude])[1]; 
                       })
                       .attr('r',4)
                       .style('fill','yellow')
                       .style('opacity',0.5);
        
                       svg.selectAll('circle')
                       .on("mouseover", function(event,d) {
                        var index = d.id;
                        
                        // Get the mouse coordinates
                        var coordinates = d3.pointer(this)
                        var mouseX = coordinates[0];
                        var mouseY = coordinates[1];
                  
                        // Generate the HTML table content
                        var tableHTML = "<table>";
                        tableHTML += "<tr>Country: " +d.name+ "</tr>";
                        tableHTML += "<tr><th>Air pollution</th><th>Dwellings without basic facilities</th><th>Educational attainment</th><th>Employees working very long hours</th><th>Employment rate</th><th>Feeling safe walking alone at night</th><th>Homicide rate</th><th>Household net adjusted disposable income</th><th>Household net financial wealth</th><th>Housing expenditure</th><th>Labour market insecurity</th><th>Life expectancy</th><th>Life satisfaction</th><th>Long-term unemployment rate</th><th>Personal earnings</th><th>Quality of support network</th><th>Rooms per person</th><th>Self-reported health</th><th>Stakeholder engagement for developing regulations</th><th>Student skills</th><th>Time devoted to leisure and personal care</th><th>Voter turnout</th><th>Water quality</th></tr>";
                        tableHTML += "<tr><td>" + d.index1 + "</td><td>" + d.index2 + "</td><td>" + d.index3 + "</td><td>" + d.index4 + "</td><td>" + d.index5 + "</td><td>" +
                        d.index6 + "</td><td>" + d.index7 + "</td><td>" + d.index8 + "</td><td>" + d.index9 + "</td><td>" + d.index10 + "</td><td>" + d.index11 + "</td><td>" +d.index12 + "</td><td>" +d.index13 + "</td><td>" +d.index14 + "</td><td>" +d.index15 + "</td><td>" +d.index16 + "</td><td>" +d.index17 + "</td><td>" +d.index18 + "</td><td>" +d.index19 + "</td><td>" +d.index20 + "</td><td>" +d.index21 + "</td><td>" +d.index22 + "</td><td>" +d.index23 + "</td></tr>";                  
                        tableHTML += "</table>";
                        
                        // Show the tooltip and update its content
                        d3.select(".tooltip")
                          .style("display", "block")
                          .style("left", mouseX + "px")
                          .style("top", mouseY + "px")
                          .html(tableHTML);
                      })
                      .on("mouseout", function() {
                        // Hide the tooltip
                        d3.select(".tooltip").style("display", "none");
                      });
                        
                              });
                          }
                          )
                      });
    

     }
     function topFunction() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
   window.onload = init;