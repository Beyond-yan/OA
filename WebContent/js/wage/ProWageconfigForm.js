/**
 * @author
 * @createtime
 * @class ProWageconfigForm
 * @extends Ext.Window
 * @description 工资项目表单
 * @company 捷达世软件
 */
ProWageconfigForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ProWageconfigForm.superclass.constructor.call(this, {
			id : 'ProWageconfigFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '工资项目详细信息',
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
		var combomealtype1 = new Ext.form.ComboBox({
			fieldLabel : '项目类型',
			hiddenName : 'proWageconfig.proWagetype.id',
			id:'proWageconfigTypeId',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			displayField : 'name',
			valueField : 'id',
			mode : 'local',
			store : new Ext.data.SimpleStore(
					{
						autoLoad : true,
						url : __ctxPath + '/wage/comProWagetype.do',
						fields : [ 'id','name' ],
						listeners : {
							load : function() {
									Ext.getCmp('proWageconfigTypeId')
										.setValue(Ext.getCmp('proWageconfigTypeId').getValue());
							}
						}							
					})		
		});
		
		
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'ProWageconfigForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'proWageconfig.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '项目名称',
				name : 'proWageconfig.name',
				allowBlank : false,
				maxLength : 100
			}, combomealtype1 ]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/wage/getProWageconfig.do?id=' + this.id,
				root : 'data',
				preName : 'proWageconfig'
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
			url : __ctxPath + '/wage/saveProWageconfig.do',
			callback : function(fp, action) {
			var resultResp = Ext.util.JSON
			.decode(action.response.responseText);
	         if (resultResp.result == 1){
	        	 Ext.MessageBox
					.show( {
						title : '操作信息',
						msg : '项目名称必须唯一！',
						buttons : Ext.MessageBox.OK,
						icon : 'ext-mb-error'
					});
	         }
				var gridPanel = Ext.getCmp('ProWageconfigGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});