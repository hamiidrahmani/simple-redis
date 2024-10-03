import { IncrementalHashTable } from "./IncrementalHashTable.mjs";

class TrieNode {
  constructor(key) {
    this.key = key;
    this.value = {
      simple: null,
      hashTable: null,
      orderedList: null,
    };
    this.children = [];
  }

  getValue(type) {
    return this.value[type];
  }

  setValue(type, val) {
    this.value[type] = val;
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode("");
  }

  set(type, key, value, currentNode = this.root) {
    if (!key.length) {
      currentNode.setValue(type, value);
      return;
    }
    const foundedNode = this.get(key, currentNode.children);
    if (foundedNode) {
      foundedNode.setValue(type, value);
    } else {
      const newNode = new TrieNode(key[0]);
      currentNode.children.push(newNode);
      this.set(type, key.substring(1), value, newNode);
    }
  }

  get(key, children = this.root.children) {
    for (let j = 0; j < children.length; j++) {
      const element = children[j];
      if (key[0] === element.key) {
        const nextKey = key.substring(1);
        if (nextKey) {
          return this.get(key.substring(1), element.children);
        }
        return element;
      } else {
        return null;
      }
    }
  }

  hGet(key, field) {
    const currentNode = this.get(key);
    const hashTable = currentNode ? currentNode.getValue("hashTable") : null;
    return hashTable ? hashTable.get(field) : null;
  }

  hSet(key, field, value) {
    const currentNode = this.get(key);
    const hashTable = currentNode ? currentNode.getValue("hashTable") : null;
    if (hashTable) {
      hashTable.insert(field, value);
    } else {
      const hashTable = new IncrementalHashTable();
      hashTable.insert(field, value);
      this.set("hashTable", key, hashTable);
    }
  }
  zAdd() {}
  zRank() {}
  zRange() {}
  zScore() {}
}
