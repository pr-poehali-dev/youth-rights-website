import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "articles" | "documents" | "appeal" | "contacts" | "admin";

interface Article {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}

interface Document {
  id: number;
  title: string;
  category: string;
  description: string;
  filename: string;
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: "Права студентов при отчислении: что нужно знать",
    date: "15 мая 2025",
    category: "Образование",
    excerpt: "Разбираем процедуру отчисления из вуза, ваши права и способы защиты интересов в спорных ситуациях.",
    content: "Студент имеет право на получение полной информации об основаниях отчисления, на обжалование решения в установленные сроки, а также на академический отпуск по состоянию здоровья или иным уважительным причинам. Важно знать, что отчисление возможно только при наличии задолженностей по итогам сессии после исчерпания всех попыток пересдачи, предусмотренных регламентом учебного заведения.",
  },
  {
    id: 2,
    title: "Трудовые права молодёжи: испытательный срок и оформление",
    date: "2 апреля 2025",
    category: "Трудовое право",
    excerpt: "Испытательный срок, минимальная заработная плата, запрет на сверхурочную работу — разбираем ключевые нормы ТК РФ для молодых специалистов.",
    content: "По Трудовому кодексу РФ, для лиц моложе 18 лет испытательный срок не устанавливается. Для выпускников вузов, впервые поступающих на работу по специальности в течение года после окончания учёбы, испытательный срок также не предусмотрен. Работодатель обязан официально оформить сотрудника в течение трёх дней с момента фактического начала работы.",
  },
  {
    id: 3,
    title: "Молодёжное жильё: льготная ипотека и государственные программы",
    date: "18 марта 2025",
    category: "Жилищное право",
    excerpt: "Обзор федеральных и региональных программ поддержки молодых семей и специалистов в ЯНАО при получении жилья.",
    content: "На территории Ямало-Ненецкого автономного округа действует ряд программ поддержки молодых семей и специалистов в сфере жилья. Федеральная программа «Семейная ипотека» предоставляет льготную ставку до 6% для семей с детьми. Региональные субсидии позволяют компенсировать часть первоначального взноса молодым специалистам, работающим в приоритетных для округа отраслях.",
  },
];

const initialDocuments: Document[] = [
  {
    id: 1,
    title: "Жалоба в трудовую инспекцию",
    category: "Трудовые споры",
    description: "Типовая жалоба на незаконное увольнение или нарушение условий труда",
    filename: "zhaloba_trudovaya_inspekcia.docx",
  },
  {
    id: 2,
    title: "Заявление о предоставлении академического отпуска",
    category: "Образование",
    description: "Образец заявления в деканат на академический отпуск по медицинским или иным основаниям",
    filename: "akademicheskiy_otpusk.docx",
  },
  {
    id: 3,
    title: "Исковое заявление о защите прав потребителя",
    category: "Защита прав",
    description: "Типовой иск в суд общей юрисдикции по делам о нарушении прав потребителей",
    filename: "iskovoe_potrebitel.docx",
  },
  {
    id: 4,
    title: "Запрос в органы государственной власти",
    category: "Государственные обращения",
    description: "Форма официального запроса информации в государственные и муниципальные органы",
    filename: "zapros_gosporgany.docx",
  },
  {
    id: 5,
    title: "Претензия работодателю о невыплате заработной платы",
    category: "Трудовые споры",
    description: "Досудебная претензия при задержке или невыплате заработной платы",
    filename: "pretenziya_zarplata.docx",
  },
];

const categoryColors: Record<string, string> = {
  "Образование": "border-l-blue-500",
  "Трудовое право": "border-l-amber-500",
  "Жилищное право": "border-l-emerald-500",
  "Трудовые споры": "border-l-red-500",
  "Защита прав": "border-l-purple-500",
  "Государственные обращения": "border-l-sky-500",
};

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminTab, setAdminTab] = useState<"articles" | "documents">("articles");
  const [appealSent, setAppealSent] = useState(false);
  const [appealForm, setAppealForm] = useState({
    lastName: "", firstName: "", middleName: "",
    birthDate: "", phone: "", email: "", message: "", consent: false,
  });
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [newArticle, setNewArticle] = useState({ title: "", category: "", excerpt: "", content: "" });
  const [newDocument, setNewDocument] = useState({ title: "", category: "", description: "", filename: "" });
  const [showNewArticleForm, setShowNewArticleForm] = useState(false);
  const [showNewDocumentForm, setShowNewDocumentForm] = useState(false);

  const navItems: { key: Page; label: string }[] = [
    { key: "home", label: "Главная" },
    { key: "articles", label: "Статьи" },
    { key: "documents", label: "Документы" },
    { key: "appeal", label: "Обращение" },
    { key: "contacts", label: "Контакты" },
  ];

  const navigate = (p: Page) => {
    setPage(p);
    setMobileMenuOpen(false);
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("home")}
            className="font-display text-lg font-semibold text-gold tracking-wide hover:opacity-80 transition-opacity"
          >
            Гольцман Н.Р.
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`nav-link font-body text-sm tracking-wider uppercase ${
                  page === item.key ? "text-gold active" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => navigate("admin")}
              className="ml-2 p-2 text-muted-foreground hover:text-gold transition-colors"
              title="Панель администратора"
            >
              <Icon name="Settings" size={16} />
            </button>
          </nav>

          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background py-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`block w-full text-left px-6 py-3 font-body text-sm tracking-wider uppercase ${
                  page === item.key ? "text-gold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => navigate("admin")}
              className="block w-full text-left px-6 py-3 text-muted-foreground text-sm"
            >
              Панель администратора
            </button>
          </div>
        )}
      </header>

      <main className="pt-16">

        {/* ===== HOME ===== */}
        {page === "home" && (
          <div>
            <section className="relative min-h-[92vh] flex items-center hero-gradient overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-20 right-10 w-96 h-96 border border-gold rounded-full" />
                <div className="absolute top-32 right-24 w-64 h-64 border border-gold rounded-full" />
              </div>
              <div className="max-w-6xl mx-auto px-6 py-24 w-full">
                <div className="max-w-3xl">
                  <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-6 opacity-0 animate-fade-up delay-100">
                    Уполномоченный по правам молодёжи
                  </p>
                  <h1 className="font-display text-6xl md:text-8xl font-semibold leading-none mb-6 opacity-0 animate-fade-up delay-200">
                    Гольцман<br />
                    <span className="text-gold">Никита</span><br />
                    Романович
                  </h1>
                  <div className="divider-gold my-8 w-48 opacity-0 animate-fade-in delay-300" />
                  <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10 opacity-0 animate-fade-up delay-400">
                    Председатель Совета молодых юристов Ямало-Ненецкого автономного округа.
                    Юрист, помощник депутата. Занимаюсь правозащитной деятельностью в интересах молодёжи и студентов ЯНАО.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up delay-500">
                    <button
                      onClick={() => navigate("appeal")}
                      className="px-8 py-4 bg-gold text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
                    >
                      Подать обращение
                    </button>
                    <button
                      onClick={() => navigate("articles")}
                      className="px-8 py-4 border border-border text-foreground font-body text-sm tracking-widest uppercase hover:border-gold hover:text-gold transition-colors"
                    >
                      Читать статьи
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <Icon name="ChevronDown" size={20} className="text-muted-foreground" />
              </div>
            </section>

            <section className="py-24 border-t border-border">
              <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                  <div>
                    <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">О деятельности</p>
                    <h2 className="font-display text-5xl font-semibold leading-tight mb-6">
                      Защита прав —<br />моя работа
                    </h2>
                    <div className="divider-gold w-32 mb-8" />
                    <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Как Уполномоченный по правам молодёжи, я оказываю бесплатную юридическую помощь студентам
                      и молодым людям в возрасте до 35 лет по вопросам трудового, жилищного, образовательного права
                      и иным правовым вопросам.
                    </p>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      Деятельность охватывает весь Ямало-Ненецкий автономный округ. Помогаю разобраться в ситуации,
                      составить необходимые документы и защитить ваши интересы в государственных органах.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: "Scale", title: "Юридическая помощь", desc: "Консультации по трудовым, жилищным, образовательным вопросам" },
                      { icon: "FileText", title: "Составление документов", desc: "Жалобы, запросы, исковые заявления, претензии" },
                      { icon: "Shield", title: "Защита интересов", desc: "Представление интересов в государственных органах и судах" },
                      { icon: "Users", title: "Совет молодых юристов", desc: "Руководство профессиональным сообществом молодых юристов ЯНАО" },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex gap-4 p-5 border border-border bg-surface card-hover"
                      >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-gold/30">
                          <Icon name={item.icon} size={18} className="text-gold" />
                        </div>
                        <div>
                          <h3 className="font-body font-semibold text-sm mb-1">{item.title}</h3>
                          <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16 bg-surface border-t border-border">
              <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { value: "ЯНАО", label: "Регион деятельности" },
                    { value: "до 35", label: "Лет — целевая аудитория" },
                    { value: "0 ₽", label: "Стоимость консультации" },
                    { value: "24/7", label: "Приём обращений онлайн" },
                  ].map((stat) => (
                    <div key={stat.label} className="border-t border-gold/30 pt-6">
                      <div className="font-display text-4xl font-semibold text-gold mb-2">{stat.value}</div>
                      <div className="font-body text-xs text-muted-foreground tracking-wide">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-24 border-t border-border">
              <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="font-display text-5xl font-semibold mb-4">Нужна помощь?</h2>
                <p className="font-body text-muted-foreground mb-10 max-w-lg mx-auto">
                  Опишите вашу ситуацию — я изучу обращение и свяжусь с вами для консультации
                </p>
                <button
                  onClick={() => navigate("appeal")}
                  className="px-10 py-4 bg-gold text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
                >
                  Написать обращение
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ===== ARTICLES ===== */}
        {page === "articles" && !selectedArticle && (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="mb-12">
              <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-3">Публикации</p>
              <h1 className="font-display text-5xl font-semibold mb-4">Статьи и разъяснения</h1>
              <div className="divider-gold w-32" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className={`border border-border border-l-4 ${categoryColors[article.category] || "border-l-amber-400"} bg-surface p-6 card-hover cursor-pointer`}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-body text-xs text-gold tracking-wide">{article.category}</span>
                    <span className="font-body text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <h2 className="font-display text-xl font-semibold leading-snug mb-3">{article.title}</h2>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{article.excerpt}</p>
                  <div className="flex items-center gap-2 text-gold text-xs font-body">
                    <span>Читать далее</span>
                    <Icon name="ArrowRight" size={14} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {page === "articles" && selectedArticle && (
          <div className="max-w-3xl mx-auto px-6 py-16">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-body text-sm mb-10"
            >
              <Icon name="ArrowLeft" size={16} />
              Все статьи
            </button>
            <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-3">{selectedArticle.category}</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">{selectedArticle.title}</h1>
            <p className="font-body text-sm text-muted-foreground mb-8">{selectedArticle.date}</p>
            <div className="divider-gold w-32 mb-8" />
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-6">{selectedArticle.excerpt}</p>
            <p className="font-body text-base leading-relaxed">{selectedArticle.content}</p>
          </div>
        )}

        {/* ===== DOCUMENTS ===== */}
        {page === "documents" && (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="mb-12">
              <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-3">Правовая база</p>
              <h1 className="font-display text-5xl font-semibold mb-4">Типовые документы</h1>
              <div className="divider-gold w-32 mb-4" />
              <p className="font-body text-muted-foreground max-w-xl">
                Скачайте образцы документов, адаптируйте под свою ситуацию. При необходимости обратитесь за консультацией.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start gap-5 p-6 border border-border bg-surface card-hover"
                >
                  <div className="flex-shrink-0 w-12 h-12 border border-gold/30 flex items-center justify-center">
                    <Icon name="FileText" size={20} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-body text-xs text-gold tracking-wide mb-1 block">{doc.category}</span>
                    <h3 className="font-body font-semibold text-sm mb-2">{doc.title}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">{doc.description}</p>
                    <button className="flex items-center gap-2 font-body text-xs text-gold hover:opacity-70 transition-opacity">
                      <Icon name="Download" size={14} />
                      Скачать документ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== APPEAL ===== */}
        {page === "appeal" && (
          <div className="max-w-3xl mx-auto px-6 py-16">
            <div className="mb-12">
              <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-3">Обратная связь</p>
              <h1 className="font-display text-5xl font-semibold mb-4">Подать обращение</h1>
              <div className="divider-gold w-32 mb-4" />
              <p className="font-body text-muted-foreground">
                Заполните форму — я рассмотрю ваше обращение и свяжусь с вами в течение 3 рабочих дней.
              </p>
            </div>

            {appealSent ? (
              <div className="border border-gold/30 bg-surface p-10 text-center">
                <div className="w-16 h-16 border border-gold/40 flex items-center justify-center mx-auto mb-6">
                  <Icon name="CheckCircle" size={28} className="text-gold" />
                </div>
                <h2 className="font-display text-3xl font-semibold mb-3">Обращение отправлено</h2>
                <p className="font-body text-muted-foreground mb-6">
                  Благодарю за обращение. Я свяжусь с вами в течение 3 рабочих дней.
                </p>
                <button
                  onClick={() => {
                    setAppealSent(false);
                    setAppealForm({ lastName: "", firstName: "", middleName: "", birthDate: "", phone: "", email: "", message: "", consent: false });
                  }}
                  className="font-body text-sm text-gold hover:opacity-70 transition-opacity"
                >
                  Подать ещё одно обращение
                </button>
              </div>
            ) : (
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setAppealSent(true);
                }}
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-body text-xs text-muted-foreground tracking-wide uppercase block mb-2">Фамилия *</label>
                    <input
                      required
                      value={appealForm.lastName}
                      onChange={(e) => setAppealForm({ ...appealForm, lastName: e.target.value })}
                      className="w-full bg-surface border border-border px-4 py-3 font-body text-sm focus:border-gold outline-none transition-colors"
                      placeholder="Иванов"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground tracking-wide uppercase block mb-2">Имя *</label>
                    <input
                      required
                      value={appealForm.firstName}
                      onChange={(e) => setAppealForm({ ...appealForm, firstName: e.target.value })}
                      className="w-full bg-surface border border-border px-4 py-3 font-body text-sm focus:border-gold outline-none transition-colors"
                      placeholder="Иван"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground tracking-wide uppercase block mb-2">Отчество</label>
                    <input
                      value={appealForm.middleName}
                      onChange={(e) => setAppealForm({ ...appealForm, middleName: e.target.value })}
                      className="w-full bg-surface border border-border px-4 py-3 font-body text-sm focus:border-gold outline-none transition-colors"
                      placeholder="Иванович"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs text-muted-foreground tracking-wide uppercase block mb-2">Дата рождения *</label>
                  <input
                    required
                    type="date"
                    value={appealForm.birthDate}
                    onChange={(e) => setAppealForm({ ...appealForm, birthDate: e.target.value })}
                    className="w-full bg-surface border border-border px-4 py-3 font-body text-sm focus:border-gold outline-none transition-colors"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-muted-foreground tracking-wide uppercase block mb-2">Телефон *</label>
                    <input
                      required
                      type="tel"
                      value={appealForm.phone}
                      onChange={(e) => setAppealForm({ ...appealForm, phone: e.target.value })}
                      className="w-full bg-surface border border-border px-4 py-3 font-body text-sm focus:border-gold outline-none transition-colors"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground tracking-wide uppercase block mb-2">Электронная почта *</label>
                    <input
                      required
                      type="email"
                      value={appealForm.email}
                      onChange={(e) => setAppealForm({ ...appealForm, email: e.target.value })}
                      className="w-full bg-surface border border-border px-4 py-3 font-body text-sm focus:border-gold outline-none transition-colors"
                      placeholder="example@mail.ru"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs text-muted-foreground tracking-wide uppercase block mb-2">Суть обращения *</label>
                  <textarea
                    required
                    rows={6}
                    value={appealForm.message}
                    onChange={(e) => setAppealForm({ ...appealForm, message: e.target.value })}
                    className="w-full bg-surface border border-border px-4 py-3 font-body text-sm focus:border-gold outline-none transition-colors resize-none"
                    placeholder="Опишите вашу ситуацию подробно — это поможет быстрее разобраться в проблеме..."
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    className={`flex-shrink-0 w-5 h-5 border mt-0.5 flex items-center justify-center transition-colors cursor-pointer ${appealForm.consent ? "border-gold bg-gold/10" : "border-border group-hover:border-gold/50"}`}
                    onClick={() => setAppealForm({ ...appealForm, consent: !appealForm.consent })}
                  >
                    {appealForm.consent && <Icon name="Check" size={12} className="text-gold" />}
                  </div>
                  <span className="font-body text-xs text-muted-foreground leading-relaxed">
                    Я даю согласие на обработку моих персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных» в целях рассмотрения настоящего обращения. *
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!appealForm.consent}
                  className="w-full py-4 bg-gold text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Отправить обращение
                </button>
              </form>
            )}
          </div>
        )}

        {/* ===== CONTACTS ===== */}
        {page === "contacts" && (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="mb-12">
              <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-3">Связаться</p>
              <h1 className="font-display text-5xl font-semibold mb-4">Контакты</h1>
              <div className="divider-gold w-32" />
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">Гольцман Никита Романович</h2>
                <p className="font-body text-muted-foreground mb-8 leading-relaxed">
                  Уполномоченный по правам молодёжи.<br />
                  Председатель Совета молодых юристов ЯНАО.<br />
                  Юрист, помощник депутата.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: "MapPin", label: "Регион", value: "Ямало-Ненецкий автономный округ" },
                    { icon: "Mail", label: "Электронная почта", value: "golcman@молодыеюристыянао.рф" },
                    { icon: "Clock", label: "Приём обращений", value: "Пн–Пт, 9:00–18:00 (МСК+2)" },
                  ].map((contact) => (
                    <div key={contact.label} className="flex gap-4 p-4 border border-border bg-surface">
                      <div className="flex-shrink-0 w-9 h-9 border border-gold/30 flex items-center justify-center">
                        <Icon name={contact.icon} size={16} className="text-gold" />
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground mb-0.5">{contact.label}</p>
                        <p className="font-body text-sm">{contact.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-border bg-surface p-8">
                <h3 className="font-display text-2xl font-semibold mb-4">Написать обращение</h3>
                <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
                  Для получения юридической помощи заполните форму обращения. Все обращения рассматриваются конфиденциально.
                </p>
                <button
                  onClick={() => navigate("appeal")}
                  className="w-full py-4 bg-gold text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
                >
                  Подать обращение
                </button>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="font-body text-xs text-muted-foreground text-center">
                    Бесплатная юридическая помощь для молодёжи ЯНАО до 35 лет
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ADMIN ===== */}
        {page === "admin" && (
          <div className="max-w-5xl mx-auto px-6 py-16">
            {!adminAuthenticated ? (
              <div className="max-w-sm mx-auto">
                <div className="mb-10 text-center">
                  <div className="w-14 h-14 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Lock" size={22} className="text-gold" />
                  </div>
                  <h1 className="font-display text-3xl font-semibold mb-2">Панель управления</h1>
                  <p className="font-body text-sm text-muted-foreground">Введите пароль администратора</p>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (adminPassword === "admin123") setAdminAuthenticated(true);
                  else alert("Неверный пароль");
                }}>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Пароль"
                    className="w-full bg-surface border border-border px-4 py-3 font-body text-sm focus:border-gold outline-none transition-colors mb-4"
                  />
                  <button type="submit" className="w-full py-3 bg-gold text-primary-foreground font-body text-sm tracking-widest uppercase hover:opacity-90 transition-opacity">
                    Войти
                  </button>
                </form>
                <p className="font-body text-xs text-muted-foreground text-center mt-4">Пароль по умолчанию: admin123</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-2">Администрирование</p>
                    <h1 className="font-display text-4xl font-semibold">Панель управления</h1>
                  </div>
                  <button
                    onClick={() => { setAdminAuthenticated(false); setAdminPassword(""); navigate("home"); }}
                    className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="LogOut" size={16} />
                    Выйти
                  </button>
                </div>

                <div className="flex border-b border-border mb-8">
                  <button
                    onClick={() => setAdminTab("articles")}
                    className={`px-6 py-3 font-body text-sm tracking-wide ${adminTab === "articles" ? "text-gold border-b-2 border-gold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Статьи ({articles.length})
                  </button>
                  <button
                    onClick={() => setAdminTab("documents")}
                    className={`px-6 py-3 font-body text-sm tracking-wide ${adminTab === "documents" ? "text-gold border-b-2 border-gold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Документы ({documents.length})
                  </button>
                </div>

                {adminTab === "articles" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-display text-2xl font-semibold">Управление статьями</h2>
                      <button
                        onClick={() => setShowNewArticleForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gold text-primary-foreground font-body text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
                      >
                        <Icon name="Plus" size={14} />
                        Новая статья
                      </button>
                    </div>

                    {showNewArticleForm && (
                      <div className="border border-gold/30 bg-surface p-6 mb-6">
                        <h3 className="font-body font-semibold mb-4">Новая статья</h3>
                        <div className="space-y-3">
                          <input
                            placeholder="Заголовок"
                            value={newArticle.title}
                            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none"
                          />
                          <input
                            placeholder="Категория"
                            value={newArticle.category}
                            onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none"
                          />
                          <textarea
                            placeholder="Краткое описание"
                            rows={2}
                            value={newArticle.excerpt}
                            onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none resize-none"
                          />
                          <textarea
                            placeholder="Полный текст статьи"
                            rows={4}
                            value={newArticle.content}
                            onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none resize-none"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                if (newArticle.title) {
                                  const today = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
                                  setArticles([{ id: Date.now(), ...newArticle, date: today }, ...articles]);
                                  setNewArticle({ title: "", category: "", excerpt: "", content: "" });
                                  setShowNewArticleForm(false);
                                }
                              }}
                              className="px-5 py-2 bg-gold text-primary-foreground font-body text-xs uppercase tracking-wide hover:opacity-90 transition-opacity"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={() => setShowNewArticleForm(false)}
                              className="px-5 py-2 border border-border font-body text-xs uppercase tracking-wide hover:border-muted-foreground transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {articles.map((article) => (
                        <div key={article.id} className="border border-border bg-surface">
                          {editingArticle?.id === article.id ? (
                            <div className="p-5 space-y-3">
                              <input
                                value={editingArticle.title}
                                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                                className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none"
                              />
                              <input
                                value={editingArticle.category}
                                onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                                className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none"
                              />
                              <textarea
                                rows={2}
                                value={editingArticle.excerpt}
                                onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                                className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none resize-none"
                              />
                              <textarea
                                rows={4}
                                value={editingArticle.content}
                                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                                className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none resize-none"
                              />
                              <div className="flex gap-3">
                                <button
                                  onClick={() => {
                                    setArticles(articles.map((a) => a.id === editingArticle.id ? editingArticle : a));
                                    setEditingArticle(null);
                                  }}
                                  className="px-5 py-2 bg-gold text-primary-foreground font-body text-xs uppercase tracking-wide hover:opacity-90"
                                >
                                  Сохранить
                                </button>
                                <button
                                  onClick={() => setEditingArticle(null)}
                                  className="px-5 py-2 border border-border font-body text-xs uppercase tracking-wide"
                                >
                                  Отмена
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 p-4">
                              <div className="flex-1 min-w-0">
                                <span className="font-body text-xs text-gold mr-3">{article.category}</span>
                                <span className="font-body text-xs text-muted-foreground">{article.date}</span>
                                <h3 className="font-body font-semibold text-sm mt-1 truncate">{article.title}</h3>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => setEditingArticle(article)}
                                  className="p-2 text-muted-foreground hover:text-gold transition-colors"
                                >
                                  <Icon name="Pencil" size={14} />
                                </button>
                                <button
                                  onClick={() => setArticles(articles.filter((a) => a.id !== article.id))}
                                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  <Icon name="Trash2" size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTab === "documents" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-display text-2xl font-semibold">Управление документами</h2>
                      <button
                        onClick={() => setShowNewDocumentForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gold text-primary-foreground font-body text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
                      >
                        <Icon name="Plus" size={14} />
                        Новый документ
                      </button>
                    </div>

                    {showNewDocumentForm && (
                      <div className="border border-gold/30 bg-surface p-6 mb-6">
                        <h3 className="font-body font-semibold mb-4">Новый документ</h3>
                        <div className="space-y-3">
                          <input
                            placeholder="Название документа"
                            value={newDocument.title}
                            onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none"
                          />
                          <input
                            placeholder="Категория"
                            value={newDocument.category}
                            onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none"
                          />
                          <textarea
                            placeholder="Описание"
                            rows={2}
                            value={newDocument.description}
                            onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none resize-none"
                          />
                          <input
                            placeholder="Имя файла (например: document.docx)"
                            value={newDocument.filename}
                            onChange={(e) => setNewDocument({ ...newDocument, filename: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                if (newDocument.title) {
                                  setDocuments([{ id: Date.now(), ...newDocument }, ...documents]);
                                  setNewDocument({ title: "", category: "", description: "", filename: "" });
                                  setShowNewDocumentForm(false);
                                }
                              }}
                              className="px-5 py-2 bg-gold text-primary-foreground font-body text-xs uppercase tracking-wide hover:opacity-90"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={() => setShowNewDocumentForm(false)}
                              className="px-5 py-2 border border-border font-body text-xs uppercase tracking-wide"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="border border-border bg-surface">
                          {editingDocument?.id === doc.id ? (
                            <div className="p-5 space-y-3">
                              <input
                                value={editingDocument.title}
                                onChange={(e) => setEditingDocument({ ...editingDocument, title: e.target.value })}
                                className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none"
                              />
                              <input
                                value={editingDocument.category}
                                onChange={(e) => setEditingDocument({ ...editingDocument, category: e.target.value })}
                                className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none"
                              />
                              <textarea
                                rows={2}
                                value={editingDocument.description}
                                onChange={(e) => setEditingDocument({ ...editingDocument, description: e.target.value })}
                                className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-gold outline-none resize-none"
                              />
                              <div className="flex gap-3">
                                <button
                                  onClick={() => {
                                    setDocuments(documents.map((d) => d.id === editingDocument.id ? editingDocument : d));
                                    setEditingDocument(null);
                                  }}
                                  className="px-5 py-2 bg-gold text-primary-foreground font-body text-xs uppercase tracking-wide hover:opacity-90"
                                >
                                  Сохранить
                                </button>
                                <button
                                  onClick={() => setEditingDocument(null)}
                                  className="px-5 py-2 border border-border font-body text-xs uppercase tracking-wide"
                                >
                                  Отмена
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 p-4">
                              <div className="flex-1 min-w-0">
                                <span className="font-body text-xs text-gold">{doc.category}</span>
                                <h3 className="font-body font-semibold text-sm mt-1 truncate">{doc.title}</h3>
                                <p className="font-body text-xs text-muted-foreground mt-0.5 truncate">{doc.description}</p>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => setEditingDocument(doc)}
                                  className="p-2 text-muted-foreground hover:text-gold transition-colors"
                                >
                                  <Icon name="Pencil" size={14} />
                                </button>
                                <button
                                  onClick={() => setDocuments(documents.filter((d) => d.id !== doc.id))}
                                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  <Icon name="Trash2" size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display text-lg font-semibold text-gold">Гольцман Никита Романович</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Уполномоченный по правам молодёжи · ЯНАО</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className="font-body text-xs text-muted-foreground hover:text-gold transition-colors tracking-wide"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="divider-gold mt-8 mb-6" />
          <p className="font-body text-xs text-muted-foreground text-center">
            © 2025 Гольцман Н.Р. Бесплатная юридическая помощь молодёжи ЯНАО
          </p>
        </div>
      </footer>
    </div>
  );
}
