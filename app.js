// Create function to draw a bargraph from a specific id from a dataset
function buildBarGraph(sample) {
    console.log(`Calling buildBarGraph (${sample})`);

    d3.json("samples.json").then((data) => {
        // Grab values from the data json object to build the plots
        var samples = data.samples;
        var dataset = samples.filter(input => sample == input.id);
        var result = dataset[0];
        console.log(result);
        var otuId = result.otu_ids;
        var sampleValues = result.sample_values;
        var otuLabels = result.otu_labels;

        // Get top 10 OTUs found in that individual
        yticks = otuId.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();
        xticks = sampleValues.slice(0, 10).reverse();

        var barData = [
            {
                x: xticks,
                y: yticks,
                type: "bar",
                text: otuLabels.slice(0, 10).reverse(),
                orientation: "h",
                // opacity: 0.5,
                height: 1000
            }
        ];
        var barLayout = {
            title: `Top ${yticks.length} OTUs for Bacteria Sample ID ${sample}`,
            font: { size: 12 }
            // width: 500
            // margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);

    });

};
// buildBarGraph(940);


// Create function to draw a bubblechartfrom a specific id from a dataset
function bubbleChart(sample) {

    d3.json("samples.json").then((data) => {
        // Grab values from the data json object to build the plots
        var samples = data.samples;
        var dataset = samples.filter(input => sample == input.id);
        var result = dataset[0];
        console.log(result);
        var otuId = result.otu_ids;
        var sampleValues = result.sample_values;
        var otuLabels = result.otu_labels;

        var trace1 = {
            x: otuId,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: otuId,
                size: sampleValues
            }
        };

        var data = [trace1];

        var layout = {
            title: `Bubble Chart for Bacteria Sample ID ${sample}`,
            showlegend: false,
            height: 600,
            width: 600,
            xaxis: { title: { text: "OTU ID" } },
            // plot_bgcolor: '#282c35',
            // paper_bgcolor: '#ffa7c4',
        };

        Plotly.newPlot('bubble', data, layout);
    });
};
// bubbleChart(940);

// Create function to get a metadata chart for a specific id from a dataset
function metaData(sample) {

    d3.json("samples.json").then((data) => {
        // Grab values from the data json object to build the plots
        var samples = data.metadata;
        var dataset = samples.filter(input => sample == input.id);
        var result = dataset[0];

        // Use d3 to select the panel with id of `#sample-metadata`
        var panel = d3.select("#sample-metadata");
        // Use `.html("") to clear any existing metadata
        panel.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        //Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            var textToShow = (`${key}: ${value}`);
            panel.append("h5").text(textToShow);
        })
    });
};
// metaData(940);


function gaugeChart(sample) {
    d3.json("samples.json").then((data) => {
        // Grab values from the data json object to build the plots
        var samples = data.metadata;
        var dataset = samples.filter(input => sample == input.id);
        var result = dataset[0];
        var weeklyFrequency = result.wfreq;
        console.log(`Initializing guage chart ${sample}`);



        var data = [
            {
                // domain: { x: [0, 1], y: [0, 1] },
                value: weeklyFrequency,
                title: { text: "Belly Button Frequency <br> Scrubs per Week", font: { size: 24 } },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 380 },
                gauge: {
                    axis: { range: [null, 9] },
                    bar: {color: "red"},
                bgcolor: "white",
                borderwidth: 2,
                // bordercolor: "gray",
                    steps: [
                        { range: [0, 1], color: "hsl(125, 82%, 10%)" },
                        { range: [1, 2], color: "hsl(125, 82%, 20%)" },
                        { range: [2, 3], color: "hsl(125, 82%, 30%)" },
                        { range: [3, 4], color: "hsl(125, 82%, 40%)7" },
                        { range: [4, 5], color: "hsl(125, 82%, 50%)" },
                        { range: [5, 6], color: "hsl(125, 82%, 60%)" },
                        { range: [6, 7], color: "hsl(125, 82%, 70%)" },
                        { range: [7, 8], color: "hsl(125, 82%, 80%)" },
                        { range: [8, 9], color: "hsl(125, 82%, 90%)" }
                    ],
                    text: [
                        "TOO FAST!",
                        "Pretty Fast",
                        "Fast",
                        "Average",
                        "Slow",
                        "Super Slow",
                        ""
                      ],
                    // threshold: {
                    //     line: { color: "red", width: 4 },
                    //     thickness: 0.75,
                    //     value: 490
                    // }
                }
            }
        ];

        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);
    });
}

function optionChanged(newSampleId) {

    console.log(`User Selected ${newSampleId}`);

    bubbleChart(newSampleId);
    buildBarGraph(newSampleId);
    metaData(newSampleId);
    gaugeChart(newSampleId);

}

function Init() {

    console.log("Initializing Dashboard");

    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {

        console.log(data);

        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector.append("option")
                .text(sample)
                .property("value", sample);
        });

        var sample = sampleNames[0];

        buildBarGraph(sample);
        bubbleChart(sample);
        gaugeChart(sample);
        metaData(sample);

    });

}

Init();