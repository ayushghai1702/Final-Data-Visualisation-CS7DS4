      var svg = dimple.newSvg("#chartContainer", 700, 550);
      d3.csv("correlated-data.csv", function (data) {

          data = dimple.filterData(data, "Year", [
              "2001", "2002", "2003", "2004", "2005", "2006",
              "2007", "2008", "2009", "2010", "2011"          ]);

          var indicator = new dimple.chart(svg, data);

          var defaultColor = indicator.defaultColors[2];
          var indicatorColor = indicator.defaultColors[7];

          var frame = 1000;

          var firstTick = true;

          indicator.setBounds(434, 49, 153, 311);

          var y = indicator.addCategoryAxis("y", "Year");
          y.addOrderRule("female_suicides", "Desc");

          var x = indicator.addMeasureAxis("x", "female_suicides");
          x.hidden = true;

          var s = indicator.addSeries(null, dimple.plot.bar);
          s.addEventHandler("click", onClick);
          indicator.draw();

          y.titleShape.remove();

          y.shapes.selectAll("line,path").remove();

          y.shapes.selectAll("text")
                  .style("text-anchor", "start")
                  .style("font-size", "11px")
                  .attr("transform", "translate(18, 0.5)");

          //
          svg.selectAll("title_text")
                  .data(["Click bar to select",
                      "and pause. Click again",
                      "to resume animation"])
                  .enter()
                  .append("text")
                  .attr("x", 435)
                  .attr("y", function (d, i) { return 15 + i * 12; })
                  .style("font-family", "sans-serif")
                  .style("font-size", "10px")
                  .style("color", "Black")
                  .text(function (d) { return d; });

          s.shapes
                  .attr("rx", 10)
                  .attr("ry", 10)
                  .style("fill", function (d) { return (d.y === '2001' ? indicatorColor.fill : defaultColor.fill) })
                  .style("stroke", function (d) { return (d.y === '2001' ? indicatorColor.stroke : defaultColor.stroke) })
                  .style("opacity", 0.4);

          var bubbles = new dimple.chart(svg, data);
		bubbles.defaultColors = [
		new dimple.color("#006347"),
		new dimple.color("#215517"),
		new dimple.color("#425D10"),
		new dimple.color("#63BA97"),
		new dimple.color("#019477"),
		new dimple.color("#54B9C1"),
		new dimple.color("#0091A0"),
		new dimple.color("#97D0A7"),
		new dimple.color("#411747"),
		new dimple.color("#082F6D"),
		new dimple.color("#1D5789"),
		new dimple.color("#7AA6D7"),
		new dimple.color("#386373"),
		new dimple.color("#56187D"),
		new dimple.color("#79127F"),
		new dimple.color("#EEA187"),
		new dimple.color("#DE8277"),
		new dimple.color("#D38895"),
		new dimple.color("#9C58A1"),
		new dimple.color("#E4780A"),
		new dimple.color("#CD0027"),
		new dimple.color("#B91655"),
		new dimple.color("#DF4018"),
		new dimple.color("#E2B53E"),
		new dimple.color("#DEC990"),
		new dimple.color("#FFE001"),
		new dimple.color("#E6CD69"),
		new dimple.color("#411C01"),
		new dimple.color("#89B524"),
		new dimple.color("#6A6A68"),
		new dimple.color("#DD6BA7"),
		new dimple.color("#DD3F4E"),
		new dimple.color("#DB2879"),
		new dimple.color("#FEF8D4")

		]; 
          bubbles.setBounds(60, 50, 355, 310)
          bubbles.addMeasureAxis("x", "male_suicides");
          bubbles.addMeasureAxis("y", "female_suicides");
	     bubbles.addSeries(["State"], dimple.plot.bubble)
          bubbles.addLegend(60, 400, 500, 120);

          var story = bubbles.setStoryboard("Year", onTick);
          story.frameDuration = frame;

          bubbles.draw();

   
          bubbles.legends = [];
          
          story.storyLabel.remove();

          function onClick(e) {
              story.pauseAnimation();
              
              if (e.yValue === story.getFrameValue()) {
                  story.startAnimation();
              } else {
                  story.goToFrame(e.yValue);
                  story.pauseAnimation();
              }
          }

          function onTick(e) {
              if (!firstTick) {
                  s.shapes
                          .transition()
                          .duration(frame / 2)
                          .style("fill", function (d) { return (d.y === e ? indicatorColor.fill : defaultColor.fill) })
                          .style("stroke", function (d) { return (d.y === e ? indicatorColor.stroke : defaultColor.stroke) });
              }
              firstTick = false;
          }
      });
  
