import React, { useState, useEffect } from "react";
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import swt2 from './swt2.txt';

const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 50
});

const _search = (str, pattern) => {
    const strs = str.split(' ').map((str) => str.trim().toLowerCase());
    let _pattern = pattern.toLowerCase().replace(/\s+/g, '');

    const matches = strs.reduce((pre, cur) => {
        if (_pattern.includes(cur)) return pre + 1;
        return pre;
    }, 0);

    return matches == strs.length
}

const Example = () => {
    const [search, setSearch] = useState('');
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState([]);

    useEffect(() => {
        const $swt2 = fetch(swt2).then(swt => swt.text());

        Promise.all([$swt2]).then(([swt2]) => {
            const _swt2 = swt2.split('<split>').map((text) => ({
                code: 'prn',
                text: text
            }))
            const list = _swt2;
            setList(list);
            setFilter(list);
        })
    }, []);

    const onChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setFilter(() => {
            return list.filter((item) => {
                return _search(e.target.value, item.text);
            });
        });
    }

    const rowRenderer = ({ index, isScrolling, key, style, parent }) => (
        <CellMeasurer
            key={key}
            cache={cache}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            <div style={{
                ...style,
                whiteSpace: 'nowrap',
                padding: 16
            }} key={key}>
                {filter[index] && (
                    <>
                        <div>
                            <span className=
                                {`sub ${filter[index].code}`}>{filter[index].code}
                            </span> <span>{filter[index].text}</span>
                        </div>
                    </>
                )}
            </div>
        </CellMeasurer>
    );

    return (
        <>
            <input type="text" value={search || ''} onChange={onChange} placeholder="Search" />
            <div className="table">
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            rowCount={filter.length}
                            width={width}
                            height={height}
                            deferredMeasurementCache={cache}
                            rowHeight={cache.rowHeight}
                            rowRenderer={rowRenderer}
                        />
                    )}
                </AutoSizer>
            </div>
        </>
    )
};

export default Example;
