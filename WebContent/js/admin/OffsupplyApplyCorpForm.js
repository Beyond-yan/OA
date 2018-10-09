/**
 * @author 
 * @createtime 
 * @class OffsupplyApplyCorpForm
 * @extends Ext.Window
 * @description OffsupplyApplyCorp表单
 * @company 捷达世软件
 */
OffsupplyApplyCorpForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				OffsupplyApplyCorpForm.superclass.constructor.call(this, {
							id : 'OffsupplyApplyCorpFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[OffsupplyApplyCorp]详细信息',
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
							//id : 'OffsupplyApplyCorpForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'offsupplyApplyCorp.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'APPLY_TIME',
								 								name : 'offsupplyApplyCorp.applyTime'
																,allowBlank:false
								 																 								,maxLength: 30
								 							}
																																										,{
																fieldLabel : 'FEE_AMOUNT',
								 								name : 'offsupplyApplyCorp.feeAmount'
								 																 								,maxLength: 5
								 							}
																																										,{
																fieldLabel : 'REMARK',
								 								name : 'offsupplyApplyCorp.remark'
								 																 								,xtype:'textarea'
								 								,maxLength: 400
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'offsupplyApplyCorp.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'offsupplyApplyCorp.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'offsupplyApplyCorp.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'offsupplyApplyCorp.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getOffsupplyApplyCorp.do?id='+ this.id,
								root : 'data',
								preName : 'offsupplyApplyCorp'
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
						url:__ctxPath + '/admin/saveOffsupplyApplyCorp.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('OffsupplyApplyCorpGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});