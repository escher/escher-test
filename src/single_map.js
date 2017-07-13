import { Builder } from 'escher-vis'
import * as d3 from 'd3'

import 'escher-vis/css/dist/builder.css'

function getJSON (url) {
  return new Promise(function (fulfill, reject) {
    d3.json(url, (e, d) => {
      if (e) reject (e)
      else fulfill(d)
    })
  })
}

function log (e) {
  console.log(e)
}

function onLoad (sel) {
  d3.xml('/static/membrane.svg')
    .mimeType('image/svg+xml')
    .get(function(error, xml) {
      if (error) throw error
      const par = sel.select('.zoom-g')
      const g = par.insert('g', '#reactions')
      g.attr('transform', 'scale(10)')
      // g.node().appendChild(xml.documentElement.children[0])
      g.append('rect')
        .attr('x', '-0.674')
        .attr('y', '0.828')
        .attr('fill', '#BF2026')
        .attr('width', '530.674')
        .attr('height', '611.172')
      g.append('path')
        .attr('fill', '#FFFFFF')
        .attr('d', 'M193.188,556.254c25.174,2.602,55.981,2.316,55.981,2.316l55.818-4.535l48.087-40.139l33.069-83.063 l43.558-142.927l34.951-125.057l-11.178-61.622l-20.261-29.471L229.57,42.508l-24.092-1.221l-48.854,26.77L62.115,405.25 l97.99,140.867L193.188,556.254z')
      sel.select('.escher-container').style('background-color', '#BF2026')
    })
}

export default function draw () {

  // Load a JSON file for the map from the network
  Promise.all([
    getJSON('/static/e_coli_core.Core metabolism.json'),
    getJSON('/static/reaction_data_iJO1366.json'),
    getJSON('/static/iJO1366.json'),
  ]).then(([ data, reaction_data, model, ]) => {
    // ---------------------------------------
    // First map: Just show the map
    // ---------------------------------------

    const sel = d3.select('body')

    var options1 = {
      /* just show the zoom buttons */
      menu: 'all',
      // use the smooth pan and zoom option
      use_3d_transform: true,
      /* no editing in this map */
      enable_editing: true,
      /* no keyboard shortcuts */
      enable_keys: true,
      reaction_data,
      fill_screen: true,
      never_ask_before_quit: true,
      show_gene_reaction_rules: true,
      full_screen_button: true,
      first_load_callback: () => onLoad(sel),
    }

    Builder(data, model, null, sel, options1)
  }, log)// .catch(log)
}
