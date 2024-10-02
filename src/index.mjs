import { HashTable } from "./utils/HashTable.mjs";
import { Trie } from "./utils/Trie.mjs";
import { RadixTree } from "./utils/RadixTree.mjs";

function init() {
  const trie = new RadixTree();
  trie.hSet("test", "name", "John");
  trie.hSet("testing", "family", "Smith");
  trie.hSet("tester", "age", "40");

  console.log(JSON.stringify(trie));
}

init();
