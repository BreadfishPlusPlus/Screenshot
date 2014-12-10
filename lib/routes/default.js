var template = require('fs').readFileSync(__dirname + '/default.html', {encoding: 'utf8'});

template = template.replace(/{{IMAGE_FORMAT}}/gmi, process.env.IMAGE_FORMAT)
                    .replace(/{{IMAGE_QUALITY}}/gmi, process.env.IMAGE_QUALITY)
                    .replace(/{{CACHE_TTL}}/gmi, process.env.CACHE_TTL)
                    .replace(/{{WIDTH_POST}}/gmi, process.env.WIDTH_POST)
                    .replace(/{{WIDTH_THREAD}}/gmi, process.env.WIDTH_THREAD);

module.exports = function(req, res){
    res.status(404).send(template);
};