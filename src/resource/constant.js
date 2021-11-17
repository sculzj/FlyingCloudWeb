/**
 * 该文件定义了常量
 */

export const COLORS= {theme_color:'rgb(24,144,255)',secunda_color:'rgb(77,169,255)',danger_color:'rgb(255,77,79)',line_color:'rgb(277,277,277)',dark_color:'#001529'};
export const TITLE_ONE='一站办公';
export const TITLE_TWO='云边协同';
export const TITLE_THREE='千企互联';
export const TITLE_FOUR='按需付费';
export const TITLE_FIVE='安全高效';
export const DESCRIBE_ONE = '飞云办公集成了日常OA、商务邮箱、快文系统、即时通讯、流程管理、财务报销、企业云盘、企业商旅等应用于一体，打造全新一站式办公体验。' +
    '只需要一次登录，即可使用全部服务，免去账号管理与重复登录的烦恼！';
export const DESCRIBE_TWO = '飞云办公支持windows、IOS、Andriod等多平台，所有数据均可上云，多端接入自动同步，随时随地自由办公，全量信息无缝流转。' +
    '将员工从空间及时间的枷锁中解放出来，轻松办公，愉悦工作。';
export const DESCRIBE_THREE = '飞云办公已成为上千家企业首选的解决方案，基于开放的理念，在确保数据独立与安全的前提下，打破传统模式中各个企业的' +
    '信息鸿沟，允许跨企业OA流转，降低企业之间的沟通成本，强化企业之间的协同作战。';
export const DESCRIBE_FOUR = '飞云办公采用模块化设计，易于解耦，各个功能模块之间即可相互独立，又可无缝对接，即插即用，企业可根据自身业务需求灵活订购业务功能。\n' +
    '与此同时，云架构帮助企业释放运维资源，允许企业聚焦生产经营。';
export const DESCRIBE_FIVE = '飞云办公基于数据灾备、数据容错机制，确保业务数据不丢失，是企业值得信赖的生产工具。'+
    '此外，坚持“响应即解决”的服务原则，为客户提供7*24小时不间断的点对点技术支持服务，覆盖入门教学、系统对接、系统故障等环节';
export const SHADECOLOR='rgba(133,133,133,0.8)';
export const DESCRIBE_OA='飞云办公集成了日常OA、商务邮箱、快文系统、即时通讯、流程管理、财务报销、企业云盘、企业商旅等应用于一体，打造全新一站式办公体验。' +
    '只需要一次登录，即可使用全部服务，免去账号管理与重复登录的烦恼！';

export const ACTIONS={SAVE_TOKEN:'savaTheToken',CLEAN_TOKEN:'cleanTheToken',SAVE_USERINFO:'saveTheUserInfo',CLEAN_USERINFO:'cleanTheUserInfo',SAVE_CODE:'saveTheCode',CLEAN_CODE:'cleanTheCode'};

export const KEYS={PERSONAL_ZONE:'personalZone'};

export const Status={waiting:"waiting",ready:"ready",success:"success",failed:"failed",refused:"refused",error: "error",overtime:"overtime",verifying:'validating'};

export const Code={success:200,error:500,refused: 401,overtime:408};

export const serverIP='http://127.0.0.1:3000';

export const SEX={MAN:1,WOMAN:2};

//定义增、删、查、改、复制等常用操作标识
export const OPERATE_TYPE={NEW:'CREAT',UPDATE:'edit',DELETE:'delete',SELECT:'search',COPY:'copy'};