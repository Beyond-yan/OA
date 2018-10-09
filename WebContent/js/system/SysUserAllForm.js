/**
 * @author 
 * @createtime 
 * @class SysUserAllForm
 * @extends Ext.Window
 * @description SysUserAll表单
 * @company 捷达世软件
 */
SysUserAllForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SysUserAllForm.superclass.constructor.call(this, {
							id : 'SysUserAllFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 200,
							width : 500,
							maximizable : true,
							title : '用户详细信息',
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
							//id : 'SysUserAllForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
										name : 'sysUserAll.id',
										xtype : 'hidden',
										value : this.id == null ? '' : this.id
									}, {
										fieldLabel : '用户账号',
										name : 'sysUserAll.userName',
										disabled : this.id == null ? false : true,
										id : 'SysUserAllForm.userName',
										maxLength : 64
									}/*, {
										fieldLabel : '密码',
										name : 'sysUserAll.userPassword',
										id : 'SysUserAllForm.userPassword',
										maxLength : 64
									}*/, {
										xtype : 'hidden',
										name : 'sysUserAll.sysSchemaConfig.schemaCode',
										id : 'SysUserAllForm.schemaCode'
									}, {
										fieldLabel : 'SCHEMA',
										hiddenName : 'sysUserAll.sysSchemaConfig.id',
										id : 'SysUserAllForm.id',
										xtype : 'combo',
										valueField : 'id',
										displayField : 'schemaCode',
										editable : false,
										emptyText : '--请选SCMEMA--',
										triggerAction : 'all',
										forceSelection : true,
										blankText : '请选SCMEMA！',
										store : new Ext.data.SimpleStore({
											url : __ctxPath + '/system/getAllSchemaSysSchemaConfig.do?',
											autoLoad : true,
											fields : ['id', 'schemaCode'],
											listeners : {
												scope : this,
												load : function() {
													var cmp = Ext.getCmp('SysUserAllForm.id');
													if (cmp.hiddenField.value)
														cmp.setValue(cmp.hiddenField.value);
												}
											}
										}),
										listeners : {
											select : function(cbo, record, index) {
												Ext.getCmp('SysUserAllForm.schemaCode').setValue(cbo.getRawValue());
											}
										}
									}, {
										fieldLabel : '用户状态',
										hiddenName : 'sysUserAll.status',
										id : 'SysUserAllForm.status',
										xtype : 'combo',
										mode : 'local',
										editable : false,
										triggerAction : 'all',
										store : [ [ '1', '激活' ], [ '0', '禁用' ] ],
										value : 1
									}/*, {
										fieldLabel : '创建人',
										readOnly : true,
										disabled : true,
										name : 'sysUserAll.createUser',
										maxLength : 64
									}, {
										fieldLabel : '创建日期',
										readOnly : true,
										disabled : true,
										name : 'sysUserAll.createDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										value : new Date()
									}, {
										fieldLabel : '修改人',
										readOnly : true,
										disabled : true,
										name : 'sysUserAll.updateUser',
										maxLength : 64
									}, {
										fieldLabel : '修改日期',
										readOnly : true,
										disabled : true,
										name : 'sysUserAll.updateDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										value : new Date()
									}*/]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath
										+ '/system/getSysUserAll.do?id='
										+ this.id,
								root : 'data',
								preName : 'sysUserAll'
							});
				}

			},//end of the initcomponents

			/**
			 * 重置
			 * @param {} formPanel
			 */
			reset : function() {
//				this.formPanel.getForm().reset();
				Ext.getCmp('SysUserAllForm.userName').reset();
//				Ext.getCmp('SysUserAllForm.userPassword').reset();
				Ext.getCmp('SysUserAllForm.schemaId').reset();
				Ext.getCmp('SysUserAllForm.status').reset();
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
							url : __ctxPath + '/system/saveSysUserAll.do',
							callback : function(fp, action) {
								var gridPanel = Ext.getCmp('SysUserAllGrid');
								if (gridPanel != null) {
									gridPanel.getStore().reload();
								}
								this.close();
							}
						});
			}//end of save

		});