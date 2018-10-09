/**
 * @author 
 * @createtime 
 * @class CqFileSnConfigForm
 * @extends Ext.Window
 * @description CqFileSnConfig表单
 * @company 捷达世软件
 */
FileSnConfigForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				FileSnConfigForm.superclass.constructor.call(this, {
							id : 'FileSnConfigFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 250,
							width : 500,
							maximizable : true,
							title : '文件编号详细信息',
							buttonAlign : 'center',
							buttons : [
										{
											text : '保存',
											iconCls : 'btn-save',
											scope : this,
											handler : this.save
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
							id : 'FileSnConfigForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'fileSnConfig.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							},{
								fieldLabel : '编号名称',
								name : 'fileSnConfig.snName',
								allowBlank:false,
								maxLength: 200
							},{
								fieldLabel : '编号序号',
								allowBlank:false,
								name : 'fileSnConfig.snNumber',
								xtype:'numberfield'
							},{
								fieldLabel : '编号格式',
								allowBlank:false,
								name : 'fileSnConfig.snFormat',
								maxLength: 200
							},{
								fieldLabel : '编号类型',
								xtype:'combo',
								allowBlank : false,
								hiddenName : 'fileSnConfig.snType',
								editable : false,
								emptyText:'请选择',
								triggerAction : 'all',
								store:[['0','发文'],['1','收文']]
							},{
								fieldLabel : '失效日期',
								name : 'fileSnConfig.expirationDate',
								xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
	 						}]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/snconfig/getFileSnConfig.do?id='+ this.id,
								root : 'data',
								preName : 'fileSnConfig'
							});
				}
				
			},//end of the initcomponents

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
						url:__ctxPath + '/snconfig/saveFileSnConfig.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('FileSnConfigGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});