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
    }

    Builder(data, model, null, d3.select('body'), options1)
  }, log)// .catch(log)
}
