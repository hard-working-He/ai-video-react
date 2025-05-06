import { Row, Col, Button, Input, Select, Slider } from 'antd';
import { useVideoParams } from '../../../store/videoParams';

const BasicSetting = () => {
  const { cogvideoConfigState, setCogvideState } = useVideoParams();
  return (
    <div>
      <Row>
        <Col span={12}>
          <Input placeholder="请输入视频描述" />
        </Col>
      </Row>
    </div>
  )
}

export default BasicSetting