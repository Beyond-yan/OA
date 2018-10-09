/**
 * @author 
 * @createtime 
 * @class SysDataTransferHisForm
 * @extends Ext.Window
 * @description SysDataTransferHis表单
 * @company 捷达世软件
 */
SysDataTransferHisForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SysDataTransferHisForm.superclass.constructor.call(this, {
							id : 'SysDataTransferHisFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[SysDataTransferHis]详细信息',
							buttonAlign : 'center',
							buttons : [
										{
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
										}
							         ]
				});
			},//end of the constructor
			//初始化组件
			initUIComponents : function() {
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px',
							border : false,
							autoScroll:true,
							//id : 'SysDataTransferHisForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'sysDataTransferHis.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'HIS_ID',
								 								name : 'sysDataTransferHis.hisId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ARCHIVES_ID',
								 								name : 'sysDataTransferHis.archivesId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ARCHIVESNO',
								 								name : 'sysDataTransferHis.archivesno'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'SEND_DEP',
								 								name : 'sysDataTransferHis.sendDep'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'SUBJECT',
								 								name : 'sysDataTransferHis.subject'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'ARCHTYPE',
								 								name : 'sysDataTransferHis.archtype'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ISSUERID',
								 								name : 'sysDataTransferHis.issuerid'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ISSUER',
								 								name : 'sysDataTransferHis.issuer'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'PRIVACYLEVEL',
								 								name : 'sysDataTransferHis.privacylevel'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'URGENTLEVEL',
								 								name : 'sysDataTransferHis.urgentlevel'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'SOURCES',
								 								name : 'sysDataTransferHis.sources'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'WRITTEN_DATE',
								 								name : 'sysDataTransferHis.writtenDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'RECEIVE_DEP',
								 								name : 'sysDataTransferHis.receiveDep'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'TRANSFER_TYPE',
								 								name : 'sysDataTransferHis.transferType'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'FROM_SCHEMA',
								 								name : 'sysDataTransferHis.fromSchema'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'TO_SCHEMA_ID',
								 								name : 'sysDataTransferHis.toSchemaId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'RECEIVE_DATE',
								 								name : 'sysDataTransferHis.receiveDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'RECEIVE_FLAG',
								 								name : 'sysDataTransferHis.receiveFlag'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'REJECT_MSG',
								 								name : 'sysDataTransferHis.rejectMsg'
								 																 								,xtype:'textarea'
								 								,maxLength: 500
								 							}
																																										,{
																fieldLabel : 'CREATE_USER',
								 								name : 'sysDataTransferHis.createUser'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'sysDataTransferHis.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'TRANSACTION_ID',
								 								name : 'sysDataTransferHis.transactionId'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'RECEIVE_USER',
								 								name : 'sysDataTransferHis.receiveUser'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'RECEIVE_USER_NAME',
								 								name : 'sysDataTransferHis.receiveUserName'
								 																 								,maxLength: 100
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/system/getSysDataTransferHis.do?id='+ this.id,
								root : 'data',
								preName : 'sysDataTransferHis'
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
						formPanel:this.formPanel,
						scope:this,
						url:__ctxPath + '/system/saveSysDataTransferHis.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('SysDataTransferHisGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});