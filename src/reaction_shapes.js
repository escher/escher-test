import { Builder } from 'escher-vis'
import escher from 'escher-vis'
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
  const draw = (bigg_id, loc, rot) => {
    this.map.new_reaction_from_scratch(bigg_id, loc, rot)
    this.map.new_reaction_for_metabolite(
      bigg_id, Object.keys(this.map.get_selected_nodes())[0], rot
    )
  }
  draw('ENO', { x: 0, y: 200 }, 90)
  draw('PPS', { x: -200, y: 0 }, 180)
  draw('CYTBD2pp', { x: 200, y: 0 }, 0)
  draw('PGI', { x: 0, y: -200 }, -90)
  draw('NADTRHD', { x: 200, y: -200 }, -35)
  draw('XYLabcpp', { x: -200, y: -200 }, -135)
  draw('THZPSN3', { x: 600, y: 200 }, 45)
  draw('PPA2', { x: -200, y: 200 }, 135)
  this.map.new_reaction_from_scratch('EX_glc__D_e',
                                     { x: 0, y: 1300 }, 90)

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
      show_gene_reaction_rules: false,
      full_screen_button: true,
      first_load_callback,
      reaction_data: { PPS: 20, PPA: 20, NADTRHD: 20, THZPSN3: 30 },
      metabolite_data: { atp_c: 20 },
      reaction_no_data_size: 25,
      metabolite_no_data_size: 25,
      canvas_size_and_loc: {
        x: -4500,
        y: -1000,
        width: 9000,
        height: 3500
      },
      reaction_scale: [{ type: 'min', color: '#c8c8c8', size: 12 },
                       { type: 'Q1', color: '#9696ff', size: 20 },
                       { type: 'median', color: '#9696ff', size: 20 },
                       { type: 'Q3', color: '#9696ff', size: 20 },
                       { type: 'max', color: '#ff0000', size: 25 }],
    }

    // Builder(null, model, null, document.getElementsByTagName('body')[0], options1)
    Builder(null, model, null, escher.libs.d3_select('body'), options1)
  }, log)// .catch(log)
}
