/**
 * @author 
 * @createtime 
 * @class OffsupplyApplyDetailForm
 * @extends Ext.Window
 * @description OffsupplyApplyDetail表单
 * @company 捷达世软件
 */
OffsupplyApplyDetailForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				OffsupplyApplyDetailForm.superclass.constructor.call(this, {
							id : 'OffsupplyApplyDetailFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[OffsupplyApplyDetail]详细信息',
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
							//id : 'OffsupplyApplyDetailForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'offsupplyApplyDetail.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'APPLY_ONE_ID',
								 								name : 'offsupplyApplyDetail.applyOneId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'SUPPLY_ID',
								 								name : 'offsupplyApplyDetail.supplyId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'PRICE',
								 								name : 'offsupplyApplyDetail.price'
								 																 								,maxLength: 9
								 							}
																																										,{
																fieldLabel : 'QUANTITY',
								 								name : 'offsupplyApplyDetail.quantity'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'offsupplyApplyDetail.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'offsupplyApplyDetail.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'offsupplyApplyDetail.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'offsupplyApplyDetail.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getOffsupplyApplyDetail.do?id='+ this.id,
								root : 'data',
								preName : 'offsupplyApplyDetail'
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
						url:__ctxPath + '/admin/saveOffsupplyApplyDetail.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('OffsupplyApplyDetailGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});