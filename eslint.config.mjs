import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  test: true,

  rules: {
    'no-alert': 'warn',
  },
}, {
  files: ['**/*.test.ts'],
  rules: {
    'prefer-promise-reject-errors': 'off',
  },
})
