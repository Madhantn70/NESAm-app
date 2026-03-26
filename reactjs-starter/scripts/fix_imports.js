import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

// Maps old paths (relative to src/) to new paths (relative to src/)
function getNewPath(oldSrcRelativePath) {
  let p = oldSrcRelativePath.replace(/\\/g, '/');
  
  // 1. Core & Shared
  if (p.startsWith('components/')) return p.replace('components/', 'shared/components/');
  if (p.startsWith('utils/')) return p.replace('utils/', 'shared/utils/');
  if (p.startsWith('constants/')) return p.replace('constants/', 'shared/constants/');
  if (p.startsWith('api/')) return p.replace('api/', 'core/api/');

  // 2. Features -> Domains
  if (p.startsWith('features/home/')) return p.replace('features/home/', 'domains/public/landing/');
  if (p.startsWith('features/auth/')) return p.replace('features/auth/', 'domains/public/login/');
  if (p.startsWith('features/registration/')) return p.replace('features/registration/', 'domains/public/registration/');
  if (p.startsWith('features/member/')) return p.replace('features/member/', 'domains/member/home/');

  // 3. Screens
  if (p === 'screens/HomePage.tsx' || p === 'screens/HomePage') return 'domains/public/landing/pages/HomePage.tsx';
  if (p === 'screens/LoginPage.tsx' || p === 'screens/LoginPage') return 'domains/public/login/pages/LoginPage.tsx';
  if (p === 'screens/RegistrationPage.tsx' || p === 'screens/RegistrationPage') return 'domains/public/registration/pages/RegistrationPage.tsx';
  if (p === 'screens/member/MemberDashboardPage.tsx' || p === 'screens/member/MemberDashboardPage') return 'domains/member/home/pages/MemberDashboardPage.tsx';
  if (p === 'screens/member/MemberActiveDfcPage.tsx' || p === 'screens/member/MemberActiveDfcPage') return 'domains/member/contributions/pages/MemberActiveDfcPage.tsx';
  if (p === 'screens/member/MemberImpactPage.tsx' || p === 'screens/member/MemberImpactPage') return 'domains/member/impact/pages/MemberImpactPage.tsx';

  // If already matches domains/ shared/ core/ app/
  if (p.startsWith('domains/') || p.startsWith('shared/') || p.startsWith('core/') || p.startsWith('app/')) {
    return p;
  }

  return p;
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(srcDir);
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/from\s+['"]([^'"]+)['"]/g, (match, importPath) => {
    // Only resolve relative imports
    if (importPath.startsWith('.')) {
      // 1. Resolve absolute path of old import relative to the CURRENT completely migrated file location
      // Wait, if the file moved (e.g. depth 3 to 4), the `importPath` (like `../../../components`) 
      // is written based on OLD location.
      // So we must temporarily pretend the file is at its OLD location to resolve the target exactly!
      
      // Let's reverse-map current file location back to OLD location
      let currentSrcRelative = path.relative(srcDir, file).replace(/\\/g, '/');
      let oldFileLocation = currentSrcRelative;
      
      if (currentSrcRelative.startsWith('domains/public/landing/pages/HomePage')) oldFileLocation = currentSrcRelative.replace('domains/public/landing/pages/HomePage', 'screens/HomePage');
      else if (currentSrcRelative.startsWith('domains/public/login/pages/LoginPage')) oldFileLocation = currentSrcRelative.replace('domains/public/login/pages/LoginPage', 'screens/LoginPage');
      else if (currentSrcRelative.startsWith('domains/public/registration/pages/RegistrationPage')) oldFileLocation = currentSrcRelative.replace('domains/public/registration/pages/RegistrationPage', 'screens/RegistrationPage');
      else if (currentSrcRelative.startsWith('domains/member/home/pages/MemberDashboardPage')) oldFileLocation = currentSrcRelative.replace('domains/member/home/pages/MemberDashboardPage', 'screens/member/MemberDashboardPage');
      else if (currentSrcRelative.startsWith('domains/member/contributions/pages/MemberActiveDfcPage')) oldFileLocation = currentSrcRelative.replace('domains/member/contributions/pages/MemberActiveDfcPage', 'screens/member/MemberActiveDfcPage');
      else if (currentSrcRelative.startsWith('domains/member/impact/pages/MemberImpactPage')) oldFileLocation = currentSrcRelative.replace('domains/member/impact/pages/MemberImpactPage', 'screens/member/MemberImpactPage');
      else if (currentSrcRelative.startsWith('domains/public/landing/')) oldFileLocation = currentSrcRelative.replace('domains/public/landing/', 'features/home/');
      else if (currentSrcRelative.startsWith('domains/public/login/')) oldFileLocation = currentSrcRelative.replace('domains/public/login/', 'features/auth/');
      else if (currentSrcRelative.startsWith('domains/public/registration/')) oldFileLocation = currentSrcRelative.replace('domains/public/registration/', 'features/registration/');
      else if (currentSrcRelative.startsWith('domains/member/home/')) oldFileLocation = currentSrcRelative.replace('domains/member/home/', 'features/member/');
      else if (currentSrcRelative.startsWith('shared/components/')) oldFileLocation = currentSrcRelative.replace('shared/components/', 'components/');
      else if (currentSrcRelative.startsWith('shared/utils/')) oldFileLocation = currentSrcRelative.replace('shared/utils/', 'utils/');
      else if (currentSrcRelative.startsWith('shared/constants/')) oldFileLocation = currentSrcRelative.replace('shared/constants/', 'constants/');
      else if (currentSrcRelative.startsWith('core/api/')) oldFileLocation = currentSrcRelative.replace('core/api/', 'api/');

      const oldFileAbsolutePath = path.join(srcDir, oldFileLocation);
      const oldFileDir = path.dirname(oldFileAbsolutePath);
      
      // Target path in old structure
      const targetOldAbsolutePath = path.resolve(oldFileDir, importPath);
      
      if (targetOldAbsolutePath.startsWith(srcDir)) {
         let targetOldSrcRelative = path.relative(srcDir, targetOldAbsolutePath).replace(/\\/g, '/');
         
         // Fix the target to the new mapped location
         let newTargetSrcRelative = getNewPath(targetOldSrcRelative);

         // Strip .tsx or .ts or .jsx at the end to make it clean if we want, or just let Vite handle it
         let aliasTarget = `@/${newTargetSrcRelative}`;
         // Remove extension if present in the alias, though TS/Vite is forgiving.
         aliasTarget = aliasTarget.replace(/\.(tsx|ts|jsx|js)$/, '');

         return `from "${aliasTarget}"`;
      }
    }
    return match; // return original if not relative or outside src
  });
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
  }
});

console.log(`Updated imports in ${changedCount} files.`);
