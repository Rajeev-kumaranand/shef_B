const fs = require('fs');
const path = require('path');

const models = ['discover', 'shop', 'latest', 'community', 'note'];

models.forEach(model => {
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);

  const fileContent = `import axiosInstance from './axios.js';

export const get${capModel}Content = async () => {
  const response = await axiosInstance.get('/${model}');
  return response.data;
};

export const update${capModel}Content = async (data) => {
  const response = await axiosInstance.put('/${model}', data);
  return response.data;
};
`;
  fs.writeFileSync(path.join(__dirname, `src/services/api/${model}Api.js`), fileContent);
});

console.log('Frontend APIs created.');
