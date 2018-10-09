/**
 * @author 
 * @createtime 
 * @class PublicBuyListForm
 * @extends Ext.Window
 * @description PublicBuyList表单
 * @company 捷达世软件
 */
PublicBuyListForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				PublicBuyListForm.superclass.constructor.call(this, {
							id : 'PublicBuyListFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[PublicBuyList]详细信息',
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
							//id : 'PublicBuyListForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'publicBuyList.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'PUB_APPLY_ID',
								 								name : 'publicBuyList.pubApplyId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ITEM_NAME',
								 								name : 'publicBuyList.itemName'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'PRICE',
								 								name : 'publicBuyList.price'
								 																 								,maxLength: 18
								 							}
																																										,{
																fieldLabel : 'NUMBER',
								 								name : 'publicBuyList.number'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'TOTAL',
								 								name : 'publicBuyList.total'
								 																 								,maxLength: 18
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'publicBuyList.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'publicBuyList.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'publicBuyList.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'publicBuyList.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getPublicBuyList.do?id='+ this.id,
								root : 'data',
								preName : 'publicBuyList'
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
						url:__ctxPath + '/admin/savePublicBuyList.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('PublicBuyListGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});