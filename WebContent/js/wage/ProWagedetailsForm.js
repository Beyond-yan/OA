/**
 * @author
 * @createtime
 * @class ProWagedetailsForm
 * @extends Ext.Window
 * @description 工资明细表单
 * @company 捷达世软件
 */
ProWagedetailsForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ProWagedetailsForm.superclass.constructor.call(this, {
			id : 'ProWagedetailsFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 600,
			maximizable : true,
			title : '工资明细详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, {
				text : '取消',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'ProWagedetailsForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'proWagedetails.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, 
			{
				xtype : 'container',
				style : 'padding-left:0px;margin-bottom:4px;',
				layout : 'column',
				items : [
						{
							xtype : 'label',
							style : 'padding-left:0px;',
							text : '工号:',
							width : 105
						},
						{
							xtype : 'textfield',
							name : 'proWagedetails.appUser.username',
							id : 'proWagedetails.appUser.username',
							allowBlank : false,
							editable : false,
							readOnly : true,
							width : 200
						},
						{
							xtype : 'button',
							iconCls : 'btn-user-sel',
							text : '选择人员',
							handler : function() {
							UserSelector
										.getView(function(id,name) {
													Ext.getCmp('proWagedetails.appUser.username').setValue(name);
													Ext.getCmp('proWagedetails.userid').setValue(id);
												},
												true)
										.show();
							}
						},
						{
							xtype : 'button',
							text : '清除记录',
							iconCls : 'reset',
							handler : function() {
								Ext.getCmp('proWagedetails.appUser.username').setValue('');
								Ext.getCmp('proWagedetails.userid').setValue('');
							}
						} ]
			
			},
			{
				name : 'proWagedetails.userid',
				id:'proWagedetails.userid',
				xtype : 'hidden'
			}, {
				fieldLabel : '金额',
				name : 'proWagedetails.value',
				allowBlank : false,
				xtype:'numberfield',
				maxLength : 9
			},{
				xtype : 'container',
				style : 'padding-left:0px;margin-bottom:4px;',
				layout : 'column',
				items : [
						{
							xtype : 'label',
							style : 'padding-left:0px;',
							text : '项目名称:',
							width : 105
						},
						{
							xtype : 'textfield',
							name : 'proWagedetails.proWageconfig.name',
							id : 'proWagedetails.proWageconfig.name',
							allowBlank : false,
							editable : false,
							readOnly : true,
							width : 200
						},
						{
							xtype : 'button',
							iconCls : 'btn-user-sel',
							text : '选择项目',
							handler : function() {
							WageConfigSelector
										.getView(function(id,name) {
													Ext.getCmp('proWagedetails.proWageconfig.name').setValue(name);
													Ext.getCmp('proWagedetails.wageconfigId').setValue(id);
												},
												true)
										.show();
							}
						},
						{
							xtype : 'button',
							text : '清除记录',
							iconCls : 'reset',
							handler : function() {
								Ext.getCmp('proWagedetails.proWageconfig.name').setValue('');
								Ext.getCmp('proWagedetails.wageconfigId').setValue('');
							}
						} ]
			
			}, {
				name : 'proWagedetails.wageconfigId',
				id:'proWagedetails.wageconfigId',
				xtype : 'numberfield',
				xtype : 'hidden'
			}, {
				fieldLabel : '年',
				allowBlank : false,
				xtype:'numberfield',
				name : 'proWagedetails.year'
			},{
				fieldLabel : '月份',
				hiddenName : 'proWagedetails.month',
				xtype : 'combo',
				emptyText : '请选择',
				mode : 'local',
				editable : false,
				allowBlank : false,
				triggerAction : 'all',
				store : [['1', '1月'], ['2', '2月'],	['3', '3月'], ['4', '4月'], ['5', '5月'],
						 ['6', '6月'], ['7', '7月'],['8', '8月'], ['9', '9月'], ['10', '10月'],
						 ['11', '11月'], ['12', '12月']]
			}]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/wage/getProWagedetails.do?id=' + this.id,
				root : 'data',
				preName : 'proWagedetails'
			});
		}

	},// end of the initcomponents

	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function() {
		this.close();
	},
	/**
	 * 保存记录
	 */
	save : function() {
		$postForm( {
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/wage/saveProWagedetails.do',
			callback : function(fp, action) {
			var resultResp = Ext.util.JSON
			.decode(action.response.responseText);
	         if (resultResp.result == 2){
	        	 Ext.MessageBox
					.show( {
						title : '操作信息',
						msg : '项目名称重复！',
						buttons : Ext.MessageBox.OK,
						icon : 'ext-mb-error'
					});
	         }
				var gridPanel = Ext.getCmp('ProWagedetailsGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});