module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "extends": [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 13,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-hooks",
        "@typescript-eslint"
    ],
    "rules": {
        // 重新配置 react-hooks 相关内容
        'quotes': ['error','single'], // 字符串采用单引号
        'indent': ['error', 2], // 两个空格作为缩进
        "react-hooks/rules-of-hooks": "error",
        "react/react-in-jsx-scope": "off",
        "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
        'react/jsx-max-props-per-line': [1, {"maximum": 5}],
        'key-spacing': ["error", { "afterColon": true }],
        'comma-spacing': ["error", { "before": false, "after": true }]
    }
};
