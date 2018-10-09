/**
 * @author 
 * @createtime 
 * @class OrderDetailForm
 * @extends Ext.Window
 * @description OrderDetail表单
 * @company 捷达世软件
 */
OrderDetailForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				OrderDetailForm.superclass.constructor.call(this, {
							id : 'OrderDetailFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[OrderDetail]详细信息',
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
							//id : 'OrderDetailForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'orderDetail.detailid',
								xtype : 'hidden',
								value : this.detailid == null ? '' : this.detailid
							}
																																																	,{
																fieldLabel : 'orderId',
								 								name : 'orderDetail.orderid'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'productNo',
								 								name : 'orderDetail.productno'
																,allowBlank:false
								 																 								,maxLength: 128
								 							}
																																										,{
																fieldLabel : 'price',
								 								name : 'orderDetail.price'
																,allowBlank:false
								 																 								,maxLength: 18
								 							}
																																										,{
																fieldLabel : 'quantity',
								 								name : 'orderDetail.quantity'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'notes',
								 								name : 'orderDetail.notes'
								 																 								,xtype:'textarea'
								 								,maxLength: 1024
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.detailid != null && this.detailid != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/sales/getOrderDetail.do?detailid='+ this.detailid,
								root : 'data',
								preName : 'orderDetail'
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
						url:__ctxPath + '/sales/saveOrderDetail.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('OrderDetailGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});