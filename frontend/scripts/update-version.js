const fs = require('fs');
const path = require('path');

/**
 * Update version numbers across all necessary files
 * Usage: npm run update-version 1.2.3
 */

// Get the new version from command line arguments
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Please provide a version number: npm run update-version 1.2.3');
  process.exit(1);
}

// Validate version format (semver)
const semverRegex = /^\d+\.\d+\.\d+$/;
if (!semverRegex.test(newVersion)) {
  console.error('Version must be in semver format: major.minor.patch (e.g., 1.2.3)');
  process.exit(1);
}

// Paths to files that need version updates
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const appJsonPath = path.join(__dirname, '..', 'app.json');

// Update package.json
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const oldVersion = packageJson.version;
  packageJson.version = newVersion;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✅ Updated package.json version: ${oldVersion} → ${newVersion}`);
} catch (error) {
  console.error('❌ Failed to update package.json:', error.message);
  process.exit(1);
}

// Update app.json
try {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  // Update version in root
  const oldRootVersion = appJson.version || 'undefined';
  appJson.version = newVersion;
  
  // Update version in expo section
  const oldExpoVersion = appJson.expo?.version || 'undefined';
  if (appJson.expo) {
    appJson.expo.version = newVersion;
  }
  
  // Update build number/versionCode
  // For Android, increment versionCode
  if (appJson.expo && appJson.expo.android) {
    const oldVersionCode = appJson.expo.android.versionCode || 0;
    const newVersionCode = oldVersionCode + 1;
    appJson.expo.android.versionCode = newVersionCode;
    console.log(`✅ Updated Android versionCode: ${oldVersionCode} → ${newVersionCode}`);
  }
  
  // For iOS, increment buildNumber
  if (appJson.expo && appJson.expo.ios) {
    const oldBuildNumber = appJson.expo.ios.buildNumber || '0';
    const newBuildNumber = (parseInt(oldBuildNumber, 10) + 1).toString();
    appJson.expo.ios.buildNumber = newBuildNumber;
    console.log(`✅ Updated iOS buildNumber: ${oldBuildNumber} → ${newBuildNumber}`);
  }
  
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
  console.log(`✅ Updated app.json version: ${oldRootVersion} → ${newVersion} and ${oldExpoVersion} → ${newVersion}`);
} catch (error) {
  console.error('❌ Failed to update app.json:', error.message);
  process.exit(1);
}

console.log(`🎉 Version successfully updated to ${newVersion} across all files!`);
console.log(`🔍 Remember to review the changes and commit them.`);