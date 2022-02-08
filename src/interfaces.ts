import { methodOptions } from "@ra-lib/ajax/es";

export type { LAYOUT_TYPE } from '@ra-lib/admin';

/** 当前登录用户 */
export type LoginUser = {
    id: any;
    name: string;
    token?: string;
    permissions?: string[];
    [key: string]: any;
}

/** 系统菜单  */
export type Menu = {
    id: any;
    text: string;
    [key: string]: any;
}

/** 配置 */
export type Config = {
    /** node 运行环境 */
    NODE_ENV?: string;
    /** 运行环境 */
    RUN_ENV?: string;
    /** 配置环境 */
    CONFIG_ENV?: number;
    /** 是否是开发环境 */
    IS_DEV?: boolean;
    /** 是否是生产环境 */
    IS_PROD?: boolean;
    /** 是否是测试环境 */
    IS_TEST?: boolean;
    /** 是否是预览环境 */
    IS_PREVIEW?: boolean;
    /** 是否作为子应用 */
    IS_SUB?: boolean;
    /** 是否是手机布局 */
    IS_MOBILE?: boolean;
    /** 不需要认证的路由白名单 */
    NO_AUTH_ROUTES?: string[];
    /** 应用名称 */
    APP_NAME?: string;
    /** 是否显示代理 */
    SHOW_PROXY?: boolean;
    /** ajax地址请求前缀 */
    AJAX_PREFIX?: string;
    /** ajax超时时间 */
    AJAX_TIMEOUT?: number;
    /** config高阶组件配置存储key */
    CONFIG_HOC_STORAGE_KEY?: string;
    /** 是否有系统概念 */
    WITH_SYSTEMS?: boolean;
    /** 路由的基础路径名称 */
    BASE_NAME?: string;
    /** 是否是hash路由 */
    HASH_ROUTER?: boolean;
    /** 静态文件地址前缀，用来配置cdn等 */
    PUBLIC_URL?: string;
}
/** config高阶组件 */
export type HocConfig = {
    /** 是否需要登录*/
    auth?: boolean;
    /** props是否注入ajax */
    ajax?: boolean;
    /** 是否与model连接 */
    connect?: boolean | any;
    /** 启用页面保持功能，无特殊需求，尽量不要开启 */
    keepAlive?: boolean;
    /** layout布局方式 LAYOUT_TYPE.SIDE_MENU LAYOUT_TYPE.TOP_MENU LAYOUT_TYPE.TOP_SIDE_MENU */
    layoutType?: string;
    /** 头部是否显示 */
    header?: boolean;
    /** 侧边栏是否显示 */
    side?: boolean;
    /** Tabs是否显示 */
    tab?: boolean;
    /** 持久化 Tabs记录 */
    persistTab?: boolean;
    /** tab左侧显示展开收起菜单按钮 */
    tabSideToggle?: boolean;
    /** tab右侧显示额外头部内容 */
    tabHeaderExtra?: boolean;
    /** tab高度 */
    tabHeight?: number;
    /** 页面头部是否显示 */
    pageHeader?: boolean;
    /** 头部主题 dark default */
    headerTheme?: string;
    /** 侧边栏主题 dark default */
    sideTheme?: string;
    /** logo主题 dark default */
    logoTheme?: string;
    /** 侧边栏展开宽度 */
    sideMaxWidth?: number;
    /** 头部显示菜单展开收起按钮 */
    headerSideToggle?: boolean;
    /** 保持菜单展开状态 */
    keepMenuOpen?: boolean;
    /** 左侧菜单是否收起 */
    sideCollapsed?: boolean;
    /** 是否显示搜索菜单 */
    searchMenu?: boolean;
    /** 是否显示我的收藏菜单 */
    showCollectedMenus?: boolean;
    /** PageContent组件 fitHeight 时，计算高度所用到的额外高度值，如果页面显示统一的footer，这里设置footer的高度 */
    pageOtherHeight: number,
}

/** ajax 对象 */
export type Ajax = {
    get<T>(url: string, data?: any, options?: methodOptions): Promise<T>;
    post<T>(url: string, data?: any, options?: methodOptions): Promise<T>;
    put<T>(url: string, data?: any, options?: methodOptions): Promise<T>;
    del<T>(url: string, data?: any, options?: methodOptions): Promise<T>;
    patch<T>(url: string, data?: any, options?: methodOptions): Promise<T>;
    download<T>(url: string, data?: any, options?: methodOptions): Promise<T>;
}

export type AjaxResult<T> = {
    data?: T,
    run?: any,
    error?: any,
    loading?: boolean
};

/** ajax hooks */
export type AjaxHook = {
    useGet<T>(url: string, data?: any, refreshDeps?: any, options?: any): AjaxResult<T>;
    usePost<T>(url: string, data?: any, refreshDeps?: any, options?: any): AjaxResult<T>;
    usePut<T>(url: string, data?: any, refreshDeps?: any, options?: any): AjaxResult<T>;
    useDel<T>(url: string, data?: any, refreshDeps?: any, options?: any): AjaxResult<T>;
    usePatch<T>(url: string, data?: any, refreshDeps?: any, options?: any): AjaxResult<T>;
    useDownload<T>(url: string, data?: any, refreshDeps?: any, options?: any): AjaxResult<T>;
}

/** 被config高阶组件包裹的组件props */
export type ConfigProps = {
    ajax: AjaxHook & Ajax,
    query?: any,
    action?: any,
    [key: string]: any,
}

/** 子应用 */
export interface SubApp {
    /** 应用名称 */
    name?: string;
    /** 应用标题 */
    title?: string;
    /** 应用入口 */
    entry?: string;
    /** 子应用容器 */
    container?: string;
    /** 子应用激活规则 */
    activeRule?: string;
    /** 子应用额外属性 */
    props?: any;
}

export type Option = {
    label: any,
    value: any,
    [key: string]: any,
}

/** options */
export type Options = {
    getTag?: any,
    getLabel?: any,
} & Array<Option>;
