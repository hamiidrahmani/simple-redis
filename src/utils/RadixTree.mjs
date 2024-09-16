import { HashTable } from "./HashTable.mjs";

class RadixNode {
  constructor() {
    this.children = new HashTable(10);
    this.isEndOfWord = false;
    this.value = null;
  }
}

export class RadixTree {
  constructor() {
    this.root = new RadixNode();
  }

  set(key, value) {
    let currNode = this.root;

    for (let index = 0; index < key.length; index++) {
      const element = key[index];
      let children = currNode.children.get(element);

      if (!children) {
        children = new RadixNode();
        currNode.children.set(element, children);
      }

      currNode = children;
    }

    currNode.isEndOfWord = true;
    currNode.value = value;
  }

  get(key) {
    let currNode = this.root;

    for (let index = 0; index < key.length; index++) {
      const element = key[index];
      let child = currNode.children.get(element);

      if (!child) {
        return null;
      }

      currNode = child;
    }

    return currNode.isEndOfWord ? currNode.value : null;
  }
}
