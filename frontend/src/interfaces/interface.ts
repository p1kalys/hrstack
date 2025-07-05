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
    rssSource?: string;
    rssLink?: string;
    isFromRss?: boolean;
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


export interface EventType {
    _id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    image?: string;
}

export interface EventCardProps {
    event: EventType;
}

export interface EventData {
    _id: string;
    title: string;
    description: string;
    location?: string;
    link?: string;
    physical: boolean;
    date: string;
    createdAt: string;
    isApproved: boolean;
}

export interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'update';
    initialData?: EventData;
    eventId?: string;
    onSuccess: () => void;
}

export interface EventTableProps {
    eventData: EventData;
    fetchEvents: () => void;
}
