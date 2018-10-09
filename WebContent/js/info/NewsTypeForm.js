/**
 * @author
 * @createtime
 * @class NewsTypeForm
 * @extends Ext.Window
 * @description NewsTypeForm表单
 * @company 宏天软件
 */

NewsTypeForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		NewsTypeForm.superclass.constructor.call(this, {
					items:this.formPanel,
					id : 'newsTypeFormWin',
					border : false,
					title: '新闻类型',
			        iconCls:'menu-news_type',
			        width: 320,
			        height:120,
			        layout: 'fit',
			        modal:true,
			        plain:true,
			        buttonAlign:'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.initUI();
		this.buttons = [{
            text: '保存',
            iconCls:'btn-save',
            scope : this,
            handler:function(){
            	var newsTypeGrid = Ext.getCmp('NewsTypeGrid');
            	var type = Ext.getCmp('typeTree');
            	if(this.formPanel.getForm().isValid()){
            		this.formPanel.getForm().submit({
            			waitMsg:'正在提交新闻类型信息',
			            success: function(formPanel, o){
            				Ext.ux.Toast.msg('操作信息','添加新闻类型成功！')
            				Ext.getCmp('newsTypeFormWin').close();
            				if(newsTypeGrid!=null){
            					newsTypeGrid.getStore().reload();
            				}
            				if(type!=null){type.root.reload();}
            				
            			}
            		});
            	}
            }
        },{
            text: '取消',
            iconCls:'btn-cancel',
            handler:function(){
            	Ext.getCmp('newsTypeFormWin').close();
            }
        }
        ]
	}
});

NewsTypeForm.prototype.initUI=function(){
this.formPanel = new Ext.form.FormPanel({
			id:'newsTypeForm',
	        frame : false,
	        layout:'form',
	        bodyStyle:'padding:5px;',
	        defaultType: 'textfield',
	        url:__ctxPath+'/info/addNewsType.do',
	        defaultType: 'textfield',
	        labelWidth:80,
	        reader: new Ext.data.JsonReader(
	        	{
	        	root:'data'
	        	},
	        	[
	        		 {name:'typeId',mapping:'typeId'}
	        		,{name:'typeName',mapping:'typeName'}
	        		,{name:'sn',mapping:'sn'}
	        	]
	        	),
	        defaults: {
	            //anchor: '95%,95%',
	            allowBlank: false,
	            selectOnFocus: true,
	            msgTarget: 'side'
	        },
	        items: [
		        {
		        	xtype:'hidden'
		        	,name:'newsType.typeId'
		        	,id:'typeId'
		        }
	            ,{
	            	fieldLabel:'类型名称',
	            	name:'newsType.typeName',
	            	blankText: '类型名称为必填!',
	            	id:'typeName'
	            }
	            ,{
	            	xtype:'hidden',
	            	name:'newsType.sn',
	            	id:'sn'
	            }
	        	]
	    });//end of the formPanel
}
