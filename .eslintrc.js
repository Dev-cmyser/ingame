module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier', // Добавьте 'prettier' в extends
    ],
    plugins: ['@typescript-eslint', 'prettier'], // Добавьте 'prettier' в plugins
    // rules: {
    //     // Другие правила ESLint
    //     'prettier/prettier': 'error', // Добавьте это правило
    // },
    overrides: [
        {
            files: ['**/dto.ts'], // Паттерн для TypeScript файлов
            rules: {
                'prettier/prettier': 'warn',
                // Другие правила ESLint для TypeScript файлов
            },
        },
        {
            files: ['**/{module, service, controller}.ts'], // Паттерн для TypeScript файлов
            rules: {
                'prettier/prettier': 'error',
                // Другие правила ESLint для TypeScript файлов
            },
        },
    ],
}
