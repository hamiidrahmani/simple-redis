import { IncrementalHashTable } from "./IncrementalHashTable.mjs";
import { SkipList } from "./SkipList.mjs";

export class OrderedList {
  constructor() {
    this.skipList = new SkipList();
    this.hashTable = new IncrementalHashTable();
  }

  add(key, value) {
    const node = this.hashTable.get(key);
    if (node !== null || node !== undefined) {
      this.delete(key, node);
    }
    this.skipList.add(value, key);
    this.hashTable.add(key, value);
  }

  delete(key, value) {
    return this.skipList.delete(key, value);
  }

  getScore(key) {
    return this.hashTable.get(key);
  }

  getRank(key) {
    return this.skipList.getIndex(key);
  }

  getRange(from, to) {
    return this.skipList.getList(from, to);
  }
}
