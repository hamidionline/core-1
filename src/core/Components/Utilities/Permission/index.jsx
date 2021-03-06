import React, {Component} from 'react';
import {Button, Text, Input, Checkbox, Label, Flex} from 'theme-ui';
import styled from '@emotion/styled';
import {getApi} from '../../../tools/config';
import {getWorkingPath, removeModal, setShouldReload, update} from '../../../state/actions';
import {toast} from 'react-toastify';
import icons from '../../../../assets/icons';

class Permission extends Component {

  state = {
    working: false,
    users: [
      {title: 'Owner', read: false, write: false, execute: false},
      {title: 'Group', read: false, write: false, execute: false},
      {title: 'Everyone', read: false, write: false, execute: false},
    ],
    mod: 'xxx',
    perms: '',
  };

  componentDidMount() {
    this.prepare();
  }

  prepare = () => {
    const item = this.props.item;
    const perms_ = item.perms.split('');
    perms_.shift();

    const _perms = {
      Owner: perms_.splice(0, 3),
      Group: perms_.splice(0, 3),
      Everyone: perms_.splice(0, 3),
    };

    const users = this.state.users.map(user => {
      const perms = _perms[user.title];

      user.read = perms[0] === 'r';
      user.write = perms[1] === 'w';
      user.execute = perms[2] === 'x';

      return user;
    });
    const {mod, perms} = this.calculateMod(users);
    this.setState({users, mod, perms});
  };

  handleCheck = (_user, val, e) => {
    const users = this.state.users.map(user => {
      if (user.title !== _user.title) {
        return user;
      }
      if (val === 4) {
        user.read = e.target.checked;
      }
      if (val === 2) {
        user.write = e.target.checked;
      }
      if (val === 1) {
        user.execute = e.target.checked;
      }
      return user;
    });
    const {mod, perms} = this.calculateMod(users);
    this.setState({users, mod, perms});
  };

  calculateMod = (users) => {
    const mod = [];
    const perms = [this.props.item.perms[0]];
    for (const user of users) {
      let val = 0;

      if (user.read) {
        val += 4;
        perms.push('r');
      }
      else {
        perms.push('-');
      }

      if (user.write) {
        val += 2;
        perms.push('w');
      }
      else {
        perms.push('-');
      }

      if (user.execute) {
        val += 1;
        perms.push('x');
      }
      else {
        perms.push('-');
      }

      mod.push(val);
    }
    return {mod: mod.join(''), perms: perms.join('')};
  };

  getSelectables = () => {
    return this.state.users.map(user => {
      return (
          <tr key={user.title}>
            <td>{user.title}</td>
            <td><Label><Checkbox checked={user.read} onChange={e => this.handleCheck(user, 4, e)}/></Label></td>
            <td><Label><Checkbox checked={user.write} onChange={e => this.handleCheck(user, 2, e)}/></Label></td>
            <td><Label><Checkbox checked={user.execute} onChange={e => this.handleCheck(user, 1, e)}/></Label></td>
          </tr>
      );
    });
  };

  handleSave = () => {
    const {mod, perms} = this.calculateMod(this.state.users);

    this.setState({working: true, mod, perms});
    const item = this.props.item;
    getWorkingPath().then(path => {
      getApi().chmod(path, item.name, mod).then(response => {
        toast.success(response.message);
        item.perms = perms;
        update(item);
        removeModal();
      }).catch(error => {
        toast.error(error.message);
        this.setState({working: false});
      });
    });
  };

  handleModChange = e => {
    const value = e.target.value.split('');
    if (value.length > 3) {
      return;
    }
    if (value.length < 3) {
      this.setState({mod: value.join('')});
      return;
    }
    const users = this.state.users;
    for (const i of [0, 1, 2]) {
      if (!value[i]) {
        continue;
      }
      let val = value[i];
      if (val >= 4) {
        users[i].read = true;
        val -= 4;
      }
      else {
        users[i].read = false;
      }
      if (val >= 2) {
        users[i].write = true;
        val -= 2;
      }
      else {
        users[i].write = false;
      }
      if (val >= 1) {
        users[i].execute = true;
        val -= 1;
      }
      else {
        users[i].execute = false;
      }
    }
    this.setState({users, mod: value.join('')});
  };

  render() {
    return (

        <Flex sx={{
          flexDirection: 'column', alignItems: 'center',
          p: 4,
          '> span > svg': {width: '50px', height: '50px'},
        }}>
          {icons.unlock}

          <Text sx={{fontSize: 22, py: 2}}>Change Permission</Text>

          <Table>
            <thead>
            <tr>
              <TH width="80%"/>
              <TH>Read</TH>
              <TH>Write</TH>
              <TH>Execute</TH>
            </tr>
            </thead>
            <tbody>
            {this.getSelectables()}
            </tbody>
            <tfoot>
            <tr>
              <td/>
              <td colSpan={3}><Input type="text" value={this.state.mod} onChange={this.handleModChange}/>
              </td>
            </tr>
            </tfoot>
          </Table>

          <Button
              sx={{
                py: 2,
                px: 5,
                marginTop: 3,
                alignSelf: 'center',
                mx: '10%',
              }}
              onClick={this.handleSave}
              disabled={this.state.working}>
            {this.state.working ? 'Updating...' : 'Update'}
          </Button>

        </Flex>

    );
  }
}

export default Permission;

const Table = styled.table`
  border: 1px solid #dcdcdc;
  border-spacing: 0;
  width: 80%;
  //Row
  tr td{ padding: 8px; }
  tr:nth-of-type(odd) td{ background: #fff }
  tr:nth-of-type(even) td{ background: #f5f4f4 }
  // Hover
  tr:hover td{ background: #e7e7ff;}
`;

const TH = styled.th`
  border-bottom: 1px solid #dcdcdc;
  z-index: 1;
  padding: 8px;
  white-space: nowrap;
  background: #fbfafa;
  font-size: 11px;
  text-align: left;
  font-weight: 500;
  text-transform: uppercase;
`;