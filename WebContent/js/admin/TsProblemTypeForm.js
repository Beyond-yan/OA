/**
 * @author 
 * @createtime 
 * @class TsProblemTypeForm
 * @extends Ext.Window
 * @description TsProblemType表单
 * @company 捷达世软件
 */
TsProblemTypeForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				TsProblemTypeForm.superclass.constructor.call(this, {
							id : 'TsProblemTypeFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[TsProblemType]详细信息',
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
							//id : 'TsProblemTypeForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'tsProblemType.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'PRO_TYPE_NAME',
								 								name : 'tsProblemType.proTypeName'
																,allowBlank:false
								 																 								,maxLength: 32
								 							}
																																										,{
																fieldLabel : 'PRO_TYPE_DESCRIPTION',
								 								name : 'tsProblemType.proTypeDescription'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'REF1',
								 								name : 'tsProblemType.ref1'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'REF2',
								 								name : 'tsProblemType.ref2'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'REF3',
								 								name : 'tsProblemType.ref3'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'tsProblemType.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'tsProblemType.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'tsProblemType.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'tsProblemType.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getTsProblemType.do?id='+ this.id,
								root : 'data',
								preName : 'tsProblemType'
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
						url:__ctxPath + '/admin/saveTsProblemType.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('TsProblemTypeGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});