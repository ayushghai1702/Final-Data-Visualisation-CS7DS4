var w = 600,
	h = 600;

var colorscale = d3.scale.category10();


var LegendOptions = ['Singapore','China','India',  'United states', 'New Zealand'];


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


var mycfg = {
  w: w,
  h: h,
  maxValue: 0.009,
  levels: 0.09,
  ExtraWidthX: 300
}

RadarChart.draw("#radar-chart", d, mycfg);

var svg = d3.select('#radar-body')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)

var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)') 
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040")
	.text("");
		
var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)') 
	;
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
