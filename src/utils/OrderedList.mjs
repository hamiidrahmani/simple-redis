import { IncrementalHashTable } from "./IncrementalHashTable.mjs";
import { SkipList } from "./SkipList.mjs";

export class OrderedList {
  constructor() {
    this.skipList = new SkipList();
    this.hashTable = new IncrementalHashTable();
  }

  add(key, value) {
    this.skipList.add(value, key);
    this.hashTable.add(key, value);
  }

  getRank(key) {
    let node = this.skipList.head;
    let rank = 0;

    while (node) {
      while (node.right && node.right.key < key) {
        rank++;
        node = node.right;
      }
      if (node.right && node.right.key === key) {
        return rank;
      }
      node = node.down;
    }

    return null; // Key not found
  }

  getScore(key) {
    return this.hashTable.get(key);
  }
}
