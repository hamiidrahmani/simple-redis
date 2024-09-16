// TODO: Add a balance factor to expand the size of HashTable
export class HashTable {
  constructor(size = 4) {
    this.data = new Array(size);
  }

  // TODO: we should use another hash function mentioned in the pdf
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
}
