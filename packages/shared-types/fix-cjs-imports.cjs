const fs = require("fs");
const path = require("path");

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let hasChanges = false;

    // Fix relative imports: "./something" -> "./something.d.cts"
    const relativeImportRegex = /from\s+"\.\/([^"]+)"/g;
    content = content.replace(relativeImportRegex, (match, module) => {
      // Don't add extension if already has one
      if (module.endsWith(".d.cts") || module.endsWith(".d.ts")) {
        return match;
      }
      hasChanges = true;
      return `from "./${module}.d.cts"`;
    });

    // Fix parent directory imports: "../something" -> "../something.d.cts"
    const parentImportRegex = /from\s+"\.\.\/([^"]+)"/g;
    content = content.replace(parentImportRegex, (match, module) => {
      // Handle nested directories
      if (module.includes("/")) {
        const parts = module.split("/");
        const lastPart = parts[parts.length - 1];
        if (!lastPart.endsWith(".d.cts") && !lastPart.endsWith(".d.ts")) {
          parts[parts.length - 1] = lastPart + ".d.cts";
          hasChanges = true;
          return `from "../${parts.join("/")}"`;
        }
      } else {
        if (!module.endsWith(".d.cts") && !module.endsWith(".d.ts")) {
          hasChanges = true;
          return `from "../${module}.d.cts"`;
        }
      }
      return match;
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(
        `✓ Fixed imports in: ${path.relative(process.cwd(), filePath)}`,
      );
    } else {
      console.log(
        `- No changes needed: ${path.relative(process.cwd(), filePath)}`,
      );
    }

    return hasChanges;
  } catch (error) {
    console.error(`✗ Error fixing imports in ${filePath}:`, error.message);
    process.exit(1);
  }
}

function fixAllFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`✗ Directory not found: ${dir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dir);
  let totalFiles = 0;
  let fixedFiles = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const result = fixAllFiles(fullPath);
      totalFiles += result.total;
      fixedFiles += result.fixed;
    } else if (file.endsWith(".d.cts")) {
      totalFiles++;
      if (fixImportsInFile(fullPath)) {
        fixedFiles++;
      }
    }
  }

  return { total: totalFiles, fixed: fixedFiles };
}

// Main execution
console.log("🔧 Starting CJS imports fix...");
const startTime = Date.now();

const cjsDir = path.join(__dirname, "dist", "cjs");
const result = fixAllFiles(cjsDir);

const duration = Date.now() - startTime;
console.log("\n Import fix completed!");
console.log(`📊 Files processed: ${result.total}`);
console.log(`🔧 Files fixed: ${result.fixed}`);
console.log(`⏱️  Duration: ${duration}ms`);

if (result.fixed === 0) {
  console.log("ℹ️  All import paths were already correct.");
}
