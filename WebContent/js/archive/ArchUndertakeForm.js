/**
 * @author:Ropen
 * @class ArchDispatchView
 * @extends Ext.Panel
 * @description [ArchDispatch]管理
 */
ArchUndertakeForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			displayPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				ArchUndertakeForm.superclass.constructor.call(this, {
							id : 'ArchUndertakeFormWin',
							layout : 'form',
							items : [this.formPanel, this.displayPanel],
							modal : true,
							height : 400,
							width : 600,
							iconCls:'menu-arch-undertake',
							maximizable : true,
							title : '承办意见待办',
							buttonAlign : 'center',
							buttons : this.buttons
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				this.displayPanel = new Ext.Panel({
							id : 'ArchivesHandleDisplayPanel',
							autoScroll : true,
							height : 220,
							border : false,
							autoLoad : {
								url : __ctxPath
										+ '/pages/archive/dispatchread.jsp?dispatchId='
										+ this.dispatchId
							}
						});
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px 10px 10px 10px',
							border : false,
							url : __ctxPath + '/archive/readArchDispatch.do',
							id : 'ArchUndertakeForm',
							defaults : {
								anchor : '98%,98%'
							},
							items : [{
										name : 'dispatchId',
										id : 'dispatchId',
										xtype : 'hidden',
										value : this.dispatchId
									},{
										fieldLabel : '承办意见',
										name : 'readFeedback',
										xtype : 'textarea',
										id : 'readFeedback'
									}]
						});
				// 加载表单对应的数据
				if (this.dispatchId != null && this.dispatchId != 'undefined') {
					this.formPanel.getForm().load({
						deferredRender : false,
						url : __ctxPath + '/archive/getArchDispatch.do?dispatchId='
								+ this.dispatchId,
						waitMsg : '正在载入数据...',
						success : function(form, action) {
						},
						failure : function(form, action) {
						}
					});
				}
				// 初始化功能按钮
				this.buttons = [
//					{
//							text : '保存',
//							iconCls : 'btn-save',
//							handler : this.save.createCallback(this.formPanel,
//									this)
//						},
						{
							text : '取消',
							iconCls : 'btn-cancel',
							handler : this.cancel.createCallback(this)
						}];
			},// end of the initcomponents
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
			 * 通过
			 */
			save : function(formPanel, window) {
				if (formPanel.getForm().isValid()) {
					formPanel.getForm().submit({
								method : 'POST',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									var gridPanel = Ext
											.getCmp('ArchUndertakeGrid');
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