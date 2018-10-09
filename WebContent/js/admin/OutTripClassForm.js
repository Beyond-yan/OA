/**
 * @author : Donald Su
 * @class : OutTripClassView
 * @extends : Ext.Panel
 * @description : 出差类别管理
 * @company : 深圳捷达世软件有限公司
 * @createtime : 2011-06-13
 */
OutTripClassForm = Ext.extend(Ext.Window, {
	
	// 构造函数 - 开始
	constructor : function(_cfg) {
		
		Ext.applyIf(this, _cfg);
		
		this.initUIComponents();
		
		OutTripClassForm.superclass.constructor.call(this, {
			id : 'OutTripClassFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 250,
			width : 500,
			maximizable : true,
			title : '出差类别详细信息',
			buttonAlign : 'center',
			buttons : [
				{
					text : '保存',
					iconCls : 'btn-save',
					scope : this,
					handler : this.save
				},
				/*{
					text : '重置',
					iconCls : 'btn-reset',
					scope : this,
					handler : this.reset
				},*/
				{
					text : '取消',
					iconCls : 'btn-cancel',
					scope : this,
					handler : this.cancel
				}
	        ]
		});
		
	},// 构造函数 - 结束
			
	// 初始化界面控件 - 开始
	initUIComponents : function() {
		
		var dataStatus = [['1', '可用'], ['0', '禁用']];	
		
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [
	            {
					name : 'outTripClass.id',
					xtype : 'hidden',
					value : this.id == null ? '' : this.id
	            },
	            {
					fieldLabel : '类别名称',
					name : 'outTripClass.name',
					allowBlank : false,
					maxLength : 50
	            },
	            {
					fieldLabel : '类别描述',
					name : 'outTripClass.description',
					maxLength : 200
	            },
				{
	            	xtype : 'combo',
	            	fieldLabel : '类别状态',
					hiddenName : 'outTripClass.status',
					allowBlank : false,
					editable : false,
					mode : 'local',
					triggerAction : 'all',
					value : '1',
					store : [ [ '1', '可用' ], [ '0', '禁用' ] ]
				}
	        ]
		});
		
		//加载表单对应的数据	
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
				url : __ctxPath + '/admin/getOutTripClass.do?id='+ this.id,
				root : 'data',
				preName : 'outTripClass'
			});
		}
		
	},// 初始化界面控件 - 结束

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
				formPanel : this.formPanel,
				scope : this,
				url : __ctxPath + '/admin/saveOutTripClass.do',
				callback : function(fp,action){
					var gridPanel = Ext.getCmp('OutTripClassGrid');
					if (gridPanel != null) {
						gridPanel.getStore().reload();
					}
					this.close();
				}
			}
		);
		
	}

});