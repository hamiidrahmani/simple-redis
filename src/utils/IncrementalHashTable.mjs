import { fnv1a } from "./Fnv1a.mjs";

const REHASH_BATCH_SIZE = 5; // Number of buckets per call
export class IncrementalHashTable {
  constructor(size = 4) {
    this.oldTable = null;
    this.newTable = new Array(size);
    this.size = 0;
    this.threshold = 0.75;
    this.rehashIndex = 0;
    this.rehashing = false;
  }

  // Insert key-value pair with duplicate key handling
  add(key, value) {
    if (this.size / this.newTable.length > this.threshold && !this.rehashing) {
      this.startResizing();
    }

    this.incrementalRehash();

    // Insert into newTable
    let index = Number(fnv1a(key)) % this.newTable.length;
    if (!this.newTable[index]) {
      this.newTable[index] = [];
    }

    // Check for existing key and update
    for (let pair of this.newTable[index]) {
      if (pair[0] === key) {
        pair[1] = value;
        return;
      }
    }

    this.newTable[index].push([key, value]);
    this.size++;
  }

  // Get value by key
  get(key) {
    this.incrementalRehash();

    // Search in newTable
    let index = Number(fnv1a(key)) % this.newTable.length;
    if (this.newTable[index]) {
      for (let pair of this.newTable[index]) {
        if (pair[0] === key) return pair[1];
      }
    }

    // Search in oldTable if rehashing
    if (this.oldTable) {
      index = Number(fnv1a(key)) % this.oldTable.length;
      if (this.oldTable[index]) {
        for (let pair of this.oldTable[index]) {
          if (pair[0] === key) return pair[1];
        }
      }
    }

    return null;
  }

  // Start resizing with incremental rehashing
  startResizing() {
    if (this.rehashing) return; // Prevent multiple resizes
    this.oldTable = this.newTable;
    this.newTable = new Array(this.oldTable.length * 2);
    this.rehashIndex = 0;
    this.rehashing = true;
  }

  // Incremental rehashing process
  incrementalRehash() {
    if (!this.rehashing) return;

    let count = 0;

    while (
      this.oldTable &&
      this.rehashIndex < this.oldTable.length &&
      count < REHASH_BATCH_SIZE
    ) {
      let bucket = this.oldTable[this.rehashIndex];
      if (bucket) {
        for (let pair of bucket) {
          let index = Number(fnv1a(pair[0])) % this.newTable.length;
          if (!this.newTable[index]) {
            this.newTable[index] = [];
          }
          this.newTable[index].push(pair);
        }
      }
      this.oldTable[this.rehashIndex] = null; // Help garbage collection
      this.rehashIndex++;
      count++;
    }

    if (this.rehashIndex >= this.oldTable.length) {
      this.oldTable = null;
      this.rehashing = false;
    }
  }
}
