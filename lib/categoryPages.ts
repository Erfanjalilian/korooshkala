import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  readCategories,
  readPages,
  writeJson,
  type Category,
  type CategorySubcategory,
} from "@/lib/store";

export type CategoryPageContent = {
  categorySlug: string;
  subcategorySlug: string;
  categoryName: string;
  title: string;
  description: string;
  image: string;
  phone: string;
  isCategoryArticle?: boolean;
};
type SavedCategoryPage = Pick<CategoryPageContent, "title" | "description" | "image" | "phone">;

export const CATEGORY_ARTICLE_SLUG = "article";

const categoryArticleDefaults: Record<
  string,
  Pick<SavedCategoryPage, "title" | "description">
> = {
  stainless: {
    title: "استیل؛ ترکیب ماندگار درخشش و استحکام",
    description:
      "استیل با ظاهر درخشان و دوام بالا، انتخابی کاربردی برای پروژه‌های صنعتی و ساختمانی است.\n\nدر این دسته‌بندی می‌توانید محصولات استیل را بررسی کنید و برای دریافت راهنمایی و اطلاع از موجودی با ما تماس بگیرید.",
  },
  "copper-alloys": {
    title: "مس؛ رسانای قدرت و نماد اصالت",
    description:
      "مس به‌دلیل رسانایی و ویژگی‌های کاربردی، جایگاه ویژه‌ای در صنایع مختلف دارد.\n\nمحصولات این دسته را بررسی کنید و برای انتخاب متناسب با نیاز پروژه و اطلاع از قیمت روز با ما در ارتباط باشید.",
  },
  polyamine: {
    title: "پلی‌آمید؛ استحکام و عملکرد برتر در صنعت",
    description:
      "پلی‌آمید با ترکیب استحکام و دوام، گزینه‌ای مناسب برای کاربردهای متنوع صنعتی است.\n\nبرای آشنایی با محصولات این دسته‌بندی، دریافت اطلاعات بیشتر و استعلام موجودی با کارشناسان ما تماس بگیرید.",
  },
};

const categoryPageKey = (categorySlug: string, subcategorySlug: string) =>
  `${categorySlug}/${subcategorySlug}`;

function findLeafPath(
  items: CategorySubcategory[],
  slug: string,
  parents: string[] = [],
): string[] | null {
  for (const item of items) {
    const path = [...parents, item.name];
    if (item.slug === slug) return item.items?.length ? null : path;

    if (item.items?.length) {
      const nestedPath = findLeafPath(item.items, slug, path);
      if (nestedPath) return nestedPath;
    }
  }

  return null;
}

function findCategoryPagePath(
  categories: Category[],
  categorySlug: string,
  subcategorySlug: string,
) {
  const category = categories.find((item) => item.slug === categorySlug);
  if (!category?.image) return null;
  if (subcategorySlug === CATEGORY_ARTICLE_SLUG) {
    return categoryArticleDefaults[categorySlug] ? { category } : null;
  }
  if (!category.subcategories?.length) return null;

  for (const group of category.subcategories) {
    const path = findLeafPath(group.items, subcategorySlug);
    if (path) return { category, group, path };
  }
  return null;
}

function collectCategoryLeaves(category: Category) {
  const leaves: Array<{ groupName: string; path: string[]; slug: string }> = [];
  function collect(items: CategorySubcategory[], groupName: string, parents: string[] = []) {
    for (const item of items) {
      const path = [...parents, item.name];
      if (item.items?.length) collect(item.items, groupName, path);
      else leaves.push({ groupName, path, slug: item.slug });
    }
  }
  for (const group of category.subcategories ?? []) collect(group.items, group.name);
  return leaves;
}

export async function readCategoryPageRecords(): Promise<CategoryPageContent[]> {
  const [categories, pages] = await Promise.all([readCategories(), readPages()]);
  const savedPages = await readSavedCategoryPages();
  const records: CategoryPageContent[] = [];

  for (const category of categories) {
    if (!category.image) continue;
    const articleDefaults = categoryArticleDefaults[category.slug];
    if (articleDefaults) {
      const key = categoryPageKey(category.slug, CATEGORY_ARTICLE_SLUG);
      const savedArticle = savedPages[key];
      records.push({
        categorySlug: category.slug,
        subcategorySlug: CATEGORY_ARTICLE_SLUG,
        categoryName: category.name,
        ...articleDefaults,
        ...savedArticle,
        image: savedArticle?.image ?? category.image,
        phone: savedArticle?.phone ?? pages.contact.phone,
        isCategoryArticle: true,
      });
    }
    for (const leaf of collectCategoryLeaves(category)) {
      const key = categoryPageKey(category.slug, leaf.slug);
      const defaults: SavedCategoryPage = {
        title: [category.name, leaf.groupName, ...leaf.path].join("، "),
        description: `${[category.name, leaf.groupName, ...leaf.path].join("، ")} برای کاربردهای صنعتی و ساختمانی عرضه می‌شود. برای اطلاع از مشخصات، موجودی و قیمت روز، با کارشناسان فروش کوروش کالا تماس بگیرید.`,
        image: category.image,
        phone: pages.contact.phone,
      };
      records.push({
        categorySlug: category.slug,
        subcategorySlug: leaf.slug,
        categoryName: category.name,
        ...defaults,
        ...savedPages[key],
      });
    }
  }

  return records;
}

async function readSavedCategoryPages(): Promise<Record<string, SavedCategoryPage>> {
  try {
    return JSON.parse(
      await readFile(path.join(process.cwd(), "data", "category-pages.json"), "utf8"),
    ) as Record<string, SavedCategoryPage>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

export async function saveCategoryPage(
  categorySlug: string,
  subcategorySlug: string,
  values: SavedCategoryPage,
) {
  const categories = await readCategories();
  if (!findCategoryPagePath(categories, categorySlug, subcategorySlug)) return false;

  const pages = await readSavedCategoryPages();
  pages[categoryPageKey(categorySlug, subcategorySlug)] = values;
  await writeJson("category-pages.json", pages);
  return true;
}

export async function readCategoryPage(
  categorySlug: string,
  subcategorySlug: string,
): Promise<CategoryPageContent | null> {
  const pages = await readCategoryPageRecords();
  return pages.find(
    (page) => page.categorySlug === categorySlug && page.subcategorySlug === subcategorySlug,
  ) ?? null;
}

export async function readCategoryPageSlugs(): Promise<
  Array<{ categorySlug: string; subcategorySlug: string }>
> {
  return (await readCategoryPageRecords()).map(({ categorySlug, subcategorySlug }) => ({
    categorySlug,
    subcategorySlug,
  }));
}
