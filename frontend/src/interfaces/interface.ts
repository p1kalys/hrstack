interface Author {
    name: string,
    email: string,
}

export interface Blog {
    _id: string,
    title: string,
    description: string,
    category: string[],
    image?: string,
    createdAt: string,
    updatedAt: string,
    isPublished: boolean,
    subTitle: string,
    author: Author,
};

export interface BlogCardProps {
    blog: Blog;
};

export interface BlogComment {
    _id: string,
    blog: Blog,
    name: string,
    content: string,
    isApproved: boolean,
    createdAt: string,
    updatedAt: string,
}

export interface DashboardData {
    blogs: number;
    comments: number;
    drafts: number;
    recentBlogs: Blog[];
}

export interface TableProps {
    blog: Blog;
    fetchBlogs: () => void;
    index: number;
}

export interface CommentTableProps {
    comment: BlogComment;
    fetchComments: () => void;
}

export interface RssFeedItem {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    contentSnippet: string;
    guid: string;
    isoDate: string;
}

export interface RssFeed {
    title: string;
    description: string;
    link: string;
    language: string;
    items: RssFeedItem[];
}
