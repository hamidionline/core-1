import GeneralAPI from './GeneralAPI';
import boot from './boot';
import General from './General';
import reducers from './state/reducers';
import initial_state from './state'

export default {
  // hook/name for the plugin
  general: {
    // register API
    api: GeneralAPI,
    // load time function calls
    boot,
    // add initial state
    initial_state,
    // add a tab entry
    tabs: {
      entries: {
        title: 'Entries',
        component: General,
      },
    },
    // add context menu entry
    context_menu: {},
    // add toolbar entry
    toolbar: {},
    // access to directory tree
    directory_tree: {},
    // access to info panel
    info_panel: {},
    // add reducers
    reducers,
  },
};