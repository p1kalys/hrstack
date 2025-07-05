import cron from 'node-cron';
import Parser from 'rss-parser';
import Blog from '../models/Blog';

const parser = new Parser();

const rssUrls = [
    'https://hr.economictimes.indiatimes.com/rss/topstories',
    'https://hr.economictimes.indiatimes.com/rss/workplace-4-0/talent-management',
    'https://hr.economictimes.indiatimes.com/rss/hrtech',
    'https://www.hrdive.com/feeds/news/',
];

cron.schedule('0 */3 * * *', async () => {
    try {
        await Blog.deleteMany({ isFromRss: true });
        console.log('[CRON] Cleared previous RSS blog entries.');

        const feeds = await Promise.all(rssUrls.map(url => parser.parseURL(url)));
        const combinedItems = feeds.flatMap(feed =>
            feed.items.map(item => ({
                title: item.title || 'Untitled',
                subTitle: item.creator || '',
                description: item.contentSnippet || item.content || '',
                category: item.categories || ['RSS'],
                image: item.enclosure?.url || '',
                isPublished: true,
                anonymous: true,
                author: '686888e703028fa2f37867e5',
                isFromRss: true,
                rssSource: item.link || '',
                createdAt: new Date(item.isoDate || Date.now()),
            }))
        );

        await Blog.insertMany(combinedItems);

        console.log(`[CRON] Fetched and stored ${combinedItems.length} RSS blogs.`);
    } catch (error) {
        console.error('[CRON] RSS fetch failed:', error);
    }
});
