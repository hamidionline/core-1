import APIMapper from './mappers/APIMapper';
import {appendState} from './state/store/initialState';
import {addReducer} from './state/reducers';

const plugins = {};
const api = {};
const tabs = [];
let bootRequired = [];

export const registerPlugin = (_plugins) => {
  for (const key of Object.keys(_plugins)) {
    const plugin = _plugins[key];
    // load state
    if (plugin.initial_state) {
      appendState(key, plugin.initial_state);
    }

    // load tabs
    if (plugin.tabs) {
      for (const key of Object.keys(plugin.tabs)) {
        const tab = plugin.tabs[key];
        tabs
            .push({
                    title: tab.title,
                    key,
                    component: tab.component,
                  });
      }
    }

    // load reducers
    if (plugin.reducers) {
      for (const key of Object.keys(plugin.reducers)) {
        addReducer(key, plugin.reducers[key]);
      }
    }

    // load the api
    api[key] = APIMapper.mapAPIConfigToMethod(key.toProperCase(), plugin.api);

    if (plugin.boot) {
      bootRequired.push({boot: plugin.boot, key});
    }

    plugins[key] = plugin;
  }
};

export const getTabs = () => {
  return tabs;
};

export const bootPlugins = () => {
  for (const entry of bootRequired) {
    entry.boot({api: api[entry.key]});
  }
  bootRequired = [];
};
