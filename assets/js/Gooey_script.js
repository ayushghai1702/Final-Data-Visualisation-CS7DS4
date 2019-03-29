
			///////////////////////////////////////////////////////////////////////////
			//////////////////// Set up and initiate svg containers ///////////////////
			///////////////////////////////////////////////////////////////////////////	

			var margin  = {
				top: 100,
				right: 0,
				bottom: 0,
				left: 0
			};
			var width = 960 - margin.left - margin.right,
				height = 600 - margin.top - margin.bottom;
						
			//SVG container
			var svg = d3.select('#chart')
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

			///////////////////////////////////////////////////////////////////////////
			///////////////////////////// Create filter ///////////////////////////////
			///////////////////////////////////////////////////////////////////////////	

			//SVG filter for the gooey effect
			//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
			var defs = svg.append("defs");
			var filter = defs.append("filter").attr("id","gooeyCodeFilter");
			filter.append("feGaussianBlur")
				.attr("in","SourceGraphic")
				.attr("stdDeviation","10")
				//to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
				.attr("color-interpolation-filters","sRGB") 
				.attr("result","blur");
			filter.append("feColorMatrix")
				.attr("class", "blurValues")
				.attr("in","blur")
				.attr("mode","matrix")
				.attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -5")
				.attr("result","gooey");
			filter.append("feBlend")
				.attr("in","SourceGraphic")
				.attr("in2","gooey")
				.attr("operator","atop");

		 	///////////////////////////////////////////////////////////////////////////
			//////////////////////////// Set-up Map /////////////////////////////////
			/////////////////////////////////////////////////////////////////////////// 

			//Variables for the map
			var projection = d3.geo.mercator()
					.scale(170)
					.translate([480,230]);
	  
			var path = d3.geo.path()
					.projection(projection);
	
			var map = svg.append("g")
						.attr("class", "map");

			//Initiate the world map
			map.selectAll(".geo-path")
				.data(countriesMap[0].features)
				.enter().append("path")
					.attr("class", function(d) { return "geo-path" + " " + d.id; })
					.attr("id", function(d) { return d.properties.name; })
					.attr("d", path)
					.style("stroke-opacity", 1)
					.style("fill-opacity", 0.5);

		 	///////////////////////////////////////////////////////////////////////////
			//////////////////////////////// Cities ///////////////////////////////////
			/////////////////////////////////////////////////////////////////////////// 

			//Radius scale
			var rScale = d3.scale.pow()
				.exponent(3.5)
				.range([1,10])
				.domain([0, d3.max(suicides, function(d) { return d.suicide_rate; })]);

			//Put the city locations into the data itself
			suicides.forEach(function(d,i) {
					d.radius = rScale(d.suicide_rate);
					d.x = projection([d.longitude, d.latitude])[0];
					d.y = projection([d.longitude, d.latitude])[1];
			});

			//Wrapper for the cities
			var cityWrapper = svg.append("g")
				.attr("class", "cityWrapper")
				.style("filter", "url(#gooeyCodeFilter)");
				
			//Place the city circles
			var cities = cityWrapper.selectAll(".cities")
				.data(suicides)
				.enter().append("circle")
				.attr("class", "cities")
				.attr("r", function(d) { return d.radius ;})
				.attr("cx", projection([0,0])[0])
				.attr("cy", projection([0,0])[1])
				.style("opacity", 1);

			var coverCirleRadius = 40;//40 earlier
			//Circle over all others
			cityWrapper.append("circle")
				.attr("class", "cityCover")
				.attr("r", coverCirleRadius)
				.attr("cx", projection([0,0])[0])
				.attr("cy", projection([0,0])[1]);

		 	///////////////////////////////////////////////////////////////////////////
			/////////////////////////// Country Labels ////////////////////////////////
			/////////////////////////////////////////////////////////////////////////// 

			//Calculate the centers for each country
			var centers = getCenters("region", [width, height/0.8]);
			centers.forEach(function(d) {
					d.y = d.y - 100;
					d.x = d.x + 0;
			});//centers forEach

			//Wrapper for the country labels
			var labelWrapper = svg.append("g")
				.attr("class", "labelWrapper");
				
			//Append the country labels
		    labelWrapper.selectAll(".label")
		      	.data(centers)
		      	.enter().append("text")
		      	.attr("class", "label")
		      	.style("opacity", 0)
		      	.attr("transform", function (d) { return "translate(" + (d.x) + ", " + (d.y - 60) + ")"; })
		      	.text(function (d) { return d.name });
																			
			///////////////////////////////////////////////////////////////////////////
			/////////////////////////// Set-up the force //////////////////////////////
			///////////////////////////////////////////////////////////////////////////	

			var force = d3.layout.force()
				.gravity(.02)
		    	.charge(0)
		    	.on("tick", tick(centers, "region"));	
		
			var padding = 0;
			var maxRadius = d3.max(suicides, function(d) { return d.radius; });	

			///////////////////////////////////////////////////////////////////////////
			///////////////////////////// Do the loop /////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	
					
			loop();	
			setInterval(loop, 15000);
			
			function loop() {
				placeCities();
				setTimeout(clusterCountry, 7000);
				setTimeout(backToCenter, 12000);
			}//loop
						
			///////////////////////////////////////////////////////////////////////////
			/////////////////////////// Animation steps ///////////////////////////////
			///////////////////////////////////////////////////////////////////////////	
					
			//Move the cities from the center to their actual locations
			function placeCities () {

				//Stop the force layout (in case you move backward)
				force.stop();

				//Make the cover circle shrink
				d3.selectAll(".cityCover")
						.transition().duration(3000)
						.attr("r", 0);

				//Put the cities in their geo location
				d3.selectAll(".cities")
					.transition("move").duration(2000)
					.delay(function(d,i) { return i*20; })
					.attr("r", function(d) {
						return d.radius = rScale(d.suicide_rate);
					})
					.attr("cx", function(d) {
						return d.x = projection([d.longitude, d.latitude])[0];
					})
					.attr("cy", function(d) {
						return d.y = projection([d.longitude, d.latitude])[1];
					});
						
				//Around the end of the transition above make the circles see-through a bit
				d3.selectAll(".cities")
					.transition("dim").duration(1000).delay(4000)
					.style("opacity", 0.8);

				//"Remove" gooey filter from cities during the transition
				//So at the end they do not appear to melt together anymore
				d3.selectAll(".blurValues")
					.transition().duration(4000)
					.attrTween("values", function() { 
						return d3.interpolateString("1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -5", 
													"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -5"); 
					});

			}//placeCities

			//Cluster all the cities based on the country
			function clusterCountry() {

				///Start force again
				force.start();

				//Dim the map
				d3.selectAll(".geo-path")
					.transition().duration(1000)
					.style("fill-opacity", 0);
					
				//Show the labels
				d3.selectAll(".label")
					.transition().duration(500)
					.style("opacity", 1);

				d3.selectAll(".cities")
					.transition().duration(1000)
					.style("opacity", 1);

				//Reset gooey filter values back to a visible "gooey" effect
			   	d3.selectAll(".blurValues")
					.transition().duration(2000)
					.attrTween("values", function() { 
						return d3.interpolateString("1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -5", 
													"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -6"); 
					});

			}//clusterCountry

			//Move the circles back to the center location again
			function backToCenter () {

				//Stop the force layout
				force.stop();

				//Hide labels
				d3.selectAll(".label")
					.transition().duration(500)
					.style("opacity", 0);

				//Show map
				d3.selectAll(".geo-path")
					.transition().duration(1000)
					.style("fill-opacity", 0.5);
				
			   	//Make the cover cirlce to its true size again
			    d3.selectAll(".cityCover")
					.transition().duration(3000).delay(500)
					.attr("r", coverCirleRadius);

			    //Move the cities to the 0,0 coordinate
				d3.selectAll(".cities")
					.transition()
					.duration(2000).delay(function(d,i) { return i*10; })
					.attr("cx", projection([0, 0])[0])
					.attr("cy", projection([0, 0])[1])
					.style("opacity", 1);
					
				d3.selectAll(".blurValues")
					.transition().duration(1000).delay(1000)
					.attrTween("values", function() {
						return d3.interpolateString("1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -6",
													"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -5");
					});

			}//backToCenter
	
		 	///////////////////////////////////////////////////////////////////////////
			/////////////////////////// Helper functions //////////////////////////////
			/////////////////////////////////////////////////////////////////////////// 

			//Radial layout
			function getCenters (vname, size) {
			  	var centers = [], 
					mapping,
					flags = [];
				for( var i = 0; i < suicides.length; i++) {
				    if( flags[suicides[i][vname]]) continue;
				    flags[suicides[i][vname]] = true;
				    centers.push({name: suicides[i][vname], value: 1});
				}//for i
			  	centers.sort(function(a, b){ return d3.ascending(a.name, b.name); });

			  	mapping = d3.layout.pack()
			  		.sort(function(d) { return d[vname]; })
			  		.size(size);
			  	mapping.nodes({children: centers});

			  	return centers;
			}//getCenters
	
			//Radial lay-out
			function tick (centers, varname) {
				var foci = {};
				for (var i = 0; i < centers.length; i++) {
					foci[centers[i].name] = centers[i];
				}
	  
				return function (e) {
					for (var i = 0; i < suicides.length; i++) {
					  var o = suicides[i];

					  var f = foci[o[varname]];
					  
					  o.y += (f.y - o.y) * e.alpha;
					  o.x += (f.x - o.x) * e.alpha;
					}//for
					
					d3.selectAll(".cities")
						.each(collide(.5))
						.attr("cx", function (d) { return d.x; })
						.attr("cy", function (d) { return d.y; });

				}//function
			}//tick

			function collide(alpha) {
		          var quadtree = d3.geom.quadtree(suicides);
		          return function (d) {
		            var r = d.radius + maxRadius + padding,
		                nx1 = d.x - r,
		                nx2 = d.x + r,
		                ny1 = d.y - r,
		                ny2 = d.y + r;
		            
		            quadtree.visit(function(quad, x1, y1, x2, y2) {
		              if (quad.point && (quad.point !== d)) {
		                var x = d.x - quad.point.x,
		                    y = d.y - quad.point.y,
		                    l = Math.sqrt(x * x + y * y),
		                    r = d.radius + quad.point.radius + padding;
		                if (l < r) {
		                  l = (l - r) / l * alpha;
		                  d.x -= x *= l;
		                  d.y -= y *= l;
		                  quad.point.x += x;
		                  quad.point.y += y;
		                }
		              }
		              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		            });
		          };
		    }//collide
					