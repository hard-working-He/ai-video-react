import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import styles from "./index.module.css"
const InputBox = ({searchParams, setSearchParams}) => {
    return (
      <div className={styles.searchInputBox}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: '730px' }}>
            <textarea
              onChange={e => {
                setSearchParams(e.target.value);
              }}
              value={searchParams}
              placeholder="搜索🔍"
              rows="3"
              className={styles.inputTextarea}
            />
          </div>
          <div>
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<SendOutlined />}
              className={styles.sendButton}
            />
          </div>
        </div>
      </div>
    )
}   

export default InputBox;