/**
 * @author
 * @createtime
 * @class MonitorParticipantForm
 * @extends Ext.Window
 * @description MonitorParticipant表单
 * @company 捷达世软件
 */
MonitorParticipantForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		MonitorParticipantForm.superclass.constructor.call(this, {
			id : 'MonitorParticipantFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '我的督办任务详细信息',
			buttonAlign : 'center',
			buttons : [ /*{
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, {
				text : '重置',
				iconCls : 'btn-reset',
				scope : this,
				handler : this.reset
			}, */{
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
			// id : 'MonitorParticipantForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'monitorParticipant.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			},/* {
				fieldLabel : 'TYPE',
				name : 'monitorParticipant.type',
				allowBlank : false,
				xtype : 'numberfield'
			},*/{
				fieldLabel : '督办主题',
				name : 'monitorApply.topic',
				allowBlank : false,
				xtype : 'textfield',
				disabled:true
			}, {
				fieldLabel : '责任人',
				name : 'appUser.fullname',
				allowBlank : false,
				xtype : 'textfield',
				disabled:true
			}, {
				fieldLabel : '截止日期',
				name : 'monitorApply.finishDt',
				allowBlank : false,
				xtype : 'textfield',
				disabled:true
			},{
				fieldLabel : '状态',
				name : 'monitorStatusConf.confName',
				allowBlank : false,
				xtype : 'textfield',
				disabled:true
			},{
				fieldLabel : '现状描述',
				name : 'curStaDes',
				xtype : 'textarea',
				disabled:true
			}/*,{
				fieldLabel : 'MTR_APPLY_ID',
				name : 'monitorParticipant.mtrApplyId',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : 'USER_ID',
				name : 'monitorParticipant.userId',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : 'ROLE',
				name : 'monitorParticipant.role',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : 'CREATE_DATE',
				name : 'monitorParticipant.createDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : 'CREATE_BY',
				name : 'monitorParticipant.createBy',
				maxLength : 50
			}, {
				fieldLabel : 'UPDATE_DATE',
				name : 'monitorParticipant.updateDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : 'UPDATE_BY',
				name : 'monitorParticipant.updateBy',
				maxLength : 50
			} */]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/admin/getMonitorParticipant.do?id='
						+ this.id,
				root : 'data',
				preName : 'monitorParticipant'
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
			url : __ctxPath + '/admin/saveMonitorParticipant.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('MonitorParticipantGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});