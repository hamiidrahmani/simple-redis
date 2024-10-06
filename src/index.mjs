import { writeFileSync } from "fs";
import { Redis } from "./utils/Redis.mjs";

function init() {
  const redis = new Redis();
  redis.set("hello", "majid");
  redis.set("help", "hamid");
  redis.hSet("help", "name", "John");
  redis.hSet("testing", "family", "Smith");
  redis.hSet("tester", "age", "40");
  redis.zAdd("tester", 10, "omid");
  redis.zAdd("tester", 20, "hamid");
  redis.zAdd("tester", 40, "majid");
  writeFileSync("./output.json", JSON.stringify(redis, null, 2), "utf-8");
}

init();
