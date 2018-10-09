/**
 * @author 
 * @createtime 
 * @class SysServiceInterfaceForm
 * @extends Ext.Window
 * @description SysServiceInterface表单
 * @company 捷达世软件
 */
SysServiceInterfaceForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SysServiceInterfaceForm.superclass.constructor.call(this, {
							id : 'SysServiceInterfaceFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '服务详细信息',
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
							//id : 'SysServiceInterfaceForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
										name : 'sysServiceInterface.id',
										xtype : 'hidden',
										value : this.id == null ? '' : this.id
									}, {
										fieldLabel : '服务编号',
										name : 'sysServiceInterface.serviceCode',
										maxLength : 64
									}, {
										fieldLabel : '服务名称',
										name : 'sysServiceInterface.serviceName',
										maxLength : 200
									}, {
										fieldLabel : '服务访问地址',
										name : 'sysServiceInterface.servicePath',
										maxLength : 200
									}, {
										fieldLabel : '服务描述',
										name : 'sysServiceInterface.serviceDesc',
										xtype : 'textarea',
										maxLength : 500
									}/*, {
										fieldLabel : 'CREATE_USER',
										name : 'sysServiceInterface.createUser',
										maxLength : 64
									}, {
										fieldLabel : 'CREATE_DATE',
										name : 'sysServiceInterface.createDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										value : new Date()
									}, {
										fieldLabel : 'UPDATE_USER',
										name : 'sysServiceInterface.updateUser',
										maxLength : 64
									}, {
										fieldLabel : 'UPDATE_DATE',
										name : 'sysServiceInterface.updateDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										value : new Date()
									}*/]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath
										+ '/system/getSysServiceInterface.do?id='
										+ this.id,
								root : 'data',
								preName : 'sysServiceInterface'
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
							url : __ctxPath
									+ '/system/saveSysServiceInterface.do',
							callback : function(fp, action) {
								var gridPanel = Ext
										.getCmp('SysServiceInterfaceGrid');
								if (gridPanel != null) {
									gridPanel.getStore().reload();
								}
								this.close();
							}
						});
			}//end of save

		});