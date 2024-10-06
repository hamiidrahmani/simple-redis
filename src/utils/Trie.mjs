import { IncrementalHashTable } from "./IncrementalHashTable.mjs";
import { OrderedList } from "./OrderedList.mjs";

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

  // simple
  set(type, key, value) {
    let currentNode = this.root;

    if (!key.length) {
      currentNode.setValue(type, value);
      return;
    }

    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      let foundNode = null;

      for (let index = 0; index < currentNode.children.length; index++) {
        if (currentNode.children[index].key === char) {
          foundNode = currentNode.children[index];
          break;
        }
      }

      if (!foundNode) {
        foundNode = new TrieNode(char, null);
        currentNode.children.push(foundNode);
      }

      currentNode = foundNode;
    }

    currentNode.setValue(type, value); // Store the value in the last node
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
      }
    }
    return null;
  }

  // hashTable
  hGet(key, field) {
    const currentNode = this.get(key);
    const hashTable = currentNode ? currentNode.getValue("hashTable") : null;
    return hashTable ? hashTable.get(field) : null;
  }

  hSet(key, field, value) {
    const currentNode = this.get(key);
    const hashTable = currentNode ? currentNode.getValue("hashTable") : null;
    if (hashTable) {
      hashTable.add(field, value);
    } else {
      const hashTable = new IncrementalHashTable();
      hashTable.add(field, value);
      this.set("hashTable", key, hashTable);
    }
  }

  // orderedList
  zAdd(key, score, member) {
    const currentNode = this.get(key);
    const orderedList = currentNode
      ? currentNode.getValue("orderedList")
      : null;
    if (orderedList) {
      orderedList.add(member, score);
    } else {
      const orderedList = new OrderedList();
      orderedList.add(member, score);
      this.set("orderedList", key, orderedList);
    }
  }

  zScore(key, member) {
    const currentNode = this.get(key);
    const orderedList = currentNode
      ? currentNode.getValue("orderedList")
      : null;
    return orderedList ? orderedList.getScore(member) : null;
  }
  zDelete(key, score, member) {
    const currentNode = this.get(key);
    const orderedList = currentNode
      ? currentNode.getValue("orderedList")
      : null;
    return orderedList.delete(member, score);
  }
  zRank(key, member) {
    const currentNode = this.get(key);
    const orderedList = currentNode
      ? currentNode.getValue("orderedList")
      : null;
    return orderedList ? orderedList.getRank(member) : null;
  }

  zRange(key, start, end) {
    const currentNode = this.get(key);
    const orderedList = currentNode
      ? currentNode.getValue("orderedList")
      : null;
    return orderedList ? orderedList.getRange(start, end) : null;
  }
}
