/**
 * @author 
 * @createtime 
 * @class RowNumberResetForm
 * @extends Ext.Window
 * @description RowNumberResetForm表单
 * @company 捷达世软件
 */
RowNumberResetForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				RowNumberResetForm.superclass.constructor.call(this, {
							id : 'RowNumberResetFormWin',
							layout : 'fit',
							iconCls : 'menu-archive-handout',
							items : this.formPanel,
							modal : true,
							height : 130,
							width : 350,
							maximizable : true,
							title : '重设行号',
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
				var fileId=this.docFileId;
				var directoryId=this.directoryId;
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px',
							border : false,
							autoScroll:true,
							defaults : {
								anchor : '98%,98%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'fileId',
								value : fileId,
								xtype:'hidden'
							},{
								name : 'directoryId',
								value : directoryId,
								xtype:'hidden'
							},{
								fieldLabel : '行号',
 								name : 'docFileRowNumber',
 								allowBlank : false,
 								xtype:'numberfield'
							}]
						});
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
						url:__ctxPath + '/system/updateRowNumberDocFiles.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('DocDirectoryDetailGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});