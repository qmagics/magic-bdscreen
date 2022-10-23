const Koa = require('koa');
const router = require('./router');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors());
app.use(router.routes());

app.listen(3000, () => {
    console.log('server is start on port 3000');
})