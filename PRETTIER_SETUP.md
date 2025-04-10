# Prettier Setup

This project uses Prettier for consistent code formatting. The configuration is based on the existing codebase style.

## Configuration

The Prettier configuration is defined in `.prettierrc`:

```json
{
  "semi": true,
  "arrowParens": "always",
  "proseWrap": "preserve",
  "singleQuote": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 80,
  "endOfLine": "auto",
  "bracketSpacing": true,
  "jsxBracketSameLine": false
}
```

## Usage

Format all files:

```bash
npm run format
```

## Key Style Rules

- Double quotes for strings and JSX attributes
- Semicolons at the end of statements
- 2 space indentation
- 80 character line length limit
- Trailing commas in ES5 objects and arrays
- Parentheses around arrow function parameters
- Spaces between brackets in object literals
- JSX brackets on new lines

## IDE Integration

For the best development experience, configure your editor to use Prettier:

### VS Code

1. Install the Prettier extension
2. Enable "Format on Save" in settings
3. Set Prettier as the default formatter

### WebStorm/IntelliJ

1. Install the Prettier plugin
2. Enable "Run on save" in Prettier settings
3. Configure the IDE to use Prettier for formatting
