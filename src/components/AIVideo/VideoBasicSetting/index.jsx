import { Row, Col, Button, Dropdown } from 'antd';
import { CrownOutlined, ThunderboltOutlined,ClockCircleOutlined } from '@ant-design/icons';
import './index.css';
import { useBasicSettingsStore } from '../../../store/videoParams';

// 参数列表
/* const ratioList = [
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '3:4', value: '3:4' }
]; */

const frameRateList = [
  { key: '1', label: '30帧', value: '30' },
  { key: '2', label: '60帧', value: '60' }
];

const outputModeList = [
  { key: '1', label: '质量优先', value: 'quality' },
  { key: '2', label: '速度优先', value: 'speed' }
];
const durationList=[
  { key: '1', label: '5秒', value: '5' },
  { key: '2', label: '10秒', value: '10' ,disabled: true}
  
]

const BasicSetting = () => {
  const {
    frameRate,
    outputMode,
    duration,
    setFrameRate,
    setOutputMode,
    setDuration
  } = useBasicSettingsStore();

  // 通用渲染函数（增加当前值 & onChange）
  const renderDropdown = (items, icon, selectedValue, onChange) => {
    return (
      <Dropdown
        menu={{
          items: items.map(item => ({
            label: item.label,
            key: item.value,
            disabled: item.disabled
          })),
          onClick: ({ key }) => onChange(key)
        }}
        placement="top"
      >
        <Button className="paramButton" icon={icon} style={{ marginRight: '10px' }}>
          {items.find(item => item.value === selectedValue)?.label}
        </Button>
      </Dropdown>
    );
  };

  return (
    <div>
      <Row>
        <Col span={24}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {renderDropdown(frameRateList, <ThunderboltOutlined />, frameRate, setFrameRate)}
            {renderDropdown(outputModeList, <CrownOutlined />, outputMode, setOutputMode)}
            {renderDropdown(durationList, <ClockCircleOutlined />, duration, setDuration)}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BasicSetting;
