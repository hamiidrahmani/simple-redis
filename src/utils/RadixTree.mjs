import { OrderedList } from "./OrderedList.mjs";
import { IncrementalHashTable } from "./IncrementalHashTable.mjs";
class RadixTreeNode {
  constructor() {
    this.children = [];
    this.value = {
      simple: null,
      hashTable: null,
      orderedList: null,
    };
  }

  getValue(type) {
    return this.value[type];
  }

  setValue(type, val) {
    this.value[type] = val;
  }
}

export class RadixTree {
  constructor() {
    this.root = new RadixTreeNode();
  }

  set(type, key, value) {
    let node = this.root;
    while (key.length > 0) {
      let found = false;
      for (let i = 0; i < node.children.length; i++) {
        const [childKey, childNode] = node.children[i];
        const commonPrefixLength = this._getCommonPrefixLength(key, childKey);
        if (commonPrefixLength > 0) {
          if (commonPrefixLength === childKey.length) {
            key = key.slice(commonPrefixLength);
            node = childNode;
            found = true;
            break;
          } else {
            const remainingChildKey = childKey.slice(commonPrefixLength);
            const commonPrefix = childKey.slice(0, commonPrefixLength);

            const newChildNode = new RadixTreeNode();
            node.children[i] = [commonPrefix, newChildNode];

            newChildNode.children.push([remainingChildKey, childNode]);

            key = key.slice(commonPrefixLength);
            node = newChildNode;
            found = true;
            break;
          }
        }
      }
      if (!found) {
        const newNode = new RadixTreeNode();
        node.children.push([key, newNode]);
        node = newNode;
        key = "";
      }
    }

    node.value[type] = value;
  }

  get(key) {
    let node = this.root;
    while (key.length > 0) {
      let found = false;
      for (let i = 0; i < node.children.length; i++) {
        const [childKey, childNode] = node.children[i];
        const commonPrefixLength = this._getCommonPrefixLength(key, childKey);
        if (commonPrefixLength > 0) {
          if (commonPrefixLength === childKey.length) {
            key = key.slice(commonPrefixLength);
            node = childNode;
            found = true;
            break;
          } else {
            return null;
          }
        }
      }
      if (!found) {
        return null;
      }
    }
    return node;
  }

  getValue(key, type) {
    const currentNode = this.get(key);
    return currentNode ? currentNode.getValue(type) : null;
  }

  _getCommonPrefixLength(str1, str2) {
    let i = 0;
    while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
      i++;
    }
    return i;
  }
}
