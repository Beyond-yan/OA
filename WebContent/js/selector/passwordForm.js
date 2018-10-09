/**
 * @author Ropen
 * @class passwordForm
 * @extends Ext.Window
 * @description 公文模板表单
 */
passwordForm=Ext.extend(Ext.Window,{
	//内嵌FormPanel
	formPanel:null,
	//构造函数
	constructor:function(_cfg){
		if(_cfg==null){_cfg={};}
		Ext.apply(this,_cfg);
		//必须先初始化组件
		this.initComponents();
		passwordForm.superclass.constructor.call(this,{
			id:'passwordFormWin',
			layout:'fit',
			items:this.formPanel,
			modal:true,
			height:180,
			width:560,
			title:'输入密码',
			iconCls : 'menu-archive-template',
			buttonAlign : 'center',
			buttons:this.buttons
		});
	},//end of the constructor
	//初始化组件
	initComponents:function(){
		this.formPanel=new Ext.FormPanel({
				layout : 'form',
				bodyStyle: 'padding:10px 10px 10px 10px',
				border:false,
				url : __ctxPath + '/archive/comparePasswordArchTemplate.do',
				id : 'passwordForm',
				defaults : {
					anchor : '98%,98%'
				},
				defaultType : 'textfield',
				items : [{
								fieldLabel : '用章密码',
								name : 'password',
								allowBlank:false
							},{
								name : 'ntkoSealPath',
								value : this.ntkoSealPath,
								xtype : 'hidden'
							}
				]
			});
		//初始化功能按钮
		this.buttons=[{
				text : '校验',
				iconCls : 'btn-save',
				handler :this.save.createCallback(this.formPanel,this)
			},{
				text : '取消',
				iconCls : 'btn-cancel',
				handler : this.cancel.createCallback(this)
			}];
	},//end of the initcomponents
	
	/**
	 * 重置
	 * @param {} formPanel
	 */
	reset:function(formPanel){
		formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * @param {} window
	 */
	cancel:function(window){
		window.close();
	},
	/**
	 * 保存记录
	 */
	save:function(formPanel,window){
		if (formPanel.getForm().isValid()) {
			formPanel.getForm().submit({
				method : 'POST',
				waitMsg : '正在提交数据...',
				success : function(fp, action) {
					var result = Ext.util.JSON.decode(action.response.responseText);
					Ext.ux.Toast.msg('操作信息', result.msg);
					if(result.success=='true'){
					 if (window.callback != null) {
						 window.close();
						 window.callback.call();
						}
					}
				},
				failure : function(fp, action) {
					//console.log(action.response.responseText);
					var msg=action.response.responseText;
					Ext.MessageBox.show({
								title : '操作信息',
								msg :msg,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
					window.close();
				}
			});
		}
	}//end of save
	
});