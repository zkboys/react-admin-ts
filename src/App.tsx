import React from 'react';
import logo from './logo.svg';
import { Button, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import s from './App.module.less';
import theme from 'src/theme.less';
import cn from 'classnames';

// 设置 Modal、Message、Notification rootPrefixCls。
ConfigProvider.config({
    prefixCls: theme.antPrefix,
});

function App() {
    return (
        <ConfigProvider locale={zhCN} prefixCls={theme.antPrefix}>
            <div className={cn(s.App, s.app2)}>
                <header className={cn(s.AppHeader, s.app2)}>
                    <img src={logo} className={s.AppLogo} alt="logo"/>
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className={s.AppLink}
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    <Button type={"primary"}>antd</Button>
                </header>
            </div>
        </ConfigProvider>
    );
}

export default App;
