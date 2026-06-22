const fs = require('fs');
const path = require('path');

const domains = [
  'member/home',
  'member/contributions',
  'member/impact',
  'admin/dashboard'
];

const basePath = path.join(__dirname, 'src', 'domains');

domains.forEach(domain => {
  const domainPath = path.join(basePath, ...domain.split('/'));
  
  // Make dirs
  ['model', 'viewModel', 'api', 'components', 'pages'].forEach(folder => {
    fs.mkdirSync(path.join(domainPath, folder), { recursive: true });
  });

  // Extract names for nicer stubs
  const parts = domain.split('/');
  const nameParts = parts.flatMap(p => p.split('-'));
  const PascalName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  const camelName = nameParts[0] + nameParts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');

  // 1. model
  fs.writeFileSync(path.join(domainPath, 'model', `${PascalName}.ts`), `// TODO: fill when backend DTO is ready\nexport interface ${PascalName}Data {}\n`);

  // 2. api
  fs.writeFileSync(path.join(domainPath, 'api', `${camelName}Api.ts`), `import { axiosClient } from '../../../../core/api/axiosClient';\n// export const fetch${PascalName} = async () => {\n//   const response = await axiosClient.get('/api/${domain}');\n//   return response.data;\n// };\n`);

  // 3. mock
  fs.writeFileSync(path.join(domainPath, 'api', 'mock.ts'), `import MockAdapter from 'axios-mock-adapter';\n\nexport const register${PascalName}Mocks = (adapter: MockAdapter) => {\n  // adapter.onGet('/api/${domain}').reply(200, {});\n};\n`);

  // 4. viewModel
  fs.writeFileSync(path.join(domainPath, 'viewModel', `use${PascalName}.ts`), `export const use${PascalName} = () => {\n  return { data: null, isLoading: false };\n};\n`);

  // 5. components
  fs.writeFileSync(path.join(domainPath, 'components', `${PascalName}View.tsx`), `import React from 'react';\n\nexport const ${PascalName}View: React.FC<any> = (props) => {\n  return <div>Coming soon</div>;\n};\n`);

  // 6. pages
  fs.writeFileSync(path.join(domainPath, 'pages', `${PascalName}Page.tsx`), `import React from 'react';\nimport { use${PascalName} } from '../viewModel/use${PascalName}';\nimport { ${PascalName}View } from '../components/${PascalName}View';\n\nexport default function ${PascalName}Page() {\n  const viewModel = use${PascalName}();\n  return (\n    <div className="p-4">\n      <h1 className="text-2xl font-bold mb-4">${PascalName}</h1>\n      <${PascalName}View {...viewModel} />\n    </div>\n  );\n}\n`);

});

console.log('Stubbing complete');
