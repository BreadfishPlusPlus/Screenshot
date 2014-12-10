process.env.SCREENSHOT_PATH = __dirname + '/screenshots/';
process.env.USER_AGENT      = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
process.env.IMAGE_FORMAT    = 'png';
process.env.IMAGE_QUALITY   = '50';
process.env.PORT            = 3000;
process.env.DEBUG           = '*';
process.env.CACHE_TTL       = 60 * 1000;
process.env.WIDTH_THREAD    = 1280;
process.env.WIDTH_POST      = 1024;

require(__dirname + '/lib/webserver');