/**
 * @author Ropen
 * @class ArchTemplatePasswordForm
 * @extends Ext.Window
 * @description 公文模板表单
 */
ArchTemplatePasswordForm=Ext.extend(Ext.Window,{
	//内嵌FormPanel
	formPanel:null,
	//构造函数
	constructor:function(_cfg){
		if(_cfg==null){_cfg={};}
		Ext.apply(this,_cfg);
		//必须先初始化组件
		this.initComponents();
		ArchTemplatePasswordForm.superclass.constructor.call(this,{
			id:'ArchTemplatePasswordFormWin',
			layout:'fit',
			items:this.formPanel,
			modal:true,
			height:180,
			width:560,
			title:'修改密码',
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
				url : __ctxPath + '/archive/updatePasswordArchTemplate.do',
				id : 'ArchTemplatePasswordForm',
				defaults : {
					anchor : '98%,98%'
				},
				defaultType : 'textfield',
				items : [   {
								fieldLabel : '旧密码',
								name : 'OLDpassword',
								id : 'old',
								allowBlank:false
							},{
								fieldLabel : '新密码',
								id : 'new',
								allowBlank:false
							},{
								fieldLabel : '再次输入',
								name : 'password',
								id : 'new1',
								allowBlank:false
							},{
								name : 'Q_isGenre_L_EQ',
								value : this.isGenre,
								xtype : 'hidden'
							}
				]
			});
		//初始化功能按钮
		this.buttons=[{
				text : '保存',
				iconCls : 'btn-save',
				handler :this.save.createCallback(this.formPanel,this)
			}, {
				text : '重置',
				iconCls : 'btn-reset',
				handler :this.reset.createCallback(this.formPanel)
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
		var pass= Ext.getCmp('new').getValue();
		var pass1= Ext.getCmp('new1').getValue();
		if(pass!=pass1){
			Ext.ux.Toast.msg('操作信息','两次输入密码不一致');
			return false;
		}
		if (formPanel.getForm().isValid()) {
			formPanel.getForm().submit({
				method : 'POST',
				waitMsg : '正在提交数据...',
				success : function(fp, action) {
					var result = Ext.util.JSON
					.decode(action.response.responseText);
					Ext.ux.Toast.msg('操作信息', result.msg);
					if(result.success){
						window.close();
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