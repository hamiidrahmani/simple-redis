import { HashTable } from "./HashTable.mjs";

class RadixNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.children = [];
  }
}

export class RadixTree {
  constructor() {
    this.root = new RadixNode("", null);
  }

  set(key, value, currentBucket = this.root) {
    if (!key.length) {
      currentBucket.value = value;
      return;
    }

    for (let i = 0; i < currentBucket.children.length; i++) {
      let [childKey, childNode] = currentBucket.children[i];
      let commonPrefixLength = this._getCommonPrefixLength(key, childKey);

      if (commonPrefixLength > 0) {
        if (commonPrefixLength === childKey.length) {
          this.set(key.substring(commonPrefixLength), value, childNode);
        } else {
          let newChildKey = childKey.substring(commonPrefixLength);
          let newChildNode = new RadixNode(newChildKey, childNode.value);
          newChildNode.children = childNode.children;

          childNode.key = childKey.substring(0, commonPrefixLength);
          childNode.value = null;
          childNode.children = [];
          childNode.children.push([newChildKey, newChildNode]);

          this.set(key.substring(commonPrefixLength), value, childNode);
        }
        return;
      }
    }

    currentBucket.children.push([key, new RadixNode(key, value)]);
  }

  get(key, currentBucket = this.root) {
    if (!key.length) {
      return currentBucket;
    }

    for (let i = 0; i < currentBucket.children.length; i++) {
      let [childKey, childNode] = currentBucket.children[i];
      if (key.startsWith(childKey)) {
        return this.get(key.substring(childKey.length), childNode);
      }
    }

    return null;
  }

  hGet(key, field) {
    const currentBucket = this.get(key);
    return currentBucket ? currentBucket.value.get(field) : null;
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

  _getCommonPrefixLength(str1, str2) {
    let length = 0;
    while (
      length < str1.length &&
      length < str2.length &&
      str1[length] === str2[length]
    ) {
      length++;
    }
    return length;
  }
}
