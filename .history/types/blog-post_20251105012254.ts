export type Category = {
  _id: string;
  name: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  postedBy?: string;
  mainImage?: { url: string };
  contentHtml: string;
  category?: { name: string; slug: string };
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
};
