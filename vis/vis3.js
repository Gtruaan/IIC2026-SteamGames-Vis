const MARGIN3 = {
    top: 50,
    bottom: 130,
    right: 20,
    left: 56,
};

// Constantes para no andar hardcodeando por la vida (copy gus)
const SVG3_WIDTH = 600; // 5000
const SVG3_HEIGHT = 600; // 5000

const SVG3 = d3.select("#vis-3").append("svg");
//width height
SVG3.attr("width", SVG3_WIDTH).attr("height", SVG3_HEIGHT)

const HEIGHTVIS3 = SVG3_HEIGHT - MARGIN3.top - MARGIN3.bottom;
const WIDTHVIS3 = SVG3_WIDTH - MARGIN3.right - MARGIN3.left;

// Function para leer el json
function leer(){
    d3.json("data/dataset.json")
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

  ////////////////////////////////////////////////////
  // PODEMOS USAR LO COMENTADO PARA VER LOS VALORES UNICOS QUE QUERAMOS

  // const uniqueReviews = new Set();

  // for (const game in datasetValues) {
  //   if (datasetValues.hasOwnProperty(game)) {
  //     const reviews = datasetValues[game].history.length;
  //     uniqueReviews.add(reviews);
  //   }
  // }

  // console.log([...uniqueReviews]);

  ////////////////////////////////////////////////////////

    // ['Very Positive', 'Mixed', 'Mostly Positive', 
    //'Overwhelmingly Positive', 'Mostly Negative']
    // 'Overwhelmingly Negative' 'Very Negative'
    // Positive Negative

    const x = d3.scaleOrdinal()
    .domain(['Mostly Negative','Very Positive', 'Mostly Positive', 'Mixed','Overwhelmingly Positive'])
    .range([SVG3_WIDTH / 4, SVG3_WIDTH / 2, 3 * SVG3_WIDTH / 4, SVG3_WIDTH / 2, SVG3_WIDTH / 2])

    const y = d3.scaleOrdinal()
    .domain(['Mostly Negative','Very Positive', 'Mostly Positive', 'Mixed','Overwhelmingly Positive'])
    .range([SVG3_HEIGHT / 2, SVG3_HEIGHT / 2, 2 * SVG3_HEIGHT / 4, 3 * SVG3_HEIGHT / 4, SVG3_HEIGHT / 4])

    const size = d3.scaleLinear()
    .domain([20, 104])
    .range([1, 4]) // 10 40

  const node = SVG3.append("g")
  .selectAll("circle")
  .data(datasetValues, d => d.name)
  .join("circle")
  .attr("r", d => {return size(d.history.length)})
  .attr("cx", SVG3_WIDTH / 2)
  .attr("cy", SVG3_HEIGHT / 2)
  .style("fill", d => {if(typeof d.price === "string" && (d.price).charAt(0) !== "$"){
    return "red"
  } else if (typeof d.price === "string" && parseFloat((d.price).slice(1)) < 15.00){
    return "green"
  } else if (typeof d.price === "string" && parseFloat((d.price).slice(1)) < 30.00){
    return "yellow"
  } else if (typeof d.price === "string" && parseFloat((d.price).slice(1)) > 30.00){
    return "purple"
  } else return "blue"
})
  .style("fill-opacity", 0.8)
  .attr("stroke", "black")
  .style("stroke-width", 1)
  .call(d3.drag() // call specific function when circle is dragged
       .on("start", dragstarted)
       .on("drag", dragged)
       .on("end", dragended));

    let simulation = d3.forceSimulation()
    .force("x", d3.forceX().strength(0.5).x(d => x(d.reviews)))
    .force("y", d3.forceY().strength(0.5).y(d => y(d.reviews)))
    .force("center", d3.forceCenter().x(SVG3_WIDTH/2).y(SVG3_HEIGHT/2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.8).radius(d => {return size(d.history.length)+1}).iterations(1)) // Force that avoids circle overlapping
// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
simulation
    .nodes(datasetValues)
    .on("tick", function(d){
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
    });

    // function stopSimulation() {
    //   simulation.stop();
    // }
    
    // // Detén la simulación cuando lo desees, por ejemplo, después de un cierto período de tiempo
    // setTimeout(stopSimulation, 5000);

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