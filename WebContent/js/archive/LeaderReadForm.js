/**
 * @author:Ropen
 * @createtime
 * @class LeaderReadForm
 * @extends Ext.Window
 * @description LeaderRead表单
 */
LeaderReadForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			displayPanel:null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				LeaderReadForm.superclass.constructor.call(this, {
							id : 'LeaderReadFormWin',
							layout : 'form',
							items : this.displayPanel,
							modal : true,
							height : 400,
							width : 600,
							iconCls:'menu-arch-leader',
//							autoScroll:true,
							maximizable : true,
							title : '领导指示意见',
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
//				      autoHeight:true,
				      border:false,
				      autoLoad:{url:__ctxPath+'/pages/archive/leaderreader.jsp?leaderId='+this.leadId}
				});
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px 10px 10px 10px',
							border : false,
							autoScroll :false,
							url : __ctxPath + '/archive/saveLeaderRead.do',
							id : 'LeaderReadForm',
							defaults : {
								anchor : '98%,98%'
							},
							items : [
								{
										name : 'leaderRead.readId',
										id : 'readId',
										xtype : 'hidden',
										value : this.leadId
									},{
										fieldLabel : '审批意见',
										name : 'leaderOpinion',
										xtype:'textarea',
										id : 'leaderOpinion'
									}, {
										fieldLabel : '0=尚未批',
										name : 'isPass',
										xtype:'hidden',
										id : 'isPass'
									}

							]
						});
				// 初始化功能按钮
				this.buttons = [
//					{
//							text : '通过',
//							iconCls : 'btn-save',
//							handler : this.pass.createCallback(this.formPanel,
//									this)
//						}, {
//							text : '不通过',
//							iconCls : 'btn-reset',
//							handler : this.notpass.createCallback(this.formPanel,this)
//						},
						{
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
			 * 通过
			 */
			pass : function(formPanel, window) {
				Ext.getCmp('isPass').setValue(1);
				if (formPanel.getForm().isValid()) {
					formPanel.getForm().submit({
								method : 'POST',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									var gridPanel = Ext
											.getCmp('LeaderReadGrid');
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
			 */
			notpass : function(formPanel, window) {
				Ext.getCmp('isPass').setValue(2);
				if (formPanel.getForm().isValid()) {
					formPanel.getForm().submit({
								method : 'POST',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									var gridPanel = Ext
											.getCmp('LeaderReadGrid');
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