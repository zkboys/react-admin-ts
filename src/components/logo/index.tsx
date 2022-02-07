import logo from './logo.png';
import { APP_NAME } from 'src/config';
import s from './style.module.less';

export default function Logo(props: any) {
    if (props.image) return logo;

    return (
        <div className={s.root}>
            <img src={logo} alt="logo"/>
            <h1>{APP_NAME}</h1>
        </div>
    );
}
