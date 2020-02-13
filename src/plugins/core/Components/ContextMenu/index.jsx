/** @jsx jsx */
import {jsx, Divider} from 'theme-ui';
import styled from '@emotion/styled';
import React from 'react';
import {connectMenu, ContextMenu, MenuItem, SubMenu} from 'react-contextmenu';
import {getContextMenu, getHandlers} from '../../tools/config';

export const CONTEXT_MENU_ID = 'hive-fm-context-menu';
const style = {
  background: 'white',
  boxShadow: '0 0 4px #ccc',
  borderRadius: '3px',
  width: '180px',
};

export default connectMenu(CONTEXT_MENU_ID)(function(props) {

  const [state, dispatch] = useStore();

  const {trigger} = props;
  if (trigger === null) {
    return (<ContextMenu id={CONTEXT_MENU_ID} sx={style}>
      <MenuItem>Patch for re-render</MenuItem>
    </ContextMenu>);
  }

  const {item} = trigger;
  const menu_items = getContextMenu(item, state.general);
  const handlers = getHandlers(item, state.general).filter(item => !!item.menu_item);

  return (
      <ContextMenu
          id={CONTEXT_MENU_ID}
          sx={style}>
        {handlers.length > 0
            ? <>
              {handlers.map(handler => (
                  <Menu key={handler.key}
                        onClick={() => handler.handle(item, state, dispatch)}>
                    {handler.menu_item.icon} {handler.menu_item.title}
                  </Menu>
              ))}
              <Divider/>
            </>
            : null}
        {
          Object.keys(menu_items).map(key => (
              <Menu
                  key={key}
                  onClick={() => menu_items[key].handle(item, state, dispatch)}
                  sx={{}}
              >
                {menu_items[key].menu_item.icon} {menu_items[key].menu_item.title}
              </Menu>
          ))
        }
      </ContextMenu>
  );
});

const Menu = styled(MenuItem)`
  cursor: pointer;
  padding: 8px 10px;
  font-size: 12px;
  text-transform: uppercase;
  color: #999;
  display: flex;
  &:hover{
    background: #eee;
    color: #000;
  }

  svg{
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
`;