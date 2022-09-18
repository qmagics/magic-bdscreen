import { defineComponent } from "vue";
import config from '@/config';
import logo from '@/assets/logo.svg';

export default defineComponent({
    setup: (props) => {
        return () => {
            return <div class="editor-header">
                <div class="editor-header-logo">
                    <img src={logo} />
                    <span>{config.title}</span>
                </div>
                <div class="editor-header-toolbar">
                    <div>
                        <el-button type="success">预览</el-button>
                        <el-button type="primary">保存</el-button>
                    </div>
                </div>
            </div>
        }
    },
})

