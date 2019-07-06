<template>
  <div class='tinymce'>
    <editor id='tinymce' v-model='myValue' :init='init' @onClick="onClick"></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import { StingBase64 } from "@/utils/substring";

export default {
  name: 'tinymce',
  components: {
		Editor
	},
	props:{
		value: {
      type: String
    }
	},
  data () {  	
    return {
      init: {
        language_url: '/static/tinymce/zh_CN.js',    //语言路径
        language: 'zh_CN',  //语言
        skin_url: '/static/tinymce/skins/ui/oxide',
        height: 400,    //默认高度
        plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',   //添加需要的插件
        toolbar:   //工具栏      |分租      ，分列
          'bold italic underline strikethrough | fontsizeselect | forecolor backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
        branding: false,
        //menubar: false,  菜单栏
        images_upload_handler: (blobInfo, success, failure) => {
					let files = blobInfo.blob();
          let reader = new FileReader();
		      reader.readAsDataURL(files); // 读出 base64
		      reader.onloadend = () => {
		        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值        
		        let dataURL = reader.result;//base64       
						this.$api.upload.UploadImgByBase64(StingBase64(dataURL),2)
				  	.then( data => {
				  		success(process.env.BASE_API.split("api")[0]+data)
				  	})
				  	.catch(() => {
			        failure('上传失败')
			      })
		      }
		    }
      },
      myValue: this.value
    }
  },
   methods: {
    onClick() {
      this.$emit('onClick',this.myValue)
    },
  },
  mounted () {
    tinymce.init({})
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('onClick', newValue)
    }
  }
}
</script>

<style>
/*
newdocument			核心	创建新文档
bold						核心	加粗
italic					核心	斜体
underline				核心	下划线
strikethrough		核心	删除线
alignleft				核心	居左
aligncenter			核心	居中
alignright			核心	居右
alignjustify		核心	两端对齐
alignnone				核心	清除
styleselect			核心	格式选择下拉框(缩进、行高)
formatselect		核心	段落选择下拉框(段落、标题)
fontselect			核心	字体选择下拉框
fontsizeselect	核心	字号选择下拉框
cut							核心	剪切
copy						核心	复制
paste						核心	粘贴
outdent					核心	减少缩进
indent					核心	增加缩进
blockquote			核心	引用
undo						核心	撤消
redo						核心	恢复
removeformat		核心	清除格式
subscript				核心	下标
superscript			核心	上标
visualaid				核心	网格线
insert					核心	插入的集合按钮
hr							hr	水平线
bullist					lists	无序列表
numlist					lists	有序列表
link						link	添加和修改链接
unlink					link	去除链接格式
openlink				link	打开选中链接
image						image	添加和修改图片
charmap					charmap	特殊符号
pastetext				paste	粘贴纯文本
print						print	打印
preview					preview	预览
anchor					anchor	作者
pagebreak				pagebreak	分页符
spellchecker		spellchecker	拼写检查
searchreplace		searchreplace	搜索
visualblocks		visualblocks	隐藏块级区域开关
visualchars			visualchars	隐藏字符串开关.
code						code	代码
help						help	帮助
fullscreen			fullscreen	全屏
insertdatetime	insertdatetime	插入时间
media						media	插入/编辑媒体文件
nonbreaking			nonbreaking	不间断空格
save						save	保存(ajax)
cancel					save	取消保存
rotateleft			imagetools	逆时针旋转当前图像
rotateright			imagetools	顺时针旋转当前图像
flipv						imagetools	垂直翻转当前图像
fliph						imagetools	水平翻转当前图像
editimage				imagetools	打开图像编辑对话框
imageoptions		imagetools	打开图像配置对话框
fullpage				fullpage	完整页面的文档属性
ltr							directionality	设置编写方向从左到右
rtl							directionality	设置编写方向从右到左
emoticons				emoticons	表情
template				template	插入模板
forecolor				textcolor	文本颜色
backcolor				textcolor	背景颜色
restoredraft		restoredraft	恢复到最新的自动保存草稿
insertfile			moxiemanager	引入文件
a11ycheck				a11ychecker	检查访问性
toc							toc	插入目录
quickimage			inlite	插入本地图像
quicktable			inlite	插入2X2的表格
quicklink				inlite	插入连接
table									table	插入/编辑表格
tabledelete						table	删除表格
tablecellprops				table	单元格属性
tablemergecells				table	合并单元格
tablesplitcells				table	拆分单元格
tableinsertrowbefore	table	在当前行之前插入一个新行
tableinsertrowafter		table	在当前行之后插入一个新行
tabledeleterow				table	删除当前行
tablerowprops					table	行属性
tablecutrow						table	剪切选定行
tablecopyrow					table	复制选定行
tablepasterowbefore		table	在当前行之前粘贴行
tablepasterowafter		table	在当前行之后粘贴行
tableinsertcolbefore	table	在当前列之前插入一个列
tableinsertcolafter		table	在当前列之后插入一个列.
tabledeletecol				table	删除当前列
*/

</style>