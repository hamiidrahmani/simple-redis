import { Trie } from "./Trie.mjs";

export class Redis {
  trie = null;
  constructor() {
    this.trie = Trie();
  }
  set(key, value) {}
  get(key) {}
  hSet(key, field, value) {}
  hGet(key, field) {}
}
