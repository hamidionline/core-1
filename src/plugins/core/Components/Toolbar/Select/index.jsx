import React, {Component} from 'react';
import Move from './Move';
import Paste from './Paste';
import {setClipboard} from '../../../state/actions';
import icons from '../../../../../assets/icons';

class Copy extends Component {

  componentDidMount() {
    this.props.dispatch(setClipboard([]));
  }

  handleCopy = () => {
    const clipboard = this.getSelected();
    if (!clipboard.length) {
      return;
    }

    this.props.dispatch(setClipboard(clipboard));
  };

  getSelected = () => {
    return [
      ...this.props.state.entries.dirs,
      ...this.props.state.entries.files,
    ]
        .filter(item => item.selected);
  };

  render() {
    const attrs = {
      'data-toggle': 'tooltip',
      'data-placement': 'top',
      title: 'Select for Copy/Move',
    };
    const clipboard = this.props.state.clipboard || [];
    const count = clipboard.length;
    if (count) {
      attrs.title = `Selected ${count} items`;
    }
    return (
        <>
          <button className="btn btn-primary" ref="copy" key="copy" onClick={this.handleCopy} {...attrs}>
            {icons.check}
          </button>
          <Paste key="paste" state={this.props.state} dispatch={this.props.dispatch}/>
          <Move key="move" state={this.props.state} dispatch={this.props.dispatch}/>
        </>
    );
  }
}

export default Copy;