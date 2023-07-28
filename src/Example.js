import React, { useState, useEffect } from "react";
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import swt2 from './swt2.txt';
import isc from './isc.txt';
import swd from './swd.txt';
import sdn from './sdn301m.txt';

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
        const $isc = fetch(isc).then(swt => swt.text());
        const $swd = fetch(swd).then(swd => swd.text());
        const $sdn = fetch(sdn).then(sdn => sdn.text());

        Promise.all([$swt2,$isc,$swd,$sdn]).then(([swt2, isc,swd,sdn]) => {
            // const _swt2 = swt2.split('\n').map((text) => ({
            //     code: 'src1',
            //     text: text
            // }))
            // const _isc = isc.split('<split>').map((text) => ({
            //     code: '_isc',
            //     text: text
            // }))
            // const _swd = swd.split('<split>').map((text) => ({
            //     code: '_swd',
            //     text: text
            // }))
            const _sdn = sdn.split('<split>').map((text) => ({
                code: '_sdn',
                text: text
            }))
            const list = [..._sdn];
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
                                {`sub swt ${filter[index].code}`}>{filter[index].code}
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
