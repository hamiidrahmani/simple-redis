const SIZE_THRESHOLD = 0.8;

export class HashTable {
  balanceFactor = 4;
  count = 0;

  constructor(size = this.balanceFactor) {
    this.data = new Array(size);
  }

  _hash(key) {
    let hash = 0;

    for (let index = 0; index < key.length; index++) {
      hash = (hash + key.charCodeAt(index) * index) % this.data.length;
    }

    return hash;
  }

  set(key, value) {
    const address = this._hash(key);

    if (!this.data[address]) {
      this.data[address] = [];
    }

    this.data[address].push([key, value]);
    this.count++;

    if (this.count / this.data.length >= SIZE_THRESHOLD) {
      this._resize();
    }

    return this.data;
  }

  get(key) {
    const address = this._hash(key);
    const currentBucket = this.data[address];

    if (currentBucket && currentBucket.length) {
      for (let index = 0; index < currentBucket.length; index++) {
        const element = currentBucket[index];

        if (element[0] === key) {
          return element[1];
        }
      }
    }

    return undefined;
  }

  _resize() {
    const newSize = this.balanceFactor * 2;
    const oldData = this.data;
    this.data = new Array(newSize);
    this.count = 0; // Reset the count.

    // Rehash all existing items
    for (let index = 0; index < oldData.length; index++) {
      const bucket = oldData[index];

      if (bucket) {
        for (const [key, value] of bucket) {
          this.set(key, value);
        }
      }
    }

    this.balanceFactor = newSize;
  }
}
