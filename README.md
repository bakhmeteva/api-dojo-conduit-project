# API Dojo Conduit Testing Project

Цей проєкт призначений для автоматизованого тестування API та UI веб-додатку Conduit за допомогою сучасних інструментів тестування.

**Тестовий сайт:** https://demo.learnwebdriverio.com

## Структура проєкту

```
├── tests/
│   ├── api/                # API тести
│       ├── articles/       # Тести роботи зі статтями
│       ├── users/          # Тести профілів користувачів
│   
├── src/
│   ├── controllers/        # API клієнти та методи
│   ├── fixtures/           # Тестові дані та фікстури
│   ├── interfaces/         # Тестові типи даних
│   └── shemas/             # json схеми
├── playwright.config.ts    # Конфігурація Playwright
├── package.json            # Залежності та npm-скрипти
└── .github/workflows/      # CI/CD workflow для GitHub Actions
```

## Покриття тестами

### API тести:
- **Аутентифікація**: реєстрація, вхід, оновлення профілю
- **Статті**: створення, редагування, видалення, лайки
- **Коментарі**: додавання, видалення коментарів
- **Профілі**: перегляд, підписки/відписки
- **Теги**: отримання списку популярних тегів

## Фікстури та тестові дані
```typescript
// Приклад структури тестових даних
const testUsers = {
  validUser: {
    username: "testuser",
    email: "test@example.com",
    password: "password123"
  },
  existingUser: {
    username: "johnjacob",
    email: "john@jacob.com", 
    password: "johnjacob"
  }
};

const testArticles = {
  newArticle: {
    title: "Test Article",
    description: "Test description",
    body: "Test article body",
    tagList: ["test", "automation"]
  }
};
```

## Швидкий старт

1. **Встановлення залежностей:**
   ```bash
   npm ci
   ```

2. **Запуск усіх тестів:**
   ```bash
   npx playwright test
   ```

## Конфігурація

Проєкт налаштовано для тестування на:
- **UI Base URL**: `https://demo.learnwebdriverio.com`

## Автоматичний запуск тестів (CI)

У проєкті налаштовано автоматичний запуск тестів у GitHub Actions. Workflow виконується при кожному push або pull request до гілки `main`. Включає:
- Запуск API тестів
- Генерацію звітів
- Завантаження артефактів тестування

## Особливості проєкту
- **Паралельне виконання**: тести запускаються паралельно для швидкості
- **Ретраї**: автоматичні повторні спроби для нестабільних тестів  

## Рекомендації
- Для додавання нових API тестів використовуйте папку `tests/api/`
- Використовуйте фікстури з `src/fixtures/` для тестових даних
- Дотримуйтесь принципу DRY - виносьте загальну логіку в утиліти

## Корисні посилання
- [Playwright документація](https://playwright.dev/docs/intro)
- [Conduit API специфікація](https://github.com/gothinkster/realworld/tree/master/api)
- [Демо сайт Conduit](https://demo.learnwebdriverio.com)

---
