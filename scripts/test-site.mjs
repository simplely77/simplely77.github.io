import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";

import { tmpdir } from "node:os";
import { join } from "node:path";

const buildDir = mkdtempSync(join(tmpdir(), "simplely-cms-test-"));
const output = (path) => join(buildDir, path);
const settingsPath = "src/data/site.json";
const original = existsSync(settingsPath) ? readFileSync(settingsPath, "utf8") : null;
const posts = "src/content/posts";
const published = `${posts}/cms-integration-published.md`;
const draft = `${posts}/cms-integration-draft.md`;
const second = `${posts}/cms-integration-second.md`;
const image = "public/uploads/cms-integration.svg";
for (const path of [published, draft, second, image]) assert.equal(existsSync(path), false);
mkdirSync(posts, { recursive: true });
mkdirSync("src/data", { recursive: true });
mkdirSync("public/uploads", { recursive: true });

try {
  writeFileSync(settingsPath, JSON.stringify({
    ...(original ? JSON.parse(original) : {}),
    title: "Simplely CMS Check",
    subtitle: "后台编辑验证",
    description: "后台简介验证",
    name: "资料表单验证",
    bio: "后台个人简介验证",
    avatar: "/uploads/cms-integration.svg",
  }));
  writeFileSync(image, '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="blue"/></svg>');
  for (const [path, hidden] of [[published, false], [draft, true]]) {
    writeFileSync(path, `---\ntitle: "${hidden ? "CMS-DRAFT-MUST-STAY-HIDDEN" : "中文技术验证"}"\npublished: "2026-10-30"\ndraft: ${hidden}\nimage: "/uploads/cms-integration.svg"\ntags: [验证]\ncategory: 技术排障\n---\n\n## 解决方案\n\n![排查截图](/uploads/cms-integration.svg)\n\n\`\`\`bash\necho verified\n\`\`\`\n`);
  }
  writeFileSync(second, '---\ntitle: "第二条中文记录"\nslug: cms-integration-second-url\npublished: "2026-10-30"\ndraft: false\n---\n\n同一天的另一条技术记录。\n');
  execFileSync("astro", ["build", "--outDir", buildDir], { stdio: "inherit" });
  const home = readFileSync(output("index.html"), "utf8");
  for (const text of ["Simplely CMS Check", "资料表单验证", "后台个人简介验证", "/uploads/cms-integration.svg", "中文技术验证"]) assert.ok(home.includes(text), text);
  assert.ok(home.includes('lang="zh-CN"'));
  assert.ok(existsSync(output("uploads/cms-integration.svg")));
  const article = readFileSync(output("posts/cms-integration-published/index.html"), "utf8");
  assert.ok(article.includes("echo"));
  assert.ok(article.includes("解决方案"));
  assert.ok(existsSync(output("posts/cms-integration-second-url/index.html")));
  const styles = readdirSync(output("_astro")).filter((name) => name.endsWith(".css"))
    .map((name) => readFileSync(output(`_astro/${name}`), "utf8")).join("\n");
  for (const selector of [".card-base", ".custom-md", "--page-bg"]) assert.ok(styles.includes(selector), selector);
  assert.equal(existsSync(output("posts/cms-integration-draft/index.html")), false);
  for (const path of [output("index.html"), output("archive/index.html"), output("rss.xml"), output("sitemap-0.xml")]) {
    const text = readFileSync(path, "utf8");
    assert.ok(!text.includes("CMS-DRAFT-MUST-STAY-HIDDEN"), path);
    assert.ok(!text.includes("cms-integration-draft"), path);
  }
  assert.ok(readFileSync(output("rss.xml"), "utf8").includes("https://simplely77.github.io/"));
  execFileSync("pagefind", ["--site", buildDir], { stdio: "inherit" });
  const index = JSON.parse(readFileSync(output("pagefind/pagefind-entry.json"), "utf8"));
  assert.equal(index.languages["zh-cn"].page_count, 3);
  console.log("CMS integration passed: profile, Chinese content, quoted date, uploads, code, draft isolation and site URLs.");
} finally {
  rmSync(buildDir, { recursive: true, force: true });
  for (const path of [published, draft, second, image]) rmSync(path, { force: true });
  if (original !== null) writeFileSync(settingsPath, original);
  else rmSync(settingsPath, { force: true });
}
