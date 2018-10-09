/**
 * @author 
 * @createtime 
 * @class SysArchivesFilesForm
 * @extends Ext.Window
 * @description SysArchivesFiles表单
 * @company 捷达世软件
 */
SysArchivesFilesForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SysArchivesFilesForm.superclass.constructor.call(this, {
							id : 'SysArchivesFilesFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[SysArchivesFiles]详细信息',
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
							//id : 'SysArchivesFilesForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'sysArchivesFiles.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'DATA_ID',
								 								name : 'sysArchivesFiles.dataId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'FILE_TYPE',
								 								name : 'sysArchivesFiles.fileType'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'FILE_VERSION',
								 								name : 'sysArchivesFiles.fileVersion'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'FILE_NAME',
								 								name : 'sysArchivesFiles.fileName'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'FILE_PATH',
								 								name : 'sysArchivesFiles.filePath'
								 																 								,xtype:'textarea'
								 								,maxLength: 500
								 							}
																																										,{
																fieldLabel : 'FILE_SIZE',
								 								name : 'sysArchivesFiles.fileSize'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'FILE_BYTE_SIZE',
								 								name : 'sysArchivesFiles.fileByteSize'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'FILE_EXT_TYPE',
								 								name : 'sysArchivesFiles.fileExtType'
								 																 								,maxLength: 20
								 							}
																																										,{
																fieldLabel : 'FILE_DATE',
								 								name : 'sysArchivesFiles.fileDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/system/getSysArchivesFiles.do?id='+ this.id,
								root : 'data',
								preName : 'sysArchivesFiles'
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
						url:__ctxPath + '/system/saveSysArchivesFiles.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('SysArchivesFilesGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});