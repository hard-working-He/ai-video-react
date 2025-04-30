import { Input as AntdInput } from 'antd';
import { useState } from 'react';

const Input = () => {
    const [value, setValue] = useState('1');
    return (
            <AntdInput value={value} onChange={(e) => setValue(e.target.value)} />

    )
}

export default Input;