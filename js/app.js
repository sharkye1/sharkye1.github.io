// Главное приложение
class App {
    constructor() {
        this.currentSubject = null;
        this.currentLab = null;
        this.currentSubjectLabel = null;
        this.init();
    }

    init() {
        // Загружаем язык (без вызова updateUI здесь - app еще не готова)
        this.loadLanguage();
        
        // Показываем начальный экран ПЕРЕД updateUI
        // UI must be initialized before any rendering calls
        this.showWelcomeScreen();
        
        // Навешиваем обработчики событий
        this.setupEventListeners();
        
        // updateUI() вызывается в конце, когда приложение полностью инициализировано
        // К этому моменту:
        // - DOM элементы уже созданы (showWelcomeScreen)
        // - Обработчики навешаны (setupEventListeners)
        // - Глобальная переменная 'app' уже определена
        updateUI();
    }

    loadLanguage() {
        const lang = getLang();
        document.documentElement.lang = lang;
        // Не вызываем updateUI() здесь - app еще не инициализирована
        // updateUI() будет вызвана в конце init()
    }

    setupEventListeners() {
        // Language toggle
        document.getElementById('langToggle').addEventListener('click', () => {
            const newLang = getLang() === 'ru' ? 'en' : 'ru';
            setLang(newLang);
            document.getElementById('langToggle').textContent = newLang === 'ru' ? 'EN' : 'РУ';
        });

        // Back buttons
        document.getElementById('backFromLabs').addEventListener('click', () => {
            this.showWelcomeScreen();
        });

        document.getElementById('backFromQuestions').addEventListener('click', () => {
            this.showLabScreen();
        });

        // Add question button
        document.getElementById('addQuestionBtn').addEventListener('click', () => {
            this.openAddQuestion();
        });
    }

    showWelcomeScreen() {
        this.switchScreen('welcomeScreen');
        this.renderSubjectGrid();
    }

    renderSubjectGrid() {
        const grid = document.getElementById('subjectGrid');
        grid.innerHTML = '';

        Object.entries(CONFIG.SUBJECTS).forEach(([key, subject]) => {
            const btn = document.createElement('button');
            btn.className = 'btn-subject';
            btn.textContent = subject[getLang()] || subject.ru;
            btn.addEventListener('click', () => {
                this.selectSubject(key, subject[getLang()] || subject.ru);
            });
            grid.appendChild(btn);
        });
    }

    selectSubject(subjectKey, subjectLabel) {
        this.currentSubject = subjectKey;
        this.currentSubjectLabel = subjectLabel;
        this.showLabScreen();
    }

    showLabScreen() {
        this.switchScreen('labScreen');
        document.getElementById('labTitle').textContent = this.currentSubjectLabel;
        this.renderLabGrid();
    }

    renderLabGrid() {
        const grid = document.getElementById('labGrid');
        grid.innerHTML = '';

        const labs = CONFIG.SUBJECTS[this.currentSubject].labs;
        labs.forEach(lab => {
            const btn = document.createElement('button');
            btn.className = 'btn-lab';
            btn.textContent = `Лаба ${lab}`;
            btn.addEventListener('click', () => {
                this.selectLab(lab);
            });
            grid.appendChild(btn);
        });
    }

    selectLab(lab) {
        this.currentLab = lab;
        this.showQuestionsScreen();
    }

    showQuestionsScreen() {
        this.switchScreen('questionsScreen');
        document.getElementById('questionsTitle').textContent = 
            `${this.currentSubjectLabel} — Лаба ${this.currentLab}`;
        
        this.loadQuestions();
    }

    async loadQuestions() {
        const spinner = document.getElementById('loadingSpinner');
        const list = document.getElementById('questionsList');
        const error = document.getElementById('errorMessage');

        spinner.style.display = 'flex';
        list.innerHTML = '';
        error.style.display = 'none';

        try {
            const questions = await api.getQuestions(this.currentSubject, this.currentLab);
            spinner.style.display = 'none';

            if (questions.length === 0) {
                list.innerHTML = `<p class="no-questions">${t('noQuestions')}</p>`;
                return;
            }

            questions.forEach(question => {
                const card = this.createQuestionCard(question);
                list.appendChild(card);
            });
        } catch (err) {
            spinner.style.display = 'none';
            error.textContent = t('error');
            error.style.display = 'block';
            console.error(err);
        }
    }

    createQuestionCard(question) {
        const details = document.createElement('details');
        details.className = 'question-item';

        // Summary с текстом вопроса
        const summary = document.createElement('summary');
        summary.className = 'question-text';
        summary.textContent = this.escapeHtml(question.question);
        details.appendChild(summary);

        // Контент деталей
        const content = document.createElement('div');
        content.className = 'question-details';

        // Мета-информация
        let contentHTML = `
            <div class="question-meta">
                <p><strong>${t('askedTo')}</strong> ${this.escapeHtml(question.askedTo)}</p>
                <p><strong>${t('date')}:</strong> <time>${question.date}</time></p>
            </div>
        `;

        // Ответ студента
        if (question.answer) {
            contentHTML += `
                <div class="question-answer">
                    <strong>${t('answer')}</strong>
                    <p>${this.escapeHtml(question.answer)}</p>
                </div>
            `;
        }

        // Оценка
        if (question.grade) {
            const gradeLabel = CONFIG.GRADES[question.grade][getLang()] || CONFIG.GRADES[question.grade].ru;
            contentHTML += `
                <div class="question-grade ${question.grade}">
                    ${gradeLabel}
                </div>
            `;
        }

        // Ссылка на GitHub
        contentHTML += `
            <a href="${question.url}" target="_blank" class="question-link">
                ${t('viewOnGithub')}
            </a>
        `;

        content.innerHTML = contentHTML;
        details.appendChild(content);
        return details;
    }

    openAddQuestion() {
        const url = api.generateIssueURL(
            this.currentSubject,
            this.currentLab,
            this.currentSubjectLabel
        );
        window.open(url, '_blank');
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Обновить UI при смене языка
function updateUI() {
    document.getElementById('welcomeTitle').textContent = t('welcomeTitle');
    document.getElementById('welcomeDesc').textContent = t('welcomeDesc');
    document.getElementById('backText').textContent = t('back');
    document.getElementById('backText2').textContent = t('back');
    document.getElementById('addButtonText').textContent = t('addButton');
    document.getElementById('googleFormText').textContent = t('googleForm');
    document.getElementById('loadingText').textContent = t('loading');
    document.getElementById('footerText').textContent = t('footer');
    
    // Пересчитываем гриды если они видимы
    if (document.getElementById('welcomeScreen').classList.contains('active')) {
        app.renderSubjectGrid();
    }
    if (document.getElementById('labScreen').classList.contains('active')) {
        app.renderLabGrid();
    }
}

// Запуск приложения
let app;
document.addEventListener('DOMContentLoaded', () => {
    // ВАЖНО: app инициализируется здесь, поэтому первый вызов updateUI()
    // должен быть в конце init(), когда глобальная переменная уже готова.
    // Это предотвращает "Cannot read properties of undefined" ошибку.
    app = new App();
});
