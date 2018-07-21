var arrayObj=new Array();
var percent = d3.format("1"),
    format = d3.time.format("%Y%m%d");
var cccity = "北京";
var all_csv = [];
console.log(all_csv);
var calendar={
  initialize:function()
  {
var width = $('#calendar-svg').width(),
    height = $('#calendar-svg').height(),
    cellSize = width/55; // cell size

console.log(d3.select("#calendar"));
var svg = d3.select("#calendar-svg").selectAll("svg")
    .data(d3.range(2016,2017))
    .enter().append("svg")
	.attr("id","nsvg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
    .append("g")
    .attr("transform", "translate(" + 20 + "," + 20 + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });

var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
    .datum(format);

rect.append("title")
    .text(function(d) { return d; });

svg.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);

var attributes=new Array();
var num=1;

d3.csv("../static/data/pm2.5_day.csv", function(error, csv) {
  if (error) throw error;
 /* for (var item in csv[0]){
    attributes[item]=num;
    num++;
  }*/
    //console.log(attributes["beijing"]);
  //console.log(csv);
  var color = d3.scale.quantize()
    .domain([500,0])
    .range(d3.range(12).map(function(d) { return "q" + d + "-11"; }));

   
  var data = d3.nest()
    .key(function(d) { return d.date; })
    .rollup(function(d){return d[0][cccity];})
    .map(csv);
all_csv = csv;
  rect.filter(function(d) { return d in data; })
      .attr("class", function(d) { return "day " + color(data[d]); })
      .select("title")
      .text(function(d) { return d + ": " + Math.round(percent(data[d])); });
});
function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
      d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}
},
changeColor:function change_color(sm,sd,em,ed){
  console.log(sm,sd,em,ed);
  if(Number(sm)<10) {sm="0"+sm;console.log(sm);}
  if(Number(em)<10) {em="0"+em;console.log(em);}
  if(Number(sd)<10) {sd="0"+sd;console.log(sd);}
  if(Number(ed)<10) {ed="0"+ed;console.log(ed);}
  var start="2016"+sm+sd;
  var end="2016"+em+ed;
  map.update(arrayObj[start],arrayObj[end]);
  console.log(start);
  console.log(end);
  d3.csv("dataset//pm2.5_day.csv", function(error, csv) {
  if (error) throw error;
  var color1 = d3.scale.quantize()
    .domain([500,0])
    .range(d3.range(12).map(function(d) {
      return "q" + d + "-11"; }));

   var countnum=1;
  var data = d3.nest()
    .key(function(d) { arrayObj[d.date]=countnum;countnum++;return d.date; })
    .rollup(function(d){return d[0][cccity];})
    .map(csv);
   // console.log(arrayObj["20160418"]);
//console.log(data);
var rect = d3.select("#calendar-svg").selectAll("svg").selectAll(".day")
  rect.filter(function(d) { return d in data; })
      .style("opacity", function(d) {
       /* d3.nest().key(function(dd){
          console.log(dd.date);
          if((Number(dd.date)<Number(start)) || (Number(dd.date)>Number(end)))
            {console.log("A"+dd.date);return "q" + "11" + "-11"; }
          else
            {console.log("B"+dd.date); return "day " + color1(data[d]);}
        })*/
        //console.log(d);
        if((Number(d)<Number(start)) || (Number(d)>Number(end)))
          return 0.4;
        else
          {//console.log(color1(data[d]));
            //console.log(data[d]);
            //console.log(data);
            //console.log(color1);
            return 1 }
      })
      // return "day " + color1(data[d]); })
      .select("title")
      .text(function(d) { return d + ": " +Math.round(percent(data[d])); });
});

},
update:function(ci)
 {
var width = $('#calendar-svg').width(),
    height = $('#calendar-svg').height(),
    cellSize = width/55; // cell size


console.log("haha");
console.log(ci);

if (ci!="")
	cccity = ci;
console.log(d3.select("#nsvg"));
d3.selectAll("#nsvg").remove();
d3.selectAll("#nsvg").remove();
var svg = d3.select("#calendar-svg").selectAll("svg")
    .data(d3.range(2016,2017))
    .enter().append("svg")
	.attr("id","nsvg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
    .append("g")
    .attr("transform", "translate(" + 20 + "," + 20 + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });

var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
    .datum(format);

rect.append("title")
    .text(function(d) { return d; });

svg.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);

var attributes=new Array();
var num=1;

 var color = d3.scale.quantize()
    .domain([500,0])
    .range(d3.range(12).map(function(d) { return "q" + d + "-11"; }));

   
  var data = d3.nest()
    .key(function(d) { return d.date; })
    .rollup(function(d){return d[0][cccity];})
    .map(all_csv);

  rect.filter(function(d) { return d in data; })
      .attr("class", function(d) { return "day " + color(data[d]); })
      .select("title")
      .text(function(d) { return d + ": " + Math.round(percent(data[d])); });
function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
      d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";

}
}
}



