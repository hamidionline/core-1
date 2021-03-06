/** @jsx jsx */
import {jsx, Button, Text, Flex, Image, Spinner} from 'theme-ui';
import React, {Component} from 'react';
import {getApi} from '../../../tools/config';
import {getSelectedItems, injectModal, remove, removeModal, resetDirectoryTree} from '../../../state/actions';
import {toast} from 'react-toastify';
import icons from '../../../../assets/icons';
import {EventBus} from '../../../../helpers/Utils';
import {ITEMS_SELECTED} from '../../../state/types';

export class DeleteButton extends React.Component {
  state = {shouldShow: false};

  componentDidMount() {
    EventBus.$on(ITEMS_SELECTED, this.onItemsSelected);
  }

  componentWillUnmount() {
    EventBus.$off(ITEMS_SELECTED, this.onItemsSelected);
  }

  onItemsSelected = items => {
    const shouldShow = items.length > 0;
    if (this.state.shouldShow !== shouldShow) {
      this.setState({shouldShow});
    }
  };

  handleDeleteClick = () => {
    const modal = (props) => {
      return <Delete {...props}/>;
    };

    injectModal(modal);
  };

  render() {

    if (!this.state.shouldShow) {
      return null;
    }
    return (
        <Button
            variant="secondary"
            onClick={this.handleDeleteClick}
        >
          {icons.trash} Delete
        </Button>
    );
  }
}

class Delete extends Component {
  state = {working: false, items: []};

  componentDidMount() {
    getSelectedItems().then(items => {
      this.setState({items});
    });
  }

  handleDelete = () => {
    let items = this.state.items;
    this.setState({working: true});
    for (const item of items) {
      getApi().delete('/', item.path).then(response => {
        toast.success('Deleted successfully');
        remove(item);
        if (item.is_dir) {
          resetDirectoryTree(item);
        }
        removeModal();
      }).catch(error => {
        toast.error(error.message);
        this.setState({working: false});
      });
    }
  };

  render() {
    const selected = this.state.items;

    return (
        <Flex sx={{
          flexDirection: 'column', alignItems: 'center',
          p: 4,
          '> span > svg': {width: '50px', height: '50px'},
        }}>
          {icons.trash}

          <Text sx={{fontSize: 22, py: 2}}>Delete these entries</Text>

          <div className="fm-modal-overflow-content" sx={{my: 2, width: '100%'}}>
            <ul sx={{
              listStyleType: 'none',
              p: 0,
              m: 0,
              border: '1px solid #ddd',
              'li': {
                py: 2,
                px: 3,
              },
              'li:not(:last-child)': {
                borderBottom: '1px solid #ddd',
              },
              'li:hover': {
                bg: 'primaryLight',
              },
            }}>
              {selected.map(item => <li className="list-group-item" key={`${item.name}`}>
                <Image src={thumb(item.path)} sx={{width: 20, mr: 2}}/> {item.name}
              </li>)}
            </ul>
          </div>

          <div sx={{
            bg: 'primaryLight',
            borderColor: 'primary',
            borderWidth: '0 0 0 3px',
            borderStyle: 'solid',
            borderRadius: 4,
            py: 2,
            px: 3,
          }}>
            <strong>Are you absolutely sure?</strong> This action cannot be undone!
          </div>
          <Button sx={{
            py: 2, px: 5, marginTop: 3,
            'svg': {width: '20px', height: '20px'},
          }}
                  onClick={this.handleDelete}
                  disabled={this.state.working}
          >
            {this.state.working ? <Spinner title="Deleting"/> : 'Delete'}
          </Button>
        </Flex>
    );
  }
}

export default Delete;