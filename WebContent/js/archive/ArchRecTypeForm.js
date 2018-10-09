/**
 * @author:Ropen
 * @createtime
 * @class ArchRecTypeForm
 * @extends Ext.Window
 * @description ArchRecType表单
 */
ArchRecTypeForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				ArchRecTypeForm.superclass.constructor.call(this, {
							id : 'ArchRecTypeFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 200,
							iconCls:'menu-arch-rec-type',
							width : 400,
							maximizable : true,
							title : '来文分类详细信息',
							buttonAlign : 'center',
							buttons : this.buttons
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				var _url = __ctxPath + '/system/listDepartment.do?opt=appUser';
				var depSelector = new TreeSelector('ArchRecTypeForm.depName', _url, '所属部门',
						'depId', false);
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px 10px 10px 10px',
							border : false,
							url : __ctxPath + '/archive/saveArchRecType.do',
							id : 'ArchRecTypeForm',
							defaults : {
								anchor : '98%,98%'
							},
							defaultType : 'textfield',
							items : [{
										name : 'archRecType.recTypeId',
										id : 'recTypeId',
										xtype : 'hidden',
										value : this.recTypeId == null
												? ''
												: this.recTypeId
									}, {
										// fieldLabel : '部门',
										xtype : 'hidden',
										name : 'archRecType.depId',
										id : 'depId'
									}, {
										fieldLabel : '分类名称',
										allowBlank : false,
										name : 'archRecType.typeName',
										id : 'typeName'
									}, depSelector

							]
						});
				// 加载表单对应的数据
				if (this.recTypeId != null && this.recTypeId != 'undefined') {
					this.formPanel.getForm().load({
						deferredRender : false,
						url : __ctxPath + '/archive/getArchRecType.do?recTypeId='
								+ this.recTypeId,
						waitMsg : '正在载入数据...',
						success : function(form, action) {
							var dep=action.result.data.department;
							Ext.getCmp('ArchRecTypeForm.depName').setValue(dep.depName);
							Ext.getCmp('depId').setValue(dep.depId);
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
											.getCmp('ArchRecTypeGrid');
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
			}// end of save

		});