"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

type LinkItem = { title: string; href: string };
type PageValues = {
  about: { title: string; description: string; image?: string };
  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
    title: string;
    description: string;
    image?: string;
  };
};
type FooterValues = {
  brandTitle: string;
  description: string;
  quickLinksTitle: string;
  customerLinksTitle: string;
  contactTitle: string;
  quickLinks: LinkItem[];
  customerLinks: LinkItem[];
  managerCredit: string;
  designerCredit: string;
};
type CategoryPage = {
  categorySlug: string;
  subcategorySlug: string;
  categoryName: string;
  title: string;
  description: string;
  image: string;
  phone: string;
  isCategoryArticle?: boolean;
};
type Props = {
  pages: PageValues;
  footer: FooterValues;
  categoryPages: CategoryPage[];
  section: "pages" | "category-pages";
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10";
const textAreaClass =
  "w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-sm outline-none focus:border-[#2563EB]";

function TextField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 4,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111827]">
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          required={required}
          className={textAreaClass}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className={inputClass}
        />
      )}
    </label>
  );
}

function ImagePicker({
  image,
  onChange,
}: {
  image?: string;
  onChange: (file: File | undefined) => void;
}) {
  const [fileName, setFileName] = useState("");

  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111827]">
      تصویر
      <span className="flex min-h-14 cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#93C5FD] bg-[#EFF6FF] px-3 text-center text-sm text-[#2563EB]">
        {fileName || "انتخاب تصویر (حداکثر ۵ مگابایت)"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setFileName(file?.name ?? "");
            onChange(file);
          }}
          className="sr-only"
        />
      </span>
      {image ? (
        <Image
          src={image}
          alt="تصویر فعلی"
          width={240}
          height={140}
          unoptimized
          className="max-h-36 w-fit rounded-xl border border-[#E7E5E4] bg-[#FFF7ED] object-contain p-2"
        />
      ) : null}
    </label>
  );
}

export default function ContentManagement({
  pages: initialPages,
  footer: initialFooter,
  categoryPages,
  section,
}: Props) {
  const [pages, setPages] = useState(initialPages);
  const [footer, setFooter] = useState(initialFooter);
  const [editableCategoryPages, setEditableCategoryPages] = useState(categoryPages);
  const [aboutImage, setAboutImage] = useState<File>();
  const [contactImage, setContactImage] = useState<File>();
  const [selectedKey, setSelectedKey] = useState(
    categoryPages[0]
      ? `${categoryPages[0].categorySlug}/${categoryPages[0].subcategorySlug}`
      : "",
  );
  const [categoryImage, setCategoryImage] = useState<File>();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const selectedCategoryPage = editableCategoryPages.find(
    (page) => `${page.categorySlug}/${page.subcategorySlug}` === selectedKey,
  );
  const updateCategoryPage = (
    field: "title" | "description" | "phone",
    value: string,
  ) => {
    if (!selectedCategoryPage) return;
    setEditableCategoryPages((current) => current.map((page) =>
      page.categorySlug === selectedCategoryPage.categorySlug &&
      page.subcategorySlug === selectedCategoryPage.subcategorySlug
        ? { ...page, [field]: value }
        : page,
    ));
  };

  const send = async <T,>(url: string, body: FormData | object): Promise<T> => {
    const isFormData = body instanceof FormData;
    const response = await fetch(url, {
      method: "PATCH",
      ...(isFormData ? { body } : {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    });
    if (!response.ok) {
      const result = await response.json() as { error?: string };
      throw new Error(result.error || "ذخیره اطلاعات انجام نشد.");
    }
    return await response.json() as T;
  };

  const savePage = async (
    page: "about" | "contact",
    values: PageValues["about"] | PageValues["contact"],
    image?: File,
  ) => {
    setSaving(true);
    setNotice("");
    setErrorMessage("");
    try {
      if (image) {
        const formData = new FormData();
        formData.set("page", page);
        for (const [key, value] of Object.entries(values)) {
          if (typeof value === "string") formData.set(key, value);
        }
        formData.set("image", image);
        const updatedPages = await send<PageValues>("/api/admin?resource=pages", formData);
        setPages(updatedPages);
      } else {
        const updatedPages = await send<PageValues>("/api/admin?resource=pages", { page, values });
        setPages(updatedPages);
      }
      setNotice("اطلاعات صفحه ذخیره شد.");
      if (page === "about") setAboutImage(undefined);
      else setContactImage(undefined);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "ذخیره اطلاعات ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  const saveFooter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setErrorMessage("");
    try {
      const updatedFooter = await send<FooterValues>("/api/admin?resource=footer", { values: footer });
      setFooter(updatedFooter);
      setNotice("تنظیمات فوتر ذخیره شد.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "ذخیره فوتر ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  const saveCategoryPage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCategoryPage) return;
    setSaving(true);
    setNotice("");
    setErrorMessage("");
    const formData = new FormData(event.currentTarget);
    formData.set("categorySlug", selectedCategoryPage.categorySlug);
    formData.set("subcategorySlug", selectedCategoryPage.subcategorySlug);
    formData.set("title", selectedCategoryPage.title);
    formData.set("description", selectedCategoryPage.description);
    formData.set("phone", selectedCategoryPage.phone);
    if (categoryImage) formData.set("image", categoryImage);
    try {
      const result = await send<{ page: CategoryPage }>("/api/admin?resource=category-pages", formData);
      setEditableCategoryPages((current) => current.map((page) =>
        page.categorySlug === result.page.categorySlug &&
        page.subcategorySlug === result.page.subcategorySlug
          ? result.page
          : page,
      ));
      setNotice("جزئیات دسته‌بندی ذخیره شد.");
      setCategoryImage(undefined);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "ذخیره صفحه دسته‌بندی ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  const updateLink = (
    key: "quickLinks" | "customerLinks",
    index: number,
    field: keyof LinkItem,
    value: string,
  ) => {
    setFooter((current) => ({
      ...current,
      [key]: current[key].map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link,
      ),
    }));
  };

  return (
    <div className="grid gap-5">
      {notice ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p> : null}
      {errorMessage ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p> : null}

      {section === "pages" ? <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h2 className="mb-5 text-lg font-extrabold text-[#111827]">مدیریت صفحه درباره ما</h2>
          <div className="grid gap-4">
            <TextField label="عنوان اصلی" value={pages.about.title} required onChange={(title) => setPages((current) => ({ ...current, about: { ...current.about, title } }))} />
            <TextField label="توضیحات" value={pages.about.description} multiline rows={5} onChange={(description) => setPages((current) => ({ ...current, about: { ...current.about, description } }))} />
            <ImagePicker image={pages.about.image} onChange={setAboutImage} />
            <button type="button" disabled={saving} onClick={() => void savePage("about", pages.about, aboutImage)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white disabled:opacity-60">
              <Save size={17} /> ذخیره درباره ما
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h2 className="mb-5 text-lg font-extrabold text-[#111827]">مدیریت صفحه تماس با ما</h2>
          <div className="grid gap-4">
            <TextField label="عنوان" value={pages.contact.title} required onChange={(title) => setPages((current) => ({ ...current, contact: { ...current.contact, title } }))} />
            <TextField label="توضیحات" value={pages.contact.description} multiline onChange={(description) => setPages((current) => ({ ...current, contact: { ...current.contact, description } }))} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="شماره تماس" type="tel" value={pages.contact.phone} required onChange={(phone) => setPages((current) => ({ ...current, contact: { ...current.contact, phone } }))} />
              <TextField label="ایمیل" type="email" value={pages.contact.email} onChange={(email) => setPages((current) => ({ ...current, contact: { ...current.contact, email } }))} />
              <TextField label="نشانی" value={pages.contact.address} onChange={(address) => setPages((current) => ({ ...current, contact: { ...current.contact, address } }))} />
              <TextField label="ساعات پاسخ‌گویی" value={pages.contact.hours} onChange={(hours) => setPages((current) => ({ ...current, contact: { ...current.contact, hours } }))} />
            </div>
            <ImagePicker image={pages.contact.image} onChange={setContactImage} />
            <button type="button" disabled={saving} onClick={() => void savePage("contact", pages.contact, contactImage)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white disabled:opacity-60">
              <Save size={17} /> ذخیره تماس با ما
            </button>
          </div>
        </section>
      </div> : null}

      {section === "pages" ? <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-5 text-lg font-extrabold text-[#111827]">مدیریت فوتر</h2>
        <form onSubmit={saveFooter} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="نام فروشگاه در فوتر" value={footer.brandTitle} onChange={(brandTitle) => setFooter({ ...footer, brandTitle })} />
            <TextField label="متن معرفی فروشگاه" value={footer.description} multiline onChange={(description) => setFooter({ ...footer, description })} />
            <TextField label="عنوان بخش پیوندهای سریع" value={footer.quickLinksTitle} onChange={(quickLinksTitle) => setFooter({ ...footer, quickLinksTitle })} />
            <TextField label="عنوان بخش خدمات مشتریان" value={footer.customerLinksTitle} onChange={(customerLinksTitle) => setFooter({ ...footer, customerLinksTitle })} />
            <TextField label="عنوان بخش ارتباط" value={footer.contactTitle} onChange={(contactTitle) => setFooter({ ...footer, contactTitle })} />
            <TextField label="متن اعتبار مدیر" value={footer.managerCredit} onChange={(managerCredit) => setFooter({ ...footer, managerCredit })} />
            <TextField label="متن اعتبار طراح" value={footer.designerCredit} onChange={(designerCredit) => setFooter({ ...footer, designerCredit })} />
          </div>
          {(["quickLinks", "customerLinks"] as const).map((key) => (
            <div key={key} className="grid gap-3 rounded-xl border border-[#E7E5E4] p-4">
              <h3 className="font-bold text-[#292524]">{key === "quickLinks" ? "پیوندهای سریع" : "پیوندهای خدمات مشتریان"}</h3>
              {footer[key].map((link, index) => (
                <div key={`${key}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
                  <input aria-label="عنوان پیوند" value={link.title} onChange={(event) => updateLink(key, index, "title", event.target.value)} className={inputClass} />
                  <input aria-label="نشانی پیوند" value={link.href} onChange={(event) => updateLink(key, index, "href", event.target.value)} className={inputClass} dir="ltr" />
                  <button type="button" aria-label="حذف پیوند" onClick={() => setFooter((current) => ({ ...current, [key]: current[key].filter((_, linkIndex) => linkIndex !== index) }))} className="flex h-11 items-center justify-center rounded-xl px-3 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setFooter((current) => ({ ...current, [key]: [...current[key], { title: "", href: "" }] }))} className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-[#BFDBFE] px-3 text-sm font-bold text-[#2563EB]">
                <Plus size={16} /> افزودن پیوند
              </button>
            </div>
          ))}
          <p className="text-xs leading-6 text-[#78716C]">شماره تلفن، نشانی، ایمیل و شبکه‌های اجتماعی فوتر از بخش تماس با ما و تنظیمات شبکه‌های اجتماعی خوانده می‌شوند.</p>
          <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white disabled:opacity-60">
            <Save size={17} /> ذخیره فوتر
          </button>
        </form>
      </section> : null}

      {section === "category-pages" ? <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-5 text-lg font-extrabold text-[#111827]">مدیریت مقاله‌های اسلایدر و صفحات دسته‌بندی</h2>
        {selectedCategoryPage ? (
          <form onSubmit={saveCategoryPage} className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-[#111827]">
              انتخاب مقاله یا صفحه
              <select value={selectedKey} onChange={(event) => { setSelectedKey(event.target.value); setCategoryImage(undefined); }} className={inputClass}>
                {editableCategoryPages.map((page) => (
                  <option key={`${page.categorySlug}/${page.subcategorySlug}`} value={`${page.categorySlug}/${page.subcategorySlug}`}>
                    {page.categoryName} — {page.isCategoryArticle ? "مقالهٔ اسلایدر" : page.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label={selectedCategoryPage.isCategoryArticle ? "عنوان مقاله" : "عنوان صفحه"} value={selectedCategoryPage.title} required onChange={(title) => updateCategoryPage("title", title)} />
              <TextField label="شماره تماس سفارش" type="tel" value={selectedCategoryPage.phone} required onChange={(phone) => updateCategoryPage("phone", phone)} />
            </div>
            <TextField label={selectedCategoryPage.isCategoryArticle ? "متن مقاله" : "توضیحات صفحه"} value={selectedCategoryPage.description} multiline rows={selectedCategoryPage.isCategoryArticle ? 12 : 5} required onChange={(description) => updateCategoryPage("description", description)} />
            <ImagePicker image={selectedCategoryPage.image} onChange={setCategoryImage} />
            <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-sm font-bold text-white disabled:opacity-60">
              <Save size={17} /> ذخیره {selectedCategoryPage.isCategoryArticle ? "مقاله" : "جزئیات دسته‌بندی"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-[#78716C]">هنوز دسته‌بندی نهایی برای مدیریت وجود ندارد.</p>
        )}
      </section> : null}
    </div>
  );
}
