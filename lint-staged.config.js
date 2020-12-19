module.exports = {
  '**/*.{ts,tsx}': [() => 'npm run type-check', 'prettier --write', 'npm run lint:fix'],
};
