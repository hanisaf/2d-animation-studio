// engine/series.js: scene series. Shared by the studio (browser) and the Node scripts (scripts/registry.mjs).
//
// Each scenes/<series>/series.js calls series({ title, category, logline, scenes: ['<scene id>', ...] }). Once every
// series file has run, expandSeries() fills in what the rest of the code reads from REGISTRY:
//   REGISTRY.scenes       every scene id, series by series (in REGISTRY.series order)
//   REGISTRY.movie        the scene ids of REGISTRY.movieSeries, in order
//   REGISTRY.sceneSeries  scene id → series id (a scene's folder is scenes/<series>/<id>)

const SERIES = {};
let CURRENT_SERIES = null;            // set by the loader while a series.js runs
function series(meta) {
  if (!CURRENT_SERIES) throw new Error('series() must be called from a scenes/<series>/series.js');
  SERIES[CURRENT_SERIES] = { id: CURRENT_SERIES, title: CURRENT_SERIES, category: '', ...meta, scenes: meta.scenes || [] };
}
function expandSeries() {
  const sceneSeries = {};
  for (const sid of REGISTRY.series) {
    if (!SERIES[sid]) throw new Error(`scenes/${sid}/series.js did not call series({...})`);
    for (const id of SERIES[sid].scenes) {
      if (sceneSeries[id]) throw new Error(`scene id "${id}" is in both scenes/${sceneSeries[id]}/ and scenes/${sid}/: scene ids must be unique`);
      sceneSeries[id] = sid;
    }
  }
  for (const sid of REGISTRY.movieSeries) if (!SERIES[sid]) throw new Error(`movieSeries lists "${sid}", which is not in REGISTRY.series`);
  REGISTRY.sceneSeries = sceneSeries;
  REGISTRY.scenes = REGISTRY.series.flatMap(sid => SERIES[sid].scenes);
  REGISTRY.movie = REGISTRY.movieSeries.flatMap(sid => SERIES[sid].scenes);
}
const sceneDir = id => `scenes/${REGISTRY.sceneSeries[id]}/${id}`;
