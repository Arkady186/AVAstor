import scrape from 'website-scraper';

const run = async () => {
  try {
    await scrape({
      urls: ['https://kzn.feelday.ru/'],
      directory: 'client/public/feelday',
      recursive: true,
      maxDepth: 2,
      urlFilter: (url) => url.startsWith('https://kzn.feelday.ru'),
      filenameGenerator: 'bySiteStructure',
      requestConcurrency: 8,
      sources: [
        { selector: 'img', attr: 'src' },
        { selector: 'link[rel="stylesheet"]', attr: 'href' },
        { selector: 'script', attr: 'src' },
        { selector: 'source', attr: 'src' },
        { selector: 'video', attr: 'src' }
      ]
    });
    console.log('FEELDAY site mirrored into client/public/feelday');
  } catch (err) {
    console.error('Scrape failed:', err);
    process.exit(1);
  }
};

run();


