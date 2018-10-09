/**
 * @author 
 * @createtime 
 * @class SysArchivesFilesHisForm
 * @extends Ext.Window
 * @description SysArchivesFilesHis表单
 * @company 捷达世软件
 */
SysArchivesFilesHisForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SysArchivesFilesHisForm.superclass.constructor.call(this, {
							id : 'SysArchivesFilesHisFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[SysArchivesFilesHis]详细信息',
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
							//id : 'SysArchivesFilesHisForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'sysArchivesFilesHis.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'HIS_ID',
								 								name : 'sysArchivesFilesHis.hisId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'DATA_ID',
								 								name : 'sysArchivesFilesHis.dataId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'FILE_TYPE',
								 								name : 'sysArchivesFilesHis.fileType'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'FILE_VERSION',
								 								name : 'sysArchivesFilesHis.fileVersion'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'FILE_NAME',
								 								name : 'sysArchivesFilesHis.fileName'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'FILE_PATH',
								 								name : 'sysArchivesFilesHis.filePath'
								 																 								,xtype:'textarea'
								 								,maxLength: 500
								 							}
																																										,{
																fieldLabel : 'FILE_SIZE',
								 								name : 'sysArchivesFilesHis.fileSize'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'FILE_BYTE_SIZE',
								 								name : 'sysArchivesFilesHis.fileByteSize'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'FILE_EXT_TYPE',
								 								name : 'sysArchivesFilesHis.fileExtType'
								 																 								,maxLength: 20
								 							}
																																										,{
																fieldLabel : 'FILE_DATE',
								 								name : 'sysArchivesFilesHis.fileDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/system/getSysArchivesFilesHis.do?id='+ this.id,
								root : 'data',
								preName : 'sysArchivesFilesHis'
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
						url:__ctxPath + '/system/saveSysArchivesFilesHis.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('SysArchivesFilesHisGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});