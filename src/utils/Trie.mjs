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

  getValue(key, type) {
    const currentNode = this.get(key);
    return currentNode ? currentNode.getValue(type) : null;
  }
}
