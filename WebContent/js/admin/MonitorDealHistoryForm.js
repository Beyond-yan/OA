/**
 * @author
 * @createtime
 * @class MonitorDealHistoryForm
 * @extends Ext.Window
 * @description MonitorDealHistory表单
 * @company 捷达世软件
 */
MonitorDealHistoryForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		MonitorDealHistoryForm.superclass.constructor.call(this, {
			id : 'MonitorDealHistoryFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '督办事项详细信息',
			buttonAlign : 'center',
			buttons : [ {
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
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var dealdate = Ext.util.Format.date(new Date(),'Y-m-d H:i:s');
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'MonitorDealHistoryForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'monitorDealHistory.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				name : 'monitorDealHistory.mtrApplyId',
				allowBlank : false,
				xtype : 'hidden'
			}, {
				//fieldLabel : '责任部门ID',
				name : 'monitorDealHistory.deptId',
				allowBlank : false,
				//xtype : 'numberfield'
				xtype : 'hidden'
			}, {
				//fieldLabel : '处理人ID',
				name : 'monitorDealHistory.userId',
				allowBlank : false,
				//xtype : 'numberfield'
				xtype : 'hidden'
			}, {
				fieldLabel : '督办主题',
				name : 'monitorApply.topic',
				xtype : 'textfield',
				style : 'background:#DCDCDC;',
				readOnly : true
			}, {
				fieldLabel : '责任部门',
				name : 'department.depName',
				xtype : 'textfield',
				style : 'background:#DCDCDC;',
				readOnly : true
			}, {
				fieldLabel : '处理人',
				name : 'appUser.fullname',
				xtype : 'textfield',
				style : 'background:#DCDCDC;',
				readOnly : true
			},{
				fieldLabel : '处理日期',
				name : 'monitorDealHistory.dealDate',
				id:'monitorDealHistory.dealDate',
				xtype : 'textfield',
				value : dealdate,
				style : 'background:#DCDCDC;',
				readOnly : true
			},{
				fieldLabel : '状态',
				xtype : 'combo',
				hiddenName : 'monitorDealHistory.monitorStatusConf.id',
				id : 'monitorDealHistory.curStatus2',
				mode : 'local',
				editable : false,
				//value:'0',
				triggerAction : 'all',
				store :[['1','未启动'],['2','推进中'],['3','阶段性完成'],['4','完成']]
			},{
				fieldLabel : '现状说明',
				name : 'monitorDealHistory.curStaDes',
				xtype : 'textarea',
				maxLength : 400
			}/*, {
				fieldLabel : 'CREATE_DATE',
				name : 'monitorDealHistory.createDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : 'CREATE_BY',
				name : 'monitorDealHistory.createBy',
				maxLength : 50
			}, {
				fieldLabel : 'UPDATE_DATE',
				name : 'monitorDealHistory.updateDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : 'UPDATE_BY',
				name : 'monitorDealHistory.updateBy',
				maxLength : 50
			}*/ ]
		});
		
		
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/admin/getMonitorDealHistory.do?id='
						+ this.id,
				root : 'data',
				preName : 'monitorDealHistory'
			});
		}
		var dealdate = Ext.util.Format.date(new Date(),'Y-m-d H:i:s');
		Ext.getCmp('monitorDealHistory.dealDate').setValue(dealdate);
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
			url : __ctxPath + '/admin/saveMonitorDealHistory.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('MonitorDealHistoryGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});