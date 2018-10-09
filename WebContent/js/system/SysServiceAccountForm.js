/**
 * @author 
 * @createtime 
 * @class SysServiceAccountForm
 * @extends Ext.Window
 * @description SysServiceAccount表单
 * @company 捷达世软件
 */
SysServiceAccountForm = Ext.extend(Ext.Window, {
	//构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		//必须先初始化组件
		this.initUIComponents();
		SysServiceAccountForm.superclass.constructor.call(this, {
			id : 'SysServiceAccountFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 240,
			width : 500,
			maximizable : true,
			title : '服务账号详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, {
				text : '重置',
				iconCls : 'btn-reset',
				scope : this,
				handler : this.reset
			}, {
				text : '取消',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},//end of the constructor
	//初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			id : 'SysServiceAccountFormInfo',
			//id : 'SysServiceAccountForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'sysServiceAccount.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '服务账号',
				name : 'sysServiceAccount.serviceAccount',
				maxLength : 64
			}, {
				fieldLabel : '密码',
				inputType : 'password',
				id : 'SysServiceAccountForm.password',
				name : 'sysServiceAccount.password',
				maxLength : 64
			}, {
				fieldLabel : '账号描述',
				name : 'sysServiceAccount.description',
				xtype : 'textarea',
				maxLength : 500
			}, {
				fieldLabel : '状态',
				editable : false,
				hiddenName : 'sysServiceAccount.status',
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				store : [ [ '1', '激活' ], [ '0', '禁用' ] ]
			}]
		});
		//加载表单对应的数据	
		if (this.id != null && this.id != 'undefined') {
			var appUserMustInfo = Ext.getCmp('SysServiceAccountFormInfo');
			appUserMustInfo.remove('SysServiceAccountForm.password');
			appUserMustInfo.doLayout(true);
			this.formPanel.loadData({
				url : __ctxPath + '/system/getSysServiceAccount.do?id='
						+ this.id,
				root : 'data',
				preName : 'sysServiceAccount'
			});
		}

	},//end of the initcomponents

	/**
	 * 重置
	 * @param {} formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * @param {} window
	 */
	cancel : function() {
		this.close();
	},
	/**
	 * 保存记录
	 */
	save : function() {
		$postForm({
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/system/saveSysServiceAccount.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('SysServiceAccountGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}//end of save

});