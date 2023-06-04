
function popFill(fea){
    var dropdown1 = d3.select("#fea-1-select")
                   .attr("onchange", "changeValue(1)")
        
    console.log(dropdown1);
    var dropdown2 = d3.select("#fea-2-select")
                    .attr("onchange", "changeValue(2)")
    
    dropdown1.selectAll("option")
        //     .data(fea.slice(1, fea.length - 1))
            .data(fea.slice(1, fea.length))
            .enter()
            .append("option")
            .attr("value", function(d){
                    return d;
                })
                .text(function(d){
                        return d;
                });
                
        dropdown2.selectAll("option")
        //     .data(fea.slice(1, fea.length - 1))
            .data(fea.slice(1, fea.length))
            .enter()
            .append("option")
            .attr("value", function(d){
            return d;
            })
            .text(function(d){
            return d;
            });
}




