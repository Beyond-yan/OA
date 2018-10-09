/**
 * @author 
 * @createtime 
 * @class SysOaSiteForm
 * @extends Ext.Window
 * @description SysOaSite表单
 * @company 捷达世软件
 */
SysOaSiteForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SysOaSiteForm.superclass.constructor.call(this, {
							id : 'SysOaSiteFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 200,
							width : 500,
							maximizable : true,
							title : '部署点详细信息',
							buttonAlign : 'center',
							buttons : [{
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
									}]
						});
			},//end of the constructor
			//初始化组件
			initUIComponents : function() {
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px',
							border : false,
							autoScroll : true,
							//id : 'SysOaSiteForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
										name : 'sysOaSite.id',
										id : 'SysOaSiteForm.id',
										xtype : 'hidden',
										value : this.id == null ? '' : this.id
									}, {
										fieldLabel : '部署点编号',
										id : 'SysOaSiteForm.siteCode',
										name : 'sysOaSite.siteCode',
										maxLength : 20
									}, {
										fieldLabel : '部署点名称',
										id : 'SysOaSiteForm.siteName',
										name : 'sysOaSite.siteName',
										maxLength : 200
									}, {
										fieldLabel : '类型',
										id : 'SysOaSiteForm.ownerType',
										hiddenName : 'sysOaSite.ownerType',
										xtype : 'combo',
										editable : false,
										mode : 'local',
										triggerAction : 'all',
										store : [['1','本站点'],['2', '外站点']],
										value : 1
									}/*, {
										fieldLabel : '创建人',
										name : 'sysOaSite.createUser',
										disabled : true,
										maxLength : 64
									}, {
										fieldLabel : '创建日期',
										name : 'sysOaSite.createDate',
										disabled : true,
										xtype : 'datefield',
										format : 'Y-m-d',
										value : new Date()
									}, {
										fieldLabel : '修改人',
										name : 'sysOaSite.updateUser',
										disabled : true,
										maxLength : 64
									}, {
										fieldLabel : '修改日期',
										disabled : true,
										name : 'sysOaSite.updateDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										value : new Date()
									}*/]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/system/getSysOaSite.do?id='
										+ this.id,
								root : 'data',
								preName : 'sysOaSite'
							});
				}

			},//end of the initcomponents

			/**
			 * 重置
			 * @param {} formPanel
			 */
			reset : function() {
//				this.formPanel.getForm().reset();
				Ext.getCmp('SysOaSiteForm.siteCode').setValue(null);
				Ext.getCmp('SysOaSiteForm.siteName').setValue(null);
				Ext.getCmp('SysOaSiteForm.ownerType').setValue(1);
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
				if(1 == Ext.getCmp('SysOaSiteForm.ownerType').getValue()){
					var formPanel1= this.formPanel;
					var id = Ext.getCmp('SysOaSiteForm.id').getValue();
					Ext.Ajax.request({
						url :__ctxPath + '/system/haveOwnerSysOaSite.do?id='+id,
						method : 'POST',
						waitMsg : "正在验证是否存在本站点，请稍等",
						success : function(response, options) {
							if(Ext.util.JSON.decode(response.responseText).success){
								Ext.ux.Toast.msg('操作信息', '已存在本站点！');
								return false;
							}else{
								$postForm({
									formPanel:formPanel1,
									scope:this,
									url:__ctxPath + '/system/saveSysOaSite.do',
									callback:function(fp,action){
										var gridPanel = Ext.getCmp('SysOaSiteGrid');
										if (gridPanel != null) {
											gridPanel.getStore().reload();
										}
										Ext.getCmp('SysOaSiteFormWin').close();
									}
								});
							}
						},failure : function(response, options) {
							Ext.ux.Toast.msg('验证错误，请联系管理员！');
						}
					});
				}else{
					$postForm({
							formPanel:this.formPanel,
							scope:this,
							url:__ctxPath + '/system/saveSysOaSite.do',
							callback:function(fp,action){
								var gridPanel = Ext.getCmp('SysOaSiteGrid');
								if (gridPanel != null) {
									gridPanel.getStore().reload();
								}
								this.close();
							}
						}
					);
				}//end of save
			}
		});