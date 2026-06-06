import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const UPLOAD_URL = "https://functions.poehali.dev/cd73b9f3-1057-4815-a788-0cc0a063ad28";
const APPEAL_URL = "https://functions.poehali.dev/c81bd481-7577-47c7-afe5-55165e991fd6";

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
  url?: string;
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
    excerpt: "Обзор федеральных и региональных программ поддержки молодых семей и специалистов при получении жилья.",
    content: "На территории Ямало-Ненецкого автономного округа действует ряд программ поддержки молодых семей и специалистов в сфере жилья. Федеральная программа «Семейная ипотека» предоставляет льготную ставку до 6% для семей с детьми. Региональные субсидии позволяют компенсировать часть первоначального взноса молодым специалистам, работающим в приоритетных для региона отраслях.",
  },
];

const initialDocuments: Document[] = [
  { id: 1, title: "Жалоба в трудовую инспекцию", category: "Трудовые споры", description: "Типовая жалоба на незаконное увольнение или нарушение условий труда", filename: "zhaloba_trudovaya_inspekcia.docx" },
  { id: 2, title: "Заявление о предоставлении академического отпуска", category: "Образование", description: "Образец заявления в деканат на академический отпуск по медицинским или иным основаниям", filename: "akademicheskiy_otpusk.docx" },
  { id: 3, title: "Исковое заявление о защите прав потребителя", category: "Защита прав", description: "Типовой иск в суд общей юрисдикции по делам о нарушении прав потребителей", filename: "iskovoe_potrebitel.docx" },
  { id: 4, title: "Запрос в органы государственной власти", category: "Государственные обращения", description: "Форма официального запроса информации в государственные и муниципальные органы", filename: "zapros_gosporgany.docx" },
  { id: 5, title: "Претензия работодателю о невыплате заработной платы", category: "Трудовые споры", description: "Досудебная претензия при задержке или невыплате заработной платы", filename: "pretenziya_zarplata.docx" },
];

const categoryColors: Record<string, string> = {
  "Образование": "border-l-blue-500",
  "Трудовое право": "border-l-amber-500",
  "Жилищное право": "border-l-emerald-500",
  "Трудовые споры": "border-l-red-400",
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
  const [appealSending, setAppealSending] = useState(false);
  const [appealError, setAppealError] = useState("");
  const [appealForm, setAppealForm] = useState({ lastName: "", firstName: "", middleName: "", birthDate: "", phone: "", email: "", message: "", consent: false });
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [newArticle, setNewArticle] = useState({ title: "", category: "", excerpt: "", content: "" });
  const [newDocument, setNewDocument] = useState({ title: "", category: "", description: "", filename: "", url: "" });
  const [showNewArticleForm, setShowNewArticleForm] = useState(false);
  const [showNewDocumentForm, setShowNewDocumentForm] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

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

  const uploadFile = async (file: File): Promise<{ url: string; filename: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch(UPLOAD_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, fileData: base64, contentType: file.type || "application/octet-stream" }),
        });
        const data = await res.json();
        if (!res.ok) reject(new Error(data.error || "Ошибка загрузки"));
        else resolve({ url: data.url, filename: file.name });
      };
      reader.onerror = () => reject(new Error("Ошибка чтения файла"));
      reader.readAsDataURL(file);
    });
  };

  const handleAppealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppealSending(true);
    setAppealError("");
    try {
      const res = await fetch(APPEAL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appealForm),
      });
      if (!res.ok) throw new Error("Ошибка отправки");
      setAppealSent(true);
    } catch {
      setAppealError("Не удалось отправить обращение. Попробуйте позже или напишите напрямую на почту.");
    } finally {
      setAppealSending(false);
    }
  };

  const handleFileUpload = async (file: File, target: "new" | "edit") => {
    setUploadingFile(true);
    setUploadError("");
    try {
      const { url, filename } = await uploadFile(file);
      if (target === "new") {
        setNewDocument((d) => ({ ...d, filename, url }));
      } else if (editingDocument) {
        setEditingDocument((d) => d ? { ...d, filename, url } : d);
      }
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("home")}
            className="font-display text-lg font-semibold text-primary tracking-wide hover:opacity-80 transition-opacity"
          >
            Гольцман Н.Р.
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`nav-link font-body text-sm tracking-wide ${page === item.key ? "text-primary active" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => navigate("admin")}
              className="ml-2 p-2 text-muted-foreground hover:text-primary transition-colors"
              title="Панель администратора"
            >
              <Icon name="Settings" size={16} />
            </button>
          </nav>

          <button className="md:hidden text-muted-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white py-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`block w-full text-left px-6 py-3 font-body text-sm ${page === item.key ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={() => navigate("admin")} className="block w-full text-left px-6 py-3 text-muted-foreground text-sm">
              Панель администратора
            </button>
          </div>
        )}
      </header>

      <main className="pt-16">

        {/* ===== HOME ===== */}
        {page === "home" && (
          <div>
            {/* Hero */}
            <section className="relative min-h-[92vh] flex items-center hero-gradient overflow-hidden">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-10 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-light/10 blur-3xl" />
              </div>
              <div className="max-w-6xl mx-auto px-6 py-24 w-full relative">
                <div className="max-w-3xl">
                  <h1 className="font-display text-6xl md:text-8xl font-semibold leading-none mb-6 opacity-0 animate-fade-up delay-100 text-foreground">
                    Гольцман<br />
                    <span className="text-primary">Никита</span><br />
                    Романович
                  </h1>
                  <div className="divider-blue my-8 w-48 opacity-0 animate-fade-in delay-300" />
                  <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10 opacity-0 animate-fade-up delay-400">
                    Председатель Совета молодых юристов Ямало-Ненецкого автономного округа.
                    Юрист, помощник депутата. Занимаюсь правозащитной деятельностью в интересах молодёжи и студентов.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up delay-500">
                    <button
                      onClick={() => navigate("appeal")}
                      className="px-8 py-4 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm shadow-md shadow-primary/20"
                    >
                      Подать обращение
                    </button>
                    <button
                      onClick={() => navigate("articles")}
                      className="px-8 py-4 border-2 border-primary text-primary font-body text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors rounded-sm"
                    >
                      Читать статьи
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <Icon name="ChevronDown" size={20} className="text-primary/50" />
              </div>
            </section>

            {/* About */}
            <section className="py-24 border-t border-border bg-white">
              <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-start">
                  <div>
                    <div className="inline-flex items-center gap-2 text-primary mb-4">
                      <Icon name="Scale" size={16} />
                      <span className="font-body text-xs tracking-widest uppercase">О деятельности</span>
                    </div>
                    <h2 className="font-display text-5xl font-semibold leading-tight mb-6 text-foreground">
                      Защита прав —<br />моя работа
                    </h2>
                    <div className="divider-blue w-32 mb-8" />
                    <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Как Уполномоченный по правам молодёжи, я оказываю бесплатную юридическую помощь студентам
                      и молодым людям в возрасте до 35 лет по вопросам трудового, жилищного, образовательного права.
                    </p>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      Помогаю разобраться в ситуации, составить необходимые документы и защитить
                      ваши интересы в государственных органах и судах.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { icon: "Scale", title: "Юридическая помощь", desc: "Консультации по трудовым, жилищным, образовательным вопросам" },
                      { icon: "FileText", title: "Составление документов", desc: "Жалобы, запросы, исковые заявления, претензии" },
                      { icon: "Shield", title: "Защита интересов", desc: "Представление интересов в государственных органах и судах" },
                      { icon: "Users", title: "Совет молодых юристов", desc: "Руководство профессиональным сообществом молодых юристов" },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-4 p-5 border border-border bg-blue-pale/40 rounded-sm card-hover">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-sm">
                          <Icon name={item.icon} size={18} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-body font-semibold text-sm mb-1 text-foreground">{item.title}</h3>
                          <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-primary">
              <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {[
                    { value: "до 35", label: "Лет — целевая аудитория" },
                    { value: "0 ₽", label: "Стоимость консультации" },
                    { value: "24/7", label: "Приём обращений онлайн" },
                  ].map((stat) => (
                    <div key={stat.label} className="border-t-2 border-white/30 pt-6">
                      <div className="font-display text-4xl font-semibold text-white mb-2">{stat.value}</div>
                      <div className="font-body text-xs text-blue-100 tracking-wide">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-24 border-t border-border bg-white">
              <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="font-display text-5xl font-semibold mb-4 text-foreground">Нужна помощь?</h2>
                <p className="font-body text-muted-foreground mb-10 max-w-lg mx-auto">
                  Опишите вашу ситуацию — я изучу обращение и свяжусь с вами для консультации
                </p>
                <button
                  onClick={() => navigate("appeal")}
                  className="px-10 py-4 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm shadow-md shadow-primary/20"
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
              <div className="inline-flex items-center gap-2 text-primary mb-3">
                <Icon name="BookOpen" size={16} />
                <span className="font-body text-xs tracking-widest uppercase">Публикации</span>
              </div>
              <h1 className="font-display text-5xl font-semibold mb-4 text-foreground">Статьи и разъяснения</h1>
              <div className="divider-blue w-32" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className={`border border-border border-l-4 ${categoryColors[article.category] || "border-l-primary"} bg-white p-6 card-hover cursor-pointer rounded-sm`}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-body text-xs text-primary tracking-wide font-medium">{article.category}</span>
                    <span className="font-body text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <h2 className="font-display text-xl font-semibold leading-snug mb-3 text-foreground">{article.title}</h2>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{article.excerpt}</p>
                  <div className="flex items-center gap-2 text-primary text-xs font-body font-medium">
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
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-10"
            >
              <Icon name="ArrowLeft" size={16} />
              Все статьи
            </button>
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <span className="font-body text-xs tracking-widest uppercase font-medium">{selectedArticle.category}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4 text-foreground">{selectedArticle.title}</h1>
            <p className="font-body text-sm text-muted-foreground mb-8">{selectedArticle.date}</p>
            <div className="divider-blue w-32 mb-8" />
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-6">{selectedArticle.excerpt}</p>
            <p className="font-body text-base leading-relaxed text-foreground">{selectedArticle.content}</p>
          </div>
        )}

        {/* ===== DOCUMENTS ===== */}
        {page === "documents" && (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 text-primary mb-3">
                <Icon name="FolderOpen" size={16} />
                <span className="font-body text-xs tracking-widest uppercase">Правовая база</span>
              </div>
              <h1 className="font-display text-5xl font-semibold mb-4 text-foreground">Типовые документы</h1>
              <div className="divider-blue w-32 mb-4" />
              <p className="font-body text-muted-foreground max-w-xl">
                Скачайте образцы документов, адаптируйте под свою ситуацию. При необходимости обратитесь за консультацией.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-start gap-5 p-6 border border-border bg-white card-hover rounded-sm">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 flex items-center justify-center rounded-sm">
                    <Icon name="FileText" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-body text-xs text-primary tracking-wide mb-1 block font-medium">{doc.category}</span>
                    <h3 className="font-body font-semibold text-sm mb-2 text-foreground">{doc.title}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">{doc.description}</p>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        download={doc.filename}
                        className="inline-flex items-center gap-2 font-body text-xs text-primary hover:opacity-70 transition-opacity font-medium"
                      >
                        <Icon name="Download" size={14} />
                        Скачать документ
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 font-body text-xs text-muted-foreground">
                        <Icon name="Clock" size={14} />
                        Документ готовится
                      </span>
                    )}
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
              <div className="inline-flex items-center gap-2 text-primary mb-3">
                <Icon name="MessageSquare" size={16} />
                <span className="font-body text-xs tracking-widest uppercase">Обратная связь</span>
              </div>
              <h1 className="font-display text-5xl font-semibold mb-4 text-foreground">Подать обращение</h1>
              <div className="divider-blue w-32 mb-4" />
              <p className="font-body text-muted-foreground">
                Заполните форму — я рассмотрю ваше обращение и свяжусь с вами в течение 3 рабочих дней.
              </p>
            </div>

            {appealSent ? (
              <div className="border border-primary/20 bg-primary/5 p-10 text-center rounded-sm">
                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-6 rounded-full">
                  <Icon name="CheckCircle" size={28} className="text-primary" />
                </div>
                <h2 className="font-display text-3xl font-semibold mb-3 text-foreground">Обращение отправлено</h2>
                <p className="font-body text-muted-foreground mb-6">
                  Благодарю за обращение. Я свяжусь с вами в течение 3 рабочих дней.
                </p>
                <button
                  onClick={() => { setAppealSent(false); setAppealError(""); setAppealForm({ lastName: "", firstName: "", middleName: "", birthDate: "", phone: "", email: "", message: "", consent: false }); }}
                  className="font-body text-sm text-primary hover:opacity-70 transition-opacity"
                >
                  Подать ещё одно обращение
                </button>
              </div>
            ) : (
              <form className="space-y-5 bg-white border border-border p-8 rounded-sm shadow-sm" onSubmit={handleAppealSubmit}>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: "Фамилия *", key: "lastName", ph: "Иванов", req: true },
                    { label: "Имя *", key: "firstName", ph: "Иван", req: true },
                    { label: "Отчество", key: "middleName", ph: "Иванович", req: false },
                  ].map(({ label, key, ph, req }) => (
                    <div key={key}>
                      <label className="font-body text-xs text-muted-foreground uppercase tracking-wide block mb-2">{label}</label>
                      <input
                        required={req}
                        value={(appealForm as Record<string, string | boolean>)[key] as string}
                        onChange={(e) => setAppealForm({ ...appealForm, [key]: e.target.value })}
                        className="w-full bg-background border border-border px-4 py-3 font-body text-sm focus:border-primary outline-none transition-colors rounded-sm"
                        placeholder={ph}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="font-body text-xs text-muted-foreground uppercase tracking-wide block mb-2">Дата рождения *</label>
                  <input
                    required type="date"
                    value={appealForm.birthDate}
                    onChange={(e) => setAppealForm({ ...appealForm, birthDate: e.target.value })}
                    className="w-full bg-background border border-border px-4 py-3 font-body text-sm focus:border-primary outline-none transition-colors rounded-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-muted-foreground uppercase tracking-wide block mb-2">Телефон *</label>
                    <input
                      required type="tel"
                      value={appealForm.phone}
                      onChange={(e) => setAppealForm({ ...appealForm, phone: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 font-body text-sm focus:border-primary outline-none transition-colors rounded-sm"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground uppercase tracking-wide block mb-2">Электронная почта *</label>
                    <input
                      required type="email"
                      value={appealForm.email}
                      onChange={(e) => setAppealForm({ ...appealForm, email: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 font-body text-sm focus:border-primary outline-none transition-colors rounded-sm"
                      placeholder="example@mail.ru"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs text-muted-foreground uppercase tracking-wide block mb-2">Суть обращения *</label>
                  <textarea
                    required rows={6}
                    value={appealForm.message}
                    onChange={(e) => setAppealForm({ ...appealForm, message: e.target.value })}
                    className="w-full bg-background border border-border px-4 py-3 font-body text-sm focus:border-primary outline-none transition-colors resize-none rounded-sm"
                    placeholder="Опишите вашу ситуацию подробно..."
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    className={`flex-shrink-0 w-5 h-5 border-2 mt-0.5 flex items-center justify-center transition-colors cursor-pointer rounded-sm ${appealForm.consent ? "border-primary bg-primary" : "border-border group-hover:border-primary/50"}`}
                    onClick={() => setAppealForm({ ...appealForm, consent: !appealForm.consent })}
                  >
                    {appealForm.consent && <Icon name="Check" size={11} className="text-white" />}
                  </div>
                  <span className="font-body text-xs text-muted-foreground leading-relaxed">
                    Я даю согласие на обработку моих персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных» в целях рассмотрения настоящего обращения. *
                  </span>
                </label>

                {appealError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-sm">
                    <Icon name="AlertCircle" size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="font-body text-xs text-red-600">{appealError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!appealForm.consent || appealSending}
                  className="w-full py-4 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm shadow-md shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {appealSending ? (
                    <>
                      <Icon name="Loader" size={16} className="animate-spin" />
                      Отправляю...
                    </>
                  ) : (
                    "Отправить обращение"
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ===== CONTACTS ===== */}
        {page === "contacts" && (
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 text-primary mb-3">
                <Icon name="Phone" size={16} />
                <span className="font-body text-xs tracking-widest uppercase">Связаться</span>
              </div>
              <h1 className="font-display text-5xl font-semibold mb-4 text-foreground">Контакты</h1>
              <div className="divider-blue w-32" />
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6 text-foreground">Гольцман Никита Романович</h2>
                <p className="font-body text-muted-foreground mb-8 leading-relaxed">
                  Уполномоченный по правам молодёжи.<br />
                  Председатель Совета молодых юристов.<br />
                  Юрист, помощник депутата.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: "Phone", label: "Телефон", value: "+7 (___) ___-__-__" },
                    { icon: "Mail", label: "Электронная почта", value: "polimick@rambler.ru" },
                  ].map((c) => (
                    <div key={c.label} className="flex gap-4 p-4 border border-border bg-white rounded-sm">
                      <div className="flex-shrink-0 w-9 h-9 bg-primary/10 flex items-center justify-center rounded-sm">
                        <Icon name={c.icon} size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground mb-0.5">{c.label}</p>
                        <p className="font-body text-sm text-foreground">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-border bg-white p-8 rounded-sm shadow-sm">
                <h3 className="font-display text-2xl font-semibold mb-4 text-foreground">Написать обращение</h3>
                <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
                  Для получения юридической помощи заполните форму обращения. Все обращения рассматриваются конфиденциально.
                </p>
                <button
                  onClick={() => navigate("appeal")}
                  className="w-full py-4 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm shadow-md shadow-primary/20"
                >
                  Подать обращение
                </button>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="font-body text-xs text-muted-foreground text-center">Бесплатная юридическая помощь для молодёжи до 35 лет</p>
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
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mx-auto mb-4 rounded-full">
                    <Icon name="Lock" size={22} className="text-primary" />
                  </div>
                  <h1 className="font-display text-3xl font-semibold mb-2 text-foreground">Панель управления</h1>
                  <p className="font-body text-sm text-muted-foreground">Введите пароль администратора</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if (adminPassword === "admin123") setAdminAuthenticated(true); else alert("Неверный пароль"); }}>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Пароль"
                    className="w-full bg-white border border-border px-4 py-3 font-body text-sm focus:border-primary outline-none transition-colors mb-4 rounded-sm"
                  />
                  <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
                    Войти
                  </button>
                </form>
                <p className="font-body text-xs text-muted-foreground text-center mt-4">Пароль по умолчанию: admin123</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <div className="inline-flex items-center gap-2 text-primary mb-2">
                      <Icon name="Settings" size={14} />
                      <span className="font-body text-xs tracking-widest uppercase">Администрирование</span>
                    </div>
                    <h1 className="font-display text-4xl font-semibold text-foreground">Панель управления</h1>
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
                  {(["articles", "documents"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAdminTab(tab)}
                      className={`px-6 py-3 font-body text-sm ${adminTab === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {tab === "articles" ? `Статьи (${articles.length})` : `Документы (${documents.length})`}
                    </button>
                  ))}
                </div>

                {/* ARTICLES */}
                {adminTab === "articles" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-display text-2xl font-semibold text-foreground">Статьи</h2>
                      <button
                        onClick={() => setShowNewArticleForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body text-xs tracking-wider uppercase hover:bg-primary/90 transition-colors rounded-sm"
                      >
                        <Icon name="Plus" size={14} />
                        Новая статья
                      </button>
                    </div>

                    {showNewArticleForm && (
                      <div className="border border-primary/20 bg-primary/5 p-6 mb-6 rounded-sm">
                        <h3 className="font-body font-semibold mb-4 text-foreground">Новая статья</h3>
                        <div className="space-y-3">
                          {[
                            { ph: "Заголовок", key: "title" },
                            { ph: "Категория", key: "category" },
                          ].map(({ ph, key }) => (
                            <input
                              key={key}
                              placeholder={ph}
                              value={(newArticle as Record<string, string>)[key]}
                              onChange={(e) => setNewArticle({ ...newArticle, [key]: e.target.value })}
                              className="w-full bg-white border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none rounded-sm"
                            />
                          ))}
                          {[
                            { ph: "Краткое описание", key: "excerpt", rows: 2 },
                            { ph: "Полный текст статьи", key: "content", rows: 4 },
                          ].map(({ ph, key, rows }) => (
                            <textarea
                              key={key}
                              placeholder={ph}
                              rows={rows}
                              value={(newArticle as Record<string, string>)[key]}
                              onChange={(e) => setNewArticle({ ...newArticle, [key]: e.target.value })}
                              className="w-full bg-white border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none resize-none rounded-sm"
                            />
                          ))}
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
                              className="px-5 py-2 bg-primary text-primary-foreground font-body text-xs uppercase tracking-wide hover:bg-primary/90 rounded-sm"
                            >
                              Сохранить
                            </button>
                            <button onClick={() => setShowNewArticleForm(false)} className="px-5 py-2 border border-border font-body text-xs uppercase tracking-wide hover:border-muted-foreground rounded-sm">
                              Отмена
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {articles.map((article) => (
                        <div key={article.id} className="border border-border bg-white rounded-sm">
                          {editingArticle?.id === article.id ? (
                            <div className="p-5 space-y-3">
                              {[
                                { key: "title", val: editingArticle.title },
                                { key: "category", val: editingArticle.category },
                              ].map(({ key, val }) => (
                                <input
                                  key={key}
                                  value={val}
                                  onChange={(e) => setEditingArticle({ ...editingArticle, [key]: e.target.value })}
                                  className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none rounded-sm"
                                />
                              ))}
                              <textarea rows={2} value={editingArticle.excerpt} onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })} className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none resize-none rounded-sm" />
                              <textarea rows={4} value={editingArticle.content} onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })} className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none resize-none rounded-sm" />
                              <div className="flex gap-3">
                                <button onClick={() => { setArticles(articles.map((a) => a.id === editingArticle.id ? editingArticle : a)); setEditingArticle(null); }} className="px-5 py-2 bg-primary text-primary-foreground font-body text-xs uppercase tracking-wide hover:bg-primary/90 rounded-sm">Сохранить</button>
                                <button onClick={() => setEditingArticle(null)} className="px-5 py-2 border border-border font-body text-xs uppercase tracking-wide rounded-sm">Отмена</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 p-4">
                              <div className="flex-1 min-w-0">
                                <span className="font-body text-xs text-primary mr-3 font-medium">{article.category}</span>
                                <span className="font-body text-xs text-muted-foreground">{article.date}</span>
                                <h3 className="font-body font-semibold text-sm mt-1 truncate text-foreground">{article.title}</h3>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => setEditingArticle(article)} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded"><Icon name="Pencil" size={14} /></button>
                                <button onClick={() => setArticles(articles.filter((a) => a.id !== article.id))} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded"><Icon name="Trash2" size={14} /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DOCUMENTS */}
                {adminTab === "documents" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-display text-2xl font-semibold text-foreground">Документы</h2>
                      <button
                        onClick={() => { setShowNewDocumentForm(true); setUploadError(""); }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body text-xs tracking-wider uppercase hover:bg-primary/90 transition-colors rounded-sm"
                      >
                        <Icon name="Plus" size={14} />
                        Новый документ
                      </button>
                    </div>

                    {showNewDocumentForm && (
                      <div className="border border-primary/20 bg-primary/5 p-6 mb-6 rounded-sm">
                        <h3 className="font-body font-semibold mb-4 text-foreground">Новый документ</h3>
                        <div className="space-y-3">
                          <input
                            placeholder="Название документа"
                            value={newDocument.title}
                            onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                            className="w-full bg-white border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none rounded-sm"
                          />
                          <input
                            placeholder="Категория"
                            value={newDocument.category}
                            onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
                            className="w-full bg-white border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none rounded-sm"
                          />
                          <textarea
                            placeholder="Описание"
                            rows={2}
                            value={newDocument.description}
                            onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                            className="w-full bg-white border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none resize-none rounded-sm"
                          />

                          {/* File upload */}
                          <div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              accept=".doc,.docx,.pdf,.xls,.xlsx,.odt"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, "new"); }}
                            />
                            {newDocument.url ? (
                              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-sm">
                                <Icon name="CheckCircle" size={16} className="text-green-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-body text-xs text-green-700 font-medium">Файл загружен</p>
                                  <p className="font-body text-xs text-green-600 truncate">{newDocument.filename}</p>
                                </div>
                                <button
                                  onClick={() => { setNewDocument({ ...newDocument, filename: "", url: "" }); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Icon name="X" size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingFile}
                                className="w-full border-2 border-dashed border-primary/30 hover:border-primary/60 bg-white p-6 text-center transition-colors rounded-sm disabled:opacity-60"
                              >
                                {uploadingFile ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <Icon name="Loader" size={18} className="text-primary animate-spin" />
                                    <span className="font-body text-sm text-primary">Загружаю файл...</span>
                                  </div>
                                ) : (
                                  <>
                                    <Icon name="Upload" size={24} className="text-primary/50 mx-auto mb-2" />
                                    <p className="font-body text-sm text-muted-foreground">Нажмите чтобы выбрать файл</p>
                                    <p className="font-body text-xs text-muted-foreground/70 mt-1">DOC, DOCX, PDF, XLS, XLSX, ODT</p>
                                  </>
                                )}
                              </button>
                            )}
                            {uploadError && <p className="font-body text-xs text-destructive mt-2">{uploadError}</p>}
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                if (newDocument.title) {
                                  setDocuments([{ id: Date.now(), title: newDocument.title, category: newDocument.category, description: newDocument.description, filename: newDocument.filename, url: newDocument.url }, ...documents]);
                                  setNewDocument({ title: "", category: "", description: "", filename: "", url: "" });
                                  setShowNewDocumentForm(false);
                                  setUploadError("");
                                }
                              }}
                              className="px-5 py-2 bg-primary text-primary-foreground font-body text-xs uppercase tracking-wide hover:bg-primary/90 rounded-sm"
                            >
                              Сохранить
                            </button>
                            <button onClick={() => { setShowNewDocumentForm(false); setUploadError(""); }} className="px-5 py-2 border border-border font-body text-xs uppercase tracking-wide rounded-sm">
                              Отмена
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="border border-border bg-white rounded-sm">
                          {editingDocument?.id === doc.id ? (
                            <div className="p-5 space-y-3">
                              <input value={editingDocument.title} onChange={(e) => setEditingDocument({ ...editingDocument, title: e.target.value })} className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none rounded-sm" />
                              <input value={editingDocument.category} onChange={(e) => setEditingDocument({ ...editingDocument, category: e.target.value })} className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none rounded-sm" />
                              <textarea rows={2} value={editingDocument.description} onChange={(e) => setEditingDocument({ ...editingDocument, description: e.target.value })} className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-primary outline-none resize-none rounded-sm" />

                              {/* Edit file upload */}
                              <div>
                                <input
                                  ref={editFileInputRef}
                                  type="file"
                                  className="hidden"
                                  accept=".doc,.docx,.pdf,.xls,.xlsx,.odt"
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, "edit"); }}
                                />
                                {editingDocument.url ? (
                                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-sm">
                                    <Icon name="CheckCircle" size={16} className="text-green-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-body text-xs text-green-600 truncate">{editingDocument.filename}</p>
                                    </div>
                                    <button onClick={() => editFileInputRef.current?.click()} className="font-body text-xs text-primary hover:opacity-70">
                                      Заменить
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => editFileInputRef.current?.click()}
                                    disabled={uploadingFile}
                                    className="w-full border-2 border-dashed border-primary/30 hover:border-primary/60 bg-background p-4 text-center transition-colors rounded-sm disabled:opacity-60"
                                  >
                                    {uploadingFile ? (
                                      <span className="font-body text-sm text-primary flex items-center justify-center gap-2">
                                        <Icon name="Loader" size={16} className="animate-spin" />
                                        Загружаю...
                                      </span>
                                    ) : (
                                      <span className="font-body text-sm text-muted-foreground">
                                        <Icon name="Upload" size={16} className="inline mr-2 text-primary/50" />
                                        Загрузить файл
                                      </span>
                                    )}
                                  </button>
                                )}
                              </div>

                              <div className="flex gap-3">
                                <button onClick={() => { setDocuments(documents.map((d) => d.id === editingDocument.id ? editingDocument : d)); setEditingDocument(null); }} className="px-5 py-2 bg-primary text-primary-foreground font-body text-xs uppercase tracking-wide hover:bg-primary/90 rounded-sm">Сохранить</button>
                                <button onClick={() => setEditingDocument(null)} className="px-5 py-2 border border-border font-body text-xs uppercase tracking-wide rounded-sm">Отмена</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 p-4">
                              <div className="w-9 h-9 bg-primary/10 flex items-center justify-center rounded-sm flex-shrink-0">
                                <Icon name={doc.url ? "FileCheck" : "FileClock"} size={16} className={doc.url ? "text-primary" : "text-muted-foreground"} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-body text-xs text-primary font-medium">{doc.category}</span>
                                <h3 className="font-body font-semibold text-sm mt-0.5 truncate text-foreground">{doc.title}</h3>
                                {doc.url
                                  ? <p className="font-body text-xs text-green-600 mt-0.5">Файл загружен: {doc.filename}</p>
                                  : <p className="font-body text-xs text-muted-foreground mt-0.5">Файл не загружен</p>
                                }
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => setEditingDocument(doc)} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded"><Icon name="Pencil" size={14} /></button>
                                <button onClick={() => setDocuments(documents.filter((d) => d.id !== doc.id))} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded"><Icon name="Trash2" size={14} /></button>
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
      <footer className="border-t border-border mt-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display text-lg font-semibold text-primary">Гольцман Никита Романович</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Уполномоченный по правам молодёжи</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {navItems.map((item) => (
                <button key={item.key} onClick={() => navigate(item.key)} className="font-body text-xs text-muted-foreground hover:text-primary transition-colors tracking-wide">
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="divider-blue mt-8 mb-6" />
          <p className="font-body text-xs text-muted-foreground text-center">© 2025 Гольцман Н.Р. Уполномоченный по правам молодёжи</p>
        </div>
      </footer>
    </div>
  );
}