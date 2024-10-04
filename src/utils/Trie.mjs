import { IncrementalHashTable } from "./IncrementalHashTable.mjs";
import { SkipList } from "./SkipList.mjs";

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
      hashTable.insert(field, value);
    } else {
      const hashTable = new IncrementalHashTable();
      hashTable.insert(field, value);
      this.set("hashTable", key, hashTable);
    }
  }

  // orderedList
  zAdd(key, score, member) {
    const currentNode = this.get(key);
    const skipList = currentNode ? currentNode.getValue("orderedList") : null;
    if (skipList) {
      skipList.add(score, member);
    } else {
      const skipList = new SkipList();
      skipList.add(score, member);
      this.set("orderedList", key, skipList);
    }
  }

  zScore(key, member) {
    const currentNode = this.get(key);
    const skipList = currentNode ? currentNode.getValue("orderedList") : null;
    return skipList ? skipList.get(member) : null;
  }

  zRank(key, member) {
    const currentNode = this.get(key);
    const skipList = currentNode ? currentNode.getValue("orderedList") : null;
    return skipList ? skipList.rank(member) : null;
  }

  zRange() {}
}
