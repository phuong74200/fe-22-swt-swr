import { faker } from '@faker-js/faker';
import React, { useState, useEffect, useCallback } from "react";
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import swt from './swt.txt';

var _List;

function setRef(ref) {
    _List = ref;
}

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
        fetch(swt)
            .then((response) => response.text())
            .then((textContent) => {
                const content = textContent.split('\n').map((text) => ({
                    code: 'swt',
                    text: text
                }
                ));
                setList(content);
                setFilter(content);
            });
    }, []);

    const onChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setFilter(() => {
            return list.filter((item) => {
                _List.recomputeRowHeights();
                _List.forceUpdate();
                return _search(value, item.text);
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
            <div style={style} key={key}>
                {filter[index] && (
                    <>
                        <span>{filter[index].code}</span> <span>{filter[index].text}</span>
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
                            ref={setRef}
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
