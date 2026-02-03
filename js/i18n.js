// i18n (интернационализация)
const i18n = {
    ru: {
        // Общие
        back: 'Назад',
        loading: 'Загрузка...',
        error: 'Ошибка загрузки. Попробуй позже.',
        noQuestions: 'Вопросов пока нет',
        
        // Главная
        welcomeTitle: '📚 База вопросов',
        welcomeDesc: 'Вопросы, которые задают преподаватели на практиках при сдаче лабораторных',
        selectSubject: 'Выбери предмет',
        
        // Выбор лабы
        selectLab: 'Выбери лабу',
        
        // Список вопросов
        questionsTitle: 'Вопросы',
        addButton: 'Добавить вопрос',
        googleForm: 'Google Form',
        
        // Карточка вопроса
        askedTo: 'Кому задавался:',
        date: 'Дата',
        answer: 'Ответ студента:',
        grade: 'Оценка:',
        viewOnGithub: 'Увидеть на GitHub →',
        
        // Footer
        footer: '© 2026 Question Bank.'
    },
    
    en: {
        // General
        back: 'Back',
        loading: 'Loading...',
        error: 'Loading error. Try again later.',
        noQuestions: 'No questions yet',
        
        // Home
        welcomeTitle: '📚 Question Bank',
        welcomeDesc: 'Questions asked by professors on lab exams',
        selectSubject: 'Select subject',
        
        // Lab selection
        selectLab: 'Select lab',
        
        // Questions list
        questionsTitle: 'Questions',
        addButton: 'Add question',
        googleForm: 'Google Form',
        
        // Question card
        askedTo: 'Asked to:',
        date: 'Date',
        answer: 'Student answer:',
        grade: 'Grade:',
        viewOnGithub: 'View on GitHub →',
        
        // Footer
        footer: '© 2026 Question Bank. GitHub API only. No servers.'
    }
};

// Функции для работы с i18n
let currentLang = localStorage.getItem('lang') || 'ru';

function t(key) {
    return i18n[currentLang][key] || i18n['ru'][key] || key;
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateUI();
}

function getLang() {
    return currentLang;
}
