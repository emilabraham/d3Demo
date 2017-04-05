var margin = { top: 10, right: 20, bottom: 60, left: 80 };
var height = 400 - margin.top - margin.bottom; //Leave room for axes
var width = 565 - margin.left - margin.right;


//Define boundary of svg image
var svg = d3.select('.barChart')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .call(responsivefy)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// Import data source
d3.json('./data.json', function (err, data) {
  //Get domain and range for the yScale
  var yScale = d3.scaleBand()
    .domain(data.map(d => d.step))
    .range([0, height]);

  var yAxis = d3.axisLeft(yScale);
  svg.call(yAxis);

  var xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

  var xAxis = d3.axisBottom(xScale)
    .ticks(5)
    .tickSize(10)
    .tickPadding(5);
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`) //Move down to bottom of svg
    .call(xAxis);

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', d => yScale(d.step))
    .attr('width', d => xScale(d.percent))
    .attr('height', d => yScale.bandwidth());
})



function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMinYMid")
      .call(resize);

  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on("resize." + container.attr("id"), resize);

  // get width of container and resize svg to fit it
  function resize() {
      var targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
  }
}
