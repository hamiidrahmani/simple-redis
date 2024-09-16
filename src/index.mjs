import { Trie } from "./utils/Trie.mjs";

function init() {
  const trie = new Trie();
  trie.set("value", 57);
  trie.set("val", 36);
  trie.set("va", 6);
}

init();
