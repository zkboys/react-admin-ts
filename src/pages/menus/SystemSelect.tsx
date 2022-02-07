import { Select } from 'antd';
import { useGet } from 'src/commons/ajax';

export default function SystemSelect(props: any) {
    const { placeholder = '请选择系统', ...others } = props;
    const { data: options } = useGet('/menu/queryTopMenus', { pageNum: 1, pageSize: 100000 }, [], {
        // @ts-ignore
        formatResult: (res) => {
            // @ts-ignore
            return (res.content || []).map((item) => {
                return {
                    meta: item,
                    value: item.id,
                    label: item.name,
                };
            });
        },
    });

    return <Select {...others} placeholder={placeholder} options={options}/>;
}
