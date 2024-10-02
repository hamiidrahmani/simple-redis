class SkipListNode {
  constructor(value, level) {
    this.value = value;
    this.forward = new Array(level + 1).fill(null);
  }
}

export class SkipList {
  constructor(maxLevel = 16, probability = 0.5) {
    this.maxLevel = maxLevel;
    this.probability = probability;
    this.level = 0;
    this.header = new SkipListNode(null, this.maxLevel);
  }

  // Generate a random level for a new node
  randomLevel() {
    let level = 0;
    while (Math.random() < this.probability && level < this.maxLevel) {
      level++;
    }
    return level;
  }

  // Insert a value into the skip list
  insert(value) {
    const update = new Array(this.maxLevel + 1).fill(null);
    let current = this.header;

    // Find the position to insert the new node
    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].value < value) {
        current = current.forward[i];
      }
      update[i] = current;
    }

    // Generate a random level for the new node
    const newLevel = this.randomLevel();
    if (newLevel > this.level) {
      for (let i = this.level + 1; i <= newLevel; i++) {
        update[i] = this.header;
      }
      this.level = newLevel;
    }

    // Create and insert the new node
    const newNode = new SkipListNode(value, newLevel);
    for (let i = 0; i <= newLevel; i++) {
      newNode.forward[i] = update[i].forward[i];
      update[i].forward[i] = newNode;
    }
  }

  // Search for a value in the skip list
  search(value) {
    let current = this.header;
    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i] && current.forward[i].value < value) {
        current = current.forward[i];
      }
    }
    current = current.forward[0];
    return current && current.value === value ? current : null;
  }
}
