/**
 * @author 
 * @createtime 
 * @class InfoTypeForm
 * @extends Ext.Window
 * @description InfoType表单
 * @company 捷达世软件
 */
InfoTypeForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				InfoTypeForm.superclass.constructor.call(this, {
							id : 'InfoTypeFormWin',
							layout : 'fit',
							iconCls : 'menu-flowPr',
							items : this.formPanel,
							modal : true,
							height : 130,
							width : 350,
							maximizable : true,
							title : '信息分类详细信息',
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
							//id : 'InfoTypeForm',
							defaults : {
								anchor : '98%,98%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'infoType.typeid',
								xtype : 'hidden',
								value : this.typeid == null ? '' : this.typeid
							},{
								fieldLabel : '信息分类',
 								name : 'infoType.typeName',
 								xtype:'textfield',
 								maxLength: 400
							}]
						});
				//加载表单对应的数据	
				if (this.typeid != null && this.typeid != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/info/getInfoType.do?typeid='+ this.typeid,
								root : 'data',
								preName : 'infoType'
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
						url:__ctxPath + '/info/saveInfoType.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('InfoTypeGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});