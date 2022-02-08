import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { renderTableCheckbox, Table, filterTree } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { WITH_SYSTEMS } from 'src/config';

const WithCheckboxTable = renderTableCheckbox(Table);

@config()
export default class RoleSelectTable extends Component {
    static propTypes = {
        fitHeight: PropTypes.bool,
        otherHeight: PropTypes.number,
        getCheckboxProps: PropTypes.func,
        value: PropTypes.array, // 选中的节点
        onChange: PropTypes.func, // 选择节点时，触发
        fullValue: PropTypes.bool, // value是否是角色全部数据
    };

    static defaultProps = {
        value: [],
        onChange: () => void 0,
        fullValue: false,
    };

    state = {
        loading: false,
        dataSource: [], // table展示的角色数据，搜索时是roles子集
        roles: [], // 所有的角色数据
    };

    columns = [
        { title: '角色名', dataIndex: 'name', key: 'name' },
        { title: '描述', dataIndex: 'remark', key: 'remark' },
    ];

    componentDidMount() {
        (async () => {
            await this.handleSearch();
        })();
    }

    handleSearch = async () => {
        if (this.state.loading) return;

        try {
            this.setState({ loading: true });
            // @ts-ignore
            const res = await this.props.ajax.get('/role/queryEnabledRoles');

            let roles = res || [];
            if (WITH_SYSTEMS) {
                // @ts-ignore
                const systems = [];
                // @ts-ignore
                roles.forEach((item) => {
                    const { systemId, systemName } = item;
                    if (!systemId) return systems.push(item);

                    // @ts-ignore
                    let system = systems.find((sys) => sys.systemId === systemId);
                    if (!system) {
                        system = {
                            id: `systemId-${systemId}`,
                            systemId,
                            name: systemName,
                            type: 4,
                            children: [ item ],
                        };
                        systems.push(system);
                    } else {
                        system.children.push(item);
                    }
                });
                // @ts-ignore
                systems.sort((a, b) => (a.type < b.type ? -1 : 1));
                // @ts-ignore
                systems.forEach(({ children }) => {
                    if (!children) return;
                    // @ts-ignore
                    children.sort((a, b) => (a.type < b.type ? -1 : 1));
                });
                // @ts-ignore
                roles = systems;
            } else {
                // @ts-ignore
                roles = roles.filter((item) => item.type !== 2);
            }

            // @ts-ignore
            roles.sort((a, b) => (a.type < b.type ? -1 : 1));

            this.setState({ dataSource: [ ...roles ], roles, loading: false });
        } catch (e) {
            this.setState({ loading: false });
            throw e;
        }
    };

    // @ts-ignore
    handleSearchValue = (value) => {
        const { roles } = this.state;

        const dataSource = filterTree(roles, (node) => {
            const { name, remark } = node;
            return [ name, remark ].some((val) => {
                const lowerValue = (val || '').toLowerCase();
                return lowerValue.includes(value);
            });
        });

        this.setState({
            dataSource,
        });
    };

    // @ts-ignore
    handleChange = (e) => {
        // 防抖
        // @ts-ignore
        if (this.timer) clearTimeout(this.timer);

        // @ts-ignore
        this.timer = setTimeout(() => this.handleSearchValue(e.target.value), 300);
    };

    render() {
        const { dataSource, loading } = this.state;

        // @ts-ignore
        const { value, onChange, fullValue, disabled, getCheckboxProps = () => ({}), ...others } = this.props;

        return (
            <>
                <div style={{ padding: 8, display: 'flex', alignItems: 'center' }}>
                    <Input.Search
                        style={{ flex: 1 }}
                        allowClear
                        placeholder="输入关键字进行搜索"
                        onSearch={this.handleSearchValue}
                        onChange={this.handleChange}
                    />
                </div>
                <WithCheckboxTable
                    showHeader={true}
                    size="small"
                    rowSelection={{
                        getCheckboxProps,
                        // @ts-ignore
                        selectedRowKeys: fullValue ? (value || []).map((item) => item.id) : value,
                        // @ts-ignore
                        onChange: (selectedRowKeys, selectedRows) =>
                            onChange(fullValue ? selectedRows : selectedRowKeys),
                    }}
                    loading={loading}
                    columns={this.columns}
                    dataSource={dataSource}
                    pagination={false}
                    rowKey="id"
                    {...others}
                />
            </>
        );
    }
}
