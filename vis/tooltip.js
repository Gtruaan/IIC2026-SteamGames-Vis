// Tooltip
let tooltip = {"body": "", "text": ""};

// Nota: Es muy necesario el pointer-events: none para que el div no bloquee el hover
tooltip.body = d3.select("body").append("div")
                .attr("id", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "3px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style("pointer-events", "none");

tooltip.text = tooltip.body.append("p")
                            .attr("id", "tooltip-text")
                            .style("margin", "0px")
                            .style("padding", "0px")
                            .style("text-align", "left")
                            .style("font-weight", "bolder")
                            .style("font-weight", "bolder")
                            .style("font-size", 16)
                            .style("font-family", "arial")
                            .style("pointer-events", "none")
                            .html("");
