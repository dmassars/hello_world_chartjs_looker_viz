import { Chart, registerables } from 'chart.js';

import _ from 'lodash'

import {baseConfig} from './baseConfig'

Chart.register(...registerables);

const colors = ['#003f5c','#2f4b7c','#665191','#a05195','#d45087','#f95d6a','#ff7c43',' #ffa600']

let viz;

// https://www.chartjs.org/docs/latest/charts/bar.html


looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "hello_world_viz",
  label: "Hello World Viz",
  options: baseConfig,
  // Set up the initial state of the visualization
  create: function (element, config) {

    // Create an element to contain the text.
    const container = element.appendChild(document.createElement("canvas"));
    container.id = 'chartjs'

    const ctx = document.getElementById('chartjs').getContext('2d');

    viz = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: []
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            stacked: false
          },
          x: {
            stacked: false
          },
        }, 
        responsive: true,
        maintainAspectRatio: false
      }
    });


  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {

    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({ title: "No Dimensions", message: "This chart requires dimensions." });
      return;
    }

    let updateConfig = false

    queryResponse.fields.measure_like.forEach(function(field) {
      if (!baseConfig[`color_${field.name}`]) { 

        baseConfig[`color_${field.name}`] = {
          label: `${field.label_short} Color`,
          default: "#8B7DA8",
          type: "string",
          display: "color",
          section: "Series"
        }

      }

      if (!baseConfig[`elemtype_${field.name}`]) { 

        baseConfig[`elemtype_${field.name}`] = {
          label: `${field.label_short} Type`,
          default: "bar",
          type: "string",
          values: [
            {"Line": "line"},
            {"Bar": "bar"}
          ],
          display: "radio",
          section: "Series"
        }
        
      }

      updateConfig = true
    })
    
    updateConfig && this.trigger('registerOptions', baseConfig) // register options with parent page to update visConfig

    console.log({ data, config, details, queryResponse })
    
    console.log(viz)
    viz.data.datasets = []

    _.forEach(queryResponse.fields.measure_like,(m,i)=>{
      const ds = {
        label: m.label_short,
        data: _.map(data, (d) => d[m.name].value),
        backgroundColor: [
          _.get(config,`color_${m.name}`) || colors[i]
        ],
        type: _.get(config,`elemtype_${m.name}`) || 'bar'
      }

      ds.borderColor = ds.backgroundColor
      viz.data.datasets.push(ds)
    })

    const dim = queryResponse.fields.dimension_like[0]

    viz.data.labels = _.map(data, (d) => d[dim.name].value)

    viz.options.scales.y.stacked = config.seriesType == 'stack'
    viz.options.scales.x.stacked = config.seriesType == 'stack'

    viz.options.plugins.legend.display = config.legendDisplay
    viz.options.plugins.legend.position = config.legendPosition

  
    viz.update('none');

    done()
  }
});