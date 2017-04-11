import { Builder } from 'escher-vis'
import escher from 'escher-vis'

import 'escher-vis/css/dist/builder.css'

function getJSON (url) {
  return new Promise(function (fulfill, reject) {
    escher.libs.d3_json(url, (e, d) => {
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
  const draw_next = (bigg_id, rot) => {
    this.map.new_reaction_for_metabolite(
      bigg_id, Object.keys(this.map.get_selected_nodes())[0], rot
    )
  }
  this.map.new_reaction_from_scratch('PGI', { x: 0, y: 0 }, 90)
  draw_next('PFK', 95)
  draw_next('FBA', 85)

  // And zoom the map to focus on that reaction
  this.map.zoom_extent_nodes()

  // Select all nodes and align vertical
  this.map.select_all()
  this.map.align_vertical()
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
      fill_screen: true,
      never_ask_before_quit: true,
      show_gene_reaction_rules: false,
      first_load_callback,
      canvas_size_and_loc: {
        x: -500,
        y: -200,
        width: 1000,
        height: 1500
      }
    }

    Builder(null, model, null, document.getElementsByTagName('body')[0],
            options1)
  }, log)
}
