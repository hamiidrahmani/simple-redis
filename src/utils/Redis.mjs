import { IncrementalHashTable } from "./IncrementalHashTable.mjs";
import { OrderedList } from "./OrderedList.mjs";
import { Trie } from "./Trie.mjs";

export class Redis {
  trie = null;

  constructor() {
    this.trie = new Trie();
  }

  // Simple Value
  set(key, value) {
    this.trie.set("simple", key, value);
  }

  get(key) {
    return this.trie.getValue(key, "simple");
  }

  // Hash Table
  hGet(key, field) {
    const hashTable = this.trie.getValue(key, "hashTable");
    return hashTable ? hashTable.get(field) : null;
  }

  hSet(key, field, value) {
    const hashTable = this.trie.getValue(key, "hashTable");
    if (hashTable) {
      hashTable.add(field, value);
    } else {
      const hashTable = new IncrementalHashTable();
      hashTable.add(field, value);
      this.trie.set("hashTable", key, hashTable);
    }
  }

  // Ordered List
  zAdd(key, score, member) {
    const orderedList = this.trie.getValue(key, "orderedList");
    if (orderedList) {
      orderedList.add(member, score);
    } else {
      const orderedList = new OrderedList();
      orderedList.add(member, score);
      this.trie.set("orderedList", key, orderedList);
    }
  }

  zScore(key, member) {
    const orderedList = this.trie.getValue(key, "orderedList");
    return orderedList ? orderedList.getScore(member) : null;
  }
  zDelete(key, score, member) {
    const orderedList = this.trie.getValue(key, "orderedList");
    return orderedList.delete(member, score);
  }
  zRank(key, member) {
    const orderedList = this.trie.getValue(key, "orderedList");
    return orderedList ? orderedList.getRank(member) : null;
  }

  zRange(key, start, end) {
    const orderedList = this.trie.getValue(key, "orderedList");
    return orderedList ? orderedList.getRange(start, end) : null;
  }
}
