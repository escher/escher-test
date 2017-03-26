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

const first_load_callback = function () {
  // Get a nice starting location for the reaction
  const size = this.zoom_container.get_size()

  // Draw the reaction
  this.map.new_reaction_from_scratch('ENO', { x: 0, y: 200 }, 90)
  this.map.new_reaction_from_scratch('GAPD', { x: -200, y: 0 }, 180)
  this.map.new_reaction_from_scratch('PGI', { x: 200, y: 0 }, 0)
  this.map.new_reaction_from_scratch('CYTBD2pp', { x: 0, y: -200 }, -90)
  this.map.new_reaction_from_scratch('NADTRHD', { x: 200, y: -200 }, -45)
  this.map.new_reaction_from_scratch('XYLabcpp', { x: -200, y: -200 }, -135)
  this.map.new_reaction_from_scratch('FUMt2_3pp', { x: 200, y: 200 }, 45)
  this.map.new_reaction_from_scratch('PPA2', { x: -200, y: 200 }, 135)

  // And zoom the map to focus on that reaction
  this.map.zoom_extent_nodes()

  // After building a reaction, Escher selects the newest
  // metabolite. Unselect it like this.
  this.map.select_none()
}

export default function draw () {

  // Load a JSON file for the map from the network
  Promise.all([
    getJSON('/static/iJO1366.json'),
  ]).then(([ model ]) => {
    // ---------------------------------------
    // First map: Just show the map
    // ---------------------------------------

    const options1 = {
      /* just show the zoom buttons */
      menu: 'all',
      // use the smooth pan and zoom option
      use_3d_transform: true,
      /* no editing in this map */
      enable_editing: true,
      /* no keyboard shortcuts */
      enable_keys: true,
      fill_screen: true,
      never_ask_before_quit: true,
      show_gene_reaction_rules: true,
      full_screen_button: true,
      first_load_callback,
    }

    Builder(null, model, null, d3.select('body'), options1)
  }, log)// .catch(log)
}
