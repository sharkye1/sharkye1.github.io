// GitHub API работа (только чтение)
class GitHubAPI {
    constructor(owner, repo) {
        this.owner = owner;
        this.repo = repo;
        this.cache = new Map();
        this.cacheTime = 5 * 60 * 1000; // 5 минут
    }

    /**
     * Получить вопросы по предмету и лабе
     */
    async getQuestions(subject, lab) {
        const cacheKey = `${subject}-${lab}`;
        
        // Проверяем кэш
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.time < this.cacheTime) {
                return cached.data;
            }
        }

        try {
            // Формируем labels с корректными кавычками для двоеточий
            const labels = [
                `${CONFIG.LABELS.SUBJECT_PREFIX}${subject}`,
                `${CONFIG.LABELS.LAB_PREFIX}${lab}`,
                CONFIG.LABELS.STATUS_APPROVED
            ];

            // Каждый label оборачиваем в label:"..." для корректной обработки двоеточий
            const labelQuery = labels
                .map(l => `label:"${l}"`)
                .join(' ');

            // Формируем полный query
            const query = `repo:${this.owner}/${this.repo} ${labelQuery} is:open`;

            // Полный URL для дебага
            const url = `${CONFIG.API_BASE}/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=100`;
            
            console.log('GitHub Search Query:', query);
            console.log('Full URL:', url);

            // GitHub API v3 Search API endpoint
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                console.error('GitHub API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: url
                });
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const questions = data.items.map(issue => this.parseIssue(issue));

            // Сохраняем в кэш
            this.cache.set(cacheKey, {
                data: questions,
                time: Date.now()
            });

            return questions;
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }
    }

    /**
     * Парсить Issue в структуру вопроса
     */
    parseIssue(issue) {
        const body = issue.body || '';
        
        // Парсим markdown body
        const question = this.extractField(body, 'Вопрос:|Question:');
        const askedTo = this.extractField(body, 'Кому задавался:|Asked to:');
        const date = this.extractField(body, 'Дата:|Date:') || this.extractDate(issue.created_at);
        const answer = this.extractField(body, 'Ответ студента:|Student answer:');
        const gradeText = this.extractField(body, 'Оценка ответа:|Answer grade:');

        let grade = null;
        if (gradeText) {
            const gradeKey = Object.keys(CONFIG.GRADES).find(key => 
                gradeText.toLowerCase().includes(key)
            );
            grade = gradeKey || null;
        }

        return {
            id: issue.number,
            title: issue.title,
            question: question || issue.title,
            askedTo: askedTo || 'Unknown',
            date: date,
            answer: answer,
            grade: grade,
            url: issue.html_url,
            labels: issue.labels.map(l => l.name)
        };
    }

    /**
     * Извлечь поле из markdown
     */
    extractField(body, fieldPattern) {
        const regex = new RegExp(`(?:${fieldPattern})\\s*[:\\-]*\\s*(.+?)(?=\\n(?:Вопрос|Question|Кому|Asked|Дата|Date|Ответ|Student|Оценка|Grade|$))`, 'is');
        const match = body.match(regex);
        return match ? match[1].trim() : null;
    }

    /**
     * Извлечь дату из ISO формата
     */
    extractDate(isoString) {
        return isoString ? isoString.split('T')[0] : new Date().toISOString().split('T')[0];
    }

    /**
     * Генерировать URL для создания нового Issue на GitHub
     * GitHub автоматически обработает labels переданные через параметр labels=
     * Формат labels: label1,label2,label3 (без пробелов, разделены запятой)
     */
    generateIssueURL(subject, lab, subjectLabel) {
        const title = `${subjectLabel} — Лаба ${lab} — `;
        
        const bodyTemplate = `Вопрос: 

Кому задавался: 

Дата: ${new Date().toISOString().split('T')[0]}

Ответ студента: 

Оценка ответа: `;

        // Используем правильные label names из CONFIG
        // Статус по умолчанию - pending (для модерации)
        // После одобрения модератор смените на status:approved
        const labels = [
            `${CONFIG.LABELS.SUBJECT_PREFIX}${subject}`,
            `${CONFIG.LABELS.LAB_PREFIX}${lab}`,
            CONFIG.LABELS.STATUS_PENDING
        ];

        const params = new URLSearchParams({
            title: title,
            labels: labels.join(','),
            body: bodyTemplate
        });

        return `https://github.com/${this.owner}/${this.repo}/issues/new?${params}`;
    }
}

// Глобальный экземпляр API
const api = new GitHubAPI(CONFIG.REPO_OWNER, CONFIG.REPO_NAME);
