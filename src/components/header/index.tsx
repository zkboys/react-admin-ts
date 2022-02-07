import { useState } from 'react';
import { Space, Dropdown, Menu, Avatar } from 'antd';
import { DownOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { getColor, FullScreen } from '@ra-lib/admin';
import { IS_MOBILE } from 'src/config';
import config from 'src/commons/config-hoc';
import { toLogin } from 'src/commons';
import PasswordModal from './PasswordModal';
import { Proxy } from 'src/components';
import { loginUser } from 'src/interfaces';
import s from './style.module.less';

type Props = {
    /** 当前登录用户 */
    loginUser?: loginUser;
}

export default config({
    router: true,
})(function Header(props: Props) {
    const { loginUser = {} } = props;
    const [ passwordVisible, setPasswordVisible ] = useState(false);

    async function handleLogout() {
        try {
            // await props.ajax.post('/logout', null, {errorTip: false});
            alert('TODO 退出登录接口！');
        } finally {
            // 无论退出成功失败，都跳转登录页面
            toLogin();
        }
    }

    const menu = (
        <Menu>
            <Menu.Item key="modify-password" icon={<LockOutlined/>} onClick={() => setPasswordVisible(true)}>
                修改密码
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="logout" danger icon={<LogoutOutlined/>} onClick={handleLogout}>
                退出登录
            </Menu.Item>
        </Menu>
    );

    const { avatar, name = '' } = loginUser as loginUser;

    return (
        <Space
            className={s.root}
            size={16}
            style={{
                paddingRight: IS_MOBILE ? 0 : 12,
            }}
        >
            <Proxy className={s.action}/>

            {IS_MOBILE ? null : (
                <>
                    <div className={s.action}>
                        <FullScreen/>
                    </div>
                </>
            )}

            <Dropdown overlay={menu}>
                <div className={s.action}>
                    {avatar ? (
                        <Avatar size="small" className={s.avatar} src={avatar}/>
                    ) : (
                        <Avatar size="small" className={s.avatar} style={{ backgroundColor: getColor(name) }}>
                            {(name[0] || '').toUpperCase()}
                        </Avatar>
                    )}
                    {IS_MOBILE ? null : (
                        <>
                            <span className={s.userName}>{name}</span>
                            <DownOutlined/>
                        </>
                    )}
                </div>
            </Dropdown>
            <PasswordModal
                visible={passwordVisible}
                onCancel={() => setPasswordVisible(false)}
                onOk={() => setPasswordVisible(false)}
            />
        </Space>
    );
});
