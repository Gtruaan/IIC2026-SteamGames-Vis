const SVG2_WIDTH = 900;
const SVG2_HEIGHT = 600;

const MARGIN2 = {
    top: 50,
    bottom: 70,
    right: 70,
    left: 70,
};

const SVG2 = d3.select("#vis-2").append("svg");
SVG2.attr("width", SVG2_WIDTH).attr("height", SVG2_HEIGHT);


let read = function() {
    d3.json("data/genres.json")
      .then((ds) => {
            ds.forEach((d) => {
                d.history.forEach((h) => {
                    h.date = new Date(h.date);
                })
            });
            
            createMLChart(ds);
        })
      .catch((error) => console.log(error));
}


let currentDate = new Date(2012, 7, 1);

let hoverGenre = () => {
    tooltip.body.style("opacity", 1);
}

let moveGenre = (event, d, cd) => {
    tooltip.body.style("left", event.pageX + 15 + "px")
                .style("top", event.pageY + 15 + "px");

    let points = d.history.filter((h) => h.date <= cd);
    if (points.length == 0) {
        tooltip.text.html(`${d.name}<br><br>Cantidad promedio de jugadores:<br>${0}<br>`);
        return;
    }
    let current_val = points.at(-1);

    tooltip.text.html(`${d.name}<br><br>Cantidad promedio de jugadores:<br>${Math.round(current_val.avg_players)}<br>`);
}

let leaveGenre = () => {
    tooltip.body.style("opacity", 0);
}


function createMLChart(ds) {
    const containers = SVG2.append("g")
                        .attr("id", "containers");

    const XScale = d3.scaleTime()
                          .domain([new Date(2012, 6, 1), new Date(2021, 2, 1)])
                          .range([MARGIN2.left, SVG2_WIDTH - MARGIN2.right]);

    let YScale = d3.scaleLinear()
                           .domain([0, d3.max(ds, (d) => d3.max(d.history, (h) => h.avg_players))])
                           .range([SVG2_HEIGHT - MARGIN2.bottom, MARGIN2.top]);

    // Y axis
    containers.append("text")
              .text("Popularidad (jugadores por mes)")
              .attr("x",30)
              .attr("y",30)
              .attr("font-weight", "bolder")
              .attr("font-size", 12);
    let yAxis = d3.axisLeft(YScale).ticks(10);
    let yAxisCont = containers.append("g")
                      .attr("id", "left_bar")
                      .attr("transform", `translate(${MARGIN2.left}, 0)`)
                      .call(yAxis);
    yAxisCont.selectAll("line")
                     .attr("x1", SVG2_WIDTH - MARGIN2.right - MARGIN2.left)
                     .attr("stroke-dasharray", 5)
                     .attr("stroke-width", 2)
                     .attr("opacity", 0.5);
    // X axis
    containers.append("text")
              .text("Año")
              .attr("x",800)
              .attr("y",575)
              .attr("text-anchor", "end")
              .attr("font-weight", "bolder")
              .attr("font-size", 12);
    let xAxis = d3.axisBottom(XScale).ticks(9);
    let xAxisCont = containers.append("g")
                      .attr("id", "left_bar")
                      .attr("transform", `translate(0, ${SVG2_HEIGHT - MARGIN2.bottom})`)
                      .call(xAxis);
    // Prettify axis
    xAxisCont.selectAll("path").attr("stroke-width", 2);
    xAxisCont.selectAll("text").attr("font-weight", "bolder").attr("font-size", 12);
    yAxisCont.selectAll("path").attr("stroke-width", 2);
    yAxisCont.selectAll("text").attr("font-weight", "bolder").attr("font-size", 12);

    const zoom = d3.zoom()
                    .scaleExtent([1, 3])
                    .extent([[0, 0], [SVG2_WIDTH, SVG2_HEIGHT]])
                    .translateExtent([[0, 0], [SVG2_WIDTH, SVG2_HEIGHT]])
                    .on("start", () => console.log("empecé"))
                    .on("zoom", (event) => {
                        const transform = event.transform;
                        containers.attr("transform", transform);

                        containers.selectAll(".genre-line")
                        .selectAll(".genre-path")
                            .attr("stroke-width", 5 / transform.k);

                        containers.selectAll(".genre-line")
                        .selectAll(".genre-circle")
                            .attr("r", 10 / transform.k)
                            .attr("stroke-width", 2 / transform.k);
                        
                        yAxis.ticks(5 * transform.k);
                        yAxisCont.call(yAxis).attr("font-size", 12 / transform.k);

                        yAxisCont.selectAll("line")
                                 .attr("x1", SVG2_WIDTH - MARGIN2.right - MARGIN2.left)
                                 .attr("stroke-dasharray", 5)
                                 .attr("stroke-width", 2 / transform.k)
                                 .attr("opacity", 0.5);
                    })
                    .on("end", () => console.log("terminé"));

                    SVG2.call(zoom)


    const interval = d3.interval(() => {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        containers.selectAll(".genre-line")
            .data(ds, (d) => d.name).join(
            (enter) => {
                genreLine = enter.append("g")
                                 .attr("class", "genre-line")
                                 .on("mouseover", hoverGenre)
                                 .on("mousemove", (event, d) => moveGenre(event, d, currentDate))
                                 .on("mouseleave", leaveGenre);

                genreLine.append("path")
                         .attr("class", "genre-path")
                         .attr("fill", "transparent")
                         .attr("stroke", (d) => colorPalette[d.name])
                         .attr("stroke-width", 5)
                         .attr("d", (w) => {
                            return d3.line()
                                      .x(j => (XScale(j.date)))
                                      .y(j => (YScale(j.avg_players)))
                                      (w.history.filter((h) => h.date <= currentDate));
                         });

                genreLine.append("circle")
                            .attr("class", "genre-circle")
                            .attr("fill", (d) => colorPalette[d.name])
                            .attr("r", 10)
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("cx", (d) => {
                                let points = d.history.filter((h) => h.date <= currentDate);
                                if(points.length == 0) return XScale(currentDate);
                                return XScale(points.at(-1).date);
                            })
                            .attr("cy", (d) => {
                                let points = d.history.filter((h) => h.date <= currentDate);
                                if(points.length == 0) return YScale(0);
                                return YScale(points.at(-1).avg_players);
                            });
            },
            (update) => {
                update
                    .selectAll(".genre-path")
                    .transition()
                    .ease(d3.easeLinear)
                    .duration(200)
                    .attr("d", (w) => {
                        let points = w.history.filter((h) => h.date <= currentDate);
                        return d3.line()
                                    .x(j => (XScale(j.date)))
                                    .y(j => (YScale(j.avg_players)))
                                    (points);
                    });
                
                update.selectAll(".genre-circle")
                .transition()
                .ease(d3.easeLinear)
                .duration(50)
                        .attr("cx", (d) => {
                            let points = d.history.filter((h) => h.date <= currentDate);
                            if(points.length == 0) return XScale(currentDate);
                            return XScale(points.at(-1).date);
                        })
                        .attr("cy", (d) => {
                            let points = d.history.filter((h) => h.date <= currentDate);
                            if(points.length == 0) return YScale(0);
                            return YScale(points.at(-1).avg_players);
                        });
            },
        );

    }, 1500);
    }

    
 

read();