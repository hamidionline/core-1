import {uuidv4} from '../../../helpers/Utils';

export default class FileInfo {
  name;
  path;
  is_dir;
  is_file;
  is_link;
  is_readable;
  is_writable;
  is_executable;
  perms;
  size;
  extension;
  selected = false;
  _components = {};

  id;

  constructor(
      name, path, is_dir, is_file, is_link, is_readable, is_writable,
      is_executable, perms, size, extension) {
    this.name = name;
    this.path = path;
    this.is_dir = is_dir;
    this.is_file = is_file;
    this.is_link = is_link;
    this.is_readable = is_readable;
    this.is_writable = is_writable;
    this.is_executable = is_executable;
    this.perms = perms;
    this.size = size;
    this.extension = extension;

    this.id = uuidv4();
  }

  addComponent(key, component) {
    this._components[key] = component;
  }

  removeComponent(key) {
    if (this._components[key] !== undefined) {
      delete this._components[key];
    }
  }

  getName(len) {
    if (len >= this.name.length) {
      return this.name;
    }
    if (!this.extension) {
      return this.name.substr(0, len) + '...';
    }
    return this.name.substr(0, len - 3) + '...' + this.extension;
  }

  get components() {
    return Object.values(this._components);
  }

}