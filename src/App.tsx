import React, { useState, useEffect, useCallback } from 'react';
import { ConfigProvider } from 'antd';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { ComponentProvider, Loading, getLoginUser, setLoginUser /*queryParse,*/, menu } from '@ra-lib/admin';
import { isNoAuthPage } from 'src/commons';
import AppRouter from './router/AppRouter';
import { APP_NAME, CONFIG_HOC, IS_MOBILE } from 'src/config';
import { store } from 'src/models';
import { saveCollectedMenu, getCollectedMenus, getMenus, getPermissions } from 'src/api';
import theme from 'src/theme.less';
import './App.less';

// 设置语言
moment.locale('zh-cn');

// 设置 Modal、Message、Notification rootPrefixCls。
ConfigProvider.config({
    prefixCls: theme.antPrefix,
});

export default function App(props: any) {
    const { children } = props;
    const [ loading, setLoading ] = useState(true);
    const [ menus, setMenus ] = useState<menu[] | [] | null>([]);
    const [ collectedMenus, setCollectedMenus ] = useState<menu[] | [] | null>(CONFIG_HOC.showCollectedMenus ? [] : null);
    const handleMenuCollect = useCallback(async (menu, collected) => {
        await saveCollectedMenu({ menuId: menu.id, collected });

        const collectedMenus = await getCollectedMenus();
        setCollectedMenus(collectedMenus);
    }, []);

    // 一些初始化工作
    useEffect(() => {
        // 不需要登录的页面不请求
        if (isNoAuthPage()) return setLoading(false);

        // 获取用户菜单、权限等
        (async () => {
            try {
                let loginUser = getLoginUser();
                if (!loginUser) {
                    // 嵌入iframe等方式，没有经过登录页面，没有设置loginUser，需要请求loginUser
                    // 发请求，获取loginUser
                    // LoginUser = await api.getLoginUser();
                    //
                    // const {token} = queryParse();
                    // if (token) LoginUser.token = token;
                    //
                    // setLoginUser(LoginUser);

                    return setLoading(false);
                }

                // 用户收藏菜单 使用then catch 防止报错后续接口阻断
                // 用户收藏菜单
                if (CONFIG_HOC.showCollectedMenus) {
                    await getCollectedMenus().then(setCollectedMenus).catch(console.error);
                }

                // 获取用户菜单
                await getMenus().then(setMenus).catch(console.error);

                // 获取用户权限
                await getPermissions()
                    .then((res) => {
                        loginUser.permissions = res;
                        setLoginUser(loginUser);
                    })
                    .catch(console.error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // 加载完成后渲染，确保能拿到permissions等数据
    return (
        <Provider store={store}>
            <ConfigProvider locale={zhCN} prefixCls={theme.antPrefix}>
                <Helmet title={APP_NAME}/>
                {/* @ts-ignore */}
                <ComponentProvider
                    prefixCls={theme.raLibPrefix}
                    layoutPageOtherHeight={CONFIG_HOC.pageOtherHeight}
                    isMobile={IS_MOBILE}
                >
                    {loading ? (
                        <Loading progress={false} spin/>
                    ) : children ? (
                        children
                    ) : (
                        <AppRouter menus={menus} collectedMenus={collectedMenus} onMenuCollect={handleMenuCollect}/>
                    )}
                </ComponentProvider>
            </ConfigProvider>
        </Provider>
    );
}
