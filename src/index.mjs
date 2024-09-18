import { HashTable } from "./utils/HashTable.mjs";
import { Trie } from "./utils/Trie.mjs";

function init() {
  const trie = new Trie();
  trie.hSet("user", "name", "John");
  trie.hSet("user", "family", "Smith");
  trie.hSet("user", "age", "40");
  trie.hSet("user", "field", "Engineer");

  console.log(JSON.stringify(trie));
}

init();
