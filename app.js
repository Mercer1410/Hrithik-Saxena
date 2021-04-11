jQuery(document).ready(function() {

  var mouseX = 0, mouseY = 0;
  var xp = 0, yp = 0;
   
  $(document).mousemove(function(e){
    mouseX = e.pageX - 20;
    mouseY = e.pageY - 20; 
  });
  $(document).mousedown(function(){
    $("#circle").css({
      transform: "scale(1.2)",
      borderColor: "aqua",
      transition: "transform 0.5s"
    });
  });
  $(document).mouseup(function(){
    $("#circle").css({
      transform: "scale(1)",
      borderColor: "#fff",
      transition: "transform 0.5s"
    });
  });
    
  setInterval(function(){
    xp += ((mouseX - xp)/6);
    yp += ((mouseY - yp)/6);
    $("#circle").css({left: xp +'px', top: yp +'px'});
  }, 10);

});

function resize() {
    if ($(window).width() < 768) {
        $(".nav-item").addClass("col-6");
        $(".nav-item").addClass("text-center");
    } else {
        $(".nav-item").removeClass("col-6");
        $(".nav-item").removeClass("text-center");
    }
}
resize();
$(window).on('resize', resize);

$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });

var width = $("svg").width();
var height = $("svg").height();
if($(window).width() < 576){
  var size = 25;
}
else if($(window).width() < 768){
  var size = 30;
}
else{
  var size = 40;
}

var nodes = [
  { color: "#9CE550", size: size, title: "HTML5" },
  { color: "#00743A", size: size, title: "CSS3" },
  { color: "#8F011B", size: size, title: "JavaScript" },
  { color: "#6126C4", size: size, title: "Bootstrap 4" },
  { color: "#C7A69F", size: size, title: "DOM" },
  { color: "#58C2B2", size: size, title: "jQuery" },
  { color: "#EE31A2", size: size, title: "MERN" },
  { color: "#43904B", size: size, title: "REST" },
  { color: "#FC38DC", size: size, title: "Auth" },
  { color: "#3D8FB5", size: size, title: "PassportJS" },
  { color: "#E38B1D", size: size, title: "Firebase" },
  { color: "#6AEC5C", size: size, title: "D3" },
  { color: "#7840E8", size: size, title: "SVG" },
  { color: "#D1003A", size: size, title: "ES2015" },
  { color: "#8A1838", size: size, title: "Async" },
  { color: "#8D1867", size: size, title: "Git" },
  { color: "#8B2889", size: size, title: "Python" },
  { color: "#8E3812", size: size, title: "C++" },
];

var links = [];
for(var i = 0; i < nodes.length; i++){
  for(var j = i+1; j < nodes.length; j++){
    links.push({source: nodes[i].color, target: nodes[j].color});
  }
}
var svg = d3.select("svg");

var linkSelection = svg 
                      .selectAll("line")
                      .data(links)
                      .enter()
                      .append("line")
                        .attr("stroke", "#12136C")
                        .attr("stroke-width", 2);

var nodeSelection = svg
                      .selectAll("circle")
                      .data(nodes)
                      .enter()
                      .append("circle")
                        .attr("r", d => d.size)
                        .attr("fill", d => d.color)
                        .call(d3.drag()
                                  .on("start", dragStart)
                                  .on("drag", drag)
                                  .on("end", dragEnd));

var texts = svg.selectAll("text")
                .data(nodes)
                .enter()
                .append("text")
                  .attr("class", "label")
                  .attr("fill", "black")
                  .attr("text-anchor", "middle")
                  .text(d => d.title)
                  .style("font-weight", "600")
                  .style("font-size", $(window).width() < 768 ? "0.6em" : "0.9em");
var simulation = d3.forceSimulation(nodes);

simulation
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("nodes", d3.forceManyBody().strength(-60))
  .force("links", d3.forceLink(links)
                    .id(d => d.color)
                    .distance(d => 5 * ( d.source.size + d.target.size )))
  .on('tick', ticked);
         
function ticked() {
nodeSelection
  .attr("cx", d => d.x )
  .attr("cy", d => d.y );

texts
  .attr("transform", d => `translate(${d.x}, ${d.y})`)

linkSelection
  .attr("x1", d => d.source.x)
  .attr("y1", d => d.source.y)
  .attr("x2", d => d.target.x)
  .attr("y2", d => d.target.y)
}

function dragStart(d){
  console.log("Start Dragging");
  simulation.alphaTarget(0.5).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function drag(d){
  console.log("Dragging");
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragEnd(d){
  console.log("Stop Dragging");
  simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

$(window).on("resize", () => {
  width = $("svg").width();
  height = $("svg").height();

  simulation
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("nodes", d3.forceManyBody().strength(-60))
  .force("links", d3.forceLink(links)
                    .id(d => d.color)
                    .distance(d => 5 * ( d.source.size + d.target.size )))
  .on('tick', ticked);
})