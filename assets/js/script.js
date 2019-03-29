var w = 600,
	h = 600;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Singapore','China','India',  'United states', 'New Zealand'];
//var LegendOptions = ['India','China'];
//var LegendOptions = ['India','Singapore','China'];
/*
{axis:"mental hospitalsx100",value: 0.002},
		 	{axis:"psychologists workingx10",value: 0.0123},
			{axis:"Mental Health expenditure/1000",value: 0.00414},
			{axis:"psychiatrists workingx10",value: 0.0348},
			{axis:"suicide rate",value: 0.0086}
*/
//Data

var d = [
		 [	{axis:"mental hospitals",value: 0.002},
		 	{axis:"psychologists working",value: 0.0123},
			{axis:"Mental Health expenditure",value: 0.00414},
			{axis:"psychiatrists working",value: 0.0348},
			{axis:"suicide rate",value: 0.0086}
		  ],

		  [	{axis:"mental hospitals",value: 0.006},
		    {axis:"psychologists working",value:0.0018},
			{axis:"Mental Health expenditure",value:0.0025},
			{axis:"psychiatrists working",value:0.0153},
			{axis:"suicide rate",value: 0.0085}

		  ],
		 [	{axis:"mental hospitals",value: 0.0004},
		 	{axis:"psychologists working",value:0.0007},
			{axis:"Mental Health expenditure",value:0.00006},
			{axis:"psychiatrists working",value:0.003},
			{axis:"suicide rate",value: 0.016}
		  ],[
		    {axis:"mental hospitals",value:0.025},
		    {axis:"psychologists working",value:0.02962},
			{axis:"Mental Health expenditure",value:0.0063},
			{axis:"psychiatrists working",value:0.01240},
			{axis:"suicide rate",value:0.0126}
		  ], [	
		    {axis:"mental hospitals",value: 0.012},
		    {axis:"psychologists working",value: 0.01378},
		    {axis:"Mental Health expenditure",value: 0.01},
			{axis:"psychiatrists working",value: 0.00976},
			{axis:"suicide rate",value: 0.0123}

		]

		];

	/*	[	
			{axis:"Mental Health expenditure/1000",value:0.0063},
			{axis:"psychiatrists working",value:0.01240},
			{axis:"psychologists working",value:0.02962},
			{axis:"mental hospitalsx100",value:0.025},
			{axis:"suicide rate",value:0.0126}

		],[	{axis:"Mental Health expenditure/1000",value: 0.01},
			{axis:"psychiatrists working",value: 0.00976},
			{axis:"psychologists working",value: 0.01378},
			{axis:"mental hospitalsx100",value: 0.012},
			{axis:"suicide rate",value: 0.0123}

		]
		  
		];
	

/*
var d = [
		  [
			{axis:"Mental Health expenditure/1000",value:0.00006},
			{axis:"psychiatrists working",value:0.0003},
			{axis:"psychologists working",value:0.00007},
			{axis:"mental hospitalsx10",value: 0.00004},
			{axis:"suicide rate/10",value: 0.0016}
		  ],[
			{axis:"Mental Health expenditure/1000",value: 0.00414},
			{axis:"psychiatrists working",value: 0.00348},
			{axis:"psychologists working",value: 0.00123},
			{axis:"mental hospitalsx10",value: 0.0002},
			{axis:"suicide rate/10",value: 0.00086}
		  ],[
			{axis:"Mental Health expenditure/1000",value:0.0025},
			{axis:"psychiatrists working",value:0.00153},
			{axis:"psychologists working",value:0.00018},
			{axis:"mental hospitalsx10",value: 0.0006},
			{axis:"suicide rate/10",value: 0.00085}

		]
		  
		];
*/
//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.009,
  levels: 0.09,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#radar-chart", d, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#radar-body')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)

//Create the title for the legend
var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)') 
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040")
	.text("");
		
//Initiate Legend	
var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)') 
	;
	//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 52)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;
