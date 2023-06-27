const colorPalette = [
    "#fd7f6f",
    "#7eb0d5",
    "#b2e061",
    "#bd7ebe",
    "#ffb55a",
    "#ffee65",
    "#beb9db",
    "#fdcce5",
    "#8bd3c7",
    "#c9c9c9",
];

const MARGIN = {
    top: 50,
    bottom: 130,
    right: 20,
    left: 56,
};

// Constantes para no andar hardcodeando por la vida (copy gus)
const SVG3_WIDTH = 1500;
const SVG3_HEIGHT = 600;

const SVG3 = d3.select("#vis-3").append("svg");
//width height
SVG3.attr("width", SVG3_WIDTH).attr("height", SVG3_HEIGHT)

const HEIGHTVIS = SVG3_HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = SVG3_WIDTH - MARGIN.right - MARGIN.left;

// Function para leer el json
function leer(){
    d3.json("./nuevodataset.json")
        .then((datos) => {
            console.log(datos);
            console.log("Cantidad de objetos en el dataset:", Object.keys(datos).length);
            CreateCircularPacking(datos);     
        })
        .catch((error) => console.log(error))}

// =============================================================================
// ============================= TERCERA VISUALIZACION =========================
// =============================================================================

function CreateCircularPacking(dataset) {
    // Obtenemos los valores de cada objeto
    const datasetValues = Object.values(dataset);
    console.log("DATOS NORMALES", datasetValues);
    // ['Very Positive', 'Mixed', 'Mostly Positive', 
    //'Overwhelmingly Positive', 'Mostly Negative']
    // 'Overwhelmingly Negative' 'Very Negative'
    // Positive Negative
    const x = d3.scaleOrdinal()
    .domain(['Very Positive', 'Mixed', 'Mostly Positive'])
    .range([-40, 320, 520, 740, 900])

    const rad = d3.scaleLinear()
    .domain([3, 20])
    .range([0, 100])


    const color = d3.scaleOrdinal()
  .domain(['Very Positive', 'Mixed', 'Mostly Positive','Overwhelmingly Positive', 'Mostly Negative'])
  .range([ "#F8766D", "#00BA38", "#619CFF", "#c9ff40", "#6b1efa"])

  const node = SVG3.append("g")
  .selectAll("circle")
  .data(datasetValues, d => d.name)
  .join("circle")
  .attr("r", d => {
    if(d.price === "Free to Play")
    //rad(parseFloat(num.slice(1)))
    {console.log("FRee")}
    }
    )
  .attr("cx", SVG3_WIDTH / 2)
  .attr("cy", SVG3_HEIGHT / 2)
  .style("fill", d => color(d.reviews))
  .style("fill-opacity", 0.8)
  .attr("stroke", "black")
  .style("stroke-width", 0.1)
  .call(d3.drag() // call specific function when circle is dragged
       .on("start", dragstarted)
       .on("drag", dragged)
       .on("end", dragended));

    let simulation = d3.forceSimulation()
    .force("x", d3.forceX().strength(0.5).x(d => x(d.reviews)))
    .force("y", d3.forceY().strength(0.5).y( SVG3_HEIGHT/2 ))
    .force("center", d3.forceCenter().x(SVG3_WIDTH/2).y(SVG3_HEIGHT/2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.1).radius(25).iterations(1)) // Force that avoids circle overlapping
// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
simulation
    .nodes(datasetValues)
    .on("tick", function(d){
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
    });

// What happens when a circle is dragged?
function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(.03).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}
function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(.03);
  d.fx = null;
  d.fy = null;
}
};

leer();