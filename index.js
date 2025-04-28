require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const sequelize = require('./db/config');
const User = require('./db/models/User');
const { Op } = require('sequelize');

// Initialize database
sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Error syncing database:', err);
});

// ТУТ встав свій токен бота!
const bot = new Telegraf(process.env.BOT_TOKEN);

// Middleware to track user activity
bot.use(async (ctx, next) => {
  try {
    const telegramId = ctx.from?.id.toString();
    if (telegramId) {
      const [user] = await User.findOrCreate({
        where: { telegramId },
        defaults: {
          username: ctx.from.username,
          status: 'new'
        }
      });
      
      // Update last activity
      await user.update({ lastActivity: new Date() });
      
      ctx.dbUser = user;
    }
  } catch (error) {
    console.error('Error in middleware:', error);
  }
  return next();
});

// /start команда
bot.start(async (ctx) => {
  if (ctx.dbUser) {
    await ctx.dbUser.update({ status: 'new', currentBlock: 'START' });
  }
  
  ctx.reply(
    `Привіт! Я віртуальний асистент. 👋

Розповім тобі основну інформацію та задам кілька запитань. 🙂

Якщо все влаштує — направлю тебе до людини, яка допоможе далі.
✅ Натисни "ОК" — щоб продовжити!

😊 Або якщо хочеш спочатку переглянути відгуки — тисни "Відгуки"`,
    Markup.inlineKeyboard([
      [Markup.button.callback('ОК', 'BLOCK2')],
      [Markup.button.callback('Відгуки', 'REVIEWS')],
    ])
  );
});

// Відгуки
bot.action('REVIEWS', async (ctx) => {
  await ctx.reply('Ось кілька відгуків від наших працівниць:');
  await ctx.replyWithPhoto({ source: './images/review1.png' });
  await ctx.replyWithPhoto({ source: './images/review2.png' });
  await ctx.replyWithPhoto({ source: './images/review3.png' });
});

// Блок 2
bot.action('BLOCK2', async (ctx) => {
  if (ctx.dbUser) {
    await ctx.dbUser.update({ 
      status: 'in_progress',
      currentBlock: 'BLOCK2'
    });
  }
  
  ctx.reply(
    `⬇️ Всього буде 5 пунктів: ⬇️

1. Детальніше про роботу
2. Як проходить робочий процес
3. Графік роботи
4. Оплата
5. Що потрібно для початку

❗ Натискай кнопку під текстом, щоб продовжити ❗`,
    Markup.inlineKeyboard([
      [Markup.button.callback('ОК', 'BLOCK3')],
    ])
  );
});

// Блок 3
bot.action('BLOCK3', async (ctx) => {
  if (ctx.dbUser) {
    await ctx.dbUser.update({ 
      status: 'in_progress',
      currentBlock: 'BLOCK3'
    });
  }
  
  ctx.reply(
    `1️⃣ Детальніше про роботу 1️⃣
❕Робота проходитиме на британському сайті знайомств, де знаходяться тільки іноземні чоловіки (можна блокувати країни СНД)❕
Спілкування буде англійською мовою (через перекладач).

Суть роботи полягає в тому, що ви заходите на сайт, вмикаєте камеру, одразу вимикаєте мікрофон (оскільки спілкування відбувається в письмовому форматі) і чекаєте дзвінка від чоловіка.
Щоб вам зателефонували, нічого робити не потрібно.
Безкоштовно вас ніхто побачити не зможе — гроші нараховуються тільки тоді, коли чоловік телефонує вам.

Навчатимуть вас спеціально підготовлені люди, навчання займає максимум 1 годину.
Далі все залежить від вашої активності та фантазії в спілкуванні.
2 вихідних на тиждень.

❕Важливо❕ Це Adult сайт, але всі дівчата працюють у категорії non-adult — абсолютно без інтиму, і завжди мають повне право відмовити співрозмовнику.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Підходить! Йдемо далі', 'BLOCK4')],
      [Markup.button.callback('Не підходить', 'NOT_MATCH')],
    ])
  );
});

// Блок 4
bot.action('BLOCK4', async (ctx) => {
  if (ctx.dbUser) {
    await ctx.dbUser.update({ 
      status: 'in_progress',
      currentBlock: 'BLOCK4'
    });
  }
  
  ctx.reply(
    `2️⃣ Як проходить робота на сайті: 2️⃣
Ти просто заходиш на сайт за логіном і паролем (які надішле студія), вмикаєш камеру 🎥, вимикаєш мікрофон ⛔️ і чекаєш дзвінка від чоловіка.

Коли дзвінка немає — немає потреби весь час сидіти перед камерою (головне, коли дзвонить чоловік — швидко відповісти на дзвінок❗️).
Як тільки чоловік зателефонував — з першої хвилини тобі починають нараховуватися гроші.

Суть роботи — затримати чоловіка спілкуванням (можна не лише спілкуванням, усе залежить від твого бажання), щоб він витрачав якнайбільше грошей на тебе.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Підходить! Йдемо далі', 'BLOCK5')],
      [Markup.button.callback('Не підходить', 'NOT_MATCH')],
    ])
  );
});

// Блок 5
bot.action('BLOCK5', async (ctx) => {
  if (ctx.dbUser) {
    await ctx.dbUser.update({ 
      status: 'in_progress',
      currentBlock: 'BLOCK5'
    });
  }
  
  ctx.reply(
    `3️⃣ Графік роботи 3️⃣

⏰ Від 5-6 годин на добу у будь-який зручний час.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Підходить! Йдемо далі', 'BLOCK6')],
      [Markup.button.callback('Не підходить', 'NOT_MATCH')],
    ])
  );
});

// Блок 6 (НОВИЙ! Оплата)
bot.action('BLOCK6', async (ctx) => {
  if (ctx.dbUser) {
    await ctx.dbUser.update({ 
      status: 'in_progress',
      currentBlock: 'BLOCK6'
    });
  }
  
  ctx.reply(
    `4️⃣ Оплата 4️⃣

❗️Зарплата виплачується в криптовалюті, а далі ти зможеш вивести її на будь-яку картку або платіжну систему (цьому навчають), кожні 2 тижні.

💵 до 600 доларів — 80% (+ комісія сайту 15%)  
💵 від 600 до 1000 доларів — 85% (+ комісія сайту 15%)  
💵 понад 1000 доларів — 90% (+ комісія сайту 15%)

Зарплата дівчат за 2 тижні мінімум 400–500$, багато хто заробляє 1000–2000$.

Ти також зможеш переглядати свій баланс на сайті (у доларах) і рахувати чистий прибуток.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Підходить! Йдемо далі', 'BLOCK7')],
      [Markup.button.callback('Не підходить', 'NOT_MATCH')],
    ])
  );
});

// Блок 7 (Що потрібно для старту)
bot.action('BLOCK7', async (ctx) => {
  if (ctx.dbUser) {
    await ctx.dbUser.update({ 
      status: 'in_progress',
      currentBlock: 'BLOCK7'
    });
  }
  
  ctx.reply(
    `5️⃣ Що потрібно для початку? 5️⃣

✅ Ноутбук і хороший інтернет  
✅ ID карта / паспорт / закордонний паспорт / водійські права  
❌ Український паспорт старого зразка — не підходить

–– Потрібна буде верифікація документів для підтвердження віку (18+) ––`,
    Markup.inlineKeyboard([
      [Markup.button.callback('У мене все є! Йдемо далі', 'BLOCK8')],
      [Markup.button.callback('У мене немає ноутбука, але хочу працювати!', 'BLOCK81')],
    ])
  );
});

// Блок 8 - попередження про 18+
bot.action('BLOCK8', async (ctx) => {
  if (ctx.dbUser) {
    await ctx.dbUser.update({ 
      status: 'in_progress',
      currentBlock: 'BLOCK8'
    });
  }
  
  ctx.reply(
    `⚠️ ОБОВ'ЯЗКОВО! Якщо тобі менше 18 років і думаєш обійти верифікацію — це НЕМОЖЛИВО. Підробка документів карається законом.

Якщо більше 18 — натискай "Далі".`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Далі', 'BLOCK9')],
    ])
  );
});

// Блок 9 - фінал українською
bot.action('BLOCK9', async (ctx) => {
  if (ctx.dbUser) {
    await ctx.dbUser.update({ 
      status: 'pending_dm',
      currentBlock: 'BLOCK9'
    });
  }
  
  ctx.reply(
    `🎉 Супер! Напиши "Я пройшла" у цей акаунт 👉 @angelic578 і вона допоможе тобі з усім іншим!`
  );
});

// Блок 8.1 - фінал для тих без ноутбука
bot.action('BLOCK81', (ctx) => {
  ctx.reply(
    `🎉 Супер! Напиши "Я прочитала" у цей акаунт 👉 @angelic578 і вона допоможе тобі з усім іншим!`
  );
});

// Обробка "Не підходить"
bot.action('NOT_MATCH', (ctx) => {
  ctx.reply(
    `На жаль, співпраця неможлива в такому випадку 😔  
Дякуємо за твій час і бажаємо гарного дня!`
  );
});

// Helper function to get sales funnel statistics
async function getSalesStats() {
  const stats = await User.findAll({
    attributes: ['status', [sequelize.fn('COUNT', '*'), 'count']],
    group: ['status']
  });
  
  const pendingFollowUp = await User.findAll({
    where: {
      status: 'pending_dm',
      lastActivity: {
        [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000) // More than 24 hours ago
      }
    }
  });
  
  return { stats, pendingFollowUp };
}

// Admin command to check statistics
bot.command('stats', async (ctx) => {
  const { stats, pendingFollowUp } = await getSalesStats();
  
  let message = '📊 Sales Funnel Statistics:\n\n';
  for (const stat of stats) {
    const data = stat.get({ plain: true });
    message += `${data.status}: ${data.count}\n`;
    // Fetch users for this status
    const users = await User.findAll({ where: { status: data.status } });
    if (users.length > 0) {
      const handles = users.map(u => u.username ? `@${u.username}` : `[id:${u.telegramId}]`).join(', ');
      message += `Handles: ${handles}\n`;
    }
  }
  
  message += `\n🔔 Users pending follow-up (>24h): ${pendingFollowUp.length}`;
  if (pendingFollowUp.length > 0) {
    const handles = pendingFollowUp.map(u => u.username ? `@${u.username}` : `[id:${u.telegramId}]`).join(', ');
    message += `\nPending DM handles: ${handles}`;
  }
  
  ctx.reply(message);
});

// Запуск бота
bot.launch();
console.log('Бот працює!');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
