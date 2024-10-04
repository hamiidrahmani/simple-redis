class SkipListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.right = null;
    this.down = null;
    this.index = null;
  }
}

export class SkipList {
  constructor() {
    this.head = new SkipListNode(null, null);
  }

  get(key) {
    let node = this.head;
    while (node) {
      if (!node.right || node.right.value > value) {
        node = node.down;
      } else if (node.right.key === key) {
        return node.right.value;
      } else {
        node = node.right;
      }
    }
    return null;
  }

  add(value, key) {
    const intermediateNodes = [];
    let node = this.head;

    // Locate insertion point by create intermediate nodes array
    while (node) {
      if (!node.right || node.right.value > value) {
        intermediateNodes.unshift(node);
        node = node.down;
      } else {
        node = node.right;
      }
    }

    // Add node and levelUp randomly
    let shouldPromote = true;
    let downNode = null;
    while (shouldPromote && intermediateNodes.length) {
      const node = intermediateNodes.shift();
      const newNode = new SkipListNode(key, value);
      newNode.down = downNode;
      newNode.right = node.right;
      node.right = newNode;
      shouldPromote = Math.random() < 0;
      downNode = newNode;
    }

    // Add new level randomly
    if (shouldPromote) {
      const newHead = new SkipListNode(null, null);
      newHead.right = new SkipListNode(key, value);
      newHead.right.down = downNode;
      newHead.down = this.head;
      this.head = newHead;
    }
  }

  rank(key) {
    let node = this.head;
    while (node) {
      if (!node.right || node.right.key > key) {
        node = node.down;
      } else if (node.right.key === key) {
        return node.right.index;
      } else {
        node = node.right;
      }
    }
    return null;
  }
}
