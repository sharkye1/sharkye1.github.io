// Конфигурация приложения
const CONFIG = {
    // GitHub репозиторий (замени на свой)
    REPO_OWNER: 'sharkye1',
    REPO_NAME: 'sharkye1.github.io',
    
    // GitHub API
    API_BASE: 'https://api.github.com',
    ISSUES_ENDPOINT: '/repos/{owner}/{repo}/issues',
    
    // Предметы и лабы
    SUBJECTS: {
        db: {
            ru: 'Базы данных',
            en: 'Databases',
            labs: [1, 2, 3, 4]
        },
        prog: {
            ru: 'Программирование',
            en: 'Programming',
            labs: [5, 6, 7, 8]
        },
        opd: {
            ru: 'ОПД (БЭВМ)',
            en: 'Professional Basics',
            labs: [3, 4, 5, 6, 7]
        }
    },
    
    // Labels для GitHub Issues
    LABELS: {
        STATUS_APPROVED: 'status:approved',
        STATUS_PENDING: 'status:pending',
        SUBJECT_PREFIX: 'subject:',
        LAB_PREFIX: 'lab:'
    },
    
    // Оценки ответов
    GRADES: {
        high: {
            ru: '🟢 Высоко',
            en: '🟢 Excellent'
        },
        medium: {
            ru: '🟡 Средне',
            en: '🟡 Good'
        },
        no: {
            ru: '🔴 Точно нет',
            en: '🔴 Wrong'
        }
    }
};
