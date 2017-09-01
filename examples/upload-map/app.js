/* global saveAs */
/** Demo adding a map through mapbox style and exporting the map's endpoints to a file.
 *
 */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import React from 'react';
import ReactDOM from 'react-dom';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as mapActions from '@boundlessgeo/sdk/actions/map';

// This will have webpack include all of the SDK styles.
import '@boundlessgeo/sdk/stylesheet/sdk.scss';

import ContextSelector from './context-selector';

/* eslint-disable no-underscore-dangle */
const store = createStore(combineReducers({
  map: SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
   applyMiddleware(thunkMiddleware));

function main() {
  // add a background layer
  store.dispatch(mapActions.addLayer({
    id: 'background',
    type: 'background',
    paint: {
      'background-color': '#eee',
    },
  }));

  const exportMapSpec = () => {
    const map_spec = store.getState().map;
    const text = JSON.stringify(map_spec);
    const file = new File([text], 'my_map', {type: "application/json"});
    saveAs(file, 'my_map.json');
  };

  const my_bookmarks =
  [
    {
      "type": "Feature",
      "properties": {
        "title": "Random Point",
        "isRandom": true
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          2.336734,
          48.885318
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Random Point",
        "isRandom": true
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          2.328989,
          48.851292
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Random Point",
        "isRandom": true
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          2.305084,
          48.856160
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Random Point",
        "isRandom": true
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          2.308177,
          48.846262
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Random Point",
        "isRandom": true
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          2.349671,
          48.848918
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Random Point",
        "isRandom": true
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          2.390033,
          48.875237
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Random Point",
        "isRandom": true
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          2.367084,
          48.853757
        ]
      }
    }
  ];

  const addBookmarks = () => {
    store.dispatch(mapActions.addSource('bookmarks-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: my_bookmarks,
      }
    }));
    store.dispatch(mapActions.addLayer({
      id: 'bookmarks-layer',
      source: 'bookmarks-source',
      paint: {
        'circle-radius': 5,
        'circle-color': '#756bb1',
        'circle-stroke-color': '#756bb1',
      }
    }));
    // store.dispatch(mapActions.addFeatures('bookmarks-source', my_bookmarks));
    // store.dispatch(mapActions.addFeatures('bookmarks-source', my_bookmarks));
  };

  // place the map on the page.
  ReactDOM.render(
    <SdkMap
      store={store}
    />
  , document.getElementById('map'));

  // add a button to demo the action.
  ReactDOM.render((
    <div>
      <button className="sdk-btn" onClick={addBookmarks}>Add Bookmarks</button>
      <ContextSelector store={store} />
      <h1>Save a Map</h1>
      <h2>To <a href="https://www.mapbox.com/mapbox-gl-js/style-spec/">MapBox Style Specification</a></h2>
      <button className="sdk-btn" onClick={exportMapSpec}>Save Map</button>
    </div>
  ), document.getElementById('controls'));
}

main();
