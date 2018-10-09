/**
 * @author 
 * @createtime 
 * @class EndContractForm
 * @extends Ext.Window
 * @description ContractEvent表单
 * @company 宏天软件
 */
EndContractForm=Ext.extend(Ext.Window,{
	//内嵌FormPanel
	formPanel:null,
	//构造函数
	constructor:function(_cfg){
		Ext.applyIf(this,_cfg);
		//必须先初始化组件
		this.initUIComponents();
		EndContractForm.superclass.constructor.call(this,{
			id:'EndContractFormWin',
			layout:'fit',
			items:this.formPanel,
			modal:true,
			height:280,
			width:400,
			maximizable:true,
			title:'合同终止',
			buttonAlign : 'center',
			buttons:this.buttons
		});
	},//end of the constructor
	//初始化组件
	initUIComponents:function(){
		this.formPanel=new Ext.FormPanel({
				layout : 'form',
				bodyStyle: 'padding:10px 10px 10px 10px',
				border:false,
				url : __ctxPath + '/hrm/saveContractEvent.do',
				id : 'EndContractForm',
				defaults : {
					anchor : '98%,98%'
				},
				defaultType : 'textfield',
				items : [{
							name : 'contractEvent.eventId',
							id : 'eventId',
							xtype:'hidden',
							value : this.eventId == null ? '' : this.eventId
						},
						{
							fieldLabel : '记录名称',	
							name : 'contractEvent.eventName',
						    id : 'eventName'
						},
						{
							xtype : 'fieldset',
							title : '情况说明',
							layout : 'form',
							defaultType : 'textfield',
							items : [{
										fieldLabel : '终止理由',
										name : 'contractEvent.eventDescp',
									    id : 'eventDescp',
										xtype : 'textarea',
										anchor : '100%'
									}]
						}]
			});
		//加载表单对应的数据	
		if (this.eventId != null && this.eventId != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/hrm/getContractEvent.do?eventId='+ this.eventId,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
				},
				failure : function(form, action) {
				}
			});
		}
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
		if (formPanel.getForm().isValid()) {
			formPanel.getForm().submit({
				method : 'POST',
				waitMsg : '正在提交数据...',
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作信息', '成功保存信息！');
					var gridPanel=Ext.getCmp('ContractEventGrid');
					if(gridPanel!=null){
						gridPanel.getStore().reload();
					}
					window.close();
				},
				failure : function(fp, action) {
					Ext.MessageBox.show({
								title : '操作信息',
								msg : '信息保存出错，请联系管理员！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
					window.close();
				}
			});
		}
	}//end of save
	
});