      var svg = dimple.newSvg("#chartContainer", 700, 550);
      d3.csv("correlated-data.csv", function (data) {

          // Filter for 1 year
          data = dimple.filterData(data, "Year", [
              "2001", "2002", "2003", "2004", "2005", "2006",
              "2007", "2008", "2009", "2010", "2011"          ]);

          // Create the indicator chart on the right of the main chart
          var indicator = new dimple.chart(svg, data);

          // Pick blue as the default and orange for the selected month
          var defaultColor = indicator.defaultColors[2];
          var indicatorColor = indicator.defaultColors[7];

          // The frame duration for the animation in milliseconds
          var frame = 1000;

          var firstTick = true;

          // Place the indicator bar chart to the right
          indicator.setBounds(434, 49, 153, 311);

          // Add dates along the y axis
          var y = indicator.addCategoryAxis("y", "Year");
          y.addOrderRule("female_suicides", "Desc");

          // Use sales for bar size and hide the axis
          var x = indicator.addMeasureAxis("x", "female_suicides");
          x.hidden = true;

          // Add the bars to the indicator and add event handlers
          var s = indicator.addSeries(null, dimple.plot.bar);
          s.addEventHandler("click", onClick);
          // Draw the side chart
          indicator.draw();

          // Remove the title from the y axis
          y.titleShape.remove();

          // Remove the lines from the y axis
          y.shapes.selectAll("line,path").remove();

          // Move the y axis text inside the plot area
          y.shapes.selectAll("text")
                  .style("text-anchor", "start")
                  .style("font-size", "11px")
                  .attr("transform", "translate(18, 0.5)");

          // This block simply adds the legend title. I put it into a d3 data
          // object to split it onto 2 lines.  This technique works with any
          // number of lines, it isn't dimple specific.
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

          // Manually set the bar colors
          s.shapes
                  .attr("rx", 10)
                  .attr("ry", 10)
                  .style("fill", function (d) { return (d.y === '2001' ? indicatorColor.fill : defaultColor.fill) })
                  .style("stroke", function (d) { return (d.y === '2001' ? indicatorColor.stroke : defaultColor.stroke) })
                  .style("opacity", 0.4);

          // Draw the main chart
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

          // Add a storyboard to the main chart and set the tick event
          var story = bubbles.setStoryboard("Year", onTick);
          // Change the frame duration
          story.frameDuration = frame;
          // Order the storyboard by date
          //story.addOrderRule("Year");

          // Draw the bubble chart
          bubbles.draw();

          // Orphan the legends as they are consistent but by default they
          // will refresh on tick
          bubbles.legends = [];
          // Remove the storyboard label because the chart will indicate the
          // current month instead of the label
          story.storyLabel.remove();

          // On click of the side chart
          function onClick(e) {
              // Pause the animation
              story.pauseAnimation();
              // If it is already selected resume the animation
              // otherwise pause and move to the selected month
              if (e.yValue === story.getFrameValue()) {
                  story.startAnimation();
              } else {
                  story.goToFrame(e.yValue);
                  story.pauseAnimation();
              }
          }

          // On tick of the main charts storyboard
          function onTick(e) {
              if (!firstTick) {
                  // Color all shapes the same
                  s.shapes
                          .transition()
                          .duration(frame / 2)
                          .style("fill", function (d) { return (d.y === e ? indicatorColor.fill : defaultColor.fill) })
                          .style("stroke", function (d) { return (d.y === e ? indicatorColor.stroke : defaultColor.stroke) });
              }
              firstTick = false;
          }
      });
  
