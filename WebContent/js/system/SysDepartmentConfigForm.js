/**
 * @author 
 * @createtime 
 * @class SysDepartmentConfigForm
 * @extends Ext.Window
 * @description SysDepartmentConfig表单
 * @company 捷达世软件
 */
SysDepartmentConfigForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SysDepartmentConfigForm.superclass.constructor.call(this, {
							id : 'SysDepartmentConfigFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[SysDepartmentConfig]详细信息',
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
							//id : 'SysDepartmentConfigForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'sysDepartmentConfig.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'DEP_CODE',
								 								name : 'sysDepartmentConfig.depCode'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'DEP_NAME',
								 								name : 'sysDepartmentConfig.depName'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'SCHEMA_ID',
								 								name : 'sysDepartmentConfig.schemaId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'CREATE_USER',
								 								name : 'sysDepartmentConfig.createUser'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'sysDepartmentConfig.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_USER',
								 								name : 'sysDepartmentConfig.updateUser'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'sysDepartmentConfig.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/system/getSysDepartmentConfig.do?id='+ this.id,
								root : 'data',
								preName : 'sysDepartmentConfig'
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
						url:__ctxPath + '/system/saveSysDepartmentConfig.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('SysDepartmentConfigGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});