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

  delete(key, value) {
    let node = this.head;
    while (node) {
      if (!node.right) {
        node = node.down;
        continue;
      } else if (node.right.value === value) {
        if (node.right.key === key) {
          node.right = node.right.right;
          node = node.down;
          continue;
        } else {
          node = node.right;
          continue;
        }
      } else if (node.right.value > value) {
        node = node.down;
        continue;
      } else {
        node = node.right;
        continue;
      }
    }
    return null;
  }

  add(value, key) {
    const intermediateNodes = [];
    let node = this.head;

    while (node) {
      if (!node.right || node.right.value > value) {
        intermediateNodes.unshift(node);
        node = node.down;
      } else if (node.right.key === key) {
        return (node.right.value = value);
      } else {
        node = node.right;
      }
    }

    let shouldPromote = true;
    let downNode = null;
    while (shouldPromote && intermediateNodes.length) {
      const node = intermediateNodes.shift();
      const newNode = new SkipListNode(key, value);
      newNode.down = downNode;
      newNode.right = node.right;
      node.right = newNode;
      shouldPromote = Math.random() < 0.5;
      downNode = newNode;
    }

    if (shouldPromote) {
      const newHead = new SkipListNode(null, null);
      newHead.right = new SkipListNode(key, value);
      newHead.right.down = downNode;
      newHead.down = this.head;
      this.head = newHead;
    }
  }
  getBaseLevel() {
    let node = this.head;
    while (node) {
      if (!node.down) return node.right;
      node = node.down;
    }
  }

  getIndex(key) {
    let node = this.getBaseLevel();
    let rank = 0;
    while (node) {
      if (key === node.key) return rank;
      rank++;
      node = node.right;
    }
    return null;
  }

  getList(from, to) {
    let node = this.getBaseLevel();
    let index = 0;
    let result = [];
    while (index < from) {
      node = node.right;
      index++;
    }
    while (index <= to) {
      result.push({ key: node.key, value: node.value });
      node = node.right;
      index++;
    }
    return result;
  }
}
