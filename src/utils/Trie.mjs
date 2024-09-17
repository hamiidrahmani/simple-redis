import { HashTable } from "./HashTable.mjs";

class TrieNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.children = [];
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode("", null);
  }

  set(key, value, currentBucket = this.root) {
    if (!key.length) {
      currentBucket.value = value;
      return;
    }
    const foundedNode = this.get(key, currentBucket.children);
    if (foundedNode) {
      foundedNode.value = value;
    } else {
      const newNode = new TrieNode(key[0]);
      currentBucket.children.push(newNode);
      this.set(key.substring(1), value, newNode);
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
    const currentBucket = this.get(key);

    return currentBucket.value.get(field);
  }

  hSet(key, field, value) {
    const currentBucket = this.get(key);

    if (currentBucket) {
      currentBucket.value.set(field, value);
    } else {
      const hashTable = new HashTable();
      hashTable.set(field, value);

      this.set(key, hashTable);
    }
  }
}
