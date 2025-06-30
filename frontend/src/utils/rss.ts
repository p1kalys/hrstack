import Parser from 'rss-parser';

type CustomFeedItem = {
    title?: string;
    link?: string;
    contentSnippet?: string;
    content?: string;
    pubDate?: string;
    author?: string;
    creator?: string;
    enclosure?: { url: string }; // fallback image
    'media:content'?: {
        $: {
            url: string;
            type?: string;
        };
    };
};

const parser: Parser<{}, CustomFeedItem> = new Parser({
    customFields: {
        item: [
            ['media:content', 'media:content'],
            ['creator', 'creator'],
        ],
    },
});

export const fetchExternalBlogs = async () => {
    const feed = await parser.parseURL('https://hr.economictimes.indiatimes.com/rss/topstories');

    return feed.items.map((item) => ({
        title: item.title ?? '',
        link: item.link ?? '',
        contentSnippet: item.contentSnippet ?? item.content ?? '',
        pubDate: item.pubDate ?? '',
        author: item.creator ?? item.author ?? '',
        image: item['media:content']?.$.url ?? item.enclosure?.url ?? '',
    }));
};
