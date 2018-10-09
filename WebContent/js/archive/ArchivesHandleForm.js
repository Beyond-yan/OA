/**
 * @author
 * @createtime
 * @class ArchivesHandleForm
 * @extends Ext.Window
 * @description ArchivesHandle表单
 */
ArchivesHandleForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 内嵌FormPanel
			displayPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				ArchivesHandleForm.superclass.constructor.call(this, {
							id : 'ArchivesHandleFormWin',
							layout : 'form',
							items : this.displayPanel,
							modal : true,
							height : 400,
							width : 600,
							iconCls:'menu-arch-handler',
							maximizable : true,
							title : '拟办审核信息',
							buttonAlign : 'center',
							buttons : this.buttons
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				this.displayPanel=new Ext.Panel({
				      id:'ArchivesHandleDisplayPanel',
				      autoScroll : true,
				      height:380,
				      border:false,
				      autoLoad:{url:__ctxPath+'/pages/archive/archivereceived.jsp?handleId='+this.handleId}
				});
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px 10px 10px 10px',
							border : false,
							url : __ctxPath + '/archive/saveArchivesHandle.do',
							id : 'ArchivesHandleForm',
							defaults : {
								anchor : '98%,98%'
							},
							items : [{
							    xtype:'hidden',
							    name:'handleId',
								id:'handleId',
								value:this.handleId
							},{
								fieldLabel : '拟办意见',
								name : 'handleOpinion',
								xtype:'textarea',
								id : 'handleOpinion'
							},{
								fieldLabel : '0=初始化状态',
								name : 'isPass',
								xtype:'hidden',
								id : 'isPass'
							}
							]
						});
				// 初始化功能按钮
				this.buttons = [{
							text : '关闭',
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
											.getCmp('ArchivesHandleGrid');
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
			},// end of save
			/**
			 * 不通过
			 * 
			 * @param {}
			 *            formPanel
			 */
			notpass : function(formPanel, window) {
				Ext.getCmp('isPass').setValue(2);//2表示为不通过
				if (formPanel.getForm().isValid()) {
					formPanel.getForm().submit({
								method : 'POST',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									var gridPanel = Ext
											.getCmp('ArchivesHandleGrid');
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
			},
			/**
			 * 通过
			 * 
			 * @param {}
			 *            formPanel
			 */
			pass : function(formPanel, window) {
				Ext.getCmp('isPass').setValue(1);//1表示为通过
				if (formPanel.getForm().isValid()) {
					formPanel.getForm().submit({
								method : 'POST',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									var gridPanel = Ext
											.getCmp('ArchivesHandleGrid');
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
			}
		});