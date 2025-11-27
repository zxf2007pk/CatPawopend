进口 多铎 从 "./蜘蛛/视频/多多. js ";
进口 基本集 从 "./spider/video/baseset.js ";
进口 mogg 从 "./spider/video/mogg.js ";
进口 井磊 从 "./spider/video/leijing.js ";
进口 潘塔 从 "./spider/video/panta.js ";
进口 wogg 从 "./spider/video/wogg.js ";
进口 至真 从 "./spider/video/zhizhen.js ";
进口 _ 360巴 从 "./spider/video/_360ba.js ";
进口 即时通信软件 从 "./蜘蛛/视频/qq.js ";
进口 爱奇艺 从 "./spider/video/爱奇艺. js ";
进口 symx 从 "./spider/video/symx.js ";
进口 syjc 从 "./蜘蛛/视频/qq.js ";
进口 m3u8cj 从 "./spider/video/m3u8cj.js ";
进口 生活 从 "./spider/video/lifes . js ";
进口 结影石 从 "./spider/video/jieyingshi.js ";
进口 建片 从 "./spider/video/jianpian.js ";
进口 fenmei_live 从 "./spider/video/fenmei_live.js ";
进口 胡亚 从 "./spider/video/huya.js ";
进口 宇都 从 "./spider/video/douyu.js ";
进口 cntv 从 "./spider/video/cntv.js ";
进口 胆红素 从 "./spider/video/bili.js ";
进口 appys 从 "./spider/video/appys.js ";
进口 tgsou 从 "./spider/video/tgsou.js ";
进口 tgchannel 从 "./spider/video/tgchannel.js ";
进口 豆瓣 从 "./蜘蛛/视频/豆瓣. js ";
进口 推 从 "./spider/video/push.js;
进口 {getCache} 从 "./website/sites.js;

常数 蜘蛛 = [豆瓣, 多铎, mogg, 井磊, 潘塔, wogg, 至真, 建片, syjc, 即时通信软件, 爱奇艺, 胆红素, _ 360巴, 生活, fenmei_live, cntv, 胡亚, 宇都, m3u8cj, appys, syjc, tgchannel, tgsou, 基本集, 推];
常数 蜘蛛前缀 = /蜘蛛;

/**
*初始化路由器的功能。
 *
* @ param { Object } Fastify-Fastify实例
* @return {Promise<void>} -路由器初始化时解析的承诺
 */
出口 系统默认值 异步ˌ非同步(asynchronous) 功能 路由器(fastify) {
    //注册所有蜘蛛路由器
    蜘蛛.为每一个((蜘蛛；状似蜘蛛的物体；星形轮；十字叉；连接柄；十字头) => {
        常数 小路 = 蜘蛛前缀 + '/' + 蜘蛛；状似蜘蛛的物体；星形轮；十字叉；连接柄；十字头.自指的.键 + '/' + 蜘蛛；状似蜘蛛的物体；星形轮；十字叉；连接柄；十字头.自指的.类型;
        fastify.注册(蜘蛛；状似蜘蛛的物体；星形轮；十字叉；连接柄；十字头.美国石油学会(American Petroleum Institute), { 前缀: 小路 });
        蜘蛛；状似蜘蛛的物体；星形轮；十字叉；连接柄；十字头.支票?.(fastify)
        安慰.原木(注册蜘蛛: ' + 小路);
    });
    /**
* @api {get} /check检查
     */
    fastify.注册(
        /**
         *
         * @param {import('fastify').FastifyInstance} fastify
         */
        async (fastify) => {
            fastify.get(
                '/check',
                /**
                 * check api alive or not
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    reply.send({ run: !fastify.stop });
                }
            );
            const getConfig = () => {
                const config = {
                    video: {
                        sites: [],
                    },
                    read: {
                        sites: [],
                    },
                    comic: {
                        sites: [],
                    },
                    music: {
                        sites: [],
                    },
                    pan: {
                        sites: [],
                    },
                    color: fastify.config.color || [],
                };
                spiders.forEach((spider) => {
                    let meta = Object.assign({}, spider.meta);
                    meta.api = spiderPrefix + '/' + meta.key + '/' + meta.type;
                    meta.key = 'nodejs_' + meta.key;
                    const stype = spider.meta.type;
                    if (stype < 10) {
                        config.video.sites.push(meta);
                    } else if (stype >= 10 && stype < 20) {
                        config.read.sites.push(meta);
                    } else if (stype >= 20 && stype < 30) {
                        config.comic.sites.push(meta);
                    } else if (stype >= 30 && stype < 40) {
                        config.music.sites.push(meta);
                    } else if (stype >= 40 && stype < 50) {
                        config.pan.sites.push(meta);
                    }
                });
                return config
            }
            fastify.get(
                '/config',
                /**
                 * get catopen format config
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    const config = getConfig()
                    const sites = await getCache(_request.server)

                    const allSites = config.video.sites
                    const visitedMap = {}
                    const allSitesMap = {}
                    allSites.forEach(site => {
                        allSitesMap[site.key] = site
                    })
                    // 旧的取出来 过滤掉已失效的
                    const rs =[]
                    sites.forEach(site => {
                        visitedMap[site.key] = true
                        if (allSitesMap[site.key] && site.enable) {
                            rs.push(allSitesMap[site.key])
                        }
                    })
                    // 如果有新的站源 则追加到后面 默认启用
                    allSites.forEach(site => {
                        if (!visitedMap[site.key]) {
                            rs.push(site)
                        }
                    })
                    config.video.sites = rs

                    reply.send(config);
                }
            );
            fastify.get('/full-config', (_, reply) => {
                const config = getConfig()
                reply.send(config);
            })
        }
    );
}
