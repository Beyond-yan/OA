/**
 * @author 
 * @createtime 
 * @class TsItserviceTypeForm
 * @extends Ext.Window
 * @description TsItserviceType表单
 * @company 捷达世软件
 */
TsItserviceTypeForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				TsItserviceTypeForm.superclass.constructor.call(this, {
							id : 'TsItserviceTypeFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[TsItserviceType]详细信息',
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
							//id : 'TsItserviceTypeForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'tsItserviceType.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'ITSERVICE_NAME',
								 								name : 'tsItserviceType.itserviceName'
																,allowBlank:false
								 																 								,maxLength: 32
								 							}
																																										,{
																fieldLabel : 'ITSERVICE_DESCRIPTION',
								 								name : 'tsItserviceType.itserviceDescription'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'REF1',
								 								name : 'tsItserviceType.ref1'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'REF2',
								 								name : 'tsItserviceType.ref2'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'REF3',
								 								name : 'tsItserviceType.ref3'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'tsItserviceType.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'tsItserviceType.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'tsItserviceType.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'tsItserviceType.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getTsItserviceType.do?id='+ this.id,
								root : 'data',
								preName : 'tsItserviceType'
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
						url:__ctxPath + '/admin/saveTsItserviceType.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('TsItserviceTypeGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});