module.exports = {
  extends: [
    'airbnb-base',
  ],
  env: {
    browser: true,
  },
  plugins: [
    'svelte3'
  ],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'import/first': 'off',
        'import/no-unresolved': 'off',
      },
    }
  ],
};
