function checkAuth() {
    const user = localStorage.getItem('centz_user');
    if (user) { currentUser = JSON.parse(user); showApp(); }
    else showAuth();
}

let currentAccountType = 'personal';

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const registerFields = ['account-type-field', 'name-field', 'document-field'];
    registerFields.forEach(id => document.getElementById(id).classList.toggle('hidden', isLoginMode));
    document.getElementById('auth-btn-text').textContent    = isLoginMode ? 'Entrar'              : 'Criar Conta';
    document.getElementById('auth-toggle-text').textContent = isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?';
    if (!isLoginMode) setAccountType('personal');
}

function setAccountType(type) {
    currentAccountType = type;
    const activeCls   = 'flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md bg-white dark:bg-brand-darkCard text-gray-900 dark:text-white shadow-sm transition-all';
    const inactiveCls = 'flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 transition-all';

    document.getElementById('btn-type-personal').className = type === 'personal' ? activeCls : inactiveCls;
    document.getElementById('btn-type-business').className = type === 'business'  ? activeCls : inactiveCls;

    const isBusiness = type === 'business';
    document.getElementById('name-label').textContent     = isBusiness ? 'Razão Social'  : 'Nome Completo';
    document.getElementById('document-label').textContent = isBusiness ? 'CNPJ'          : 'CPF';
    const docInput = document.getElementById('auth-document');
    docInput.placeholder  = isBusiness ? '00.000.000/0000-00' : '000.000.000-00';
    docInput.maxLength    = isBusiness ? 18 : 14;
    docInput.value        = '';
}

function showAuth() {
    document.getElementById('app-view').classList.add('hidden');
    document.getElementById('auth-view').classList.remove('hidden');
}

function showApp() {
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('app-view').classList.remove('hidden');
    document.getElementById('user-name-display').textContent = currentUser.name;
    document.getElementById('user-avatar').textContent       = currentUser.name.charAt(0).toUpperCase();
    loadData();
}

function logout() {
    localStorage.removeItem('centz_user');
    currentUser = null;
    showAuth();
}

function loadDemoData() {
    const email = 'demo@centz.app';
    const now   = new Date();
    const y     = now.getFullYear();
    const mo    = now.getMonth();
    const d     = (day, offset = 0) => {
        const total = mo + offset;
        const m     = ((total % 12) + 12) % 12;
        const yr    = y + Math.floor(total / 12);
        return `${yr}-${String(m + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    };

    const tx = [
        { id:1,  type:'income',  value:5500,   desc:'Salário',              category:'Receita',     date:d(5),    recurring:true  },
        { id:2,  type:'income',  value:900,     desc:'Freelance Design',     category:'Receita',     date:d(18),   recurring:false },
        { id:3,  type:'expense', value:1400,    desc:'Aluguel',              category:'Moradia',     date:d(1),    recurring:true  },
        { id:4,  type:'expense', value:180,     desc:'Condomínio + IPTU',    category:'Moradia',     date:d(2),    recurring:true  },
        { id:5,  type:'expense', value:680,     desc:'Supermercado',         category:'Alimentação', date:d(8),    recurring:false },
        { id:6,  type:'expense', value:135,     desc:'iFood',                category:'Alimentação', date:d(13),   recurring:false },
        { id:7,  type:'expense', value:260,     desc:'Combustível',          category:'Transporte',  date:d(6),    recurring:false },
        { id:8,  type:'expense', value:54.90,   desc:'Uber',                 category:'Transporte',  date:d(17),   recurring:false },
        { id:9,  type:'expense', value:200,     desc:'Academia',             category:'Saúde',       date:d(3),    recurring:true  },
        { id:10, type:'expense', value:78,      desc:'Farmácia',             category:'Saúde',       date:d(22),   recurring:false },
        { id:11, type:'expense', value:160,     desc:'Cinema + Jantar',      category:'Lazer',       date:d(20),   recurring:false },
        { id:12, type:'expense', value:89.90,   desc:'Netflix + Spotify',    category:'Lazer',       date:d(5),    recurring:true  },
        { id:13, type:'income',  value:5500,    desc:'Salário',              category:'Receita',     date:d(5,-1), recurring:true  },
        { id:14, type:'expense', value:1400,    desc:'Aluguel',              category:'Moradia',     date:d(1,-1), recurring:true  },
        { id:15, type:'expense', value:720,     desc:'Supermercado',         category:'Alimentação', date:d(10,-1),recurring:false },
        { id:16, type:'expense', value:310,     desc:'Combustível',          category:'Transporte',  date:d(7,-1), recurring:false },
        { id:17, type:'expense', value:200,     desc:'Academia',             category:'Saúde',       date:d(3,-1), recurring:true  },
        { id:18, type:'expense', value:290,     desc:'Viagem fim de semana', category:'Lazer',       date:d(14,-1),recurring:false },
        { id:19, type:'income',  value:5500,    desc:'Salário',              category:'Receita',     date:d(5,-2), recurring:true  },
        { id:20, type:'income',  value:500,     desc:'Venda itens usados',   category:'Receita',     date:d(20,-2),recurring:false },
        { id:21, type:'expense', value:1400,    desc:'Aluguel',              category:'Moradia',     date:d(1,-2), recurring:true  },
        { id:22, type:'expense', value:590,     desc:'Supermercado',         category:'Alimentação', date:d(9,-2), recurring:false },
        { id:23, type:'expense', value:180,     desc:'Combustível',          category:'Transporte',  date:d(5,-2), recurring:false },
        { id:24, type:'expense', value:200,     desc:'Academia',             category:'Saúde',       date:d(3,-2), recurring:true  },
        { id:25, type:'income',  value:5500,    desc:'Salário',              category:'Receita',     date:d(5,-3), recurring:true  },
        { id:26, type:'expense', value:1400,    desc:'Aluguel',              category:'Moradia',     date:d(1,-3), recurring:true  },
        { id:27, type:'expense', value:650,     desc:'Supermercado',         category:'Alimentação', date:d(11,-3),recurring:false },
        { id:28, type:'expense', value:200,     desc:'Academia',             category:'Saúde',       date:d(3,-3), recurring:true  },
        { id:29, type:'income',  value:5500,    desc:'Salário',              category:'Receita',     date:d(5,-4), recurring:true  },
        { id:30, type:'expense', value:1400,    desc:'Aluguel',              category:'Moradia',     date:d(1,-4), recurring:true  },
        { id:31, type:'expense', value:700,     desc:'Supermercado',         category:'Alimentação', date:d(8,-4), recurring:false },
        { id:32, type:'expense', value:200,     desc:'Academia',             category:'Saúde',       date:d(3,-4), recurring:true  },
        { id:33, type:'income',  value:5500,    desc:'Salário',              category:'Receita',     date:d(5,-5), recurring:true  },
        { id:34, type:'income',  value:1200,    desc:'13º Salário (parcial)',category:'Receita',     date:d(15,-5),recurring:false },
        { id:35, type:'expense', value:1400,    desc:'Aluguel',              category:'Moradia',     date:d(1,-5), recurring:true  },
        { id:36, type:'expense', value:800,     desc:'Supermercado',         category:'Alimentação', date:d(7,-5), recurring:false },
        { id:37, type:'expense', value:200,     desc:'Academia',             category:'Saúde',       date:d(3,-5), recurring:true  },
    ];

    const goals = [
        { id:1, name:'Viagem para Europa', target:15000, current:4500, color:'#3b82f6' },
        { id:2, name:'Fundo de Emergência', target:10000, current:6800, color:'#059669' },
        { id:3, name:'Notebook Gamer',      target:4500,  current:1200, color:'#8b5cf6' },
    ];

    localStorage.setItem('centz_user',          JSON.stringify({ name:'Ana Silva', email }));
    localStorage.setItem(`centz_tx_${email}`,   JSON.stringify(tx));
    localStorage.setItem(`centz_bdg_${email}`,  JSON.stringify({ Moradia:1500, Alimentação:800, Transporte:400, Lazer:300, Saúde:350 }));
    localStorage.setItem(`centz_goals_${email}`,JSON.stringify(goals));

    currentUser = { name:'Ana Silva', email };
    showApp();
    showToast('Dados de demonstração carregados!');
}

document.getElementById('auth-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    if (!isLoginMode) {
        const name       = document.getElementById('auth-name').value || 'Usuário';
        const docNumber  = document.getElementById('auth-document').value;
        currentUser = { name, email, docNumber, accountType: currentAccountType };
        localStorage.setItem('centz_user',          JSON.stringify(currentUser));
        localStorage.setItem(`centz_tx_${email}`,   JSON.stringify([]));
        localStorage.setItem(`centz_bdg_${email}`,  JSON.stringify({}));
        localStorage.setItem(`centz_goals_${email}`,JSON.stringify([]));
        showToast('Conta criada com sucesso!');
    } else {
        const saved = JSON.parse(localStorage.getItem('centz_user') || '{}');
        currentUser = { name: saved.name || email.split('@')[0], email };
        localStorage.setItem('centz_user', JSON.stringify(currentUser));
        showToast('Login realizado!');
    }
    showApp();
});
