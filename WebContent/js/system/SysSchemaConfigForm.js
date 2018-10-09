/**
 * @author 
 * @createtime 
 * @class SysSchemaConfigForm
 * @extends Ext.Window
 * @description SysSchemaConfig表单
 * @company 捷达世软件
 */
SysSchemaConfigForm = Ext.extend(Ext.Window, {
	//构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		//必须先初始化组件
		this.initUIComponents();
		SysSchemaConfigForm.superclass.constructor.call(this, {
					id : 'SysSchemaConfigFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					height : 200,
					width : 500,
					maximizable : true,
					title : 'SCHEMA详细信息',
					buttonAlign : 'center',
					buttons : [{
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
							}]
				});
	},//end of the constructor
	//初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
					layout : 'form',
					bodyStyle : 'padding:10px',
					border : false,
					autoScroll : true,
					//id : 'SysSchemaConfigForm',
					defaults : {
						anchor : '96%,96%'
					},
					defaultType : 'textfield',
					items : [{
								name : 'sysSchemaConfig.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}, {
								fieldLabel : '名称',
								name : 'sysSchemaConfig.schemaCode',
								maxLength : 64
							}, {
								fieldLabel : '描述',
								name : 'sysSchemaConfig.schemaDesc',
								maxLength : 200
							}, {
								xtype : 'hidden',
								name : 'sysSchemaConfig.sysOaSite.siteName',
								id : 'SysSchemaConfigForm.siteName'
							}, {
								fieldLabel : '所属部署点',
								id : 'SysSchemaConfigForm.id',
								hiddenName : 'sysSchemaConfig.sysOaSite.id',
								xtype : 'combo',
								valueField : 'id',
								displayField : 'siteName',
								editable : false,
								emptyText : '--请选择部署点--',
								triggerAction : 'all',
								forceSelection : true,
								blankText : '请选择部署点！',
								store : new Ext.data.SimpleStore({
									url : __ctxPath + '/system/getSysOaSite1SysSchemaConfig.do?',
									autoLoad : true,
									fields : ['id', 'siteName'],
									listeners : {
										scope : this,
										load : function() {
											var cmp = Ext.getCmp('SysSchemaConfigForm.id');
											if (cmp.hiddenField.value)
												cmp.setValue(cmp.hiddenField.value);
										}
									}
								}),
								listeners : {
									select : function(cbo, record, index) {
										Ext.getCmp('SysSchemaConfigForm.siteName').setValue(cbo.getRawValue());
									}
								}
							}/*, {
								fieldLabel : '创建人',
								name : 'sysSchemaConfig.createUser',
								maxLength : 64
							}, {
								fieldLabel : '创建日期',
								name : 'sysSchemaConfig.createDate',
								xtype : 'datefield',
								format : 'Y-m-d',
								value : new Date()
							}, {
								fieldLabel : '修改人',
								name : 'sysSchemaConfig.updateUser',
								maxLength : 64
							}, {
								fieldLabel : '修改日期',
								name : 'sysSchemaConfig.updateDate',
								xtype : 'datefield',
								format : 'Y-m-d',
								value : new Date()
							}*/]
				});
		//加载表单对应的数据	
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
				url : __ctxPath + '/system/getSysSchemaConfig.do?id=' + this.id,
				root : 'data',
				preName : 'sysSchemaConfig'
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
					url : __ctxPath + '/system/saveSysSchemaConfig.do',
					callback : function(fp, action) {
						var gridPanel = Ext.getCmp('SysSchemaConfigGrid');
						if (gridPanel != null) {
							gridPanel.getStore().reload();
						}
						this.close();
					}
				});
	}//end of save

});