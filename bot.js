import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!token || !supabaseUrl || !supabaseKey) {
  console.error("Error: Missing Telegram Token or Supabase Credentials in .env");
  process.exit(1);
}

// Initialize Supabase and Telegram Bot
const supabase = createClient(supabaseUrl, supabaseKey);
const bot = new TelegramBot(token, { polling: true });

// InMemory Stores
const userLanguages = {};

// Comprehensive Translation Dictionaries
const botDict = {
  am: {
    mainMenuText: `💳 *ℹ️ ስለ ብሉ ካርድ (BlueCards)*\n\nBlueCards የአካባቢ ገንዘብን ከዓለም አቀፍ ክፍያዎች ጋር ለማገናኘት የተነደፈ ዋና የፊንቴክ አገልግሎት ነው።\n\nፊዚካል የባንክ ካርዶችን የሚመስሉ ከፍተኛ ጥራት ያላቸውን የቪዛ እና የማስተርካርድ ቨርቹዋል ካርዶችን እናቀርባለን።`,
    aboutText: `ℹ️ *ስለ ብሉ ካርድ (BlueCards)*\n\nBlueCards የአካባቢ ገንዘብን ከዓለም አቀፍ ክፍያዎች ጋር ለማገናኘት የተነደፈ ዋና የፊንቴክ አገልግሎት ነው።\n\n*ለምን መረጡን?*\n✅ *ተለዋዋጭ የገንዘብ ማስገቢያ:* የሚያስፈልጉዎትን ያህል ብቻ ይጫኑ።\n✅ *አስተማማኝ:* መረጃዎ በባንክ ደረጃ ደህንነቱ የተጠበቀ ነው።`,
    helpPortalText: `💡 *የብሉ ካርድ የእርዳታ እና ድጋፍ ፖርታል*\n\nየተቀማጭ ገንዘብ ማስገባት ችግር ካጋጠመዎት እባክዎን ያነጋግሩን።`,
    webappText: `ደህንነቱ የተጠበቀ ገጽዎን ለመክፈት ከታች ያለውን ቁልፍ ይጫኑ፡`,
    launchBtn: "🚀 አፕ ክፈት / Launch App",
    aboutBtn: "ℹ️ ስለ ብሉ ካርድ",
    supportBtn: "❓ እርዳታና ድጋፍ",
    langToggleBtn: "🌐 ቋንቋ ቀይር / Change Language",
    registerBtn: "📝 መመዝገቢያ / Register",
    backBtn: "⬅️ ወደ ዋና ማውጫ",
    chooseLang: "እባክዎ የሚመርጡትን ቋንቋ ይምረጡ:",
    langUpdated: "ቋንቋዎ በተሳካ ሁኔታ ወደ አማርኛ ተቀይሯል! 🇪🇹",
    shareContactPrompt: "እባክዎ ለመመዝገብ ከታች ያለውን 'ስልክ ቁጥር አጋራ' የሚለውን ቁልፍ ይጫኑ 📱",
    shareContactBtn: "📱 ስልክ ቁጥር አጋራ / Share Contact",
    registerSuccess: "✅ ምዝገባዎ በተሳካ ሁኔታ ተጠናቋል! እናመሰግናለን!"
  },
  en: {
    mainMenuText: `💳 *ℹ️ About BlueCards*\n\nBlueCards is a premium fintech service designed to bridge the gap between local currency and global payments.\n\nWe provide high-quality virtual Visa and Mastercards that work exactly like physical bank cards.`,
    aboutText: `ℹ️ *About BlueCards*\n\nBlueCards is a premium fintech service designed to bridge the gap between local currency and global payments.\n\n*Why Choose Us?*\n✅ *Flexible Funding:* Load exactly what you need.\n✅ *Secure:* Your data is protected with bank-grade security.`,
    helpPortalText: `💡 *BlueCards Help Support Portal*\n\nIf you encounter deposit processing issues, contact our support channels.`,
    webappText: `Click below to execute your secure standalone portal framework session:`,
    launchBtn: "🚀 Launch App",
    aboutBtn: "ℹ️ About BlueCards",
    supportBtn: "❓ Support Help",
    langToggleBtn: "🌐 Change Language",
    registerBtn: "📝 Register for Updates",
    backBtn: "⬅️ Back to Menu",
    chooseLang: "Please select your preferred language:",
    langUpdated: "Your language profile has been successfully set to English! 🇬🇧",
    shareContactPrompt: "Please click the 'Share Contact' button at the bottom of your screen to register 📱",
    shareContactBtn: "📱 Share Contact",
    registerSuccess: "✅ Registration complete! Thank you for joining us!"
  }
};

const t = (chatId, key) => {
  const currentLang = userLanguages[chatId] || 'am';
  return botDict[currentLang][key] || botDict['am'][key] || key;
};

// Configure the native chat command menu dropdown
bot.setMyCommands([
  { command: 'start', description: '🚀 Open BlueCards Mini App' },
  { command: 'help', description: '❓ Get help' },
  { command: 'webapp', description: '🌐 Launch mini webapp' }
]);

// Main Menu Layout Configuration (Includes Inline Register Button)
const getMainMenuKeyboard = (chatId) => ({
  reply_markup: {
    inline_keyboard: [
      [
        { text: t(chatId, 'launchBtn'), web_app: { url: webAppUrl } }
      ],
      [
        { text: t(chatId, 'registerBtn'), callback_data: "trigger_register" }
      ],
      [
        { text: t(chatId, 'aboutBtn'), callback_data: "view_about" },
        { text: t(chatId, 'supportBtn'), callback_data: "view_help" }
      ],
      [
        { text: t(chatId, 'langToggleBtn'), callback_data: "trigger_language_select" }
      ]
    ]
  }
});

const getAboutKeyboard = (chatId) => ({
  parse_mode: 'Markdown',
  reply_markup: {
    inline_keyboard: [[{ text: t(chatId, 'backBtn'), callback_data: "back_to_menu" }]]
  }
});

// Command Controllers
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, t(chatId, 'mainMenuText'), {
    parse_mode: 'Markdown',
    ...getMainMenuKeyboard(chatId)
  });
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, t(chatId, 'helpPortalText'), { parse_mode: 'Markdown' });
});

// Contact Listener (Catches the phone number when they press Share Contact)
bot.on('contact', async (msg) => {
  const chatId = msg.chat.id;
  const contact = msg.contact;

  try {
    // Upsert user into Supabase 'users' table using their phone number
    const { error } = await supabase
      .from('users')
      .upsert({
        chat_id: chatId.toString(),
        username: msg.chat.username || 'No Username',
        first_name: msg.chat.first_name || 'No Name',
        phone: contact.phone_number,
        updated_at: new Date().toISOString()
      }, { onConflict: 'chat_id' });

    if (error) throw error;

    // Remove the contact keyboard and send success message
    bot.sendMessage(chatId, t(chatId, 'registerSuccess'), {
      reply_markup: { remove_keyboard: true }
    }).then(() => {
      // Bring back the main inline menu
      bot.sendMessage(chatId, t(chatId, 'mainMenuText'), {
        parse_mode: 'Markdown',
        ...getMainMenuKeyboard(chatId)
      });
    });

  } catch (err) {
    console.error("Supabase Error:", err);
    bot.sendMessage(chatId, "⚠️ Database connection error. Please try again later.");
  }
});

// Callback Query Router
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  if (data === "view_about") {
    bot.editMessageText(t(chatId, 'aboutText'), { chat_id: chatId, message_id: messageId, parse_mode: 'Markdown', ...getAboutKeyboard(chatId) });
  } 
  else if (data === "back_to_menu") {
    bot.editMessageText(t(chatId, 'mainMenuText'), { chat_id: chatId, message_id: messageId, parse_mode: 'Markdown', ...getMainMenuKeyboard(chatId) });
  }
  else if (data === "view_help") {
    bot.editMessageText(t(chatId, 'helpPortalText'), { chat_id: chatId, message_id: messageId, parse_mode: 'Markdown', ...getAboutKeyboard(chatId) });
  }
  else if (data === "trigger_register") {
    // Open the native Telegram Contact Request Keyboard
    bot.sendMessage(chatId, t(chatId, 'shareContactPrompt'), {
      reply_markup: {
        keyboard: [
          [{ text: t(chatId, 'shareContactBtn'), request_contact: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
  }
  else if (data === "trigger_language_select") {
    bot.editMessageText(t(chatId, 'chooseLang'), {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "🇪🇹 አማርኛ (Amharic)", callback_data: "assign_lang_am" }],
          [{ text: "🇬🇧 English", callback_data: "assign_lang_en" }],
          [{ text: t(chatId, 'backBtn'), callback_data: "back_to_menu" }]
        ]
      }
    });
  }
  else if (data === "assign_lang_am" || data === "assign_lang_en") {
    userLanguages[chatId] = data === "assign_lang_am" ? 'am' : 'en';
    bot.editMessageText(t(chatId, 'langUpdated'), { chat_id: chatId, message_id: messageId }).then(() => {
      setTimeout(() => {
        bot.sendMessage(chatId, t(chatId, 'mainMenuText'), { parse_mode: 'Markdown', ...getMainMenuKeyboard(chatId) });
      }, 1200);
    });
  }

  bot.answerCallbackQuery(query.id);
});

console.log("🚀 BlueCards Backend Gateway Listener Initialized Successfully.");