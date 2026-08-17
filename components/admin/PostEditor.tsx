"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  Undo,
  Redo,
  Save,
  Eye,
  History,
  Check,
  Calendar,
} from "lucide-react";
import { db } from "@/lib/db";
import { Post, Tag } from "@/lib/mockData";
import RichTextRenderer from "@/components/RichTextRenderer";

interface PostEditorProps {
  post?: Post | null;
}

export default function PostEditor({ post = null }: PostEditorProps) {
  const router = useRouter();
  
  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"conto" | "cronica" | "poesia">("conto");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");
  const [publishedAt, setPublishedAt] = useState("");
  const [featured, setFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  
  // Supporting states
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [revisions, setRevisions] = useState<any[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize TipTap
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "tiptap p-4 border border-border min-h-[350px] bg-paper outline-none text-brand-dark focus:border-accent-red transition-colors prose-literary max-w-none",
      },
    },
  });

  // Load existing post if present
  useEffect(() => {
    async function loadEditorData() {
      // Get tags first
      const tagsData = await db.getTags();
      setAllTags(tagsData);

      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setType(post.type);
        setExcerpt(post.excerpt);
        setStatus(post.status);
        setPublishedAt(new Date(post.published_at).toISOString().slice(0, 16)); // YYYY-MM-DDTHH:MM
        setFeatured(post.featured);
        setCoverImage(post.cover_image || "");
        setSelectedTags(post.tags || []);
        
        if (editor) {
          editor.commands.setContent(post.content);
        }

        // Load revisions
        const revData = await db.getRevisions(post.id);
        setRevisions(revData);
      } else {
        // Set default date to now
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setPublishedAt(now.toISOString().slice(0, 16));
      }
    }
    loadEditorData();
  }, [post, editor]);

  // Slug Auto-generation
  const generateSlug = (titleText: string) => {
    return titleText
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-"); // Collapse duplicate dashes
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!post) {
      setSlug(generateSlug(val));
    }
  };

  // Tag Multiselect handlers
  const handleToggleTag = (tag: Tag) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const slugName = generateSlug(newTagName);
      const newTag = await db.saveTag({ name: newTagName.trim(), slug: slugName });
      setAllTags([...allTags, newTag]);
      setSelectedTags([...selectedTags, newTag]);
      setNewTagName("");
    } catch (err) {
      console.error("Erro ao criar tag:", err);
    }
  };

  // Compile full post object
  const getPostObject = (): Omit<Post, "created_at" | "updated_at" | "id"> & { id?: string } => {
    return {
      ...(post?.id ? { id: post.id } : {}),
      title: title.trim() || "Sem título",
      slug: slug.trim() || generateSlug(title) || `texto-${Date.now()}`,
      excerpt: excerpt.trim() || editor?.getText().slice(0, 120) + "..." || "",
      content: editor?.getHTML() || "",
      type,
      status,
      featured,
      cover_image: coverImage || undefined,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      tags: selectedTags,
      author_id: post?.author_id || "author-1",
    };
  };

  // Manual save handler
  const handleSave = async (explicitStatus?: "draft" | "published" | "scheduled") => {
    setSaveStatus("saving");
    const activeStatus = explicitStatus || status;
    const postData = { ...getPostObject(), status: activeStatus };

    try {
      const saved = await db.savePost(postData);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);

      // Load new revisions list
      const revData = await db.getRevisions(saved.id);
      setRevisions(revData);

      // If creating new post, redirect to edit URL to avoid duplicating
      if (!post) {
        router.push(`/admin/publicacoes/editar/${saved.id}`);
      }
    } catch (err: any) {
      console.error("Erro ao salvar post:", err);
      setSaveStatus("idle");
      alert(`Erro ao salvar post: ${err.message || JSON.stringify(err)}`);
    }
  };

  // Autosave setup
  useEffect(() => {
    if (!editor || !title.trim()) return;

    const handleAutoSave = async () => {
      setSaveStatus("saving");
      const postData = getPostObject();
      try {
        const saved = await db.savePost(postData);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);
        
        // Refresh revisions
        const revData = await db.getRevisions(saved.id);
        setRevisions(revData);
      } catch (err) {
        console.error("Autosave erro:", err);
        setSaveStatus("idle");
      }
    };

    // Trigger autosave on change every 30 seconds
    const timer = setInterval(() => {
      handleAutoSave();
    }, 30000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, title, slug, type, excerpt, status, publishedAt, featured, coverImage, selectedTags, post]);

  // Load a revision back to editor
  const handleRestoreRevision = (revContent: string) => {
    if (confirm("Deseja realmente restaurar esta versão? Alterações não salvas serão perdidas.")) {
      editor?.commands.setContent(revContent);
      alert("Versão restaurada no editor. Salve as alterações para fixá-la.");
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Editor top header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <span className="font-sans text-xs uppercase tracking-widest text-brand-brown font-semibold">
            {post ? "Editar Obra" : "Nova Obra"}
          </span>
          <h2 className="font-serif text-3xl font-medium text-brand-dark">
            {title || (type === "poesia" ? "Um novo poema..." : "Uma nova história...")}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 font-sans text-xs">
          {/* Save status notification */}
          {saveStatus === "saving" && (
            <span className="text-brand-brown/60 animate-pulse italic">Salvando...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-green-700 flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Salvo</span>
            </span>
          )}

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-2 border border-border bg-paper hover:bg-beige-light/20 text-brand-dark px-4 py-2 font-semibold transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar</span>
          </button>

          <button
            onClick={() => handleSave("draft")}
            className="inline-flex items-center gap-2 border border-border bg-paper hover:bg-beige-light/20 text-brand-dark px-4 py-2 font-semibold transition-colors"
          >
            <span>Salvar Rascunho</span>
          </button>

          <button
            onClick={() => handleSave("published")}
            className="inline-flex items-center gap-2 bg-brand-dark hover:bg-accent-red text-paper px-4 py-2 font-semibold transition-colors shadow-soft"
          >
            <Save className="w-4 h-4" />
            <span>Publicar agora</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left main: Editor canvas */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Digite o título principal..."
              className="w-full bg-transparent border-b border-border/80 focus:border-accent-red outline-none font-serif text-2xl md:text-3xl font-medium text-brand-dark py-2 placeholder:text-brand-brown/30 placeholder:italic transition-colors"
            />
          </div>

          {/* Slug input */}
          <div className="flex flex-col sm:flex-row gap-2 font-sans text-xs text-brand-brown items-start sm:items-center">
            <span className="uppercase tracking-widest font-semibold text-[10px]">URL Amigável:</span>
            <div className="flex items-center border border-border px-2 py-1 bg-beige-light/15 w-full sm:w-auto">
              <span>/{type === "conto" ? "contos" : type === "cronica" ? "cronicas" : "poesias"}/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="bg-transparent outline-none text-brand-dark font-medium font-sans focus:text-accent-red truncate pl-0.5"
                placeholder="slug-do-texto"
              />
            </div>
          </div>

          {/* Excerpt / Summary */}
          <div className="space-y-2">
            <label className="font-sans text-[10px] uppercase tracking-widest text-brand-brown font-bold block">
              Resumo / Trecho de Listagem
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Digite um fragmento do texto para atrair o leitor na página de listagens..."
              rows={3}
              className="w-full bg-paper border border-border p-3 outline-none text-sm text-brand-dark focus:border-accent-red font-serif transition-colors rounded-sm"
            />
          </div>

          {/* Editor ToolBar */}
          <div className="space-y-2">
            <label className="font-sans text-[10px] uppercase tracking-widest text-brand-brown font-bold block">
              Corpo do Texto
            </label>
            
            {/* Toolbar Buttons */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-beige-light/25 border border-b-0 border-border select-none">
              {/* Bold */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-beige-light/50 transition-colors ${
                  editor.isActive("bold") ? "text-accent-red bg-paper shadow-sm" : "text-brand-brown"
                }`}
                title="Negrito"
              >
                <Bold className="w-4 h-4" />
              </button>

              {/* Italic */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-beige-light/50 transition-colors ${
                  editor.isActive("italic") ? "text-accent-red bg-paper shadow-sm" : "text-brand-brown"
                }`}
                title="Itálico"
              >
                <Italic className="w-4 h-4" />
              </button>

              {/* Underline */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded hover:bg-beige-light/50 transition-colors ${
                  editor.isActive("underline") ? "text-accent-red bg-paper shadow-sm" : "text-brand-brown"
                }`}
                title="Sublinhado"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-border mx-1" />

              {/* H2 */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded hover:bg-beige-light/50 transition-colors ${
                  editor.isActive("heading", { level: 2 }) ? "text-accent-red bg-paper shadow-sm" : "text-brand-brown"
                }`}
                title="Título Secundário (H2)"
              >
                <Heading2 className="w-4 h-4" />
              </button>

              {/* H3 */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-1.5 rounded hover:bg-beige-light/50 transition-colors ${
                  editor.isActive("heading", { level: 3 }) ? "text-accent-red bg-paper shadow-sm" : "text-brand-brown"
                }`}
                title="Subtítulo (H3)"
              >
                <Heading3 className="w-4 h-4" />
              </button>

              {/* Blockquote */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded hover:bg-beige-light/50 transition-colors ${
                  editor.isActive("blockquote") ? "text-accent-red bg-paper shadow-sm" : "text-brand-brown"
                }`}
                title="Citação"
              >
                <Quote className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-border mx-1" />

              {/* Bullets */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded hover:bg-beige-light/50 transition-colors ${
                  editor.isActive("bulletList") ? "text-accent-red bg-paper shadow-sm" : "text-brand-brown"
                }`}
                title="Lista de marcadores"
              >
                <List className="w-4 h-4" />
              </button>

              {/* Ordered */}
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded hover:bg-beige-light/50 transition-colors ${
                  editor.isActive("orderedList") ? "text-accent-red bg-paper shadow-sm" : "text-brand-brown"
                }`}
                title="Lista numerada"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              {/* Separator */}
              <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="p-1.5 rounded hover:bg-beige-light/50 transition-colors text-brand-brown"
                title="Divisor de seção"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-5 bg-border mx-1" />

              {/* Undo */}
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-1.5 rounded hover:bg-beige-light/50 transition-colors text-brand-brown disabled:opacity-40"
                title="Desfazer"
              >
                <Undo className="w-4 h-4" />
              </button>

              {/* Redo */}
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-1.5 rounded hover:bg-beige-light/50 transition-colors text-brand-brown disabled:opacity-40"
                title="Refazer"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Right side: Meta options */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata Block */}
          <div className="border border-border p-5 bg-paper space-y-4">
            <h4 className="font-serif font-medium text-base text-brand-dark border-b border-border pb-2">
              Opções de publicação
            </h4>

            {/* Type selection */}
            <div className="space-y-1.5 font-sans text-xs">
              <label className="uppercase tracking-widest text-[10px] text-brand-brown font-bold">
                Gênero Literário
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-paper border border-border px-3 py-2 outline-none text-brand-dark uppercase font-semibold tracking-wider text-[10px]"
              >
                <option value="conto">Conto</option>
                <option value="cronica">Crônica</option>
                <option value="poesia">Poesia</option>
              </select>
            </div>

            {/* Status selection */}
            <div className="space-y-1.5 font-sans text-xs">
              <label className="uppercase tracking-widest text-[10px] text-brand-brown font-bold">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-paper border border-border px-3 py-2 outline-none text-brand-dark uppercase font-semibold tracking-wider text-[10px]"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="scheduled">Agendado</option>
              </select>
            </div>

            {/* Date time picker */}
            <div className="space-y-1.5 font-sans text-xs">
              <label className="uppercase tracking-widest text-[10px] text-brand-brown font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{status === "scheduled" ? "Agendar para:" : "Data de publicação:"}</span>
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-paper border border-border px-3 py-2 outline-none text-brand-dark font-sans text-[11px]"
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-2 pt-2">
              <input
                id="feat-toggle"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 border-border accent-accent-red cursor-pointer"
              />
              <label
                htmlFor="feat-toggle"
                className="font-sans text-[10px] uppercase tracking-widest text-brand-brown font-bold cursor-pointer select-none"
              >
                Definir como destaque
              </label>
            </div>

            {/* Cover image input */}
            <div className="space-y-1.5 font-sans text-xs">
              <label className="uppercase tracking-widest text-[10px] text-brand-brown font-bold">
                Link da Imagem de Capa (Opcional)
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://exemplo.com/capa.jpg"
                className="w-full bg-paper border border-border px-3 py-2 outline-none text-brand-dark text-xs"
              />
            </div>
          </div>

          {/* Tags Selection Block */}
          <div className="border border-border p-5 bg-paper space-y-4">
            <h4 className="font-serif font-medium text-base text-brand-dark border-b border-border pb-2">
              Temas / Tags
            </h4>

            {/* Existing tags selection */}
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const isSelected = selectedTags.some((t) => t.id === tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 text-[11px] font-sans border rounded-sm transition-all ${
                      isSelected
                        ? "bg-brand-dark border-brand-dark text-paper font-semibold"
                        : "border-border text-brand-brown hover:border-accent-red"
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>

            {/* Add tag panel */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Novo tema..."
                className="bg-paper border border-border px-2 py-1 w-full text-xs outline-none focus:border-accent-red"
              />
              <button
                type="button"
                onClick={handleCreateTag}
                className="bg-beige-medium text-brand-dark px-3 py-1 font-sans text-[10px] uppercase font-bold hover:bg-accent-red hover:text-paper transition-all"
              >
                Criar
              </button>
            </div>
          </div>

          {/* Revisions History Block */}
          {post && (
            <div className="border border-border p-5 bg-paper space-y-4">
              <h4 className="font-serif font-medium text-base text-brand-dark border-b border-border pb-2 flex items-center gap-1.5">
                <History className="w-4 h-4 text-brand-brown" />
                <span>Histórico de edições</span>
              </h4>

              {revisions.length > 0 ? (
                <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 font-sans text-[10px]">
                  {revisions.map((rev) => {
                    const revDate = new Date(rev.created_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={rev.id}
                        className="flex justify-between items-center bg-beige-light/20 p-2 border border-border/40 hover:border-accent-red/35 transition-colors"
                      >
                        <span className="text-brand-brown font-semibold">{revDate}</span>
                        <button
                          onClick={() => handleRestoreRevision(rev.content)}
                          className="text-accent-red hover:underline font-bold uppercase tracking-wider text-[8px]"
                        >
                          Restaurar
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[10px] font-sans italic text-brand-brown/70">
                  Nenhuma revisão salva ainda. Elas serão geradas automaticamente pelo autosave.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reader Preview Modal Layout */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex justify-center overflow-y-auto p-4 pt-10">
          <div className="w-full max-w-3xl bg-paper border border-border p-8 md:p-12 relative rounded shadow-editorial h-fit mb-12">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <span className="font-sans text-[9px] uppercase tracking-widest text-accent-red font-bold border border-accent-red px-2.5 py-1 bg-paper/90 rounded-sm">
                Modo de Visualização
              </span>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="bg-brand-dark hover:bg-accent-red text-paper px-3 py-1 font-sans text-xs uppercase tracking-widest font-semibold"
              >
                Fechar
              </button>
            </div>

            <article className="space-y-12 mt-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="text-xs uppercase tracking-widest font-sans text-brand-brown font-semibold">
                  {type === "cronica" ? "Crônica" : type === "conto" ? "Conto" : "Poesia"}
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-semibold text-brand-dark">
                  {title || "Sem título"}
                </h1>
                <div className="font-sans text-xs text-brand-brown/80">
                  Natália Mello • {new Date(publishedAt || Date.now()).toLocaleDateString("pt-BR")}
                </div>
              </div>

              <div className="w-12 h-[1px] bg-border mx-auto" />

              {/* Body */}
              <div className="max-w-[620px] mx-auto">
                {type === "poesia" ? (
                  <div
                    className="poetry-content"
                    dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                  />
                ) : (
                  <RichTextRenderer content={editor.getHTML()} />
                )}
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
