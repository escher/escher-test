import Builder, { libs } from 'escher'
const d3Json = libs.d3_json
const d3Select = libs.d3_select

function getJSON (url) {
  return new Promise(function (resolve, reject) {
    d3Json(url, (e, d) => {
      if (e) reject(e)
      else resolve(d)
    })
  })
}

function log (e) {
  console.log(e)
}

const first_load_callback = function (builder) {
  // Draw the reaction
  const draw = (bigg_id, loc, rot) => {
    builder.map.new_reaction_from_scratch(bigg_id, loc, rot)
    builder.map.new_reaction_for_metabolite(
      bigg_id, Object.keys(builder.map.get_selected_nodes())[0], rot
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
  builder.map.new_reaction_from_scratch('Ec_biomass_iJO1366_WT_53p95M',
                                        { x: 0, y: 1300 }, 90)

  // And zoom the map to focus on that reaction
  builder.map.zoom_extent_canvas()

  // After building a reaction, Escher selects the newest
  // metabolite. Unselect it like this.
  builder.map.select_none()
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
      reaction_data: { PPS: 20, THZPSN3: 20 },
      metabolite_data: { atp_c: 20 },
      // reaction_no_data_size: 25,
      // metabolite_no_data_size: 25,
      canvas_size_and_loc: {
        x: -4500,
        y: -1000,
        width: 9000,
        height: 3500
      }
    }

    Builder(null, model, null, d3Select('body').append('div'), options1)
  }, log)// .catch(log)
}
