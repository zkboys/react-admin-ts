import ajax from 'src/commons/ajax';
import {
    getLoginUser,
    isLoginPage,
    formatMenus,
    getContainerId,
    menu,
} from '@ra-lib/admin';
import { isNoAuthPage } from 'src/commons';
import { IS_SUB } from 'src/config';
import { subApp } from "src/interfaces";

/**
 * 获取菜单
 */
let __CACHE: any;

export async function getMenuData(): Promise<menu[]> {
    // 非登录页面，不加载菜单
    if (isNoAuthPage()) return [];

    // 作为子应用，不加载
    if (IS_SUB) return [];

    // 获取服务端数据，并做缓存，防止多次调用接口
    return (__CACHE = __CACHE ||
        ajax
            .get('/authority/queryUserMenus', { userId: getLoginUser()?.id })
            // @ts-ignore
            .then((res: menu[]) => res.map((item) => ({ ...item, order: item.order ?? item.ord ?? item.sort })))
            .catch(() => []));

    // 前端硬编码菜单
    // return [
    //     {id: 1, title: '系统管理', order: 900, type: 1},
    //     {id: 2, parentId: 1, title: '用户管理', path: '/users', order: 900, type: 1},
    //     {id: 3, parentId: 1, title: '角色管理', path: '/roles', order: 900, type: 1},
    //     {id: 4, parentId: 1, title: '菜单管理', path: '/menus', order: 900, type: 1},
    // ];
}

/**
 * 获取系统菜单
 */
export async function getMenus(): Promise<menu[]> {
    // mock时，做个延迟处理，否则菜单请求无法走mock
    if (process.env.REACT_APP_MOCK) await new Promise((resolve) => setTimeout(resolve));

    const serverMenus = await getMenuData();
    const menus = serverMenus
        .filter((item) => !item.type || item.type === 1)
        .map((item) => {
            return {
                ...item,
                id: `${item.id}`,
                parentId: `${item.parentId}`,
            };
        });

    return formatMenus(menus);
}

/**
 * 获取用户收藏菜单
 */
export async function getCollectedMenus(): Promise<menu[]> {
    // 登录页面，不加载
    if (isLoginPage()) return [];

    // 作为子应用，不加载
    if (IS_SUB) return [];

    const loginUser = getLoginUser();
    const data: any = await ajax.get('/authority/queryUserCollectedMenus', { userId: loginUser?.id });
    // const data = [];

    const menus = data.filter((item: menu) => item.type === 1).map((item: menu) => ({ ...item, isCollectedMenu: true }));

    return formatMenus(menus);
}

/**
 * 保存用户收藏菜单
 * @param menuId
 * @param collected
 */
export async function saveCollectedMenu({ menuId, collected }: { menuId: string, collected: boolean }) {
    await ajax.post('/authority/addUserCollectMenu', { userId: getLoginUser()?.id, menuId, collected });
}

/**
 * 获取用户权限码
 */
export async function getPermissions(): Promise<string[]> {
    const serverMenus = await getMenuData();
    return serverMenus.filter((item) => item.type === 2).map((item) => item.code);
}

/**
 * 获取子应用配置
 */
export async function getSubApps(): Promise<subApp[]> {
    // 从菜单数据中获取需要注册的乾坤子项目
    const menuTreeData = (await getMenus()) || [];

    // 传递给子应用的数据
    const loginUser = getLoginUser();
    const props = {
        mainApp: {
            loginUser: loginUser,
            token: loginUser?.token,
        },
    };
    let result: subApp[] = [];
    const loop = (nodes: menu[]) =>
        nodes.forEach((node) => {
            const { _target, children } = node;
            if (_target === 'qiankun') {
                const { title, name, entry } = node;
                const container = `#${getContainerId(name)}`;
                const activeRule = `/${name}`;

                result.push({
                    title,
                    name,
                    entry,
                    container,
                    activeRule,
                    props,
                });
            }
            if (children?.length) loop(children);
        });
    loop(menuTreeData);

    return result;
}
