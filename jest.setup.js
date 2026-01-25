import '@testing-library/jest-dom';

const enMessages = require('./messages/en.json');

// Helper to get nested translation value by dot notation key
const getNestedValue = (obj, path) => {
  const result = path.split('.').reduce((current, key) => current?.[key], obj);
  return result;
};

// Mock next-intl to use real translations
jest.mock('next-intl', () => {
  const mockT = (key, params) => {
    // Get translation from real JSON file
    let translation = getNestedValue(enMessages, key);
    
    // If not found, return key as fallback
    if (!translation) {
      return key;
    }
    
    // Ensure translation is a string
    if (typeof translation !== 'string') {
      return String(translation);
    }
    
    // Handle ICU MessageFormat for pluralization (simplified for tests)
    if (translation.includes('plural')) {
      // Simple plural handling: if count is 1, use singular, otherwise plural
      if (params?.count === 1) {
        translation = translation.replace(
          /{count, plural, =1 \{([^}]+)\} other \{([^}]+)\}}/,
          '$1'
        );
      } else {
        translation = translation.replace(
          /{count, plural, =1 \{([^}]+)\} other \{([^}]+)\}}/,
          '$2'
        );
      }
      // Replace # with count
      translation = translation.replace(/#/g, String(params?.count || 0));
    }

    // Interpolate parameters: replace {param} with actual values
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(
          new RegExp(`\\{${paramKey}\\}`, 'g'),
          String(paramValue)
        );
      });
    }
    
    return translation;
  };

  return {
    useTranslations: jest.fn(() => mockT),
    NextIntlClientProvider: ({ children }) => children,
    getMessages: jest.fn(() => Promise.resolve(enMessages)),
  };
});

// Mock next-intl/server
jest.mock('next-intl/server', () => ({
  getMessages: jest.fn(() => Promise.resolve(enMessages)),
}));
