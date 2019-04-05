var margin = {left:80, top:10, right:120, bottom:150},
	width = Math.max( Math.min(window.innerWidth, 1100) - margin.left - margin.right - 20, 700),
    height = Math.max( Math.min(window.innerHeight - 250, 900) - margin.top - margin.bottom - 20, 500),
    innerRadius = Math.min(width * 0.43, height * .50),
    outerRadius = innerRadius * 1.05;
	
width = outerRadius * 2 + margin.right + margin.left;
height = outerRadius * 2 + margin.top + margin.bottom;
	
var newFontSize = Math.min(70, Math.max(40, innerRadius * 62.5 / 250));
d3.select("html").style("font-size", newFontSize + "%");



	
var pullOutSize = 20 + 30/135 * innerRadius;
var numFormat = d3.format(",.0f");
var defaultOpacity = 0.85,
	fadeOpacity = 0.075;
						
var loom = d3.loom()
    .padAngle(0.05)

	.emptyPerc(0.2)
	.widthInner(20)
	.value(function(d) { return d.Total; })
	.inner(function(d) { return d.State; })
	.outer(function(d) { return d.Type; });

var arc = d3.arc()
    .innerRadius(innerRadius*1.01)
    .outerRadius(outerRadius);

var string = d3.string()
    .radius(innerRadius)
	.pullout(pullOutSize);


	
	
var characterNotes = [];
characterNotes["Maharashtra"] = "Suicide rate of farmers is maximum in Maharashtra";



			
var svg = d3.select("#lotr-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

		
d3.json('professional_profile.json', function (error, dataAgg) {

	
	
	
	var dataChar = d3.nest()
		.key(function(d) { return d.State; })
		.rollup(function(leaves) { return d3.sum(leaves, function(d) { return d.Total; }); })
		.entries(dataAgg)
		.sort(function(a, b){ return d3.descending(a.value, b.value); });				
	var characterOrder = dataChar.map(function(d) { return d.key; });
	function sortCharacter(a, b) {
	  	return characterOrder.indexOf(a) - characterOrder.indexOf(b);
	}//sortCharacter
	
	loom
		.sortSubgroups(sortCharacter)
		.heightInner(innerRadius*1.4/characterOrder.length);
	

		
	var Types=['Farmers', 'Government Service', 'House Wife', 'Private Service',
 'Professional Activity', 'Public Sector Undertaking' ,'Retired Person',
 'Self-employed', 'Student' , 'Unemployed']
	
	var colors = ["#5a3511", "#47635f", "#223e15", "#c17924", "#0d1e25", "#53821a", "#017FA4","#770000", "#373F41", "#602317"]
	var color = d3.scaleOrdinal()
    	.domain(Types)
    	.range(colors);
	
	var g = svg.append("g")
	    .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
		.datum(loom(dataAgg));	


		

	var titles = g.append("g")
		.attr("class", "texts")
		.style("opacity", 0);
		
	titles.append("text")
		.attr("class", "name-title")
		.attr("x", 0)
		.attr("y", -innerRadius*5/6 -4);
		
	titles.append("text")
		.attr("class", "value-title")
		.attr("x", 0)
		.attr("y", -innerRadius*5/10 + 15);
	
	titles.append("text")
		.attr("class", "character-note")
		.attr("x", 0)
		.attr("y", innerRadius)
		.attr("dy", "0.35em");

		

	var arcs = g.append("g")
	    .attr("class", "arcs")
	  .selectAll("g")
	    .data(function(s) { 
			return s.groups; 
		})
	  .enter().append("g")
		.attr("class", "arc-wrapper")
	  	.each(function(d) { 
			d.pullOutSize = (pullOutSize * ( d.startAngle > Math.PI + 1e-2 ? -1 : 1)) 
		})
 	 	.on("mouseover", function(d) {
			
			d3.selectAll(".arc-wrapper")
		      	.transition()
				.style("opacity", function(s) { return s.outername === d.outername ? 1 : 0.5; });
			
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", function(s) { return s.outer.outername === d.outername ? 1 : fadeOpacity; });
				
			var locationData = loom(dataAgg).filter(function(s) { return s.outer.outername === d.outername; });
			d3.selectAll(".inner-label")
		      	.transition()
		        .style("opacity", function(s) {
					var char = locationData.filter(function(c) { return c.outer.innername === s.name; });
					return char.length === 0 ? 0.1 : 1;
				});
 	 	})
     	.on("mouseout", function(d) {
			
			d3.selectAll(".arc-wrapper")
		      	.transition()
				.style("opacity", 1);
			
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", defaultOpacity);
				
			d3.selectAll(".inner-label")
		      	.transition()
		        .style("opacity", 1);
 	 	});

	var outerArcs = arcs.append("path")
		.attr("class", "arc")
	    .style("fill", function(d) { return color(d.outername); })
	    .attr("d", arc)
		.attr("transform", function(d, i) { //Pull the two slices apart
		  	return "translate(" + d.pullOutSize + ',' + 0 + ")";
		 });
		 					
	
		 

	var outerLabels = arcs.append("g")
		.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2); })
		.attr("class", "outer-labels")
		.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
		.attr("transform", function(d,i) { 
			var c = arc.centroid(d);
			return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
			+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
			+ "translate(" + 26 + ",0)"
			+ (d.angle > Math.PI ? "rotate(180)" : "")
		})
		
	outerLabels.append("text")
		.attr("class", "outer-label")
		.attr("dy", ".35em")
		.text(function(d,i){ return d.outername; });
		
	outerLabels.append("text")
		.attr("class", "outer-label-value")
		.attr("dy", "1.5em")
		.text(function(d,i){ return numFormat(d.value) + " suicides"; });

	
		
	var strings = g.append("g")
	    .attr("class", "stringWrapper")
		.style("isolation", "isolate")
	  .selectAll("path")
	    .data(function(strings) { 
			return strings; 
		})
	  .enter().append("path")
		.attr("class", "string")
		.style("mix-blend-mode", "multiply")
	    .attr("d", string)
	    .style("fill", function(d) { return d3.rgb( color(d.outer.outername) ).brighter(0.2) ; })
		.style("opacity", defaultOpacity);
		
		
			
	var innerLabels = g.append("g")
		.attr("class","inner-labels")
	  .selectAll("text")
	    .data(function(s) { 
			return s.innergroups; 
		})
	  .enter().append("text")
		.attr("class", "inner-label")
		.attr("x", function(d,i) { return d.x; })
		.attr("y", function(d,i) { return d.y; })
		.style("text-anchor", "middle")
		.attr("dy", ".35em")
	    .text(function(d,i) { return d.name; })
 	 	.on("mouseover", function(d) {
			
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", function(s) {
					return s.outer.innername !== d.name ? fadeOpacity : 1;
				});
				
			var characterData = loom(dataAgg).filter(function(s) { return s.outer.innername === d.name; });
			d3.selectAll(".outer-label-value")
				.text(function(s,i){
					var loc = characterData.filter(function(c) { return c.outer.outername === s.outername; });
					if(loc.length === 0) {
						var value = 0;
					} else {
						var value = loc[0].outer.value;
					}
					return numFormat(value) + (value === 1 ? " suicide" : " suicides"); 
					
				});
			
			d3.selectAll(".arc-wrapper")
		      	.transition()
		        .style("opacity", function(s) {
					var loc = characterData.filter(function(c) { return c.outer.outername === s.outername; });
					return loc.length === 0 ? 0.1 : 1;
				});
					
			d3.selectAll(".texts")
				.transition()
				.style("opacity", 1);	
			d3.select(".name-title")
				.text(d.name);
			d3.select(".value-title")
				.text(function() {
					var words = dataChar.filter(function(s) { return s.key === d.name; });
					return numFormat(words[0].value);
				});
				
			
			d3.selectAll(".character-note")
				.text(characterNotes[d.name])
				.call(wrap, 2.25*pullOutSize);
				
		})
     	.on("mouseout", function(d) {
			
		    d3.selectAll(".string")
		      	.transition()
				.style("opacity", defaultOpacity);
				
			d3.selectAll(".outer-label-value")	
				.text(function(s,i){ return numFormat(s.value) + " suicides"; });
				
			d3.selectAll(".arc-wrapper")
		      	.transition()
		        .style("opacity", 1);
			
			d3.selectAll(".texts")
				.transition()
				.style("opacity", 0);
			
		});
	  		
});//d3.csv



function sortAlpha(a, b){
	    if(a < b) return -1;
	    if(a > b) return 1;
	    return 0;
}//sortAlpha

function sortWords(a, b){
	    if(a.Total < b.Total) return -1;
	    if(a.Total > b.Total) return 1;
	    return 0;
}//sortWords

function wrap(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.2, // ems
		y = parseFloat(text.attr("y")),
		x = parseFloat(text.attr("x")),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}//wrap
