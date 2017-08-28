/* global saveAs */
/** Demo of exporting MapBox GL endpoints stored in redux store to a local file.
 *
 */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import React from 'react';
import ReactDOM from 'react-dom';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import SdkPrintReducer from '@boundlessgeo/sdk/reducers/print';
import SdkExportReducer from '@boundlessgeo/sdk/reducers/export';
import * as mapActions from '@boundlessgeo/sdk/actions/map';
import * as printActions from '@boundlessgeo/sdk/actions/print';
import * as exportActions from '@boundlessgeo/sdk/actions/export';

// This will have webpack include all of the SDK styles.
import '@boundlessgeo/sdk/stylesheet/sdk.scss';

/* eslint-disable no-underscore-dangle */
const store = createStore(combineReducers({
  map: SdkMapReducer,
  print: SdkPrintReducer,
  export: SdkExportReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
   applyMiddleware(thunkMiddleware));

function main() {
  const url = 'https://raw.githubusercontent.com/boundlessgeo/ol-mapbox-style/master/example/data/wms.json';
  store.dispatch(mapActions.setContext({ url }));

  const exportMapImage = (blob) => {
    saveAs(blob, 'map.png');
    store.dispatch(printActions.receiveMapImage());
  };

  const exportMapSpec = () => {
    const map_spec = store.getState().map;
    const text = JSON.stringify(map_spec);
    const blob = new File([text], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, 'newfile.txt');
  };

  // place the map on the page.
  ReactDOM.render(
    <SdkMap
      store={store}
      onExportImage={exportMapImage}
    />
  , document.getElementById('map'));

  // called by the onExportImage prop of the SdkMap.
  const exportImage = () => {
    store.dispatch(printActions.exportMapImage());
  };

  const exportSpec = () => {
    store.dispatch(exportActions.exportMapSpec());
  };

  // add a button to demo the action.
  ReactDOM.render((
    <div>
      <button className="sdk-btn" onClick={exportImage}>Export map image</button>
      <button className="sdk-btn" onClick={exportMapSpec}>Export map doc</button>
  </div>
  ), document.getElementById('controls'));
}

main();
