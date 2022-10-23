const KoaRouter = require('koa-router');
const { sleep } = require('./utils');

const router = new KoaRouter();

router.get('/car/list', async (ctx) => {
    await sleep(1000);

    ctx.body = {
        code: 1,
        data: [
            {
                Brand: "奥迪",
                Name: "奥迪A7",
                Price: 568000
            },
            {
                Brand: "宝马",
                Name: "宝马5系",
                Price: 526000
            },
            {
                Brand: "本田",
                Name: "雅阁",
                Price: 213000
            }
        ]
    }
});

router.get('/car/list2', async (ctx) => {
    await sleep(1000);

    ctx.body = {
        code: 1,
        data: [
            {
                Brand: "保时捷",
                Name: "帕拉梅拉",
                Price: 1080000
            },
            {
                Brand: "奥迪",
                Name: "奥迪RS7",
                Price: 1420000
            },
            {
                Brand: "宝马",
                Name: "宝马M8",
                Price: 2180000
            }
        ]
    }
});

module.exports = router;