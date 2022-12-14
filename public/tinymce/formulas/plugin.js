// 3、在formulas文件夹下新建plugin.js和plugin.min.js，写入以下代码，两个文件代码一样即可
// import api from '@/api/api.js'
// 适配 Nginx 反向代理
const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API
tinymce.PluginManager.add('formulas', function(editor, url) {
  var pluginName='公式';
  //配置文件引入路径,根据自己项目来,我这里引入的api.editorUrl=http://192.168.1.171/apib
  //需要说明的是iframe1所代表的页面地址在线下跑的时候需能够访问，否则访问不了会默认展示至项目首页
  // var iframe1 = api.editorUrl+'tinymce/formulas/formulas.html';
  console.log('公式地址',baseUrl.replaceAll(8001,8013))
  var iframe1 = baseUrl.replaceAll(8001,8013)+'/tinymce/formulas/formulas.html';
  var openDialog = function () {
    return editor.windowManager.openUrl({
      title: pluginName,
      size: 'large',
      url:iframe1,
      buttons: [
        {
          type: 'cancel',
          text: 'Close'
        },
        // {
        // 	type: 'custom',
        // 	text: 'Save',
        // 	name: 'save',
        // 	primary: true
        // },
      ],
    });
  };

  // 注册一个工具栏按钮名称
  editor.ui.registry.addButton('formulas', {
    text: pluginName,
    onAction: function () {
      openDialog();
    }
  });

  // 注册一个菜单项名称 menu/menubar
  editor.ui.registry.addMenuItem('formulas', {
    text: pluginName,
    onAction: function() {
      openDialog();
    }
  });

  return {
    getMetadata: function () {
      return  {
        //插件名和链接会显示在“帮助”→“插件”→“已安装的插件”中
        name: "Example plugin",//插件名称
        url: "http://exampleplugindocsurl.com", //作者网址
      };
    }
  };
});
