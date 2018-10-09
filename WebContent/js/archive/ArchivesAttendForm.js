/**
 * @author
 * @createtime
 * @class ArchivesAttendForm
 * @extends Ext.Window
 * @description ArchivesAttend表单
 */
ArchivesAttendForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				ArchivesAttendForm.superclass.constructor.call(this, {
							id : 'ArchivesAttendFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 200,
							width : 400,
							maximizable : true,
							title : '[ArchivesAttend]详细信息',
							buttonAlign : 'center',
							buttons : this.buttons
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px 10px 10px 10px',
							border : false,
							url : __ctxPath + '/archive/saveArchivesAttend.do',
							id : 'ArchivesAttendForm',
							defaults : {
								anchor : '98%,98%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'archivesAttend.attendId',
								id : 'attendId',
								xtype : 'hidden',
								value : this.attendId == null
										? ''
										: this.attendId
							}, {
								fieldLabel : '',
								name : 'archivesAttend.archivesId',
								id : 'archivesId'
							}, {
								fieldLabel : '用户ID',
								name : 'archivesAttend.userID',
								id : 'userID'
							}, {
								fieldLabel : '姓名',
								name : 'archivesAttend.fullname',
								id : 'fullname'
							}, {
								fieldLabel : '参与类型',
								name : 'archivesAttend.attendType',
								id : 'attendType'
							}, {
								fieldLabel : '执行时间',
								name : 'archivesAttend.executeTime',
								id : 'executeTime'
							}, {
								fieldLabel : '备注',
								name : 'archivesAttend.memo',
								id : 'memo'
							}

							]
						});
				// 加载表单对应的数据
				if (this.attendId != null && this.attendId != 'undefined') {
					this.formPanel.getForm().load({
						deferredRender : false,
						url : __ctxPath
								+ '/archive/getArchivesAttend.do?attendId='
								+ this.attendId,
						waitMsg : '正在载入数据...',
						success : function(form, action) {
						},
						failure : function(form, action) {
						}
					});
				}
				// 初始化功能按钮
				this.buttons = [{
							text : '保存',
							iconCls : 'btn-save',
							handler : this.save.createCallback(this.formPanel,
									this)
						}, {
							text : '重置',
							iconCls : 'btn-reset',
							handler : this.reset.createCallback(this.formPanel)
						}, {
							text : '取消',
							iconCls : 'btn-cancel',
							handler : this.cancel.createCallback(this)
						}];
			},// end of the initcomponents

			/**
			 * 重置
			 * 
			 * @param {}
			 *            formPanel
			 */
			reset : function(formPanel) {
				formPanel.getForm().reset();
			},
			/**
			 * 取消
			 * 
			 * @param {}
			 *            window
			 */
			cancel : function(window) {
				window.close();
			},
			/**
			 * 保存记录
			 */
			save : function(formPanel, window) {
				if (formPanel.getForm().isValid()) {
					formPanel.getForm().submit({
								method : 'POST',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									var gridPanel = Ext
											.getCmp('ArchivesAttendGrid');
									if (gridPanel != null) {
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