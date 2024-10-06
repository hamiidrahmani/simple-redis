import { IncrementalHashTable } from "./IncrementalHashTable.mjs";

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

  set(key, value) {
    let currentNode = this.root;

    if (!key.length) {
      currentNode.value = value;
      return;
    }

    let i = 0;

    while (i < key.length) {
      const char = key[i];
      let foundNode = null;

      for (let index = 0; index < currentNode.children.length; index++) {
        if (currentNode.children[index].key[0] === char) {
          foundNode = currentNode.children[index];
          break;
        }
      }

      if (!foundNode) {
        foundNode = new RadixNode(key.substring(i), value);
        currentNode.children.push(foundNode);
        return;
      }

      let j = 0;
      while (
        j < foundNode.key.length &&
        i < key.length &&
        foundNode.key[j] === key[i]
      ) {
        j++;
        i++;
      }

      if (j === foundNode.key.length) {
        currentNode = foundNode;
      } else {
        const commonPrefix = foundNode.key.substring(0, j);
        const remainingKey = foundNode.key.substring(j);
        const newNode = new RadixNode(remainingKey, foundNode.value);
        newNode.children = foundNode.children;

        foundNode.key = commonPrefix;
        foundNode.value = null;
        foundNode.children = [newNode];

        if (i < key.length) {
          const newChild = new RadixNode(key.substring(i), value);
          foundNode.children.push(newChild);
        } else {
          foundNode.value = value;
        }
        return;
      }
    }

    currentNode.value = value;
  }

  get(key) {
    let currentNode = this.root;
    let i = 0;

    while (i < key.length) {
      const char = key[i];
      // let foundNode = node.children.find((child) => child.key[0] === char);
      let foundNode = null;

      for (let index = 0; index < currentNode.children.length; index++) {
        if (currentNode.children[index].key[0] === char) {
          foundNode = currentNode.children[index];
          break;
        }
      }

      if (!foundNode) {
        return null;
      }

      let j = 0;
      while (
        j < foundNode.key.length &&
        i < key.length &&
        foundNode.key[j] === key[i]
      ) {
        j++;
        i++;
      }

      if (j === foundNode.key.length) {
        currentNode = foundNode;
      } else {
        return null;
      }
    }

    return currentNode;
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
      const hashTable = new IncrementalHashTable();
      hashTable.add(field, value);
      this.set(key, hashTable);
    }
  }
}
