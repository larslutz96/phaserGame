const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "../public/assets");
const outputFile = path.join(assetsDir, "assets.json");
const configDir = path.join(__dirname, "../src/Game/config");

// Function to recursively get image files
function getFiles(dir, baseDir = "") {
  return fs.readdirSync(dir).reduce((files, file) => {
    const fullPath = path.join(dir, file);
    const relPath = path.join(baseDir, file).replace(/\\/g, "/"); // Ensure web-compatible paths

    if (fs.statSync(fullPath).isDirectory()) {
      return { ...files, ...getFiles(fullPath, relPath) };
    }

    if (/\.(png|jpe?g|svg)$/i.test(file)) {
      files[file.replace(/\.[^/.]+$/, "")] = { path: relPath };
    }
    return files;
  }, {});
}

// Function to load configurations
function loadConfigs() {
  if (!fs.existsSync(configDir)) return {};

  return fs
    .readdirSync(configDir)
    .filter((file) => file.endsWith(".js"))
    .reduce((configs, file) => {
      const config = require(path.join(configDir, file)); // Load module
      Object.entries(config).forEach(([key, value]) => {
        if (key !== "gameOptions") configs[key] = value;
      });
      return configs;
    }, {});
}

// Collect assets
const assets = {
  images: getFiles(path.join(assetsDir, "sprites")),
  configs: loadConfigs(),
};

// Assign displayWidth & displayHeight to images if available in configs
const { images, configs } = assets;
const relevantKeys = [
  "displayHeight",
  "displayWidth",
  "name",
  "texture",
  "textureType",
];

Object.entries(configs).forEach(([configTypeKey, configData]) => {
  if (configData.name) {
    // Single config
    const textureName = configData.texture;
    if (images[textureName]) {
      relevantKeys.forEach((key) => {
        if (configData[key] !== undefined)
          images[textureName][key] = configData[key];
      });
    } else {
      console.warn(`⚠️ Missing texture for config: ${configTypeKey}`);
    }
  } else {
    // Multiple configs in a category
    Object.entries(configData).forEach(([configKey, data]) => {
      const textureName = data.texture;
      if (images[textureName]) {
        relevantKeys.forEach((key) => {
          if (data[key] !== undefined) images[textureName][key] = data[key];
        });
      } else {
        console.warn(
          `⚠️ Missing texture for: ${configKey} in ${configTypeKey}`,
        );
      }
    });
  }
});

// Save the JSON file
fs.writeFileSync(outputFile, JSON.stringify(images, null, 2));
console.log("✅ assets.json generated successfully!");
