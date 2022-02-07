import { useState, useEffect } from 'react';
import { getCurrentActiveSubApp } from 'src/qiankun';
import { isActiveApp, getContainerId } from '@ra-lib/admin';
import { getSubApps } from 'src/api';
import { subApp } from 'src/interfaces';
import config from 'src/commons/config-hoc';

export default config()(function SubApp() {
    const [ apps, setApps ] = useState<subApp[] | []>([]);
    const [ activeAppNames, setActiveAppNames ] = useState([]);
    useEffect(() => {
        (async () => {
            const apps = await getSubApps();
            setApps(apps);
        })();
    }, []);

    const pathname = window.location.pathname;
    useEffect(() => {
        (async () => {
            const app = await getCurrentActiveSubApp();
            // @ts-ignore
            if (app && !activeAppNames.includes(app.name)) {
                // @ts-ignore
                setActiveAppNames([ ...activeAppNames, app.name ]);
            }
        })();
    }, [ pathname, activeAppNames ]);

    return apps.map((app) => {
        const { name } = app;
        const isActive = isActiveApp(app);
        const style = {
            display: isActive ? 'block' : 'none',
        };

        // @ts-ignore
        if (!activeAppNames.includes(name)) return null;

        return <div key={name} id={getContainerId(name)} style={style}/>;
    });
});
